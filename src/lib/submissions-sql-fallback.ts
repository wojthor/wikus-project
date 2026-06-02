/** Obejście błędu Drizzle upsertRow (insertedRow.id) przy create/update submissions. */

import { getPgPool } from "@/src/lib/pg-pool";

type PgPool = import("pg").Pool;

async function getPool(): Promise<PgPool | null> {
  if (!process.env.DATABASE_URI) return null;
  try {
    return await getPgPool();
  } catch {
    return null;
  }
}

async function listSubmissionColumns(pool: PgPool): Promise<string[]> {
  const result = await pool.query<{ column_name: string }>(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'submissions'`,
  );
  return result.rows.map((r) => r.column_name);
}

function findColumn(columns: string[], matcher: (c: string) => boolean): string | null {
  return columns.find(matcher) ?? null;
}

export async function sqlGetSubmissionMediaId(
  submissionId: string | number,
  which: "student" | "teacher",
): Promise<string | number | null> {
  const pool = await getPool();
  if (!pool) return null;

  try {
    const columns = await listSubmissionColumns(pool);
    const audioCol =
      which === "student"
        ? findColumn(columns, (c) => /student/i.test(c) && /audio/i.test(c))
        : findColumn(columns, (c) => /teacher/i.test(c) && /audio/i.test(c));

    if (!audioCol) return null;

    const result = await pool.query<{ media_id: string | number | null }>(
      `SELECT "${audioCol}" AS media_id FROM submissions WHERE id = $1 LIMIT 1`,
      [submissionId],
    );

    const id = result.rows[0]?.media_id;
    return id == null || id === "" ? null : id;
  } catch (err) {
    console.error("[sqlGetSubmissionMediaId]", err);
    return null;
  }
}

export async function sqlGetMediaFilename(
  mediaId: string | number,
): Promise<string | null> {
  const pool = await getPool();
  if (!pool) return null;

  try {
    const result = await pool.query<{ filename: string | null }>(
      `SELECT filename FROM media WHERE id = $1 LIMIT 1`,
      [mediaId],
    );
    return result.rows[0]?.filename ?? null;
  } catch {
    return null;
  }
}

export async function sqlUpdateStudentAnswer(params: {
  submissionId: string | number;
  textContent?: string | null;
  studentAudioId?: string | number | null;
}): Promise<boolean> {
  const pool = await getPool();
  if (!pool) return false;

  try {
    const columns = await listSubmissionColumns(pool);
    const textCol = findColumn(columns, (c) => /text/i.test(c) && /content/i.test(c));
    const studentAudioCol = findColumn(
      columns,
      (c) => /student/i.test(c) && /audio/i.test(c),
    );

    const setParts: string[] = [];
    const values: Array<string | number> = [];

    if (params.textContent != null && textCol) {
      setParts.push(`"${textCol}" = $${values.length + 1}`);
      values.push(params.textContent.trim());
    }

    if (params.studentAudioId != null && studentAudioCol) {
      setParts.push(`"${studentAudioCol}" = $${values.length + 1}`);
      values.push(params.studentAudioId);
    }

    if (setParts.length === 0) return false;

    values.push(params.submissionId as string | number);
    const whereIdx = values.length;

    await pool.query(
      `UPDATE submissions SET ${setParts.join(", ")}, updated_at = NOW() WHERE id = $${whereIdx}`,
      values,
    );

    return true;
  } catch (err) {
    console.error("[sqlUpdateStudentAnswer]", err);
    return false;
  }
}

export async function sqlLinkStudentAudio(
  submissionId: string | number,
  mediaId: string | number,
): Promise<boolean> {
  const pool = await getPool();
  if (!pool) return false;

  try {
    const columns = await listSubmissionColumns(pool);
    const audioCol = findColumn(columns, (c) => /student/i.test(c) && /audio/i.test(c));
    if (!audioCol) return false;

    await pool.query(
      `UPDATE submissions SET "${audioCol}" = $1, updated_at = NOW() WHERE id = $2`,
      [mediaId, submissionId],
    );

    return true;
  } catch (err) {
    console.error("[sqlLinkStudentAudio]", err);
    return false;
  }
}

export async function sqlCreateSubmission(params: {
  studentId: string | number;
  lessonId: string | number;
  textContent?: string | null;
  studentAudioId?: string | number | null;
}): Promise<string | number | null> {
  const pool = await getPool();
  if (!pool) return null;

  try {
    const columns = await listSubmissionColumns(pool);

    const studentCol =
      findColumn(columns, (c) => c === "student_id") ??
      findColumn(columns, (c) => /student/i.test(c) && !/audio/i.test(c));
    const lessonCol =
      findColumn(columns, (c) => c === "lesson_id") ??
      findColumn(columns, (c) => /lesson/i.test(c));
    const textCol = findColumn(columns, (c) => /text/i.test(c) && /content/i.test(c));
    const studentAudioCol = findColumn(
      columns,
      (c) => /student/i.test(c) && /audio/i.test(c),
    );

    if (!studentCol || !lessonCol) return null;

    const insertCols = [`"${studentCol}"`, `"${lessonCol}"`];
    const values: Array<string | number | boolean | null> = [params.studentId, params.lessonId];

    if (params.textContent?.trim() && textCol) {
      insertCols.push(`"${textCol}"`);
      values.push(params.textContent.trim());
    }

    if (params.studentAudioId != null && studentAudioCol) {
      insertCols.push(`"${studentAudioCol}"`);
      values.push(params.studentAudioId);
    }

    const reviewedCol = findColumn(columns, (c) => /is/i.test(c) && /reviewed/i.test(c));
    if (reviewedCol) {
      insertCols.push(`"${reviewedCol}"`);
      values.push(false);
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const hasUpdatedAt = columns.includes("updated_at");
    const hasCreatedAt = columns.includes("created_at");

    const extraCols: string[] = [];
    if (hasCreatedAt) extraCols.push("created_at");
    if (hasUpdatedAt) extraCols.push("updated_at");

    const extraVals = extraCols.map(() => "NOW()").join(", ");
    const allCols = [...insertCols, ...extraCols.map((c) => `"${c}"`)].join(", ");
    const allVals =
      placeholders + (extraVals ? `, ${extraVals}` : "");

    const sql = `INSERT INTO submissions (${allCols}) VALUES (${allVals}) RETURNING id`;
    const result = await pool.query<{ id: string | number }>(sql, values);

    return result.rows[0]?.id ?? null;
  } catch (err) {
    console.error("[sqlCreateSubmission]", err);
    return null;
  }
}

export async function sqlLinkTeacherAudio(
  submissionId: string | number,
  mediaId: string | number | null,
  remove: boolean,
): Promise<boolean> {
  const pool = await getPool();
  if (!pool) return false;

  try {
    const columns = await listSubmissionColumns(pool);
    const audioCol = findColumn(columns, (c) => /teacher/i.test(c) && /audio/i.test(c));
    if (!audioCol) return false;

    await pool.query(
      `UPDATE submissions SET "${audioCol}" = $1, updated_at = NOW() WHERE id = $2`,
      [remove ? null : mediaId, submissionId],
    );

    return true;
  } catch (err) {
    console.error("[sqlLinkTeacherAudio]", err);
    return false;
  }
}
