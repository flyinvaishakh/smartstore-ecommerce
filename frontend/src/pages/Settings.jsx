import { useState } from 'react';
import { User, Mail, Lock, Bell, Sparkles, Save, Loader2, Shield } from 'lucide-react';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    aiSuggestions: true,
    stockAlerts: true,
    emailNotifications: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    setTimeout(() => {
      const updatedUser = { ...user, username: formData.username, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
      setSuccess(true);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  const Toggle = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-700'}`}>
      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and store preferences</p>
      </div>

      {success && (
        <div className="bg-success/10 border border-success/20 text-success p-3.5 rounded-xl flex items-center gap-2 text-sm animate-slide-up">
          <Save size={16} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile */}
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
            <User size={15} className="text-primary" />
            <h3 className="text-sm font-semibold text-white">Profile Information</h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Store Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
            <Shield size={15} className="text-primary" />
            <h3 className="text-sm font-semibold text-white">Security</h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Password</label>
              <input type="password" placeholder="••••••••" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all placeholder-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">New Password</label>
              <input type="password" placeholder="Leave blank to keep" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all placeholder-gray-600" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
            <Bell size={15} className="text-primary" />
            <h3 className="text-sm font-semibold text-white">Preferences</h3>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-gray-200 font-medium flex items-center gap-2"><Sparkles size={14} className="text-accent" /> AI Sales Suggestions</h4>
                <p className="text-xs text-gray-500 mt-0.5">Receive daily insights and pricing recommendations.</p>
              </div>
              <Toggle checked={formData.aiSuggestions} onChange={v => setFormData({...formData, aiSuggestions: v})} />
            </div>
            <div className="border-t border-white/5 pt-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm text-gray-200 font-medium">Low Stock Alerts</h4>
                <p className="text-xs text-gray-500 mt-0.5">Get notified when products drop below 10 items.</p>
              </div>
              <Toggle checked={formData.stockAlerts} onChange={v => setFormData({...formData, stockAlerts: v})} />
            </div>
            <div className="border-t border-white/5 pt-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm text-gray-200 font-medium">Email Digest</h4>
                <p className="text-xs text-gray-500 mt-0.5">Receive weekly summary emails about store performance.</p>
              </div>
              <Toggle checked={formData.emailNotifications} onChange={v => setFormData({...formData, emailNotifications: v})} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
