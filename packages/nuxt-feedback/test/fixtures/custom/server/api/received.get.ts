import { defineEventHandler } from 'h3';

export default defineEventHandler(
  () => (globalThis as unknown as { __received?: unknown[] }).__received ?? [],
)
