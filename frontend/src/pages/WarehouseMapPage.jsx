import React, { useState, useEffect } from 'react';
import { getWarehouses, getWarehouseMapData } from '../api/warehouse';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import {
  MapPinIcon,
  Squares2X2Icon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function WarehouseMapPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [mapShelves, setMapShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [filterAisle, setFilterAisle] = useState('ALL');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await getWarehouses();
      if (res.data && res.data.data && res.data.data.length > 0) {
        setWarehouses(res.data.data);
        const firstId = res.data.data[0].id;
        setSelectedWarehouseId(firstId);
        fetchMap(firstId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      toast.error('Failed to load facility locations');
      setLoading(false);
    }
  };

  const fetchMap = async (whId) => {
    setLoading(true);
    try {
      const res = await getWarehouseMapData(whId);
      if (res.data && res.data.data) {
        setMapShelves(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load warehouse grid telemetry');
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseChange = (e) => {
    const id = e.target.value;
    setSelectedWarehouseId(id);
    fetchMap(id);
  };

  // Group shelves by Aisle
  const aisles = Array.from(new Set(mapShelves.map((s) => s.shelf.aisle))).sort();
  const displayedShelves = filterAisle === 'ALL' 
    ? mapShelves 
    : mapShelves.filter((s) => s.shelf.aisle === filterAisle);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Warehouse Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            2D physical layout of aisles, storage racks, and real-time inventory allocation
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedWarehouseId}
            onChange={handleWarehouseChange}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded bg-white text-slate-800"
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} (Cap: {w.capacity})
              </option>
            ))}
          </select>

          <select
            value={filterAisle}
            onChange={(e) => setFilterAisle(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded bg-white text-slate-800"
          >
            <option value="ALL">All Aisles</option>
            {aisles.map((a) => (
              <option key={a} value={a}>
                Aisle {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-6 p-3 bg-white border border-slate-200 rounded text-xs">
        <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Rack Status:</span>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-400" />
          <span className="text-slate-600">Stocked &amp; Optimal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-400" />
          <span className="text-slate-600">Low Stock Triggered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
          <span className="text-slate-600">Empty Rack</span>
        </div>
      </div>

      {/* 2D Interactive Grid */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading facility layout...</div>
        ) : displayedShelves.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">No storage racks cataloged for this facility</div>
        ) : (
          <div className="space-y-8">
            {aisles
              .filter((a) => filterAisle === 'ALL' || a === filterAisle)
              .map((aisleKey) => {
                const aisleShelves = displayedShelves.filter((s) => s.shelf.aisle === aisleKey);
                return (
                  <div key={aisleKey} className="border border-slate-200 rounded p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-slate-800 text-white text-xs font-bold font-mono rounded">
                          AISLE {aisleKey}
                        </span>
                        <span className="text-xs text-slate-500">
                          {aisleShelves.length} rack slots allocated
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {aisleShelves.map((item) => {
                        const status = item.status;
                        const isLow = status === 'LOW';
                        const isEmpty = status === 'EMPTY';
                        const productCount = item.products?.length || 0;

                        return (
                          <button
                            key={item.shelf.id}
                            onClick={() => setSelectedShelf(item)}
                            className={`p-3 rounded border text-left transition hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-800 ${
                              isEmpty
                                ? 'bg-slate-100 border-slate-300 text-slate-500'
                                : isLow
                                ? 'bg-rose-50 border-rose-300 text-rose-900'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold tracking-tight">
                                {item.shelf.label}
                              </span>
                              {isEmpty ? (
                                <CubeTransparentIcon className="h-4 w-4 text-slate-400" />
                              ) : isLow ? (
                                <ExclamationCircleIcon className="h-4 w-4 text-rose-600" />
                              ) : (
                                <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                              )}
                            </div>
                            <div className="mt-2 text-[11px] text-slate-600">
                              {productCount > 0 ? (
                                <span>{productCount} SKU item{productCount > 1 ? 's' : ''}</span>
                              ) : (
                                <span className="italic text-slate-400">Available</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Shelf Inspection Modal */}
      <Modal
        isOpen={!!selectedShelf}
        onClose={() => setSelectedShelf(null)}
        title={`Rack Inspection: ${selectedShelf?.shelf.label || ''}`}
        maxWidth="max-w-lg"
      >
        {selectedShelf && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded border border-slate-200 text-center">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Aisle</p>
                <p className="text-sm font-bold font-mono text-slate-900">{selectedShelf.shelf.aisle}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Row / Col</p>
                <p className="text-sm font-bold font-mono text-slate-900">{selectedShelf.shelf.rowNum} - {selectedShelf.shelf.colNum}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Max Capacity</p>
                <p className="text-sm font-bold font-mono text-slate-900">{selectedShelf.shelf.capacity} units</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Stored Inventory SKUs:
              </p>
              {selectedShelf.products && selectedShelf.products.length > 0 ? (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded">
                  {selectedShelf.products.map((prod) => (
                    <div key={prod.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-800 block">{prod.sku}</span>
                        <span className="text-slate-600 font-medium block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 block">Unit: ${Number(prod.unitPrice).toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900 block">{prod.quantity} units</span>
                        {prod.quantity <= prod.reorderLevel && (
                          <Badge variant="danger">Low Stock</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500">
                  Rack position is currently empty and available for incoming dispatches.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
