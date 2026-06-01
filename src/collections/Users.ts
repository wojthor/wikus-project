import type { CollectionConfig } from "payload";

import { isPlatformAdmin, resolveAdminFlag } from "@/src/lib/platform-admin";

function buildFullName(firstName?: string | null, lastName?: string | null): string {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
}

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["email", "fullName", "welcomeEmailSent", "welcomeEmailSentAt", "createdAt"],
    description:
      "Kursanci utworzeni po płatności Stripe. Kolumna „Mail z hasłem” pokazuje, czy wysłano link do ustawienia hasła — przy „Nie” wejdź w użytkownika i użyj przycisku wysyłki.",
  },
  auth: true,
  access: {
    admin: ({ req }) => isPlatformAdmin(req.user),
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        if (!id) return;

        // Usuń zależne submissiony, żeby nie wywalać FK przy kasowaniu usera z panelu admin.
        await req.payload.delete({
          collection: "submissions",
          where: {
            student: { equals: id },
          },
          overrideAccess: true,
        });
      },
    ],
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data;

        const firstName =
          typeof data.firstName === "string" ? data.firstName : originalDoc?.firstName;
        const lastName =
          typeof data.lastName === "string" ? data.lastName : originalDoc?.lastName;

        const fullName = buildFullName(firstName, lastName);
        if (fullName) {
          data.fullName = fullName;
        }

        const email =
          typeof data.email === "string" ? data.email : originalDoc?.email;
        data.admin = resolveAdminFlag(email);

        return data;
      },
    ],
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "Imię",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      label: "Nazwisko",
      required: true,
    },
    {
      name: "welcomeEmailSent",
      type: "checkbox",
      label: "Mail z hasłem",
      defaultValue: false,
      admin: {
        readOnly: true,
        components: {
          Field: "@/app/components/AdminWelcomeEmailPanel#AdminWelcomeEmailPanelField",
          Cell: "@/app/components/AdminWelcomeEmailSentCell#AdminWelcomeEmailSentCell",
        },
        description:
          "Czy wysłano mail z linkiem do ustawienia hasła. Przy „Nie” użyj przycisku poniżej.",
      },
      access: {
        read: ({ req }) => isPlatformAdmin(req.user),
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "welcomeEmailSentAt",
      type: "date",
      label: "Data wysyłki maila",
      admin: {
        hidden: true,
        readOnly: true,
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      access: {
        read: ({ req }) => isPlatformAdmin(req.user),
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "fullName",
      type: "text",
      label: "Imię i nazwisko",
      admin: {
        hidden: true,
      },
    },
    {
      name: "admin",
      type: "checkbox",
      label: "Administrator",
      defaultValue: false,
      admin: {
        hidden: true,
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "registrationToken",
      type: "text",
      label: "Token rejestracji",
      admin: {
        hidden: true,
      },
      access: {
        read: ({ req }) => isPlatformAdmin(req.user),
        update: () => false,
        create: () => false,
      },
    },
    {
      name: "tokenExpiration",
      type: "date",
      label: "Wygaśnięcie tokenu",
      admin: {
        hidden: true,
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      access: {
        read: ({ req }) => isPlatformAdmin(req.user),
        update: () => false,
        create: () => false,
      },
    },
  ],
};
