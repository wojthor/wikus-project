"use client";

import type { DefaultCellComponentProps } from "payload";

export const AdminWelcomeEmailSentCell = ({
  cellData,
}: DefaultCellComponentProps) => {
  const sent = Boolean(cellData);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.15rem 0.5rem",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        background: sent ? "var(--theme-success-100)" : "var(--theme-warning-100)",
        color: sent ? "var(--theme-success-800)" : "var(--theme-warning-800)",
      }}
    >
      {sent ? "Tak" : "Nie"}
    </span>
  );
};
