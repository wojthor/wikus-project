import fs from "fs/promises";
import path from "path";

/** Katalog na pliki audio — na Vercel tylko /tmp jest zapisywalny. */
export function getMediaStorageDir(): string {
  if (process.env.MEDIA_STORAGE_DIR?.trim()) {
    return process.env.MEDIA_STORAGE_DIR.trim();
  }
  if (process.env.VERCEL) {
    return path.join("/tmp", "wikus-media");
  }
  return path.join(process.cwd(), "media");
}

export async function ensureMediaStorageDir(): Promise<string> {
  const dir = getMediaStorageDir();
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function resolveMediaFilePath(filename: string): string {
  return path.join(getMediaStorageDir(), filename);
}
