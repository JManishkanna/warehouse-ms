import React, { useState, useEffect } from 'react';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead } from '../api/alerts';
import Badge from '../components/common/Badge';
import {
  BellAlertIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ALERT_BADGE_MAP = {
  LOW_STOCK: 'danger',
  EXPIRY_WARNING: 'warning',
  REORDER_NEEDED: 'warning',
  UNUSUAL_ACTIVITY: 'info',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAlerts();
      if (res.data && res.data.data) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load system alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAlertAsRead(id);
      toast.success('Alert marked as acknowledged');
      fetchAlerts();
    } catch (_) {
      toast.error('Operation failed');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsAsRead();
      toast.success('All pending alerts marked as acknowledged');
      fetchAlerts();
    } catch (_) {
      toast.error('Operation failed');
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Alerts &amp; Discrepancies</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts for threshold breaches, shelf shelf-life expiry, and order backlog
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 shadow-xs"
          >
            <CheckIcon className="h-4 w-4 mr-1 text-emerald-600" />
            Acknowledge All ({unreadCount})
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs divide-y divide-slate-100">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading alerts telemetry...</div>
        ) : alerts.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No system discrepancy alerts on record. All systems normal.
          </div>
        ) : (
          alerts.map((alert) => {
            const isUnread = !alert.read;
            return (
              <div
                key={alert.id}
                className={`p-4 flex items-start justify-between gap-4 transition ${
                  isUnread ? 'bg-slate-50' : 'bg-white opacity-70'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded mt-0.5 ${
                      alert.alertType === 'LOW_STOCK'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={ALERT_BADGE_MAP[alert.alertType] || 'default'}>
                        {alert.alertType.replace('_', ' ')}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {alert.createdAt ? alert.createdAt.replace('T', ' ').substring(0, 19) : ''}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-800">{alert.message}</p>
                    {alert.product && (
                      <span className="mt-1 inline-block text-[11px] text-slate-500 font-mono">
                        Target SKU: {alert.product.sku}
                      </span>
                    )}
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
