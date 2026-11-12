import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Squares2X2Icon,
  ArchiveBoxIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, onClose }) {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', to: '/', icon: Squares2X2Icon, show: true },
    { name: 'Inventory', to: '/inventory', icon: ArchiveBoxIcon, show: true },
    { name: 'Warehouse Map', to: '/warehouse-map', icon: MapIcon, show: true },
    { name: 'Orders', to: '/orders', icon: ClipboardDocumentListIcon, show: true },
    { name: 'Suppliers', to: '/suppliers', icon: TruckIcon, show: hasRole('ADMIN', 'MANAGER') },
    { name: 'Staff & Tasks', to: '/staff', icon: UserGroupIcon, show: true },
    { name: 'Reports & Analytics', to: '/reports', icon: ChartBarIcon, show: hasRole('ADMIN', 'MANAGER') },
    { name: 'System Alerts', to: '/alerts', icon: BellAlertIcon, show: true },
    { name: 'User Management', to: '/users', icon: UsersIcon, show: hasRole('ADMIN') },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900 bg-opacity-60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-800`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
              BC
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm block">
                Bazzer<span className="text-amber-400">Cart</span>
              </span>
              <span className="text-[10px] text-amber-400/90 uppercase tracking-widest block font-semibold">
                Fulfillment Hub #BLR-04
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Fulfillment Controls
          </div>
          {navLinks
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-amber-400">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.username || 'Store Operator'}</p>
              <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider px-1.5 py-0.2 bg-slate-800 text-amber-400 border border-slate-700 rounded font-medium">
                {user?.role || 'WORKER'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
