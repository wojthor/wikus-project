/** Zapis feedbacku głosowego bezpośrednio na zgłoszeniu (nie tylko w formularzu admin). */
export async function patchSubmissionTeacherAudio(
  submissionId: string | number,
  mediaId: string | number | null,
): Promise<void> {
  const body: Record<string, unknown> = {
    teacherAudio: mediaId,
  };
  if (mediaId != null) {
    body.isReviewed = true;
  }

  const res = await fetch(`/api/submissions/${submissionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    errors?: Array<{ message?: string }>;
  };

  if (!res.ok) {
    const msg =
      data.errors?.map((e) => e.message).filter(Boolean).join(" · ") ||
      data.message ||
      `Błąd zapisu zgłoszenia (${res.status})`;
    throw new Error(msg);
  }
}
