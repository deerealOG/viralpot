
import React, { useMemo, useState } from 'react';
import { NavTab, User } from '../types';
import { 
  Home, 
  Rocket, 
  Briefcase, 
  Sparkles, 
  MessageSquareText, 
  Archive, 
  User as UserIcon,
  Sun,
  Moon,
  Smartphone,
  BarChart3
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, toggleTheme, currentTheme, user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navGroups = useMemo(() => {
    // Define the structure of navigation groups
    // Icons have two states: outline (default) and filled (active)
    const groups: { title: string | null; items: { id: NavTab; label: string; iconOutline: React.ReactNode; iconFilled: React.ReactNode }[] }[] = [];

    // Group 1: Main
    groups.push({
      title: null,
      items: [
        { 
          id: 'home', 
          label: 'Home', 
          iconOutline: <Home className="w-6 h-6" />,
          iconFilled: <Home className="w-6 h-6" fill="currentColor" />
        }
      ]
    });

    // Group 2: Workspace (Role specific)
    const workspaceItems = [];
    if (user.role === 'business') {
        workspaceItems.push({
            id: 'business',
            label: 'Launchpad',
            iconOutline: <Rocket className="w-6 h-6" />,
            iconFilled: <Rocket className="w-6 h-6" fill="currentColor" />
        } as const);
    }

    if (user.role === 'agency') {
        workspaceItems.push({
            id: 'agency',
            label: 'Client Hub',
            iconOutline: <Briefcase className="w-6 h-6" />,
            iconFilled: <Briefcase className="w-6 h-6" fill="currentColor" />
        } as const);
    }

    if (workspaceItems.length > 0) {
      groups.push({
        title: 'Workspace',
        items: workspaceItems as any
      });
    }

    // Group 3: Create
    groups.push({
      title: 'Create',
      items: [
        { 
          id: 'idea', 
          label: 'Ideas', 
          iconOutline: <Sparkles className="w-6 h-6" />,
          iconFilled: <Sparkles className="w-6 h-6" fill="currentColor" />
        },
        { 
          id: 'caption', 
          label: 'Captions', 
          iconOutline: <MessageSquareText className="w-6 h-6" />,
          iconFilled: <MessageSquareText className="w-6 h-6" fill="currentColor" />
        },
      ]
    });

    // Group 4: Growth
    groups.push({
      title: 'Growth',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          iconOutline: <BarChart3 className="w-6 h-6" />,
          iconFilled: <BarChart3 className="w-6 h-6" fill="currentColor" />
        }
      ]
    });

    // Group 5: Account
    groups.push({
      title: 'Account',
      items: [
        { 
          id: 'history', 
          label: 'History', 
          iconOutline: <Archive className="w-6 h-6" />,
          iconFilled: <Archive className="w-6 h-6" fill="currentColor" />
        },
        {
          id: 'profile',
          label: 'Profile',
          iconOutline: <UserIcon className="w-6 h-6" />,
          iconFilled: <UserIcon className="w-6 h-6" fill="currentColor" />
        }
      ]
    });

    return groups;
  }, [user.role]);

  const flatNavItems = useMemo(() => {
    return navGroups.flatMap(group => group.items);
  }, [navGroups]);

  const themeColors = useMemo(() => {
      const colors = {
          creator: {
              activeBg: 'bg-slate-100 dark:bg-slate-800',
              activeText: 'text-slate-900 dark:text-white',
              logoGradient: 'from-orange-500 to-orange-600',
              logoShadow: 'shadow-orange-500/20'
          },
          business: {
              activeBg: 'bg-slate-100 dark:bg-slate-800',
              activeText: 'text-slate-900 dark:text-white',
              logoGradient: 'from-indigo-600 to-blue-600',
              logoShadow: 'shadow-indigo-500/20'
          },
          agency: {
              activeBg: 'bg-slate-100 dark:bg-slate-800',
              activeText: 'text-slate-900 dark:text-white',
              logoGradient: 'from-emerald-600 to-teal-600',
              logoShadow: 'shadow-emerald-500/20'
          }
      };
      return colors[user.role || 'creator'] || colors.creator;
  }, [user.role]);

  return (
    <div className={`flex h-screen flex-col overflow-hidden transition-colors duration-300 relative bg-slate-50 dark:bg-[#0B1120]`}>
      {/* Subtle Dynamic Background */}
      <div className={`absolute inset-0 -z-10 opacity-40 dark:opacity-20 blur-[100px] transition-colors duration-1000 pointer-events-none
        ${user.role === 'business' ? 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-900/40' :
          user.role === 'agency' ? 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-transparent to-transparent dark:from-emerald-900/40' :
          'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100 via-transparent to-transparent dark:from-orange-900/40'
        }
      `} />

      {/* Header - Minimal & Clean */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#0B1120]/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('home')}>
           <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr ${themeColors.logoGradient} text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform`}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">ViralPot</h1>
           {user.role !== 'creator' && (
               <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                   {user.role}
               </span>
           )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
          >
            {currentTheme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
          </button>
          
          {user.isGuest && (
              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>Sign In / Sign Up</span>
              </button>
          )}

          <a 
            href="#" 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              alert("Redirect to App Store / Play Store");
            }}
          >
            <Smartphone className="w-4 h-4" />
            <span>Get the App</span>
          </a>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 cursor-pointer hover:ring-slate-300 dark:hover:ring-slate-600 transition-all" onClick={() => onTabChange('profile')}>
             {user.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                    {user.email.charAt(0).toUpperCase()}
                </div>
             )}
          </div>
        </div>
      </header>

      {/* Desktop layout wrapper */}
      <div className="flex flex-1 overflow-hidden relative z-0">
        {/* Desktop Sidebar - Minimal Rail */}
        <aside
          className={`hidden md:block md:fixed md:bottom-0 md:left-0 md:top-[73px] md:flex md:flex-col md:border-r md:border-slate-200/60 dark:border-slate-800/60 md:bg-white/50 dark:md:bg-[#0B1120]/50 md:backdrop-blur-xl md:p-3 transition-all duration-300 ${collapsed ? 'md:w-20' : 'md:w-64'} z-10`}
        >
          <div className="flex-1 overflow-y-auto space-y-8 pt-4">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {group.title && !collapsed && (
                  <h3 className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? `bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md` 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <div className={isActive ? 'text-white dark:text-slate-900' : ''}>
                             {isActive ? item.iconFilled : item.iconOutline}
                        </div>
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 pb-32 md:p-12 no-scrollbar scroll-smooth transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Minimal */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-lg pb-safe md:hidden">
        <div className="flex justify-around items-center h-16">
          {flatNavItems.slice(0, 5).map((item) => { // Show only first 5 items on mobile
             const isActive = activeTab === item.id;
             return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                  isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {isActive ? item.iconFilled : item.iconOutline}
              </button>
             )
          })}
        </div>
      </nav>
    </div>
  );
};
