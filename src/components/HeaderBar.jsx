import React from 'react';
import { ShoppingCart, User, LogOut, LogIn, Settings } from 'lucide-react';

export default function HeaderBar({ user, onLoginToggle, pendingCount }) {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-pastel-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-200 to-sky-200 shadow-inner" />
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Pastel POS</h1>
            <p className="text-xs text-slate-500">SaaS Point of Sale</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">Pending: {pendingCount}</span>
          </div>
          <button
            onClick={onLoginToggle}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-teal-200 to-emerald-200 text-slate-800 hover:shadow transition shadow-sm"
          >
            {user ? (
              <>
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user}</span>
                <LogOut className="h-4 w-4 opacity-70" />
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </>
            )}
          </button>
          <button
            className="p-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
