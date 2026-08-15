import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import OrderStatus from './pages/OrderStatus.jsx';
import Returns from './pages/Returns.jsx';
import Contact from './pages/Contact.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle browser tab title adjustments based on state changes
  useEffect(() => {
    const baseTitle = 'Northstar Retail Co. | Support';
    const titles = {
      'home': 'Home | Customer Care',
      'order-status': 'Track My Order | Shipping & Logistics',
      'returns': 'Returns & Refunds | Self-Service Policy',
      'contact': 'Contact Customer Care | Escalation',
      'sign-in': 'Sign In | Client Portal',
      'sign-up': 'Sign Up | Join Northstar'
    };
    document.title = `${titles[currentPage] || 'Support'} - ${baseTitle}`;
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'order-status':
        return <OrderStatus onNavigate={setCurrentPage} />;
      case 'returns':
        return <Returns onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'sign-in':
        return <SignIn onNavigate={setCurrentPage} />;
      case 'sign-up':
        return <SignUp onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-espresso font-sans antialiased">
      {/* Top Banner Notice */}
      <AnnouncementBar />

      {/* Main Responsive Header */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Primary Page Canvas */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
