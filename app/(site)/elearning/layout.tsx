import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-learning – Wiktor Szyszkowski",
  description:
    "Platforma kursu Unschool Your English – lekcje, nagrania i panel nauczyciela (mockup).",
};

export default function ElearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
