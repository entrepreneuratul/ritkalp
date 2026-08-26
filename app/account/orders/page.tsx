import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/lib/actions/customer-auth";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "पेंडिंग",
  CONFIRMED: "कन्फर्म",
  PACKED: "पैक हो गया",
  SHIPPED: "भेज दिया गया",
  DELIVERED: "डिलीवर हो गया",
  CANCELLED: "रद्द",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    redirect("/account/login?from=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#FDF8F0] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-[#7A1F2B]">
              Ritkalp
            </Link>
            <p className="text-sm text-[#7A1F2B]/70">
              नमस्ते, {session.user.name ?? session.user.email}
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-sm underline text-[#7A1F2B]/70">
              लॉग आउट
            </button>
          </form>
        </div>

        <h1 className="font-display text-2xl font-semibold text-[#7A1F2B] mb-6">मेरे ऑर्डर</h1>

        {orders.length === 0 ? (
          <p className="text-[#7A1F2B]/70">अभी तक कोई ऑर्डर नहीं है।</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-[#D4A017]/30 bg-white p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-[#7A1F2B]/50">
                      Order #{order.id.slice(-8)} ·{" "}
                      {order.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="font-semibold text-[#7A1F2B] mt-0.5">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FBF4DE] px-3 py-1 text-xs font-semibold text-[#7A1F2B]">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="text-sm text-[#7A1F2B]/80 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
