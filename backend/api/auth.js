import clientPromise from '../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function handleSignUp(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Log the event
    await logAuthEvent('User Sign Up', newUser.email);

    // Auto-login the user by setting the session
    if (req.session) {
      req.session.userId = result.insertedId.toString();
    }

    return res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
}

export async function handleSignIn(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Set the session using express-session
    if (req.session) {
      req.session.userId = user._id.toString();
    }

    // Log the event
    await logAuthEvent('User Sign In', user.email);

    return res.status(200).json({ 
      success: true, 
      message: 'Signed in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
}

export async function handleMe(req, res) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
    
    if (!user) {
      if (req.session) req.session.destroy();
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function handleSignOut(req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Sign out error:', err);
        return res.status(500).json({ success: false, message: 'Failed to sign out' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ success: true, message: 'Signed out successfully' });
    });
  } else {
    return res.status(200).json({ success: true, message: 'Signed out successfully' });
  }
}

async function logAuthEvent(eventType, email) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('support_logs').insertOne({
      requestType: eventType,
      orderNumber: null,
      customerMessage: `Action by: ${email}`,
      escalationStatus: 'Auth',
      createdAt: new Date(),
      metadata: JSON.stringify({ email })
    });
  } catch (err) {
    console.error('Error logging auth event:', err);
  }
}
