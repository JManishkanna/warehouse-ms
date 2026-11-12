import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDemandForecast,
} from '../api/products';
import { getAllShelves } from '../api/warehouse';
import { useAuth } from '../context/AuthContext';
import { formatINR, GROCERY_CATEGORIES } from '../api/mockData';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import QRScannerModal from '../components/QRScannerModal';
import {
  PlusIcon,
  QrCodeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const initialFormData = {
  sku: '',
  name: '',
  packSize: '',
  description: '',
  category: 'Dairy & Bread',
  temperatureZone: 'Ambient (Dry)',
  batchNo: '',
  quantity: 0,
  costPrice: '',
  unitPrice: '',
  reorderLevel: 20,
  shelfId: '',
  expiryDate: '',
};

export default function Inventory() {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Grocery Inspection Modal
  const [inspectedGrocery, setInspectedGrocery] = useState(null);

  // Product Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // QR Scanner state
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Demand Forecast Modal state
  const [isForecastOpen, setIsForecastOpen] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [selectedProductForForecast, setSelectedProductForForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchShelves();
  }, []);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const res = await getProducts(query);
      if (res.data && res.data.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load grocery catalog');
    } finally {
      setLoading(false);
    }
  };

  const fetchShelves = async () => {
    try {
      const res = await getAllShelves();
      if (res.data && res.data.data) {
        setShelves(res.data.data);
      }
    } catch (_) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      packSize: product.packSize || '',
      description: product.description || '',
      category: product.category || 'Dairy & Bread',
      temperatureZone: product.temperatureZone || 'Ambient (Dry)',
      batchNo: product.batchNo || '',
      quantity: product.quantity || 0,
      costPrice: product.costPrice || '',
      unitPrice: product.unitPrice || '',
      reorderLevel: product.reorderLevel || 20,
      shelfId: product.shelf ? product.shelf.id : '',
      expiryDate: product.expiryDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        unitPrice: parseFloat(formData.unitPrice),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        reorderLevel: parseInt(formData.reorderLevel, 10),
        shelfId: formData.shelfId ? parseInt(formData.shelfId, 10) : null,
        expiryDate: formData.expiryDate ? formData.expiryDate : null,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success('Grocery item updated');
      } else {
        await createProduct(payload);
        toast.success('New grocery line cataloged into dark store');
      }

      setIsModalOpen(false);
      fetchProducts(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete grocery SKU from inventory?')) return;
    try {
      await deleteProduct(id);
      toast.success('Grocery item removed');
      fetchProducts(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete operation failed');
    }
  };

  const handleOpenForecast = async (product) => {
    setSelectedProductForForecast(product);
    setIsForecastOpen(true);
    setLoadingForecast(true);
    try {
      const res = await getDemandForecast(product.id);
      if (res.data && res.data.data) {
        setForecastData(res.data.data);
      }
    } catch (err) {
      toast.error('Unable to compute forecast model');
    } finally {
      setLoadingForecast(false);
    }
  };

  const handleQRScanned = (scannedCode) => {
    toast.success(`Scanned barcode: ${scannedCode}`);
    setSearch(scannedCode);
    fetchProducts(scannedCode);
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const getTempZoneBadge = (zone) => {
    if (!zone) return null;
    if (zone.toLowerCase().includes('frozen')) {
      return <Badge variant="info">❄️ {zone}</Badge>;
    }
    if (zone.toLowerCase().includes('chilled')) {
      return <Badge variant="primary">🧊 {zone}</Badge>;
    }
    return <Badge variant="default">🌡️ {zone}</Badge>;
  };

  const columns = [
    {
      header: 'Grocery Item & Pack',
      accessor: 'name',
      render: (row) => (
        <div className="cursor-pointer" onClick={() => setInspectedGrocery(row)}>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-slate-900 text-xs hover:text-amber-600 transition block">
              {row.name}
            </span>
            <EyeIcon className="h-3.5 w-3.5 text-slate-400 hover:text-slate-800" />
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="font-mono text-[10px] text-slate-500 font-semibold">{row.sku}</span>
            {row.packSize && (
              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                {row.packSize}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => <Badge variant="default">{row.category || 'General'}</Badge>,
    },
    {
      header: 'Temp Zone',
      accessor: 'temperatureZone',
      render: (row) => getTempZoneBadge(row.temperatureZone),
    },
    {
      header: 'Picking Rack',
      accessor: 'shelf',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.shelf ? row.shelf.label : 'Bin Unallocated'}
        </span>
      ),
    },
    {
      header: 'Stock Units',
      accessor: 'quantity',
      render: (row) => {
        const isLow = row.quantity <= row.reorderLevel;
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-mono text-sm font-bold ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
              {row.quantity}
            </span>
            {isLow && <Badge variant="danger">Low Stock</Badge>}
          </div>
        );
      },
    },
    {
      header: 'Price (₹)',
      accessor: 'unitPrice',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-900 block">
            {formatINR(row.unitPrice)}
          </span>
          {row.costPrice && (
            <span className="text-[10px] text-slate-500 block">
              Cost: {formatINR(row.costPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Freshness / Expiry',
      accessor: 'expiryDate',
      render: (row) => {
        const isNear = row.freshnessScore?.toLowerCase().includes('expiring') || (row.expiryDate && row.expiryDate.startsWith('2026-11-03'));
        return (
          <div>
            <span className={`text-xs font-medium block ${isNear ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
              {row.freshnessScore || (row.expiryDate || 'N/A')}
            </span>
            {row.batchNo && (
              <span className="text-[10px] text-slate-400 font-mono block">
                {row.batchNo}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          {/* Quick Grocery Inspection */}
          <button
            onClick={() => setInspectedGrocery(row)}
            title="Inspect Grocery Details"
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <EyeIcon className="h-4 w-4" />
          </button>

          {/* AI Forecast */}
          <button
            onClick={() => handleOpenForecast(row)}
            title="AI Demand Prediction (10-Min Velocity)"
            className="p-1 rounded text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition"
          >
            <ArrowTrendingUpIcon className="h-4 w-4" />
          </button>

          {hasRole('ADMIN', 'MANAGER') && (
            <>
              <button
                onClick={() => openEditModal(row)}
                title="Edit SKU"
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                title="Remove SKU"
                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-black bg-amber-400 text-slate-950 rounded">
              BazzerCart
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dark Store Grocery Catalog</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            FMCG inventory, freshness SLA tags, chilled storage racks, and unit margins in Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs transition"
          >
            <QrCodeIcon className="h-4 w-4 mr-1.5 text-slate-600" />
            Scan Grocery Barcode
          </button>
          {hasRole('ADMIN', 'MANAGER') && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-xs transition"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Add Grocery SKU
            </button>
          )}
        </div>
      </div>

      {/* Grocery Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {GROCERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search grocery item, brand, SKU or rack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
          />
          <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
        {search && (
          <button
            onClick={() => {
              setSearch('');
              fetchProducts('');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Grocery Table */}
      <Table
        columns={columns}
        data={filteredProducts}
        loading={loading}
        emptyMessage="No grocery lines found matching selected criteria."
      />

      {/* GROCERY DETAILS MODAL: Easy inspection of all grocery specs */}
      <Modal
        isOpen={!!inspectedGrocery}
        onClose={() => setInspectedGrocery(null)}
        title={`Grocery Details: ${inspectedGrocery?.name || ''}`}
        maxWidth="max-w-xl"
      >
        {inspectedGrocery && (
          <div className="space-y-4 text-xs">
            {/* Top Tag banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{inspectedGrocery.name}</span>
                <span className="text-[11px] text-amber-800 font-semibold">{inspectedGrocery.packSize || 'Standard Retail Pack'}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold font-mono text-slate-950 block">
                  {formatINR(inspectedGrocery.unitPrice)}
                </span>
                <span className="text-[10px] text-slate-500 block">Retail Selling Price</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Stock in Dark Store</span>
                <span className="text-lg font-black text-slate-900 font-mono">{inspectedGrocery.quantity} units</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Safety Threshold</span>
                <span className="text-lg font-bold text-slate-700 font-mono">{inspectedGrocery.reorderLevel} units</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Margin per Unit</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {inspectedGrocery.costPrice ? formatINR(inspectedGrocery.unitPrice - inspectedGrocery.costPrice) : '20%'}
                </span>
              </div>
            </div>

            {/* Technical Grocery Specifications */}
            <div className="border border-slate-200 rounded divide-y divide-slate-100">
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Category Division:</span>
                <Badge variant="default">{inspectedGrocery.category || 'Grocery'}</Badge>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Storage Temperature Zone:</span>
                <div>{getTempZoneBadge(inspectedGrocery.temperatureZone)}</div>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Dark Store Picking Shelf:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {inspectedGrocery.shelf?.label || 'A-1-1'} ({inspectedGrocery.shelf?.aisle ? `Aisle ${inspectedGrocery.shelf.aisle}` : 'Main Bay'})
                </span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Batch / Lot Number:</span>
                <span className="font-mono text-slate-800 font-bold">{inspectedGrocery.batchNo || 'B-FMCG-2026'}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Freshness SLA &amp; Expiry:</span>
                <span className="font-semibold text-emerald-700">{inspectedGrocery.freshnessScore || inspectedGrocery.expiryDate || 'Optimal Freshness'}</span>
              </div>

              {inspectedGrocery.description && (
                <div className="p-3">
                  <span className="font-semibold text-slate-600 block mb-1">Product &amp; Handling Notes:</span>
                  <p className="text-slate-600 leading-relaxed">{inspectedGrocery.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedGrocery(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
              >
                Close Inspection
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Grocery SKU Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modify Grocery SKU' : 'Catalog New Grocery SKU into BazzerCart Hub'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Barcode / SKU ID *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
                placeholder="e.g. BLK-DRY-011"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Grocery Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
                placeholder="e.g. Amul Salted Butter"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pack Size / Weight
              </label>
              <input
                type="text"
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
                placeholder="e.g. 500g Tub"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Grocery Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
              >
                {GROCERY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Storage Temp Zone
              </label>
              <select
                value={formData.temperatureZone}
                onChange={(e) => setFormData({ ...formData, temperatureZone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
              >
                <option value="Ambient (Dry)">Ambient (Dry)</option>
                <option value="Chilled (2-4°C)">Chilled (2-4°C)</option>
                <option value="Chilled (4-8°C)">Chilled (4-8°C)</option>
                <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                <option value="Ambient (Cool)">Ambient (Cool)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description &amp; Freshness Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded"
              placeholder="Nutritional, ingredients, or storage handling notes"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
                placeholder="₹ Retail"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
                placeholder="₹ Procurement"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Safety Reorder Level
              </label>
              <input
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Picking Shelf Rack
              </label>
              <select
                value={formData.shelfId}
                onChange={(e) => setFormData({ ...formData, shelfId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
              >
                <option value="">Unallocated</option>
                {shelves.map((shelf) => (
                  <option key={shelf.id} value={shelf.id}>
                    Rack {shelf.label} ({shelf.aisle})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batch Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded hover:bg-amber-300 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingId ? 'Update SKU' : 'Catalog SKU'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QR & Barcode Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />

      {/* AI Demand Prediction Modal */}
      <Modal
        isOpen={isForecastOpen}
        onClose={() => setIsForecastOpen(false)}
        title={`BazzerCart 10-Minute Demand Forecast: ${selectedProductForForecast?.name || ''}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 border border-amber-200 rounded">
            <div className="flex justify-between items-center text-xs text-amber-950 mb-1">
              <span>SKU: <strong className="font-mono">{selectedProductForForecast?.sku}</strong></span>
              <span>Available Units: <strong className="font-mono">{selectedProductForForecast?.quantity} packs</strong></span>
            </div>
            <div className="text-xs text-amber-900">
              High-Velocity Quick-Commerce Predictive Engine (Daily OLS Dispatch Curve)
            </div>
          </div>

          {loadingForecast ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Calculating 7-day replenishment projection...
            </div>
          ) : forecastData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white border border-slate-200 rounded">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Projected Daily Demand</p>
                  <p className="text-xl font-bold text-amber-600 mt-0.5">{forecastData.predictedDailyDemand} <span className="text-xs font-normal">packs</span></p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Order Velocity</p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">High SLA (Fast Picking)</p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Dispatch History</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{forecastData.historicalDataPoints || 30} days</p>
                </div>
              </div>

              {forecastData.forecast && forecastData.forecast.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">7-Day Projected Unit Demand:</p>
                  <div className="h-48 border border-slate-200 rounded p-2 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="predictedDemand" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
