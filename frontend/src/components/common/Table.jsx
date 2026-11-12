import React from 'react';

export default function Table({ columns, data, loading, emptyMessage = 'No data recorded.' }) {
  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center bg-white border border-slate-200 rounded">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
          <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-4 py-3 font-semibold text-slate-700 tracking-wider text-xs uppercase ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-4 py-3 text-slate-700 whitespace-nowrap ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : (row[col.accessor] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
