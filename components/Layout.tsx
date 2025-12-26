import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  PenTool, 
  BarChart, 
  User, 
  Info, 
  Mail, 
  Menu, 
  X, 
  Moon, 
  Sun,
  CreditCard,
  LogIn,
  UserPlus
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
    { id: 'caption', label: 'Caption Generator', icon: PenTool },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ] as const;

  const secondaryNavItems = [
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'info', label: 'About', icon: Info },
  ] as const;

  const isAuthPage = ['signin', 'signup'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white transition-colors duration-200 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isAuthPage ? 'lg:hidden' : ''} 
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              ViralPot
            </h1>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isIdea = item.id === 'idea';
                const isCaption = item.id === 'caption';
                // Active color logic: Idea = Orange, Caption = Indigo, Others = Slate/Default
                const activeClass = isIdea ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : isCaption ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800 text-white shadow-lg';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id as NavTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                      ${activeTab === item.id 
                        ? activeClass
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-60">
                Support
              </p>
              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as NavTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                    ${activeTab === item.id 
                      ? 'bg-slate-800 text-white shadow-lg' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Auth Buttons in Nav if not logged in */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
               <button
                  onClick={() => {
                    onTabChange('signin');
                    setIsMobileMenuOpen(false);
                  }}
                   className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                    ${activeTab === 'signin'
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
               >
                 <LogIn size={20} />
                 <span>Sign In</span>
               </button>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">
                {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Header */}
        {!isAuthPage && (
          <header className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#111827]">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">ViralPot</span>
            <div className="w-8" />
          </header>
        )}
        
        {/* If Auth Page, maybe show a simple header or nothing? */}
        {isAuthPage && (
           <div className="absolute top-4 right-4 z-10">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all backdrop-blur-sm"
              >
                {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
           </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
