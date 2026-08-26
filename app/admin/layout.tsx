import { auth } from "@/lib/auth";
import { adminLogoutAction } from "@/lib/actions/admin-auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/catalog", label: "Catalog" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  // The login page (and any edge case reaching this layout without a
  // session — middleware.ts already redirects those to /admin/login)
  // renders bare, no sidebar chrome.
  if (!isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-56 shrink-0 bg-slate-900 text-slate-200 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-700">
          <p className="font-bold text-white">Ritkalp Admin</p>
          <p className="text-xs text-slate-400 mt-0.5">{session.user.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-700">
          <a
            href="/"
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            ← View site
          </a>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  );
}
