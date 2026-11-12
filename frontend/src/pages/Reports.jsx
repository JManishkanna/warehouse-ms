import React, { useState, useEffect } from 'react';
import { getProducts, getLowStockProducts } from '../api/products';
import { getOrders } from '../api/orders';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = ['#0284c7', '#0d9488', '#eab308', '#ec4899', '#6366f1', '#84cc16'];

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [prodRes, lowRes, ordRes] = await Promise.all([
        getProducts(),
        getLowStockProducts(),
        getOrders(),
      ]);
      if (prodRes.data?.data) setProducts(prodRes.data.data);
      if (lowRes.data?.data) setLowStock(lowRes.data.data);
      if (ordRes.data?.data) setOrders(ordRes.data.data);
    } catch (err) {
      toast.error('Failed to aggregate telemetry data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total inventory valuation
  const totalValuation = products.reduce((acc, p) => {
    return acc + p.quantity * parseFloat(p.unitPrice || 0);
  }, 0);

  // Group by category
  const categoryData = Object.values(
    products.reduce((acc, p) => {
      const cat = p.category || 'General';
      if (!acc[cat]) {
        acc[cat] = { name: cat, count: 0, valuation: 0 };
      }
      acc[cat].count += p.quantity;
      acc[cat].valuation += p.quantity * parseFloat(p.unitPrice || 0);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports &amp; Analytical Auditing</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited asset valuations, stock distribution, and compliance telemetry
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Asset Valuation"
          value={`$${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Real-time stored asset worth"
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Cataloged SKUs"
          value={products.length}
          subtitle="Unique inventory records"
          icon={ArchiveBoxIcon}
        />
        <StatCard
          title="Critical Reorder Alerts"
          value={lowStock.length}
          subtitle="SKUs breaching safety threshold"
          icon={ExclamationTriangleIcon}
          alert={lowStock.length > 0}
        />
        <StatCard
          title="Lifetime Orders Logged"
          value={orders.length}
          subtitle="Total inbound &amp; outbound movements"
          icon={ClipboardDocumentCheckIcon}
        />
      </div>

      {/* Analytical Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Asset Valuation by Category</h2>
          <p className="text-xs text-slate-500 mb-4">Capital distribution across inventory segments</p>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="valuation"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, valuation }) => `${name}: $${Math.round(valuation)}`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                    formatter={(val) => `$${Number(val).toFixed(2)}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No inventory categories recorded
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Physical Units Stored by Category</h2>
          <p className="text-xs text-slate-500 mb-4">Gross unit volume across categories</p>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[2, 2, 0, 0]} name="Units" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No inventory units recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical Reorder Audit Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Safety Threshold Exception Audit</h2>
        <p className="text-xs text-slate-500 mb-4">SKUs currently requiring replenishment purchase manifests</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-slate-600">SKU Ref</th>
                <th className="py-2.5 px-3 font-semibold text-slate-600">Product Name</th>
                <th className="py-2.5 px-3 font-semibold text-slate-600">Current Units</th>
                <th className="py-2.5 px-3 font-semibold text-slate-600">Reorder Level</th>
                <th className="py-2.5 px-3 font-semibold text-slate-600 text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStock.length > 0 ? (
                lowStock.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{prod.sku}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{prod.name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{prod.quantity} units</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{prod.reorderLevel} units</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">${Number(prod.unitPrice).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">
                    All inventory SKUs are operating above safety reorder thresholds.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
