import React from 'react';
import { Trash2, Printer, CheckCircle, Minus, Plus, Clock } from 'lucide-react';

function currency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

export default function OrderPanel({
  cart,
  itemsById,
  onIncQty,
  onDecQty,
  onRemove,
  onPlace,
  onPrint,
  pending,
  onCloseOrder,
}) {
  const cartEntries = cart.map((c) => ({ ...c, item: itemsById[c.itemId] }));
  const subtotal = cartEntries.reduce((s, x) => s + x.item.price * x.qty, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Current Order</h3>
          {cart.length > 0 && (
            <button
              onClick={() => cart.forEach((c) => onRemove(c.itemId))}
              className="text-xs text-rose-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        {cart.length === 0 ? (
          <p className="text-sm text-slate-500">No items added. Tap a product to add it here.</p>
        ) : (
          <div className="space-y-3">
            {cartEntries.map(({ itemId, qty, item }) => (
              <div key={itemId} className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-slate-500">{currency(item.price)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onDecQty(itemId)} className="p-1.5 rounded-md bg-slate-100"><Minus className="h-4 w-4" /></button>
                  <span className="text-sm w-6 text-center">{qty}</span>
                  <button onClick={() => onIncQty(itemId)} className="p-1.5 rounded-md bg-slate-100"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="w-20 text-right text-sm font-semibold text-slate-700">{currency(item.price * qty)}</div>
                <button onClick={() => onRemove(itemId)} className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Tax</span><span>{currency(tax)}</span></div>
              <div className="flex justify-between text-slate-800 font-semibold"><span>Total</span><span>{currency(total)}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onPrint({ items: cartEntries, totals: { subtotal, tax, total }, status: 'draft' })}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-sky-200 to-indigo-200 text-slate-800 hover:shadow"
              >
                <Printer className="h-4 w-4" /> Print Slip
              </button>
              <button
                onClick={() => onPlace({ items: cartEntries, totals: { subtotal, tax, total } })}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-teal-200 to-emerald-200 text-slate-800 hover:shadow"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Pending Orders</h3>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="h-4 w-4" /> {pending.length}
          </div>
        </div>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending orders.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <div key={order.id} className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Order #{order.id.slice(-5)}</div>
                  <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  <ul className="mt-2 text-xs text-slate-600 list-disc ml-4">
                    {order.items.map((x) => (
                      <li key={x.itemId}>
                        {x.qty} x {x.item.name} — {currency(x.item.price * x.qty)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-sm font-medium text-slate-700">Total: {currency(order.totals.total)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onPrint(order)} className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md bg-sky-100 text-slate-800">
                    <Printer className="h-4 w-4" /> Print
                  </button>
                  <button onClick={() => onCloseOrder(order.id)} className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md bg-emerald-100 text-emerald-900">
                    <CheckCircle className="h-4 w-4" /> Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
