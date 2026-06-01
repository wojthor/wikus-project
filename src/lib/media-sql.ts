/** Bezpośredni zapis rekordów media (obejście uploadu pliku Payload na serverless). */

type PgPool = import("pg").Pool;

export type SqlMediaDoc = {
  id: string | number;
  filename: string;
  mimeType: string;
  blobUrl?: string;
  blobPathname?: string;
};

async function getPool(): Promise<PgPool | null> {
  const uri = process.env.DATABASE_URI;
  if (!uri) return null;
  const { Pool } = await import("pg");
  return new Pool({ connectionString: uri });
}

async function listMediaColumns(pool: PgPool): Promise<string[]> {
  const result = await pool.query<{ column_name: string }>(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'media'`,
  );
  return result.rows.map((r) => r.column_name);
}

function pickColumn(columns: string[], candidates: string[]): string | null {
  for (const name of candidates) {
    if (columns.includes(name)) return name;
  }
  return null;
}

/** Dodaje kolumny Blob (produkcja: push wyłączony). */
export async function ensureMediaBlobColumns(): Promise<void> {
  const pool = await getPool();
  if (!pool) return;

  try {
    await pool.query(`
      ALTER TABLE media ADD COLUMN IF NOT EXISTS blob_url text;
      ALTER TABLE media ADD COLUMN IF NOT EXISTS blob_pathname text;
    `);
  } catch (err) {
    console.error("[ensureMediaBlobColumns]", err);
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
}): Promise<SqlMediaDoc | null> {
  const pool = await getPool();
  if (!pool) return null;

  try {
    await ensureMediaBlobColumns();
    const columns = await listMediaColumns(pool);

    const altCol = pickColumn(columns, ["alt"]);
    const filenameCol = pickColumn(columns, ["filename"]);
    const mimeCol = pickColumn(columns, ["mime_type", "mimetype"]);
    const sizeCol = pickColumn(columns, ["filesize", "file_size"]);
    const blobUrlCol = pickColumn(columns, ["blob_url"]);
    const blobPathCol = pickColumn(columns, ["blob_pathname"]);
    const updatedCol = pickColumn(columns, ["updated_at"]);
    const createdCol = pickColumn(columns, ["created_at"]);

    if (!filenameCol) {
      console.error("[sqlCreateBlobMedia] Brak kolumny filename w tabeli media.");
      return null;
    }

    const insertCols: string[] = [];
    const placeholders: string[] = [];
    const values: Array<string | number> = [];

    const addValue = (col: string, value: string | number) => {
      insertCols.push(`"${col}"`);
      placeholders.push(`$${values.length + 1}`);
      values.push(value);
    };
    const addNow = (col: string) => {
      insertCols.push(`"${col}"`);
      placeholders.push("NOW()");
    };

    addValue(filenameCol, params.filename);
    if (altCol) addValue(altCol, params.alt);
    if (mimeCol) addValue(mimeCol, params.mimeType);
    if (sizeCol) addValue(sizeCol, params.filesize);
    if (blobUrlCol) addValue(blobUrlCol, params.blobUrl);
    if (blobPathCol) addValue(blobPathCol, params.blobPathname);
    if (createdCol) addNow(createdCol);
    if (updatedCol) addNow(updatedCol);

    const result = await pool.query<{ id: string | number }>(
      `INSERT INTO media (${insertCols.join(", ")})
       VALUES (${placeholders.join(", ")})
       RETURNING id`,
      values,
    );

    const id = result.rows[0]?.id;
    if (id == null) return null;

    return {
      id,
      filename: params.filename,
      mimeType: params.mimeType,
      blobUrl: params.blobUrl,
      blobPathname: params.blobPathname,
    };
  } catch (err) {
    console.error("[sqlCreateBlobMedia]", err);
    return null;
  } finally {
    await pool.end();
  }
}
