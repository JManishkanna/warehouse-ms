import React, { useState, useEffect } from 'react';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../api/orders';
import { getSuppliers } from '../api/suppliers';
import { getProducts } from '../api/products';
import { useAuth } from '../context/AuthContext';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const STATUS_VARIANTS = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export default function Orders() {
  const { hasRole } = useAuth();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Order Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderType, setOrderType] = useState('INBOUND');
  const [supplierId, setSupplierId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, unitPrice: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await getSuppliers();
      if (res.data && res.data.data) setSuppliers(res.data.data);
    } catch (_) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      if (res.data && res.data.data) setProducts(res.data.data);
    } catch (_) {}
  };

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, unitPrice: '' }]);
  };

  const handleRemoveItemRow = (idx) => {
    setOrderItems(orderItems.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const updated = [...orderItems];
    updated[idx][field] = value;

    // Auto-populate price when product selected
    if (field === 'productId') {
      const found = products.find((p) => p.id === parseInt(value, 10));
      if (found) {
        updated[idx].unitPrice = found.unitPrice;
      }
    }

    setOrderItems(updated);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0 || !orderItems[0].productId) {
      toast.error('At least one valid line item is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderType,
        supplierId: orderType === 'INBOUND' && supplierId ? parseInt(supplierId, 10) : null,
        customerName: orderType === 'OUTBOUND' ? customerName : null,
        notes,
        items: orderItems.map((item) => ({
          productId: parseInt(item.productId, 10),
          quantity: parseInt(item.quantity, 10),
          unitPrice: parseFloat(item.unitPrice),
        })),
      };

      await createOrder(payload);
      toast.success('Order logged into dispatch ledger');
      setIsModalOpen(false);
      // Reset form
      setOrderType('INBOUND');
      setSupplierId('');
      setCustomerName('');
      setNotes('');
      setOrderItems([{ productId: '', quantity: 1, unitPrice: '' }]);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order #${id} status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status transition failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete order record #${id}?`)) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    {
      header: 'Order Ref',
      accessor: 'id',
      render: (row) => <span className="font-mono text-xs font-bold text-slate-800">#{row.id}</span>,
    },
    {
      header: 'Direction',
      accessor: 'orderType',
      render: (row) => (
        <Badge variant={row.orderType === 'INBOUND' ? 'info' : 'primary'}>
          {row.orderType === 'INBOUND' ? 'Inbound (Supplier)' : 'Outbound (Customer)'}
        </Badge>
      ),
    },
    {
      header: 'Origin / Destination',
      accessor: 'party',
      render: (row) => (
        <span className="text-xs font-medium text-slate-900">
          {row.orderType === 'INBOUND' ? (row.supplier?.name || 'Unassigned Supplier') : (row.customerName || 'Direct Client')}
        </span>
      ),
    },
    {
      header: 'Line Items',
      accessor: 'items',
      render: (row) => (
        <span className="text-xs text-slate-600 font-mono">
          {row.items?.length || 0} SKU item(s)
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status] || 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Date Created',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.createdAt ? row.createdAt.substring(0, 10) : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          {hasRole('ADMIN', 'MANAGER') ? (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-700"
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          ) : (
            <span className="text-xs text-slate-400 font-mono">{row.status}</span>
          )}

          {hasRole('ADMIN') && (
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Fulfillment Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log receiving manifests from suppliers and dispatch manifests for outbound distribution
          </p>
        </div>
        {hasRole('ADMIN', 'MANAGER') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs transition"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Create Manifest Order
          </button>
        )}
      </div>

      <Table columns={columns} data={orders} loading={loading} emptyMessage="No orders found in pipeline." />

      {/* Create Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Logistics Order Manifest"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Order Type *
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
              >
                <option value="INBOUND">INBOUND (Receiving from Supplier)</option>
                <option value="OUTBOUND">OUTBOUND (Fulfillment to Customer)</option>
              </select>
            </div>

            {orderType === 'INBOUND' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Supplier Vendor
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Customer / Entity Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Acme Industrial Corp"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Dispatch Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Priority freight / Dock bay 3"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Line Items:</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs text-sky-700 font-semibold hover:underline"
              >
                + Add Item Line
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <select
                    required
                    value={item.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                  >
                    <option value="">Select Product SKU</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} - {p.name} (Stock: {p.quantity})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-20 px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    placeholder="Price"
                    className="w-24 px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />

                  {orderItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
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
              {submitting ? 'Creating Order...' : 'Submit Manifest'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
