import React from 'react';
import { DollarSign, Receipt, TrendingUp } from 'lucide-react';

function currency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

export default function SummaryPanel({ closedOrders }) {
  const totals = closedOrders.reduce(
    (acc, o) => {
      acc.sales += o.totals.total;
      acc.count += 1;
      return acc;
    },
    { sales: 0, count: 0 }
  );
  const avg = totals.count ? totals.sales / totals.count : 0;

  const metrics = [
    { label: 'Sales', value: currency(totals.sales), icon: DollarSign, gradient: 'from-emerald-200 to-teal-200' },
    { label: 'Orders', value: totals.count.toString(), icon: Receipt, gradient: 'from-sky-200 to-indigo-200' },
    { label: 'Avg Order', value: currency(avg), icon: TrendingUp, gradient: 'from-rose-200 to-orange-200' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-800">Daily Summary</h3>
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className={`p-4 rounded-xl bg-gradient-to-br ${m.gradient} border border-white/60 shadow-inner`}> 
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-700/80">{m.label}</div>
                <div className="text-lg font-semibold text-slate-800">{m.value}</div>
              </div>
              <m.icon className="h-6 w-6 text-slate-700/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
