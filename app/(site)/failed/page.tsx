import Link from "next/link";

import { CheckoutButton } from "@/app/components/CheckoutButton";

export const metadata = {
  title: "Płatność nieudana — Unschool Your English",
  robots: { index: false, follow: false },
};

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faff] px-4 py-12 font-sans text-slate-900 selection:bg-[#cfd8ff]">
      <div className="w-full max-w-lg rounded-3xl border border-[#b9c5fe] bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          ✕
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#7347f4]">
          Unschool Your English
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Płatność nie została zrealizowana
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Anulowałeś płatność albo wystąpił błąd po stronie operatora. Żadne środki nie zostały
          pobrane — możesz spróbować ponownie, kiedy będziesz gotowy.
        </p>
        <div className="mt-8 space-y-3">
          <CheckoutButton
            className="w-full"
            buttonClassName="inline-flex w-full items-center justify-center rounded-4xl border border-[#ffa515] bg-[#ffbd53] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          />
          <Link
            href="/unschool"
            className="inline-flex w-full items-center justify-center rounded-4xl border border-[#b9c5fe] bg-white px-6 py-3 text-sm font-bold text-[#7347f4] transition hover:bg-[#f8faff]"
          >
            Wróć na stronę kursu
          </Link>
        </div>
      </div>
    </div>
  );
}
