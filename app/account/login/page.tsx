import Link from "next/link";
import { loginAction } from "@/lib/actions/customer-auth";
import AuthField from "@/components/AuthField";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDF8F0] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-semibold text-[#7A1F2B]">
            Ritkalp
          </Link>
          <p className="mt-2 text-sm text-[#7A1F2B]/70">अपने ऑर्डर देखने के लिए लॉगिन करें</p>
        </div>

        {searchParams.error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {searchParams.error}
          </p>
        )}

        <form
          action={loginAction}
          className="space-y-4 rounded-2xl border border-[#D4A017]/30 bg-white p-6 shadow-sm"
        >
          <AuthField label="ईमेल" name="email" type="email" required />
          <AuthField label="पासवर्ड" name="password" type="password" required />
          <button
            type="submit"
            className="w-full rounded-full bg-[#7A1F2B] text-white py-2.5 font-semibold hover:bg-[#671A24] transition-colors"
          >
            लॉगिन करें
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#7A1F2B]/70">
          अकाउंट नहीं है?{" "}
          <Link href="/account/signup" className="underline font-semibold">
            साइन अप करें
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-[#7A1F2B]/50">
          <Link href="/" className="underline">
            बिना लॉगिन किए भी ऑर्डर कर सकते हैं →
          </Link>
        </p>
      </div>
    </main>
  );
}
