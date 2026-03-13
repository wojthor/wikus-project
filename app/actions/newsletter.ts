"use server";

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
