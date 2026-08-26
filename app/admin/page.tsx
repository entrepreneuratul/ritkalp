import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalOrders, paidOrders, recentOrders, kitCounts] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.orderItem.groupBy({
      by: ["name"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = await prisma.order.count({ where: { status: "PENDING" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Revenue (Paid)" value={`₹${revenue.toLocaleString("en-IN")}`} />
        <StatCard label="Total Orders" value={String(totalOrders)} />
        <StatCard label="Pending Orders" value={String(pendingCount)} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Orders</h2>
          <ul className="divide-y divide-slate-100">
            {recentOrders.map((o) => (
              <li key={o.id} className="py-2.5">
                <Link href={`/admin/orders/${o.id}`} className="flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-medium text-slate-800 group-hover:underline">
                      {o.guestName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.status}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    ₹{o.total.toLocaleString("en-IN")}
                  </span>
                </Link>
              </li>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-slate-400 py-4">No orders yet.</p>}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top Kits (by quantity sold)</h2>
          <ul className="divide-y divide-slate-100">
            {kitCounts.map((k) => (
              <li key={k.name} className="py-2.5 flex justify-between text-sm">
                <span className="text-slate-700">{k.name}</span>
                <span className="font-semibold text-slate-800">{k._sum.quantity}</span>
              </li>
            ))}
            {kitCounts.length === 0 && <p className="text-sm text-slate-400 py-4">No sales yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-amber-600" : "text-slate-800"}`}>{value}</p>
    </div>
  );
}
