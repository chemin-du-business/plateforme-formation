import n1 from "./slides/n1.json";
import n2 from "./slides/n2.json";
import n3 from "./slides/n3.json";
import notes1 from "./slides/n1-notes.json";
import notes2 from "./slides/n2-notes.json";
import notes3 from "./slides/n3-notes.json";

export type Slide = { id: string; title: string; kicker: string; html: string };

const SLIDES: Record<number, Slide[]> = { 1: n1, 2: n2, 3: n3 };
const NOTES: Record<number, Record<string, string>> = { 1: notes1, 2: notes2, 3: notes3 };

// Diapositives vues par les apprenants (sans les notes du formateur).
export const getSlides = (level: number): Slide[] => SLIDES[level] ?? [];
// Notes du formateur : à n'utiliser que dans les pages réservées au formateur.
export const getNotes = (level: number): Record<string, string> => NOTES[level] ?? {};
