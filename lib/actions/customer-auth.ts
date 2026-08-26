"use server";

// =====================================================================
// Server Actions for the OPTIONAL customer account flow — signup, login,
// logout. Guest checkout never touches any of this (see
// components/CartDrawer.tsx); this is purely for the "see my past
// orders" convenience at /account/orders.
//
// Errors are surfaced via a `?error=` redirect back to the same page
// rather than a client-side hook, since this project's React 18.3
// doesn't ship the `useFormState`/`useActionState` API those normally
// pair with — plain <form action={...}> + redirect works everywhere.
// =====================================================================

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signIn, signOut } from "@/lib/auth";

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) redirect(`/account/signup?error=${encodeURIComponent("कृपया अपना नाम लिखें।")}`);
  if (!/^\S+@\S+\.\S+$/.test(email))
    redirect(`/account/signup?error=${encodeURIComponent("कृपया सही ईमेल लिखें।")}`);
  if (password.length < 8)
    redirect(
      `/account/signup?error=${encodeURIComponent("पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।")}`
    );

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    redirect(
      `/account/signup?error=${encodeURIComponent("इस ईमेल से पहले से एक अकाउंट मौजूद है — लॉगिन करें।")}`
    );
  }

  const passwordHash = await hashPassword(password);
  if (existing) {
    // A Customer row can already exist from a past guest checkout that
    // happened to reuse this email as guestEmail — same person, so this
    // just attaches login credentials to it instead of erroring.
    await prisma.customer.update({ where: { id: existing.id }, data: { name, passwordHash } });
  } else {
    await prisma.customer.create({ data: { name, email, passwordHash } });
  }

  await loginWith(email, password, "/account/signup");
  redirect("/account/orders");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  await loginWith(email, password, "/account/login");
  redirect("/account/orders");
}

async function loginWith(email: string, password: string, onFailureRedirectTo: string) {
  try {
    await signIn("customer", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect(`${onFailureRedirectTo}?error=${encodeURIComponent("ईमेल या पासवर्ड गलत है।")}`);
    }
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
