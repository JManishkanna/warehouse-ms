import React, { useState, useEffect } from 'react';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../api/suppliers';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { PlusIcon, PencilSquareIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  rating: 5,
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
      if (res.data && res.data.data) {
        setSuppliers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load supplier records');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (sup) => {
    setEditingId(sup.id);
    setFormData({
      name: sup.name || '',
      contactPerson: sup.contactPerson || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
      rating: sup.rating || 5,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        rating: parseInt(formData.rating, 10),
      };

      if (editingId) {
        await updateSupplier(editingId, payload);
        toast.success('Supplier profile updated');
      } else {
        await createSupplier(payload);
        toast.success('Supplier cataloged');
      }

      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save supplier operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete vendor supplier profile?')) return;
    try {
      await deleteSupplier(id);
      toast.success('Supplier removed');
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed');
    }
  };

  const columns = [
    {
      header: 'Supplier Name',
      accessor: 'name',
      render: (row) => <span className="font-semibold text-slate-900 text-xs">{row.name}</span>,
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (row) => <span className="text-xs text-slate-700">{row.contactPerson || '—'}</span>,
    },
    {
      header: 'Email Address',
      accessor: 'email',
      render: (row) => <span className="text-xs text-slate-600 font-mono">{row.email || '—'}</span>,
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row) => <span className="text-xs text-slate-600 font-mono">{row.phone || '—'}</span>,
    },
    {
      header: 'Performance Rating',
      accessor: 'rating',
      render: (row) => (
        <div className="flex items-center text-amber-500">
          {Array.from({ length: row.rating || 5 }).map((_, i) => (
            <span key={i}>&#9733;</span>
          ))}
          <span className="ml-1 text-[11px] text-slate-500 font-mono">({row.rating || 5}/5)</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Supplier &amp; Vendor Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage procurement vendor records, points of contact, and SLA quality ratings
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs transition"
        >
          <PlusIcon className="h-4 w-4 mr-1.5" />
          Add Supplier Vendor
        </button>
      </div>

      <Table columns={columns} data={suppliers} loading={loading} emptyMessage="No registered suppliers cataloged." />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Supplier Profile' : 'Register New Vendor'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Supplier Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
              placeholder="e.g. Apex Industrial Supplies"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contact Representative
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
              placeholder="Full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
                placeholder="vendor@domain.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
                placeholder="+1-555-0100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Facility Address / Warehouse Dock
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
              placeholder="Physical dispatch depot"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quality Rating (1 to 5 Stars)
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
            >
              <option value="5">5 - Excellent SLA / High Quality</option>
              <option value="4">4 - Good Reliability</option>
              <option value="3">3 - Moderate Performance</option>
              <option value="2">2 - Occasional Delays</option>
              <option value="1">1 - Deficient Reliability</option>
            </select>
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
              {submitting ? 'Saving...' : editingId ? 'Update Vendor' : 'Register Vendor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
