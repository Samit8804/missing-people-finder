"use client";

import React from 'react';
import Link from 'next/link';
import { X, FileSearch, Bell, Users, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function SideDrawer({ open, onClose, navItems, user, onLogout }) {
  // Simple, accessible drawer with a translucent overlay
  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity ${open ? 'pointer-events-auto bg-black/40' : 'pointer-events-none bg-black/0'}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200`}
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-600 rounded-md text-white"><ShieldCheck size={16} /></div>
            <span className="font-semibold">FindLink</span>
          </div>
          <button onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = false; // active state not strictly required in mobile drawer for now
            return (
              <Link key={item.name} href={item.href} className={"block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"}>
                <span className="flex items-center gap-2">
                  <item.icon size={16} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="border-t border-gray-100 p-4 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">{user.name?.charAt(0)}</div>
              <div>
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <button onClick={onLogout} className="w-full text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
          </div>
        )}
      </aside>
    </>
  );
}
