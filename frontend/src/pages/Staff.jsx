import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../api/tasks';
import { getUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TASK_STATUS_VARIANTS = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  DONE: 'success',
};

export default function Staff() {
  const { hasRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Task Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    if (hasRole('ADMIN', 'MANAGER')) {
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      if (res.data && res.data.data) {
        setTasks(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load operational tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (_) {}
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        assignedToId: assignedToId ? parseInt(assignedToId, 10) : null,
        dueDate: dueDate || null,
      });
      toast.success('Task dispatched to operative');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setAssignedToId('');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      toast.success(`Task status updated to ${status}`);
      fetchTasks();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete operational task record?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      header: 'Task Summary',
      accessor: 'title',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">{row.title}</span>
          {row.description && (
            <span className="text-[11px] text-slate-500 block truncate max-w-sm">{row.description}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Assigned Operative',
      accessor: 'assignedTo',
      render: (row) => (
        <span className="text-xs font-medium text-slate-800">
          {row.assignedTo ? row.assignedTo.username : 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span className="text-xs text-slate-600 font-mono">
          {row.dueDate ? row.dueDate : 'No deadline'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={TASK_STATUS_VARIANTS[row.status] || 'default'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-700"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          {hasRole('ADMIN', 'MANAGER') && (
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff &amp; Task Coordination</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct operational work orders, shelf picking, cycle counting, and facility audits
          </p>
        </div>
        {hasRole('ADMIN', 'MANAGER') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs transition"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Dispatch Work Order
          </button>
        )}
      </div>

      <Table columns={columns} data={tasks} loading={loading} emptyMessage="No active tasks assigned." />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch Warehouse Work Order"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Task Directive *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit shelf A-1-2 batch numbers"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Verify physical quantity matches catalog count and record discrepancies."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assign To Operative
              </label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Dispatching...' : 'Dispatch Work Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
