import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unschool Your English – Wiktor Szyszkowski",
  description:
    "Praktyczny Unschool Your English. Speaking, listening, wymowa – bez podręcznika, z personalnym feedbackiem. Poziom B1–B2.",
};

export default function Kurs2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
