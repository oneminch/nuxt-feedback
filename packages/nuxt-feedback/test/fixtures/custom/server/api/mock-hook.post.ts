import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const g = globalThis as unknown as { __received?: unknown[] }
    ; (g.__received ||= []).push(await readBody(event))
  return { ok: true }
})
