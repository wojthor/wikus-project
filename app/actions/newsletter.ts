"use server";

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const NEWSLETTER_FORM_INITIAL_STATE: NewsletterFormState = {
  status: "idle",
  message: "",
};

export async function subscribeNewsletterFormAction(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  if (!email) {
    return { status: "error", message: "Podaj adres e-mail." };
  }

  const result = await subscribeToNewsletter(email);
  if (result.success) {
    return { status: "success", message: "" };
  }

  return {
    status: "error",
    message: result.error ?? "Wystąpił błąd. Spróbuj ponownie.",
  };
}

export async function subscribeToNewsletter(email: string) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Wystąpił błąd. Spróbuj ponownie." };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (res.status === 201 || res.status === 204) {
      return { success: true };
    }

    const data = await res.json().catch(() => ({}));
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Wystąpił błąd. Spróbuj ponownie.";
    return { success: false, error: message };
  } catch {
    return { success: false, error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}
