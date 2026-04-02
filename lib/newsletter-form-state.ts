export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const NEWSLETTER_FORM_INITIAL_STATE: NewsletterFormState = {
  status: "idle",
  message: "",
};
