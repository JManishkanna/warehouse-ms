import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, toggleUserActive, deleteUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { TrashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  ADMIN: 'danger',
  MANAGER: 'warning',
  WORKER: 'info',
};

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('User authorization tier updated');
      fetchUsers();
    } catch (err) {
      toast.error('Role update failed');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await toggleUserActive(userId);
      toast.success('Account status toggled');
      fetchUsers();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser?.userId) {
      toast.error('You cannot delete your own active administrator account');
      return;
    }
    if (!window.confirm('Delete operator user account permanently?')) return;
    try {
      await deleteUser(userId);
      toast.success('Account deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      header: 'Operator Username',
      accessor: 'username',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-xs text-slate-900">{row.username}</span>
          {row.id === currentUser?.userId && (
            <span className="text-[10px] text-sky-700 bg-sky-50 px-1 rounded font-semibold border border-sky-200">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Email Address',
      accessor: 'email',
      render: (row) => <span className="text-xs text-slate-600 font-mono">{row.email}</span>,
    },
    {
      header: 'Authorization Tier',
      accessor: 'role',
      render: (row) => (
        <Badge variant={ROLE_BADGE[row.role] || 'default'}>
          {row.role}
        </Badge>
      ),
    },
    {
      header: 'Access Status',
      accessor: 'active',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'danger'}>
          {row.active ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      header: 'Account Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-3">
          <select
            value={row.role}
            disabled={row.id === currentUser?.userId}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-700 disabled:opacity-50"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="WORKER">WORKER</option>
          </select>

          <button
            onClick={() => handleToggleActive(row.id)}
            disabled={row.id === currentUser?.userId}
            className={`text-xs px-2.5 py-1 rounded font-semibold border disabled:opacity-50 transition ${
              row.active
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {row.active ? 'Suspend' : 'Activate'}
          </button>

          {row.id !== currentUser?.userId && (
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security &amp; User Authorization</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Role-Based Access Control (RBAC): Admin, Manager, and Floor Operative privileges
        </p>
      </div>

      <Table columns={columns} data={users} loading={loading} emptyMessage="No registered operators." />
    </div>
  );
}
