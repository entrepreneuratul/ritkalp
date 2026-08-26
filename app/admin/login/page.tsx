import { adminLoginAction } from "@/lib/actions/admin-auth";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Ritkalp Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Staff login</p>
        </div>

        {searchParams.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {searchParams.error}
          </p>
        )}

        <form
          action={adminLoginAction}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="from" value={searchParams.from ?? "/admin"} />
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-800 text-white py-2.5 font-semibold hover:bg-slate-900 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
