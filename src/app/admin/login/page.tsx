"use client";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions/admin-auth";

const init: AuthState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, init);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1009] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#8a5a32]">
            <svg className="h-8 w-8 text-[#f6efe2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#f6efe2]">LB&apos;s Woodshop</h1>
          <p className="mt-1 text-sm text-[#b9824f]">Admin Dashboard</p>
        </div>

        {/* Form */}
        <form action={action} className="space-y-4 rounded-xl bg-[#271a11] p-6 shadow-2xl">
          {state.error && (
            <p className="rounded-lg bg-red-900/40 px-3 py-2 text-sm font-medium text-red-300">
              {state.error}
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#b9824f]">
              Username
            </label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-[#5b4031]/50 bg-[#1a1009] px-3.5 py-2.5 text-[#f6efe2] placeholder-[#5b4031] outline-none transition focus:border-[#8a5a32] focus:ring-2 focus:ring-[#8a5a32]/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#b9824f]">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#5b4031]/50 bg-[#1a1009] px-3.5 py-2.5 text-[#f6efe2] placeholder-[#5b4031] outline-none transition focus:border-[#8a5a32] focus:ring-2 focus:ring-[#8a5a32]/40"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#8a5a32] py-2.5 font-semibold text-[#f6efe2] transition hover:bg-[#b9824f] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
