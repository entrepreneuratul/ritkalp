import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateOrderStatusAction, deleteOrderAction } from "@/lib/actions/admin-orders";
import StatusBadge from "@/components/admin/StatusBadge";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, customer: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/orders" className="text-sm text-slate-500 hover:underline">
        ← All orders
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Order #{order.id.slice(-8)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Customer</h2>
          <p className="font-medium text-slate-800">{order.guestName}</p>
          <p className="text-sm text-slate-600">{order.guestPhone}</p>
          {order.guestEmail && <p className="text-sm text-slate-600">{order.guestEmail}</p>}
          {order.customer && (
            <p className="text-xs text-slate-400 mt-1">Account: {order.customer.email}</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Deliver to</h2>
          <p className="text-sm text-slate-700">{order.addressLine}</p>
          <p className="text-sm text-slate-700">
            {order.city}, {order.state} - {order.pincode}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Items</h2>
        <ul className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.id} className="py-2.5 flex justify-between text-sm">
              <div>
                <p className="text-slate-800">
                  {item.name} × {item.quantity}
                </p>
                {item.itemsList.length > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">{item.itemsList.join(", ")}</p>
                )}
              </div>
              <span className="font-medium text-slate-800 shrink-0 ml-4">
                ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-3 mt-3 border-t border-slate-200 font-semibold text-slate-800">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Payment & Source
        </h2>
        <p className="text-sm text-slate-700">
          {order.source} · {order.paymentStatus}
        </p>
        {order.razorpayPaymentId && (
          <p className="text-xs text-slate-400 mt-1">Razorpay Payment: {order.razorpayPaymentId}</p>
        )}
      </div>

      <form action={updateOrderStatusAction} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-end gap-3">
        <input type="hidden" name="orderId" value={order.id} />
        <label className="flex-1">
          <span className="text-xs font-semibold text-slate-600 mb-1 block">Update status</span>
          <select
            name="status"
            defaultValue={order.status}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-900"
        >
          Save
        </button>
      </form>

      <form action={deleteOrderAction} className="mt-4">
        <input type="hidden" name="orderId" value={order.id} />
        <button type="submit" className="text-xs text-red-500 hover:underline">
          Delete this order
        </button>
      </form>
    </div>
  );
}
