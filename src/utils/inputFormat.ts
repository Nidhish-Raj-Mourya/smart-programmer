import type { ModuleId } from '../engine/types';

export const MODULE_LABELS: Record<ModuleId, string> = {
  loops: 'Module 0 · Loop Foundations',
  array: 'Module 1 · Array',
  string: 'Module 2 · String',
  stack: 'Module 3 · Stack',
  queue: 'Module 4 · Queue',
  recursion: 'Module 5 · Recursion',
  linkedlist: 'Module 6 · Linked List',
  tree: 'Module 7 · Tree',
  graph: 'Module 8 · Graph',
  dp: 'Module 9 · Dynamic Programming',
};

export function serializeInput(input: unknown): string {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return String(input);
  }
  return Object.values(input as Record<string, unknown>)
    .map((v) => (Array.isArray(v) ? v.join(',') : String(v)))
    .join(';');
}

export function parseInput(raw: string, template: unknown): unknown {
  if (typeof template !== 'object' || template === null || Array.isArray(template)) {
    return Number(raw);
  }

  const parts = raw.split(';').map((s) => s.trim());
  const keys = Object.keys(template as Record<string, unknown>);
  const result: Record<string, unknown> = {};

  keys.forEach((key, i) => {
    const templateVal = (template as Record<string, unknown>)[key];
    const part = parts[i] ?? '';
    if (Array.isArray(templateVal)) {
      result[key] = part.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
    } else {
      result[key] = Number(part);
    }
  });

  return result;
}

export function inputHintFor(template: unknown): { label: string; hint: string } {
  if (typeof template !== 'object' || template === null || Array.isArray(template)) {
    return { label: 'Value', hint: 'Enter a number' };
  }

  const entries = Object.entries(template as Record<string, unknown>);
  const label = entries.map(([k]) => k).join('; ');
  const hint = entries
    .map(([k, v]) => (Array.isArray(v) ? `${k} (comma-separated)` : k))
    .join('; ');

  return { label, hint: `Semicolon-separated fields: ${hint}` };
}
