import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Sparkles, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'AI Studio', path: '/ai-studio', icon: <Sparkles size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-surface h-screen flex flex-col border-r border-white/5 transition-all duration-300 relative`}>
      {/* Logo */}
      <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/5`}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">SmartStore</h1>
              <p className="text-[10px] text-accent font-medium uppercase tracking-widest">AI Platform</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-all z-20"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
      
      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3 px-3">Menu</p>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  title={item.name}
                  className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                  )}
                  <span className={`${collapsed ? '' : 'mr-3 ml-1'} transition-colors ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          title="Logout"
          className={`flex items-center ${collapsed ? 'justify-center' : 'px-3'} w-full py-2.5 text-gray-500 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
