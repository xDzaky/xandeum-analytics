import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Globe, Server, Activity, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/xandeum-analytics';
    }
    return location.pathname.includes(path);
  };

  const navItems = [
    { icon: LayoutGrid, path: '/', label: 'Dashboard' },
    { icon: Globe, path: '/analytics', label: 'Analytics' },
    { icon: Server, path: '/nodes', label: 'Nodes' },
    { icon: Activity, path: '/about', label: 'About' },
  ];

  return (
    <aside className="w-16 flex flex-col items-center border-r border-border bg-surface/50 backdrop-blur-md z-30 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border/50 w-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4 py-6 w-full items-center">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link
            key={path}
            to={path}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isActive(path)
                ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="py-6 flex flex-col gap-4 w-full items-center border-t border-border/50">
        <button className="w-10 h-10 rounded-lg text-muted hover:text-white hover:bg-white/5 flex items-center justify-center transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-[10px] font-bold text-black border border-white/20">
          XA
        </div>
      </div>
    </aside>
  );
}
