import { PaymentPageClient } from "@/app/payment/PaymentPageClient";

export const metadata = {
  title: "Płatność — Unschool Your English",
  robots: { index: false, follow: false },
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] px-4 py-10 font-sans selection:bg-[#cfd8ff] sm:px-6 sm:py-14">
      <PaymentPageClient />
    </main>
  );
}
