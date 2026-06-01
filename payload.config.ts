import { loadEnvConfig } from "@next/env";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Lessons } from "./src/collections/Lessons";
import { Media } from "./src/collections/Media";
import { Modules } from "./src/collections/Modules";
import { Submissions } from "./src/collections/Submissions";
import { Users } from "./src/collections/Users";

// Next.js ładuje .env.local dopiero w runtime — bez tego webpack może zbundlować pusty secret
loadEnvConfig(process.cwd());

// Dynamiczny dostęp — webpack nie podstawia wtedy wartości na etapie kompilacji
const payloadSecret = process.env["PAYLOAD_SECRET"];
if (!payloadSecret) {
  throw new Error(
    "Brak PAYLOAD_SECRET. Dodaj PAYLOAD_SECRET=... do pliku .env.local w katalogu projektu.",
  );
}

const databaseUri = process.env["DATABASE_URI"];
if (!databaseUri) {
  throw new Error(
    "Brak DATABASE_URI. Dodaj DATABASE_URI=postgresql://... do pliku .env.local.",
  );
}

const resendApiKey = process.env["RESEND_API_KEY"];
if (!resendApiKey) {
  throw new Error("Brak RESEND_API_KEY. Dodaj RESEND_API_KEY=... do pliku .env.local.");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd()),
    },
  },
  collections: [Users, Media, Modules, Lessons, Submissions],
  editor: lexicalEditor(),
  email: resendAdapter({
    apiKey: resendApiKey,
    defaultFromAddress: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    defaultFromName: "Unschool Your English",
  }),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
    },
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
  plugins: [],
});
