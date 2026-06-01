"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import { useEffect, useState } from "react";

import { getAdminSubmissionIdFromUrl } from "@/app/lib/admin-submission-id";

import { useClientMounted } from "./useClientMounted";

/** ID zgłoszenia w panelu admin — bez odczytu window przy pierwszym renderze (hydratacja). */
export function useAdminSubmissionId(): string | null {
  const mounted = useClientMounted();
  const { id: documentId } = useDocumentInfo();
  const [urlId, setUrlId] = useState<string | null>(null);

  useEffect(() => {
    setUrlId(getAdminSubmissionIdFromUrl());
  }, []);

  if (!mounted) return null;

  if (documentId != null && documentId !== "") {
    return String(documentId);
  }

  return urlId;
}
