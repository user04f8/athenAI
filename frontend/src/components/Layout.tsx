import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is fixed and should always display at the top */}
      <Navbar />
      
      {/* Content below navbar; pt-16 accounts for fixed navbar height */}
      <div className="flex-grow pt-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
