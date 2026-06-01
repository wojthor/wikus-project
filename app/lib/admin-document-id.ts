/** ID dokumentu z URL panelu admin (fallback gdy useDocumentInfo nie zwraca id). */
export function getAdminDocumentIdFromUrl(collectionSlug: string): string | null {
  if (typeof window === "undefined") return null;

  const escaped = collectionSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const path = window.location.pathname;
  const patterns = [
    new RegExp(`/admin/collections/${escaped}/([^/]+)$`),
    new RegExp(`/admin/collections/${escaped}/edit/([^/]+)$`),
  ];

  for (const pattern of patterns) {
    const id = pattern.exec(path)?.[1];
    if (id && id !== "create") return id;
  }

  return null;
}
