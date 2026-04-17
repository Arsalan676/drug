import React from 'react';

const Navbar = () => {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-[#131315] border-b border-white/10 z-30 sticky top-0">
      <div className="flex items-center gap-12">
        <span className="font-bold text-lg tracking-tighter text-white uppercase">MOLECULAR INTELLIGENCE</span>
        <nav className="hidden lg:flex items-center gap-8">
          <a className="tracking-tight text-sm font-medium text-white border-b border-white pb-2" href="#">Modules</a>
          <a className="tracking-tight text-sm font-medium text-neutral-500 hover:text-white transition-colors duration-200" href="#">Intelligence</a>
          <a className="tracking-tight text-sm font-medium text-neutral-500 hover:text-white transition-colors duration-200" href="#">Protocol</a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">search</span>
          <input 
            className="bg-[#2a2a2c] border-none text-xs font-mono py-2 pl-9 pr-4 w-64 rounded-sm focus:ring-1 focus:ring-white transition-all text-white outline-none" 
            placeholder="Search parameters..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <button className="hover:text-white transition-colors scale-95 active:scale-100"><span className="material-symbols-outlined">science</span></button>
          <button className="hover:text-white transition-colors scale-95 active:scale-100"><span className="material-symbols-outlined">settings</span></button>
          <button className="hover:text-white transition-colors scale-95 active:scale-100 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-2 cursor-pointer">
            <img 
              alt="Researcher Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQLeoIDFzI9FVFHSkjG_UBGMdLMwBD72ua_0X4GeSECZ17YzecgbUUJvX63A-715PO-A8pWxoCuDrADvx2AqMMm7n4NB970ZhS49BqSUAyahvSB1cA0Uwq5ppCK4creWinwuGQNbmI2oVN_9xCNlKXByT3GIwNoc8VhnnUCvIBhwMQR8ZGSlIPXA7acWs6WwkfFoi4QfLtPM_2OH2hwWacSwwLdknRjCeoTA8WTyM6OF5rc3mDcLZcomm1M8GBCu2tZiStEIO3nDk"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
