import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadEnv() {
  loadEnvFile(path.join(projectRoot, '.env'));
  loadEnvFile(path.join(projectRoot, '.env.local'));
}

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (payload) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

export async function startLocalApiServer(port = Number(process.env.PORT || 3000)) {
  loadEnv();

  const [
    { default: ordersHandler },
    { default: logsHandler },
    { default: returnsHandler },
  ] = await Promise.all([
    import('../api/orders.js'),
    import('../api/logs.js'),
    import('../api/returns.js'),
  ]);

  const server = http.createServer(async (req, res) => {
    enhanceResponse(res);

    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    req.query = Object.fromEntries(requestUrl.searchParams.entries());
    req.path = requestUrl.pathname;

    try {
      if (req.method === 'OPTIONS') {
        const routeMatch =
          requestUrl.pathname === '/api/orders' ||
          requestUrl.pathname.startsWith('/api/orders/') ||
          requestUrl.pathname === '/api/logs' ||
          requestUrl.pathname === '/api/returns';

        if (routeMatch) {
          res.statusCode = 200;
          res.end();
          return;
        }
      }

      if (requestUrl.pathname === '/api/orders' || requestUrl.pathname.startsWith('/api/orders/')) {
        req.body = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'
          ? await readRequestBody(req)
          : {};
        await ordersHandler(req, res);
        return;
      }

      if (requestUrl.pathname === '/api/logs') {
        req.body = req.method === 'POST' ? await readRequestBody(req) : {};
        await logsHandler(req, res);
        return;
      }

      if (requestUrl.pathname === '/api/returns') {
        req.body = req.method === 'POST' ? await readRequestBody(req) : {};
        await returnsHandler(req, res);
        return;
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    } catch (error) {
      console.error('Local API server error:', error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify({
        success: false,
        message: 'Local API server error.',
      }));
    }
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  console.log(`Local API server listening on http://127.0.0.1:${port}`);

  return server;
}
