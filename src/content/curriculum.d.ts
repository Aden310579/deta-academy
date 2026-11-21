export type Lesson = { t: string; min: number; b: string; calc?: boolean; video?: string };
export type Quiz = { q: string; o: string[]; a: number; ex: string };
export type Module = { id: string; n: number; free: boolean; title: string; desc: string; lessons: Lesson[]; quiz: Quiz[] };
export type Level = { n: string; name: string; desc: string; mods: string[]; slug: string; school: string; c1: string; c2: string; tagline: string; outcomes: string[] };
export const LEVELS: Level[];
export const MODS: Record<string, Module>;
export const ORDER: string[];
export const lessonKey: (m: string, i: number) => string;
export const levelOf: (id: string) => Level;
