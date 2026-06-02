/** Bezpośredni zapis/odczyt media (Payload + Vercel Blob na serverless). */

type PgPool = import("pg").Pool;

export type SqlMediaDoc = {
  id: string | number;
  filename: string;
  mimeType: string;
  blobUrl?: string;
  blobPathname?: string;
};

export type SqlMediaBlobMeta = {
  filename: string | null;
  mimeType: string | null;
  blobUrl: string | null;
  blobPathname: string | null;
};

async function getPool(): Promise<PgPool> {
  const uri = process.env.DATABASE_URI;
  if (!uri) {
    throw new Error("Brak DATABASE_URI — nie można zapisać nagrania w bazie.");
  }
  const { Pool } = await import("pg");
  return new Pool({ connectionString: uri });
}

/** Dodaje kolumny Blob (produkcja: push wyłączony). */
export async function ensureMediaBlobColumns(): Promise<void> {
  const pool = await getPool();
  try {
    await pool.query(`
      ALTER TABLE media ADD COLUMN IF NOT EXISTS blob_url text;
      ALTER TABLE media ADD COLUMN IF NOT EXISTS blob_pathname text;
    `);
  } finally {
    await pool.end();
  }
}

export async function sqlGetMediaBlobMeta(
  mediaId: string | number,
): Promise<SqlMediaBlobMeta | null> {
  const pool = await getPool();
  try {
    const result = await pool.query<{
      filename: string | null;
      mime_type: string | null;
      blob_url: string | null;
      blob_pathname: string | null;
    }>(
      `SELECT filename, mime_type, blob_url, blob_pathname
       FROM media WHERE id = $1 LIMIT 1`,
      [mediaId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      filename: row.filename,
      mimeType: row.mime_type,
      blobUrl: row.blob_url,
      blobPathname: row.blob_pathname,
    };
  } finally {
    await pool.end();
  }
}

export async function sqlCreateBlobMedia(params: {
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  blobUrl: string;
  blobPathname: string;
}): Promise<SqlMediaDoc> {
  await ensureMediaBlobColumns();
  const pool = await getPool();

  try {
    const result = await pool.query<{ id: string | number }>(
      `INSERT INTO media (
         filename, alt, mime_type, filesize, blob_url, blob_pathname, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id`,
      [
        params.filename,
        params.alt,
        params.mimeType,
        params.filesize,
        params.blobUrl,
        params.blobPathname,
      ],
    );

    const id = result.rows[0]?.id;
    if (id == null) {
      throw new Error("INSERT media nie zwrócił id.");
    }

    const playbackUrl = `/api/media-playback/${id}`;
    await pool.query(`UPDATE media SET url = $1, updated_at = NOW() WHERE id = $2`, [
      playbackUrl,
      id,
    ]);

    return {
      id,
      filename: params.filename,
      mimeType: params.mimeType,
      blobUrl: params.blobUrl,
      blobPathname: params.blobPathname,
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[sqlCreateBlobMedia]", detail, err);
    throw new Error(`Nie udało się zapisać nagrania w bazie: ${detail}`);
  } finally {
    await pool.end();
  }
}
