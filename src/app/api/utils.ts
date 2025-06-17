// Utility functions for API routes

/**
 * Checks if a value is a valid integer id (string or number).
 * Returns the id as a number if valid, or undefined if invalid.
 */
export function parseId(id: unknown): number | undefined {
  if (typeof id === 'number' && Number.isInteger(id)) return id;
  if (typeof id === 'string' && /^\d+$/.test(id)) return Number(id);
  return undefined;
}

/**
 * Returns a 400 response if id is missing or invalid.
 */
import { NextResponse } from 'next/server';
export function requireValidId(id: unknown, name = 'id') {
  const parsed = parseId(id);
  if (parsed === undefined) {
    return NextResponse.json({ error: `Missing or invalid ${name}` }, { status: 400 });
  }
  return parsed;
}
