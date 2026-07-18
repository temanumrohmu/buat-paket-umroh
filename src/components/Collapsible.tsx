"use client";

import { useState, type ReactNode } from "react";

export default function Collapsible({
  title,
  subtitle,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-gold-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h3 className="font-semibold text-navy-900">{title}</h3>
          {subtitle && <p className="text-xs text-navy-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700">
              {badge}
            </span>
          )}
          <span className="text-gold-600">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && <div className="border-t border-gold-100 p-4">{children}</div>}
    </div>
  );
}
