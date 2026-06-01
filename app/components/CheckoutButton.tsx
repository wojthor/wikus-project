"use client";

import { useRouter } from "next/navigation";

type CheckoutButtonProps = {
  label?: string;
  /** Klasy kontenera (np. w-full) */
  className?: string;
  /** Klasy samego przycisku — domyślnie styl fioletowy platformy */
  buttonClassName?: string;
};

const defaultButtonClass =
  "inline-flex w-full items-center justify-center rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95";

export function CheckoutButton({
  label = "Chcę ten kurs",
  className = "",
  buttonClassName = defaultButtonClass,
}: CheckoutButtonProps) {
  const router = useRouter();

  return (
    <div className={className}>
      <button type="button" onClick={() => router.push("/payment")} className={buttonClassName}>
        {label}
      </button>
    </div>
  );
}
