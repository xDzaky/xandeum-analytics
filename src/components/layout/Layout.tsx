import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background grid-bg">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main View */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
            <div className="page-enter">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
