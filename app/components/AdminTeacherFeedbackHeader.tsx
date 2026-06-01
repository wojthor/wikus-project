"use client";

import type { UIFieldClientComponent } from "payload";

import { AdminFieldPlaceholder, useClientMounted } from "./useClientMounted";

export const AdminTeacherFeedbackHeaderField: UIFieldClientComponent = () => {
  const mounted = useClientMounted();

  if (!mounted) return <AdminFieldPlaceholder />;

  return (
    <div className="field-type" style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
      <label className="field-label">Feedback od Wiktora dla ucznia</label>
      <p className="field-description">
        Możesz dodać feedback tekstowy, głosowy albo oba naraz — uczeń zobaczy je jako wiadomość od
        Ciebie na e-learningu.
      </p>
    </div>
  );
};
