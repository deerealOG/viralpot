import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Lightbulb,
  PenTool,
  Info, 
  Mail, 
  Menu, 
  X, 
  Moon, 
  Sun,
} from 'lucide-react';
import { NavTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export function Layout({ 
  children, 
  activeTab, 
  onTabChange, 
  toggleTheme, 
  currentTheme 
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'idea', label: 'Idea Generator', icon: Lightbulb },
    { id: 'business', label: 'Business Hub', icon: LayoutDashboard },
  ] as const;

  const secondaryNavItems = [
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'info', label: 'About', icon: Info },
  ] as const;

  const isAuthPage = ['signin', 'signup'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white transition-colors duration-200 flex flex-col lg:flex-row shadow-2xl">
      {/* Mobile Header */}
      {!isAuthPage && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#111827] z-50">
          <div className="flex items-center gap-3">
             <button
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
             >
               <Menu size={24} />
             </button>
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
                <img src="/logo.svg" alt="ViralPot" className="w-8 h-8" />
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">ViralPot</span>
             </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
      )}

      {/* Sidebar - Desktop & Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:sticky lg:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isAuthPage ? 'hidden' : 'flex flex-col'} 
      `}>
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm lg:hidden -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('home')}>
              <img src="/logo.svg" alt="ViralPot" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                ViralPot
              </h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                const isIdea = item.id === 'idea';
                const isBusiness = item.id === 'business';
                
                const activeClass = isIdea ? 'bg-linear-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                  : isBusiness ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white shadow-lg';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id as NavTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group
                      ${isActive 
                        ? activeClass
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/50">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">
                Support
              </p>
              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as NavTab)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm
                    ${activeTab === item.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            

          </nav>

          {/* Theme Toggle Button Desktop */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-sm"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120]">
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${!isAuthPage ? 'pt-16 lg:pt-0 pb-24 lg:pb-0' : ''}`}>
          {children}
        </div>
      </main>

      {/* Bottom Navigation Removed - Hamburger used instead */}
    </div>
  );
}
