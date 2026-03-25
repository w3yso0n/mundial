export type GroupPosition =
  | "1A" | "2A" | "3A"
  | "1B" | "2B" | "3B"
  | "1C" | "2C" | "3C"
  | "1D" | "2D" | "3D"
  | "1E" | "2E" | "3E"
  | "1F" | "2F" | "3F"
  | "1G" | "2G" | "3G"
  | "1H" | "2H" | "3H"
  | "1I" | "2I" | "3I"
  | "1J" | "2J" | "3J"
  | "1K" | "2K" | "3K"
  | "1L" | "2L" | "3L";

export type MatchRef =
  | { type: "group"; pos: GroupPosition }
  | { type: "match"; code: string };

export interface BracketMatch {
  code: string; // ejemplo: R16-1, O1, C1, S1, F1
  round: "R16" | "OCTAVOS" | "CUARTOS" | "SEMIS" | "FINAL";
  left: MatchRef;
  right: MatchRef;
}

export const bracketMatches: BracketMatch[] = [
  // --- Dieciseisavos (R16) ---
  { code: "R16-1", round: "R16", left: { type: "group", pos: "1A" }, right: { type: "group", pos: "3C" } },
  { code: "R16-2", round: "R16", left: { type: "group", pos: "2A" }, right: { type: "group", pos: "2B" } },

  { code: "R16-3", round: "R16", left: { type: "group", pos: "1B" }, right: { type: "group", pos: "3A" } },
  { code: "R16-4", round: "R16", left: { type: "group", pos: "2C" }, right: { type: "group", pos: "2D" } },

  { code: "R16-5", round: "R16", left: { type: "group", pos: "1C" }, right: { type: "group", pos: "3D" } },
  { code: "R16-6", round: "R16", left: { type: "group", pos: "1D" }, right: { type: "group", pos: "3B" } },

  { code: "R16-7", round: "R16", left: { type: "group", pos: "1E" }, right: { type: "group", pos: "3F" } },
  { code: "R16-8", round: "R16", left: { type: "group", pos: "2E" }, right: { type: "group", pos: "2F" } },

  { code: "R16-9", round: "R16", left: { type: "group", pos: "1F" }, right: { type: "group", pos: "3E" } },
  { code: "R16-10", round: "R16", left: { type: "group", pos: "1G" }, right: { type: "group", pos: "3H" } },

  { code: "R16-11", round: "R16", left: { type: "group", pos: "2G" }, right: { type: "group", pos: "2H" } },
  { code: "R16-12", round: "R16", left: { type: "group", pos: "1H" }, right: { type: "group", pos: "3G" } },

  { code: "R16-13", round: "R16", left: { type: "group", pos: "1I" }, right: { type: "group", pos: "3J" } },
  { code: "R16-14", round: "R16", left: { type: "group", pos: "2I" }, right: { type: "group", pos: "2J" } },

  { code: "R16-15", round: "R16", left: { type: "group", pos: "1J" }, right: { type: "group", pos: "3I" } },
  { code: "R16-16", round: "R16", left: { type: "group", pos: "1K" }, right: { type: "group", pos: "3L" } },

  { code: "R16-17", round: "R16", left: { type: "group", pos: "2K" }, right: { type: "group", pos: "2L" } },
  { code: "R16-18", round: "R16", left: { type: "group", pos: "1L" }, right: { type: "group", pos: "3K" } },

  // --- Octavos (O1–O8) ---
  { code: "O1", round: "OCTAVOS", left: { type: "match", code: "R16-1" }, right: { type: "match", code: "R16-2" } },
  { code: "O2", round: "OCTAVOS", left: { type: "match", code: "R16-3" }, right: { type: "match", code: "R16-4" } },
  { code: "O3", round: "OCTAVOS", left: { type: "match", code: "R16-5" }, right: { type: "match", code: "R16-6" } },
  { code: "O4", round: "OCTAVOS", left: { type: "match", code: "R16-7" }, right: { type: "match", code: "R16-8" } },
  { code: "O5", round: "OCTAVOS", left: { type: "match", code: "R16-9" }, right: { type: "match", code: "R16-10" } },
  { code: "O6", round: "OCTAVOS", left: { type: "match", code: "R16-11" }, right: { type: "match", code: "R16-12" } },
  { code: "O7", round: "OCTAVOS", left: { type: "match", code: "R16-13" }, right: { type: "match", code: "R16-14" } },
  { code: "O8", round: "OCTAVOS", left: { type: "match", code: "R16-15" }, right: { type: "match", code: "R16-16" } },

  // --- Cuartos (C1–C4) ---
  { code: "C1", round: "CUARTOS", left: { type: "match", code: "O1" }, right: { type: "match", code: "O2" } },
  { code: "C2", round: "CUARTOS", left: { type: "match", code: "O3" }, right: { type: "match", code: "O4" } },
  { code: "C3", round: "CUARTOS", left: { type: "match", code: "O5" }, right: { type: "match", code: "O6" } },
  { code: "C4", round: "CUARTOS", left: { type: "match", code: "O7" }, right: { type: "match", code: "O8" } },

  // --- Semifinales (S1–S2) ---
  { code: "S1", round: "SEMIS", left: { type: "match", code: "C1" }, right: { type: "match", code: "C2" } },
  { code: "S2", round: "SEMIS", left: { type: "match", code: "C3" }, right: { type: "match", code: "C4" } },

  // --- Final ---
  { code: "F1", round: "FINAL", left: { type: "match", code: "S1" }, right: { type: "match", code: "S2" } },
];

