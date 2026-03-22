"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { NewsletterData } from "@/data/content";
import { useNewsletterStatus } from "@/src/hooks/useNewsletterStatus";
import { NewsletterForm } from "./NewsletterForm";

type NewsletterModalProps = {
  data: NewsletterData;
};

export function NewsletterModal({ data }: NewsletterModalProps) {
  const { isOpen, dismiss, markSubscribed } = useNewsletterStatus(data.storageKey);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="newsletter-modal"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl w-full mx-auto mt-2 sm:mt-0 p-5 sm:p-12 bg-white rounded-[33px] shadow-sm border border-slate-100 flex flex-col gap-4 sm:gap-6 text-center relative max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <NewsletterForm data={data} onDismiss={dismiss} onSubscribeSuccess={markSubscribed} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
