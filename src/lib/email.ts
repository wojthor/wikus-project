import { Resend } from "resend";

import { getSiteUrl } from "@/src/lib/site-url";

const BRAND_COLOR = "#7347f4";
const BRAND_ACCENT = "#3e57d6";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Brak RESEND_API_KEY w zmiennych środowiskowych.");
  }
  return new Resend(apiKey);
}

export function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    "Unschool Your English <onboarding@resend.dev>"
  );
}

export function getTeacherEmail(): string {
  return process.env.TEACHER_EMAIL ?? "kontakt@wiktorszyszkowski.pl";
}

function emailLayout(params: { preview: string; bodyHtml: string }): string {
  const { preview, bodyHtml } = params;
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${preview}</title>
</head>
<body style="margin:0;padding:0;background:#f8faff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preview}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8faff;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid #b9c5fe;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_COLOR},${BRAND_ACCENT});padding:24px 28px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Unschool Your English</p>
              <p style="margin:8px 0 0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;">Wiktor Szyszkowski</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#334155;font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;font-size:12px;color:#94a3b8;line-height:1.5;">
              Ta wiadomość została wysłana automatycznie z platformy Unschool Your English.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0 0;">
    <a href="${href}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:12px;">${label}</a>
  </p>`;
}

export async function sendWelcomeSetPasswordEmail(params: {
  to: string;
  setPasswordUrl: string;
}): Promise<void> {
  const { to, setPasswordUrl } = params;
  const resend = getResend();

  const html = emailLayout({
    preview: "Ustaw hasło do platformy Unschool Your English",
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Witaj na pokładzie! 🎉</p>
      <p style="margin:0 0 12px;">Dziękujemy za zakup kursu. Twoje konto zostało utworzone — zostało już tylko <strong>ustawić hasło</strong>, aby zalogować się na platformę e-learningową.</p>
      <p style="margin:0 0 12px;">Link jest ważny przez <strong>48 godzin</strong>.</p>
      ${button(setPasswordUrl, "Ustaw hasło i wejdź na platformę")}
      <p style="margin:20px 0 0;font-size:13px;color:#64748b;">Jeśli przycisk nie działa, wklej ten adres w przeglądarce:<br />
      <a href="${setPasswordUrl}" style="color:${BRAND_COLOR};word-break:break-all;">${setPasswordUrl}</a></p>
    `,
  });

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: "Ustaw hasło — Unschool Your English",
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendNewSubmissionToTeacherEmail(params: {
  submissionId: string | number;
  studentName: string;
  lessonTitle: string;
}): Promise<void> {
  const adminUrl = `${getSiteUrl()}/admin/collections/submissions/${params.submissionId}`;
  const resend = getResend();

  const html = emailLayout({
    preview: "Nowe zadanie do sprawdzenia",
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Nowe zadanie od ucznia</p>
      <p style="margin:0 0 8px;"><strong>Uczeń:</strong> ${escapeHtml(params.studentName)}</p>
      <p style="margin:0 0 12px;"><strong>Lekcja:</strong> ${escapeHtml(params.lessonTitle)}</p>
      <p style="margin:0;">Uczeń przesłał odpowiedź — możesz dodać feedback w panelu administracyjnym.</p>
      ${button(adminUrl, "Otwórz zadanie w panelu")}
    `,
  });

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: getTeacherEmail(),
    subject: `Nowe zadanie: ${params.lessonTitle}`,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendFeedbackReadyToStudentEmail(params: {
  to: string;
  lessonTitle: string;
}): Promise<void> {
  const platformUrl = `${getSiteUrl()}/elearning`;
  const resend = getResend();

  const html = emailLayout({
    preview: "Wiktor sprawdził Twoje zadanie",
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Masz nowy feedback! ✨</p>
      <p style="margin:0 0 12px;">Wiktor sprawdził Twoje zadanie z lekcji <strong>${escapeHtml(params.lessonTitle)}</strong>.</p>
      <p style="margin:0;">Zaloguj się na platformę, aby przeczytać komentarz i przejść dalej.</p>
      ${button(platformUrl, "Przejdź do platformy")}
    `,
  });

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: "Wiktor sprawdził Twoje zadanie — Unschool Your English",
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
