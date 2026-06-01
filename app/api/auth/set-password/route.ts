import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { isRegistrationTokenValid } from "@/src/lib/registration-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 8;

type SetPasswordBody = {
  token?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};

type SetPasswordSuccess = { success: true };
type SetPasswordError = { error: string };

export async function POST(
  request: Request,
): Promise<NextResponse<SetPasswordSuccess | SetPasswordError>> {
  let body: SetPasswordBody;
  try {
    body = (await request.json()) as SetPasswordBody;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane żądania." }, { status: 400 });
  }

  const token = body.token?.trim();
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const password = body.password ?? "";

  if (!token) {
    return NextResponse.json({ error: "Brak tokenu aktywacyjnego." }, { status: 400 });
  }

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Podaj imię i nazwisko." }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayload({ config });

    const found = await payload.find({
      collection: "users",
      where: { registrationToken: { equals: token } },
      limit: 1,
      overrideAccess: true,
    });

    const user = found.docs[0];
    if (!user) {
      return NextResponse.json(
        { error: "Link jest nieprawidłowy lub został już wykorzystany." },
        { status: 400 },
      );
    }

    if (!isRegistrationTokenValid(user.tokenExpiration as string | Date | null | undefined)) {
      return NextResponse.json(
        { error: "Link wygasł. Napisz do nas, aby otrzymać nowy." },
        { status: 400 },
      );
    }

    await payload.update({
      collection: "users",
      id: user.id,
      overrideAccess: true,
      data: {
        password,
        firstName,
        lastName,
        registrationToken: null,
        tokenExpiration: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-password]", err);
    return NextResponse.json(
      { error: "Nie udało się zapisać hasła. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
