import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProgressBody = {
  quizId?: string;
  sessionId?: string;
  event?: "step_view" | "answer" | "abandon";
  stepIndex?: number;
  stepId?: string;
  value?: any;
  timeTotalSec?: number;
  timeOnStepSec?: number;
  ts?: number;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ProgressBody | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const pool = getDbPool();
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS quiz_events (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        quiz_id VARCHAR(120) NULL,
        session_id VARCHAR(120) NULL,
        event VARCHAR(40) NOT NULL,
        step_index INT NULL,
        step_id VARCHAR(120) NULL,
        value_json JSON NULL,
        time_total_sec INT NULL,
        time_on_step_sec INT NULL,
        ts_ms BIGINT NULL,
        PRIMARY KEY (id),
        KEY idx_session (session_id),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.execute(
      `INSERT INTO quiz_events (quiz_id, session_id, event, step_index, step_id, value_json, time_total_sec, time_on_step_sec, ts_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ,
      [
        body.quizId ?? null,
        body.sessionId ?? null,
        body.event ?? "step_view",
        typeof body.stepIndex === "number" ? body.stepIndex : null,
        body.stepId ?? null,
        body.value !== undefined ? JSON.stringify(body.value) : null,
        typeof body.timeTotalSec === "number" ? body.timeTotalSec : null,
        typeof body.timeOnStepSec === "number" ? body.timeOnStepSec : null,
        body.ts ?? Date.now(),
      ]
    );
  } catch (e) {
    console.error("[quiz/progress] DB insert failed:", e);
    // Non bloccare l'UX: rispondi comunque ok
  }

  return NextResponse.json({ ok: true });
}
