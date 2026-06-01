"use client";

import { useFormFields } from "@payloadcms/ui";
import type { CheckboxFieldClientComponent } from "payload";
import { useCallback, useEffect, useState } from "react";

import { PLATFORM_ADMIN_EMAIL } from "@/src/lib/platform-admin";

import { useAdminDocumentId } from "./useAdminDocumentId";

function formatSentAt(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

type UserDocSnapshot = {
  welcomeEmailSent?: boolean;
  welcomeEmailSentAt?: string | null;
  email?: string | null;
};

export const AdminWelcomeEmailPanelField: CheckboxFieldClientComponent = ({ checked }) => {
  const documentId = useAdminDocumentId("users");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [docSnapshot, setDocSnapshot] = useState<UserDocSnapshot | null>(null);

  const { welcomeEmailSent, welcomeEmailSentAt, email, dispatch } = useFormFields(
    ([fields, dispatchFields]) => ({
      welcomeEmailSent: fields.welcomeEmailSent?.value as boolean | undefined,
      welcomeEmailSentAt: fields.welcomeEmailSentAt?.value,
      email: fields.email?.value as string | undefined,
      dispatch: dispatchFields,
    }),
  );

  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;

    void fetch(`/api/users/${documentId}?depth=0`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((doc: UserDocSnapshot | null) => {
        if (!cancelled && doc) {
          setDocSnapshot(doc);
        }
      })
      .catch(() => {
        /* fallback: props / form state */
      });

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const handleSend = useCallback(async () => {
    if (!documentId || sending) return;

    setSending(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${documentId}/send-welcome-email`, {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as { error?: string; sentAt?: string };

      if (!response.ok) {
        setError(data.error ?? "Nie udało się wysłać maila.");
        return;
      }

      if (dispatch && data.sentAt) {
        dispatch({ type: "UPDATE", path: "welcomeEmailSent", value: true });
        dispatch({ type: "UPDATE", path: "welcomeEmailSentAt", value: data.sentAt });
      }

      setDocSnapshot((prev) => ({
        ...prev,
        welcomeEmailSent: true,
        welcomeEmailSentAt: data.sentAt ?? prev?.welcomeEmailSentAt ?? null,
      }));

      setMessage("Mail z linkiem do ustawienia hasła został wysłany.");
    } catch {
      setError("Nie udało się wysłać maila. Sprawdź połączenie i spróbuj ponownie.");
    } finally {
      setSending(false);
    }
  }, [dispatch, documentId, sending]);

  if (!documentId) {
    return null;
  }

  const displayEmail = email?.trim() || docSnapshot?.email?.trim() || "—";
  const normalizedEmail = displayEmail.toLowerCase();

  if (normalizedEmail === PLATFORM_ADMIN_EMAIL) {
    return null;
  }

  const wasSent = Boolean(checked ?? welcomeEmailSent ?? docSnapshot?.welcomeEmailSent);
  const sentAtLabel = formatSentAt(
    welcomeEmailSentAt ?? docSnapshot?.welcomeEmailSentAt ?? null,
  );

  return (
    <div className="field-type">
      <label className="field-label">Mail z hasłem</label>
      <p className="field-description">
        Link do ustawienia hasła na adres <strong>{displayEmail}</strong>.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginTop: "0.5rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.25rem 0.65rem",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 600,
            background: wasSent ? "var(--theme-success-100)" : "var(--theme-warning-100)",
            color: wasSent ? "var(--theme-success-800)" : "var(--theme-warning-800)",
          }}
        >
          {wasSent ? "Tak — wysłano" : "Nie — nie wysłano"}
        </span>

        {sentAtLabel && (
          <span className="field-description" style={{ margin: 0 }}>
            Wysłano: {sentAtLabel}
          </span>
        )}
      </div>

      {!wasSent && (
        <p style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            className="btn btn--style-primary btn--size-medium"
            disabled={sending}
            onClick={() => void handleSend()}
          >
            {sending ? "Wysyłanie…" : "Wyślij mail z ustawieniem hasła"}
          </button>
        </p>
      )}

      {message && (
        <p className="field-description" style={{ color: "var(--theme-success-600)" }}>
          {message}
        </p>
      )}

      {error && (
        <p className="field-description" style={{ color: "var(--theme-error-500)" }}>
          {error}
        </p>
      )}
    </div>
  );
};
