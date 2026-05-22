import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Settings, LogOut, Package, Search } from 'lucide-react';

export default function Navbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark/60 border border-white/5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/40 focus:bg-dark/80 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl shadow-black/40 z-50 animate-slide-down overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <span className="text-xs text-primary cursor-pointer hover:text-accent transition-colors">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors border-b border-white/5 flex items-start gap-3">
                  <div className="p-2 bg-warning/10 text-warning rounded-lg shrink-0"><Package size={14} /></div>
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Low stock alert</p>
                    <p className="text-xs text-gray-500 mt-0.5">"Wireless Earbuds" — only 3 left.</p>
                    <p className="text-[11px] text-gray-600 mt-1">2 mins ago</p>
                  </div>
                </div>
                <div className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors flex items-start gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0"><Bell size={14} /></div>
                  <div>
                    <p className="text-sm text-gray-200 font-medium">Welcome to SmartStore AI!</p>
                    <p className="text-xs text-gray-500 mt-0.5">Start by adding your first product.</p>
                    <p className="text-[11px] text-gray-600 mt-1">1 hr ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/5 mx-1"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all ${isProfileOpen ? 'bg-white/5' : 'hover:bg-white/[0.03]'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
              <span className="text-white text-sm font-bold">{(user.username || 'A')[0].toUpperCase()}</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-200 leading-tight">{user.username || 'Admin'}</p>
              <p className="text-[11px] text-gray-500 leading-tight">Store Owner</p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 glass-card rounded-2xl shadow-2xl shadow-black/40 z-50 animate-slide-down overflow-hidden">
              <div className="p-3 border-b border-white/5 md:hidden">
                <p className="text-sm font-medium text-gray-200">{user.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Store Owner</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/[0.03] hover:text-white transition-colors"
                >
                  <Settings size={15} /> Account Settings
                </button>
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
