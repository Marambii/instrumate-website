import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer'; 

// src/components/layout/MainLayout.tsx
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-['Outfit',sans-serif] flex flex-col">
      <Header />
      {/* Reduced padding: pt-20 for mobile, pt-28 for desktop */}
      <main className="flex-grow pt-20 md:pt-28 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;