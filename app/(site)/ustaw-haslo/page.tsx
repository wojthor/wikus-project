import { Suspense } from "react";

import { SetPasswordForm } from "@/app/ustaw-haslo/SetPasswordForm";

export const metadata = {
  title: "Ustaw hasło — Unschool Your English",
  robots: { index: false, follow: false },
};

export default function UstawHasloPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faff] px-4 py-12 font-sans selection:bg-[#cfd8ff]">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-8 text-center text-sm text-slate-500">
            Ładowanie…
          </div>
        }
      >
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
