"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Brak tokenu w linku. Użyj linku z wiadomości e-mail po zakupie kursu.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Podaj imię i nazwisko.");
      return;
    }

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Nie udało się ustawić hasła.");
        return;
      }

      router.push("/elearning?hasloUstawione=1");
      router.refresh();
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-6 text-center shadow-sm sm:p-8">
        <h1 className="text-xl font-extrabold text-slate-900">Nieprawidłowy link</h1>
        <p className="mt-3 text-sm text-slate-600">
          Otwórz link z wiadomości e-mail po zakupie kursu lub skontaktuj się z nami.
        </p>
        <Link
          href="/unschool"
          className="mt-6 inline-flex rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white"
        >
          Strona kursu
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">
          Unschool Your English
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Ustaw hasło do konta
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Uzupełnij dane i wybierz bezpieczne hasło, aby zalogować się na platformę e-learningową.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Imię
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
            placeholder="Twoje imię"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Nazwisko
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
            placeholder="Twoje nazwisko"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Nowe hasło
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
            placeholder="Minimum 8 znaków"
          />
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Powtórz hasło
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={loading}
            className="box-border w-full rounded-xl border border-[#b9c5fe] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7347f4] focus:ring-2 focus:ring-[#cfd8ff] disabled:bg-[#f8faff]"
            placeholder="Powtórz hasło"
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
          {loading ? "Zapisywanie…" : "Zapisz hasło i przejdź dalej"}
        </button>
      </form>
    </div>
  );
}
