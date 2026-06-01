"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import { useEffect, useState } from "react";

import { getAdminDocumentIdFromUrl } from "@/app/lib/admin-document-id";

import { useClientMounted } from "./useClientMounted";

/** ID dokumentu w panelu admin — useDocumentInfo bywa puste w auth (Users). */
export function useAdminDocumentId(collectionSlug: string): string | null {
  const mounted = useClientMounted();
  const { id: documentId } = useDocumentInfo();
  const [urlId, setUrlId] = useState<string | null>(null);

  useEffect(() => {
    setUrlId(getAdminDocumentIdFromUrl(collectionSlug));
  }, [collectionSlug]);

  if (!mounted) return null;

  if (documentId != null && documentId !== "") {
    return String(documentId);
  }

  return urlId ?? getAdminDocumentIdFromUrl(collectionSlug);
}
