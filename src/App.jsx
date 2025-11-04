import React, { useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar.jsx';
import ItemList from './components/ItemList.jsx';
import OrderPanel from './components/OrderPanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';

function seedItems() {
  return [
    { id: 'capp', name: 'Cappuccino', price: 4.5, category: 'Coffee', bg: 'from-rose-100 to-rose-200' },
    { id: 'latte', name: 'Latte', price: 4.0, category: 'Coffee', bg: 'from-amber-100 to-amber-200' },
    { id: 'esp', name: 'Espresso', price: 3.0, category: 'Coffee', bg: 'from-emerald-100 to-emerald-200' },
    { id: 'tea', name: 'Matcha Tea', price: 3.5, category: 'Tea', bg: 'from-teal-100 to-teal-200' },
    { id: 'cake', name: 'Cheesecake', price: 5.0, category: 'Dessert', bg: 'from-sky-100 to-sky-200' },
    { id: 'cookie', name: 'Chocolate Cookie', price: 2.0, category: 'Dessert', bg: 'from-indigo-100 to-indigo-200' },
  ];
}

function App() {
  const [user, setUser] = useState(null);
  const [items] = useState(seedItems());
  const itemsById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);

  const [cart, setCart] = useState([]); // { itemId, qty }
  const [pendingOrders, setPendingOrders] = useState([]); // { id, items: [{itemId, qty, item}], totals, createdAt }
  const [closedOrders, setClosedOrders] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((c) => c.itemId === item.id);
      if (found) {
        return prev.map((c) => (c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { itemId: item.id, qty: 1 }];
    });
  };
  const incQty = (itemId) => setCart((prev) => prev.map((c) => (c.itemId === itemId ? { ...c, qty: c.qty + 1 } : c)));
  const decQty = (itemId) => setCart((prev) => prev.flatMap((c) => (c.itemId === itemId ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c])));
  const removeItem = (itemId) => setCart((prev) => prev.filter((c) => c.itemId !== itemId));

  const placeOrder = ({ items: cartEntries, totals }) => {
    const order = {
      id: crypto.randomUUID(),
      items: cartEntries.map((x) => ({ itemId: x.itemId, qty: x.qty, item: x.item })),
      totals,
      status: 'pending',
      createdAt: Date.now(),
    };
    setPendingOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  const closeOrder = (orderId) => {
    setPendingOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order) return prev;
      setClosedOrders((c) => [{ ...order, status: 'closed', closedAt: Date.now() }, ...c]);
      return prev.filter((o) => o.id !== orderId);
    });
  };

  const printSlip = async (order) => {
    try {
      if (navigator.bluetooth) {
        // Attempt Web Bluetooth discovery (user will see chooser)
        await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        // In a real app, you would connect to the printer's GATT service and write bytes.
      }
      // Fallback to browser print
      const w = window.open('', 'PRINT', 'height=600,width=400');
      if (w) {
        w.document.write(`<html><head><title>Receipt</title></head><body>`);
        w.document.write(`<h3 style="font-family: ui-sans-serif;">Pastel POS</h3>`);
        w.document.write(`<div style="font-family: ui-sans-serif; font-size: 12px;">`);
        if (order.items) {
          w.document.write('<ul style="padding-left: 1rem;">');
          order.items.forEach((x) => {
            w.document.write(`<li>${x.qty} x ${x.item.name} — $${(x.item.price * x.qty).toFixed(2)}</li>`);
          });
          w.document.write('</ul>');
        }
        if (order.totals) {
          w.document.write(`<p>Total: <strong>$${order.totals.total.toFixed(2)}</strong></p>`);
        }
        w.document.write(`<p style="opacity:.7;">${new Date().toLocaleString()}</p>`);
        w.document.write(`</div></body></html>`);
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }
    } catch (e) {
      console.error(e);
      alert('Printing failed or was cancelled.');
    }
  };

  const handleLoginToggle = () => {
    setUser((u) => (u ? null : 'cashier@pastel'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50">
      <HeaderBar user={user} onLoginToggle={handleLoginToggle} pendingCount={pendingOrders.length} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <ItemList items={items} onAdd={addToCart} />
        </section>
        <aside className="space-y-4">
          <OrderPanel
            cart={cart}
            itemsById={itemsById}
            onIncQty={incQty}
            onDecQty={decQty}
            onRemove={removeItem}
            onPlace={placeOrder}
            onPrint={printSlip}
            pending={pendingOrders}
            onCloseOrder={closeOrder}
          />
          <SummaryPanel closedOrders={closedOrders} />
        </aside>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        Designed in soft pastels • Not connected to backend yet
      </footer>
    </div>
  );
}

export default App;
