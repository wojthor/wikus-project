import type { Payload } from "payload";

import { sendWelcomeSetPasswordEmail } from "@/src/lib/email";
import { resolveAdminFlag } from "@/src/lib/platform-admin";
import { createRegistrationToken } from "@/src/lib/registration-token";
import { getSiteUrl } from "@/src/lib/site-url";

export type SendWelcomeEmailResult =
  | { emailed: true; sentAt: string }
  | { emailed: false; reason: string };

export async function sendWelcomeEmailToUser(
  payload: Payload,
  userId: string | number,
): Promise<SendWelcomeEmailResult> {
  const user = await payload.findByID({
    collection: "users",
    id: userId,
    overrideAccess: true,
  });

  const email = user.email?.trim().toLowerCase();
  if (!email) {
    return { emailed: false, reason: "no_email" };
  }

  if (resolveAdminFlag(email)) {
    return { emailed: false, reason: "platform_admin" };
  }

  const { token, expiration } = createRegistrationToken();
  const setPasswordUrl = `${getSiteUrl()}/ustaw-haslo?token=${encodeURIComponent(token)}`;

  await payload.update({
    collection: "users",
    id: userId,
    overrideAccess: true,
    data: {
      registrationToken: token,
      tokenExpiration: expiration,
    },
  });

  try {
    await sendWelcomeSetPasswordEmail({
      to: email,
      setPasswordUrl,
    });
  } catch (err) {
    console.error("[send-welcome-email]", err);
    return { emailed: false, reason: "email_failed" };
  }

  const sentAt = new Date().toISOString();
  await payload.update({
    collection: "users",
    id: userId,
    overrideAccess: true,
    data: {
      welcomeEmailSent: true,
      welcomeEmailSentAt: sentAt,
    },
  });

  return { emailed: true, sentAt };
}
