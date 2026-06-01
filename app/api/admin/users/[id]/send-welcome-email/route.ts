import config from "@payload-config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { sendWelcomeEmailToUser } from "@/src/lib/send-welcome-email-to-user";
import { isPlatformAdmin } from "@/src/lib/platform-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SendWelcomeSuccess = {
  success: true;
  sentAt: string;
};

type SendWelcomeError = {
  error: string;
};

const REASON_MESSAGES: Record<string, string> = {
  no_email: "Użytkownik nie ma adresu e-mail.",
  platform_admin: "Nie wysyłamy maila powitalnego do konta administratora.",
  email_failed: "Nie udało się wysłać maila. Sprawdź konfigurację Resend.",
};

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<SendWelcomeSuccess | SendWelcomeError>> {
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const auth = await payload.auth({ headers: hdrs });

  if (!isPlatformAdmin(auth.user)) {
    return NextResponse.json({ error: "Wymagane konto administratora." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Brak identyfikatora użytkownika." }, { status: 400 });
  }

  try {
    const result = await sendWelcomeEmailToUser(payload, id);

    if (!result.emailed) {
      return NextResponse.json(
        { error: REASON_MESSAGES[result.reason] ?? "Nie udało się wysłać maila." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, sentAt: result.sentAt });
  } catch (err) {
    console.error("[admin send-welcome-email]", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać maila powitalnego." },
      { status: 500 },
    );
  }
}
