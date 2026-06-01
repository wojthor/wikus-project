"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, LockOpen, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";

export type SubmissionSuccessVariant = "sent" | "supplemented";

type SubmissionSuccessModalProps = {
  open: boolean;
  variant: SubmissionSuccessVariant;
  showUnlock?: boolean;
  onClose: () => void;
  onContinue?: () => void;
};

const supplementedCopy = {
  title: "Odpowiedź uzupełniona!",
  description: "Zapisaliśmy dodatkową część Twojego zadania. Wiktor zobaczy pełną odpowiedź.",
  button: "OK",
};

export function SubmissionSuccessModal({
  open,
  variant,
  showUnlock = false,
  onClose,
  onContinue,
}: SubmissionSuccessModalProps) {
  const [lockOpen, setLockOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setLockOpen(false);
      return;
    }
    if (variant === "sent" && showUnlock) {
      const timer = window.setTimeout(() => setLockOpen(true), 450);
      return () => window.clearTimeout(timer);
    }
    setLockOpen(false);
  }, [open, variant, showUnlock]);

  const isUnlockFlow = variant === "sent" && showUnlock;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="submission-success-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-success-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-[#b9c5fe] bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="mb-5 flex justify-center">
              {isUnlockFlow ? (
                <motion.div
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f3ff]"
                  animate={
                    lockOpen
                      ? { scale: [1, 1.06, 1], backgroundColor: ["#f0f3ff", "#e8f5e9", "#f0f3ff"] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {lockOpen ? (
                      <motion.div
                        key="open"
                        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      >
                        <LockOpen
                          className="h-10 w-10 text-green-600"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="closed"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Lock
                          className="h-10 w-10 text-[#7347f4]"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {lockOpen && (
                    <motion.span
                      className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 500, damping: 20 }}
                      aria-hidden
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <LockOpen className="h-8 w-8" strokeWidth={2.25} aria-hidden />
                </div>
              )}
            </div>

            <motion.h2
              id="submission-success-title"
              className="text-center text-xl font-extrabold tracking-tight text-slate-900"
              animate={isUnlockFlow && lockOpen ? { opacity: [0.85, 1] } : undefined}
            >
              {isUnlockFlow
                ? lockOpen
                  ? "Możesz przejść dalej!"
                  : "Zadanie wysłane!"
                : supplementedCopy.title}
            </motion.h2>

            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
              {isUnlockFlow ? (
                <>
                  <p className="text-center">
                    Twoja odpowiedź trafiła do Wiktora. Kolejna lekcja jest już odblokowana.
                  </p>
                  <motion.div
                    className="flex gap-3 rounded-xl border border-[#dfe6ff] bg-[#f8faff] px-3.5 py-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={lockOpen ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 4 }}
                    transition={{ delay: lockOpen ? 0.2 : 0, duration: 0.25 }}
                  >
                    <Mail
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#7347f4]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <p>
                      <span className="font-semibold text-slate-800">Feedback od Wiktora</span>
                      {" - "}
                      powiadomimy Cię mailem, gdy doda komentarz lub głosówkę do tego zadania.
                    </p>
                  </motion.div>
                </>
              ) : (
                <p className="text-center">{supplementedCopy.description}</p>
              )}
            </div>

            <div className={`mt-6 flex flex-col gap-2 ${isUnlockFlow && onContinue ? "sm:flex-col" : ""}`}>
              {isUnlockFlow && onContinue ? (
                <>
                  <button
                    type="button"
                    onClick={onContinue}
                    disabled={!lockOpen}
                    className="w-full rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5a32c9] disabled:cursor-wait disabled:opacity-60"
                  >
                    Przejdź dalej →
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl border border-[#b9c5fe] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-[#f8faff]"
                  >
                    Zostań na tej lekcji
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl bg-[#7347f4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5a32c9]"
                >
                  {variant === "sent" ? "Super, rozumiem" : supplementedCopy.button}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
