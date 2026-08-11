"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      if (!res.ok) {
        setError("بيانات خاطئة");
        return;
      }
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-4" dir="rtl">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-[#101a17] p-6"
      >
        <h1 className="font-display text-3xl font-black text-white">
          لوحة نَقْلِي
        </h1>
        <p className="text-sm text-white/45">ليادات نقل عفش · مباشر</p>
        <input
          className="w-full rounded-xl border border-white/15 bg-[#0a1210] px-3 py-3 text-white"
          placeholder="المستخدم"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/15 bg-[#0a1210] px-3 py-3 text-white"
          placeholder="كلمة المرور"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-teal-400 py-3 font-extrabold text-[#04201a]"
        >
          دخول
        </button>
      </form>
    </main>
  );
}
