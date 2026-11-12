import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboard';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { BAZZERCART_FINANCIALS, formatINR } from '../api/mockData';
import {
  CurrencyRupeeIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  BellAlertIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';

const STATUS_PALETTE = ['#16a34a', '#0284c7', '#eab308'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profitTimeframe, setProfitTimeframe] = useState('daily'); // 'daily' | 'monthly' | 'yearly'
  const [inspectedGrocery, setInspectedGrocery] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.data && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load store telemetry');
    } finally {
      setLoading(false);
    }
  };

  const financialData = stats?.financials?.[profitTimeframe] || BAZZERCART_FINANCIALS[profitTimeframe];

  // Calculate totals for active timeframe
  const totalRevenue = financialData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = financialData.reduce((acc, curr) => acc + curr.profit, 0);
  const totalCost = financialData.reduce((acc, curr) => acc + curr.cost, 0);
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-black bg-amber-400 text-slate-950 rounded">
              BazzerCart
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Operations &amp; Profit Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Koramangala Node #BLR-04 · 10-Minute Rapid Grocery Dispatch &amp; Real-Time Ledger
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            98.4% 10-Min SLA On-Time
          </span>
          <button
            onClick={fetchStats}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs"
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Primary KPI Cards (All in ₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Today's Net Profit"
          value={formatINR(stats?.todayProfit ?? 23000)}
          subtitle="22.0% store margin"
          icon={CurrencyRupeeIcon}
        />
        <StatCard
          title="Today's Revenue"
          value={formatINR(stats?.todayRevenue ?? 104500)}
          subtitle="342 orders delivered"
          icon={ArrowTrendingUpIcon}
        />
        <StatCard
          title="Grocery SKUs"
          value={stats?.totalProducts ?? 10}
          subtitle="Active catalog items"
          icon={ArchiveBoxIcon}
        />
        <StatCard
          title="Low Stock / Shelf"
          value={stats?.lowStockCount ?? 2}
          subtitle="Requires restocking"
          icon={ExclamationTriangleIcon}
          alert={(stats?.lowStockCount || 0) > 0}
        />
        <StatCard
          title="Live Dispatches"
          value="47"
          subtitle="Riders en route"
          icon={BoltIcon}
        />
        <StatCard
          title="Freshness Alerts"
          value={stats?.unreadAlerts ?? 2}
          subtitle="Perishable items"
          icon={BellAlertIcon}
          alert={(stats?.unreadAlerts || 0) > 0}
        />
      </div>

      {/* PROFIT ANALYTICS SECTION: Yearly, Monthly, Daily Interactive Graph */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <CurrencyRupeeIcon className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Dark Store Profit &amp; Revenue Analytics (INR ₹)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare Gross Customer Billing vs. Direct Procurement Cost &amp; Net Operational Profit
            </p>
          </div>

          {/* Timeframe Toggle Buttons */}
          <div className="inline-flex rounded border border-slate-300 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setProfitTimeframe('daily')}
              className={`px-3 py-1.5 rounded transition ${
                profitTimeframe === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Profits
            </button>
            <button
              onClick={() => setProfitTimeframe('monthly')}
              className={`px-3 py-1.5 rounded transition ${
                profitTimeframe === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Profits
            </button>
            <button
              onClick={() => setProfitTimeframe('yearly')}
              className={`px-3 py-1.5 rounded transition ${
                profitTimeframe === 'yearly'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly Profits
            </button>
          </div>
        </div>

        {/* Timeframe Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-slate-50 border border-slate-200 rounded">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Revenue ({profitTimeframe})</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">{formatINR(totalRevenue)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Procurement Cost</span>
            <span className="text-lg font-semibold text-slate-600 font-mono">{formatINR(totalCost)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Net Store Profit</span>
            <span className="text-lg font-extrabold text-emerald-600 font-mono">{formatINR(totalProfit)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Gross Profit Margin</span>
            <span className="text-lg font-extrabold text-amber-600 font-mono">{overallMargin}</span>
          </div>
        </div>

        {/* Profit & Revenue Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `₹${val >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'k'}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                formatter={(val, name) => [formatINR(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" fill="#0284c7" name="Gross Revenue (₹)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="profit" fill="#16a34a" name="Net Profit (₹)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-Velocity Groceries & Fulfillment Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast-Moving Groceries Table */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Fast-Moving Grocery SKUs</h2>
              <p className="text-xs text-slate-500">Quick-Commerce dark store high-velocity items</p>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              10-Min Picking Shelf
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold text-slate-600">Grocery Item</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-600">Unit Price</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-600 text-right">Bin Units</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-600 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.topProducts && stats.topProducts.length > 0 ? (
                  stats.topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-800">{p.name}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900">{formatINR(p.price || 56)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{p.quantity} units</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => setInspectedGrocery(p)}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="View Grocery Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">No grocery inventory recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 10-Minute Order Fulfillment Status */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">10-Minute Dispatch Pipeline</h2>
            <p className="text-xs text-slate-500">Live order fulfillment stages in the dark store</p>
          </div>
          <div className="h-64">
            {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                    labelLine={false}
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_PALETTE[index % STATUS_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No orders currently recorded in pipeline
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grocery Quick Inspection Modal */}
      <Modal
        isOpen={!!inspectedGrocery}
        onClose={() => setInspectedGrocery(null)}
        title={`Grocery Quick-Check: ${inspectedGrocery?.name || ''}`}
        maxWidth="max-w-md"
      >
        {inspectedGrocery && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-950 flex items-center justify-between">
              <span className="font-semibold">BazzerCart 10-Minute Dark Store SKU</span>
              <span className="font-bold font-mono">{formatINR(inspectedGrocery.price || 56)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Units</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">{inspectedGrocery.quantity} packs</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Picking Rack Location</span>
                <span className="text-base font-bold text-slate-800 font-mono">Aisle A / Rack 1-1</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Storage Temperature:</span>
                <span className="font-semibold text-slate-800">Chilled / Ambient Protected</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Freshness SLA:</span>
                <span className="font-semibold text-emerald-600">Passed Quality Check</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Replenishment Source:</span>
                <span className="font-semibold text-slate-800">Direct FMCG Mother Depot</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
