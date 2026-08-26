"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  try {
    await signIn("admin", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect(`/admin/login?error=${encodeURIComponent("ईमेल या पासवर्ड गलत है।")}&from=${encodeURIComponent(from)}`);
    }
    throw err;
  }
  redirect(from);
}

export async function adminLogoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
