"use client";

import { useCallback } from "react";
import {
  useDocumentForm,
  useFieldPath,
  useForm,
  useFormFields,
  useFormInitializing,
  useFormProcessing,
  useWatchForm,
} from "@payloadcms/ui";

/**
 * Lekki zamiennik useField dla pól upload — nie wywołuje useConfig(),
 * więc nie wywala się przy zduplikowanym bundlu @payloadcms/ui w Next.
 */
export function usePayloadUploadField<TValue = unknown>(potentiallyStalePath?: string) {
  const pathFromContext = useFieldPath();
  const path = potentiallyStalePath || pathFromContext;

  const value = useFormFields(([fields]) => {
    if (!path) return undefined;
    return fields?.[path]?.value as TValue | undefined;
  });

  const dispatchField = useFormFields(([, dispatch]) => dispatch);
  const watchForm = useWatchForm();
  const documentForm = useDocumentForm();
  const form = useForm();
  const markModified =
    watchForm?.setModified ?? documentForm?.setModified ?? form?.setModified;
  const processing = useFormProcessing();
  const initializing = useFormInitializing();

  const setValue = useCallback(
    (val: unknown, disableModifyingForm = false) => {
      if (!path || !dispatchField) return;
      dispatchField({
        type: "UPDATE",
        path,
        value: val,
        disableFormData: false,
        valid: true,
      });
      if (!disableModifyingForm && typeof markModified === "function") {
        markModified(true);
      }
    },
    [dispatchField, markModified, path],
  );

  return {
    path,
    value: value as TValue | undefined,
    setValue,
    disabled: processing || initializing,
  };
}
