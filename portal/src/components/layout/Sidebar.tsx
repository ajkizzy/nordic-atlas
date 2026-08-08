'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MODULE_ACCESS, type UserRole } from '@/types/db';
import { LayoutDashboard, Map, Users, Boxes, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, module: null },
  { href: '/dashboard/map', label: 'Map CRM', icon: Map, module: 'crm' as const },
  { href: '/dashboard/clients', label: 'Clients', icon: Users, module: 'crm' as const },
  { href: '/dashboard/inventory', label: 'Sales & Inventory', icon: Boxes, module: 'inventory' as const },
];

export function Sidebar({ role, name, signOutAction }: { role: UserRole; name: string; signOutAction: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const access = MODULE_ACCESS[role];
  const items = NAV.filter((n) => !n.module || access[n.module]);

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto border-t border-slate-100 p-3">
      <div className="px-3 py-2">
        <p className="text-sm font-semibold text-slate-900 truncate">{name || 'User'}</p>
        <p className="text-xs text-slate-500">{{ owner: 'Owner', sales: 'Sales Rep', warehouse: 'Warehouse' }[role]}</p>
      </div>
      <form action={signOutAction}>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
          <LogOut size={16} /> Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14">
        <div className="flex items-center gap-2">
          <Image src="/nordic-atlas-logo.png" alt="Nordic Atlas" width={32} height={32} className="h-8 w-8" priority />
          <span className="font-heading font-medium text-slate-900">Nordic Atlas</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-slate-600" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {open && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-white flex flex-col">
          {nav}
          {footer}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200 min-h-dvh sticky top-0">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-100">
          <Image src="/nordic-atlas-logo.png" alt="Nordic Atlas" width={32} height={32} className="h-8 w-8" priority />
          <div className="leading-tight">
            <p className="font-heading font-medium text-slate-900">Nordic Atlas</p>
            <p className="text-[11px] text-slate-400">Internal Portal</p>
          </div>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
