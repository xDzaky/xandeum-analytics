import { Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Mobile Navigation Link Component
interface NavLinkProps {
  to: string;
  label: string;
  children: React.ReactNode;
}

function NavLink({ to, label, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
        isActive ? 'text-primary' : 'text-muted hover:text-white'
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <>
      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-6">
          <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
            Xandeum <span className="text-muted font-normal">/</span> Lattice
          </h1>
          
          {/* Network Status Badge - Static (Devnet only) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-surface text-xs font-mono text-primary">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            Devnet
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-md">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-500">Live Monitoring</span>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Using Link for proper routing */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 safe-area-inset-bottom">
        <div className="flex justify-around py-2">
          <NavLink to="/" label="Dashboard">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </NavLink>
          <NavLink to="/nodes" label="Nodes">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </NavLink>
          <NavLink to="/analytics" label="Analytics">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </NavLink>
          <NavLink to="/about" label="About">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </NavLink>
        </div>
      </div>
    </>
  );
}

