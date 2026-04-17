import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatusTicker from './StatusTicker';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-sans selection:bg-white selection:text-black">
      <Sidebar />
      <main className="ml-20 md:ml-64 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          {children}
          <StatusTicker />
        </div>
      </main>
    </div>
  );
};

export default Layout;
