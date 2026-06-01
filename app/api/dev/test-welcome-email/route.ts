import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { sendWelcomeSetPasswordEmail } from "@/src/lib/email";
import { generateSecurePassword } from "@/src/lib/generate-password";
import { createRegistrationToken } from "@/src/lib/registration-token";
import { getSiteUrl } from "@/src/lib/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TestWelcomeBody = {
  email?: string;
};

type TestWelcomeSuccess = {
  success: true;
  mode: "created" | "updated";
  setPasswordUrl: string;
};

type TestWelcomeError = {
  error: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
): Promise<NextResponse<TestWelcomeSuccess | TestWelcomeError>> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: TestWelcomeBody;
  try {
    body = (await request.json()) as TestWelcomeBody;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane żądania." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    const { token, expiration } = createRegistrationToken();
    const setPasswordUrl = `${getSiteUrl()}/ustaw-haslo?token=${encodeURIComponent(token)}`;

    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });

    let mode: "created" | "updated";
    if (existing.docs.length > 0) {
      mode = "updated";
      await payload.update({
        collection: "users",
        id: existing.docs[0].id,
        overrideAccess: true,
        data: {
          registrationToken: token,
          tokenExpiration: expiration,
        },
      });
    } else {
      mode = "created";
      await payload.create({
        collection: "users",
        overrideAccess: true,
        data: {
          email,
          password: generateSecurePassword(24),
          firstName: "Kursant",
          lastName: "Testowy",
          admin: false,
          registrationToken: token,
          tokenExpiration: expiration,
        },
      });
    }

    await sendWelcomeSetPasswordEmail({
      to: email,
      setPasswordUrl,
    });

    return NextResponse.json({
      success: true,
      mode,
      setPasswordUrl,
    });
  } catch (err) {
    console.error("[dev test-welcome-email]", err);
    return NextResponse.json(
      {
        error: "Nie udało się wysłać maila testowego. Sprawdź konfigurację Resend.",
      },
      { status: 500 },
    );
  }
}
