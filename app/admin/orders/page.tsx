import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import StatusBadge from "@/components/admin/StatusBadge";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status as OrderStatus | undefined;

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-5">
        <FilterPill href="/admin/orders" active={!statusFilter} label="All" />
        {STATUSES.map((s) => (
          <FilterPill key={s} href={`/admin/orders?status=${s}`} active={statusFilter === s} label={s} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Payment</th>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-slate-800 hover:underline">
                    {o.guestName}
                  </Link>
                  <p className="text-xs text-slate-500">{o.guestPhone}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{o.items.length}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  ₹{o.total.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{o.paymentStatus}</td>
                <td className="px-4 py-3 text-slate-600">{o.source}</td>
                <td className="px-4 py-3 text-slate-500">
                  {o.createdAt.toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </a>
  );
}
