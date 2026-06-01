"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        errors?: Array<{ message?: string }>;
      };

      if (!res.ok) {
        const msg =
          data.errors?.map((err) => err.message).filter(Boolean).join(" · ") ||
          data.message;
        setError(msg || "Nieprawidłowy e-mail lub hasło.");
        return;
      }

      router.refresh();
    } catch {
      setError("Nie udało się połączyć z serwerem. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">
            Unschool Your English
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Logowanie ucznia
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Zaloguj się, aby uzyskać dostęp do lekcji i zadań.
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
              placeholder="twoj@email.pl"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Hasło
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
          >
            {loading ? "Logowanie…" : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
