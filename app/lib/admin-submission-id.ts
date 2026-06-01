import { getAdminDocumentIdFromUrl } from "@/app/lib/admin-document-id";

/** ID zgłoszenia z URL panelu admin (fallback gdy useDocumentInfo jeszcze nie ma id). */
export function getAdminSubmissionIdFromUrl(): string | null {
  return getAdminDocumentIdFromUrl("submissions");
}
