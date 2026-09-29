import React, { useState } from 'react';
import { Search, Menu, X, ExternalLink, Zap, Send, ShieldCheck } from 'lucide-react';
import { ShoprLogo } from './ShoprLogo';
import { MenuItem } from '../types';

interface HeaderProps {
  currentTab: 'store' | 'product' | 'admin' | 'package';
  onSelectTab: (tab: 'store' | 'product' | 'admin' | 'package') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  siteName: string;
  menus?: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  menus = []
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const activeMenus = menus.filter(m => m.status === 'Active');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-xs transition-all">
      {/* Top E-Commerce Announcement Bar with Telegram channel */}
      <div className="bg-[#f85606] text-white text-[11px] font-semibold py-1.5 px-4 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              FLASH DEALS
            </span>
            <span className="truncate hidden sm:inline">Up to 50% Off Today • Fast Delivery Guaranteed</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <a 
              href="https://t.me/shopr_official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline bg-white/15 px-2.5 py-0.5 rounded-full transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Telegram: @shopr_official</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          
          {/* Official Shopr Logo - Unclipped */}
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => onSelectTab('store')}
              className="flex items-center text-left py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f85606] rounded-lg group"
              aria-label="Shopr Home"
            >
              <ShoprLogo height={38} className="transition-transform duration-200 group-hover:scale-[1.02]" />
            </button>
          </div>

          {/* E-Commerce Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className="w-full flex items-center bg-slate-100 hover:bg-slate-100/90 focus-within:bg-white rounded-lg border border-slate-200 focus-within:border-[#f85606] focus-within:ring-2 focus-within:ring-[#f85606]/20 transition-all overflow-hidden">
              <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products in store..."
                className="w-full h-10 px-3 bg-transparent text-xs sm:text-sm font-medium outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button 
                onClick={() => {}}
                className="h-10 px-4 bg-[#f85606] hover:bg-[#e04800] text-white text-xs font-bold transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* Navigation Menus (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 shrink-0">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onSelectTab('store')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'store'
                    ? 'text-[#f85606] bg-orange-50 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Home</span>
              </button>

              {/* Dynamic Menu items configured by Admin */}
              {activeMenus.map((menu) => (
                <a
                  key={menu.id}
                  href={menu.url || '#'}
                  target={menu.target || '_self'}
                  rel={menu.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-[#f85606] hover:bg-slate-100 transition-all flex items-center gap-1.5 group"
                >
                  <span>{menu.title}</span>
                  {menu.target === '_blank' && (
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#f85606] transition-colors" />
                  )}
                </a>
              ))}

              <a
                href="https://t.me/shopr_official"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#f85606] bg-orange-50/80 hover:bg-orange-100 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Telegram Support</span>
              </a>
            </nav>
          </div>

          {/* Mobile Actions: Search toggle & Menu hamburger */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products in store..."
                autoFocus
                className="w-full h-10 px-3 bg-transparent text-xs font-medium outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-xs text-slate-400 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-4 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { onSelectTab('store'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-colors ${
                currentTab === 'store' ? 'bg-orange-50 text-[#f85606]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>Home</span>
              <span className="text-xs font-medium text-slate-400">All Products</span>
            </button>

            {/* Dynamic Menu items configured by Admin */}
            {activeMenus.map((menu) => (
              <a
                key={menu.id}
                href={menu.url || '#'}
                target={menu.target || '_self'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>{menu.title}</span>
                {menu.target === '_blank' && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
              </a>
            ))}

            <a
              href="https://t.me/shopr_official"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-bold text-[#f85606] bg-orange-50/70"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Telegram Support (@shopr_official)
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Products • Verified Merchant</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
