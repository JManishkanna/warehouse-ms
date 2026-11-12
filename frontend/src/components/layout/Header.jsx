import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUnreadAlertCount } from '../../api/alerts';
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertCount = async () => {
    try {
      const res = await getUnreadAlertCount();
      if (res.data && res.data.data !== undefined) {
        setUnreadCount(res.data.data);
      }
    } catch (_) {
      // Unread alert count silent failover
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span className="hidden sm:inline-block text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          BazzerCart Fulfillment Hub #BLR-04 · 10-Minute Dispatch Node
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Alerts shortcut */}
        <Link
          to="/alerts"
          className="relative p-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          title="System Alerts"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="h-4 w-px bg-slate-200" />

        {/* User signout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 py-1.5 px-2.5 rounded hover:bg-rose-50 transition"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
