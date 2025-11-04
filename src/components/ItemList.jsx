import React from 'react';
import { Plus } from 'lucide-react';

function currency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

export default function ItemList({ items, onAdd }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Menu</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            className="group text-left p-3 rounded-xl border border-slate-100 bg-white hover:shadow-md transition relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/50 to-white/0 pointer-events-none" />
            <div className={`h-24 rounded-lg mb-3 bg-gradient-to-br ${item.bg} shadow-inner`} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{item.name}</div>
                <div className="text-xs text-slate-500">{item.category}</div>
              </div>
              <div className="text-sm font-semibold text-slate-700">{currency(item.price)}</div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-teal-700 text-xs">
              <Plus className="h-4 w-4" /> Add
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
