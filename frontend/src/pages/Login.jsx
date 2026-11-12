import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginWithCredentials = async (u, p) => {
    setLoading(true);
    try {
      const res = await loginApi({ username: u.trim(), password: p.trim() });
      if (res.data && res.data.data) {
        login(res.data.data);
        toast.success(`Welcome back, ${res.data.data.username}`);
        navigate('/');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Check credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username and password are required');
      return;
    }
    handleLoginWithCredentials(username, password);
  };

  const setDemoRole = (u, p) => {
    setUsername(u);
    setPassword(p);
    handleLoginWithCredentials(u, p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-white uppercase tracking-wider">
          Warehouse Management System
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enter operational credentials to access facility controls
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow border border-slate-200 rounded-lg sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <div className="mt-1 relative rounded shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-slate-800 focus:border-slate-800"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative rounded shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LockClosedIcon className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-slate-800 focus:border-slate-800"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition"
              >
                {loading ? 'Authenticating...' : 'Sign In to Terminal'}
              </button>
            </div>
          </form>

          {/* Quick preset selector for evaluators */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Demonstration Role Profiles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('admin', 'admin123')}
                className="px-2 py-1.5 text-xs font-medium border border-slate-300 rounded hover:bg-slate-100 text-slate-700 text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('manager', 'manager123')}
                className="px-2 py-1.5 text-xs font-medium border border-slate-300 rounded hover:bg-slate-100 text-slate-700 text-center"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('worker', 'worker123')}
                className="px-2 py-1.5 text-xs font-medium border border-slate-300 rounded hover:bg-slate-100 text-slate-700 text-center"
              >
                Worker
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 space-x-4">
          <Link to="/privacy" className="hover:text-slate-200 underline">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-slate-200 underline">Terms and Conditions</Link>
        </div>
      </div>
    </div>
  );
}
