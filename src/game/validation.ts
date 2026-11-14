import { GeneratedCase } from './types.ts';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a generated case scenario for complete story consistency and solvability
 */
export function validateCase(c: GeneratedCase): ValidationResult {
  const errors: string[] = [];

  // 1. Exactly four suspects
  if (!c.suspects || c.suspects.length !== 4) {
    errors.push(`Case must have exactly 4 suspects, found ${c.suspects?.length}`);
  }

  // 2. Exactly one culprit
  const culprits = c.suspects.filter((s) => s.isCulprit);
  if (culprits.length !== 1) {
    errors.push(`Case must have exactly 1 culprit, found ${culprits.length}`);
  } else if (culprits[0].id !== c.culpritId) {
    errors.push(`Culprit ID mismatch: ${culprits[0].id} vs ${c.culpritId}`);
  }

  // 3. Culprit has coherent motive
  const culprit = culprits[0];
  if (culprit && (!culprit.motive.en || culprit.motive.en.trim().length < 5)) {
    errors.push('Culprit lacks a coherent motive');
  }

  // 4. Five to eight collectible evidence items
  if (!c.evidenceList || c.evidenceList.length < 5 || c.evidenceList.length > 8) {
    errors.push(`Evidence count must be between 5 and 8, found ${c.evidenceList?.length}`);
  }

  // 5. At least three essential clues
  const essentialClues = c.evidenceList.filter((e) => e.isEssential);
  if (essentialClues.length < 3) {
    errors.push(`Case must have at least 3 essential clues, found ${essentialClues.length}`);
  }

  // 6. Essential clues cover multiple distinct categories
  const physicalCount = essentialClues.filter((e) => e.type === 'physical' || e.type === 'biological').length;
  const timelineOrAccessCount = essentialClues.filter(
    (e) => e.type === 'timeline' || e.type === 'digital' || e.type === 'document' || e.type === 'statement'
  ).length;

  if (physicalCount === 0 && timelineOrAccessCount === 0) {
    errors.push('Essential clues must span distinct evidential categories');
  }

  // 7. Every clue placed in a valid room that exists in the case
  const roomIds = new Set(c.rooms.map((r) => r.id));
  c.evidenceList.forEach((ev) => {
    if (!roomIds.has(ev.roomId)) {
      errors.push(`Evidence ${ev.id} placed in non-existent room ${ev.roomId}`);
    }
  });

  // 8. At least 5 to 8 locations
  if (!c.rooms || c.rooms.length < 5 || c.rooms.length > 8) {
    errors.push(`Rooms count must be between 5 and 8, found ${c.rooms?.length}`);
  }

  // 9. Timeline chronology consistency
  if (!c.timeline || c.timeline.length < 3) {
    errors.push('Case must have at least 3 timeline steps');
  }

  // 10. Misleading clues have explanations
  const misleadingClues = c.evidenceList.filter((e) => e.isMisleading);
  misleadingClues.forEach((mc) => {
    if (!mc.misleadingExplanation || !mc.misleadingExplanation.en) {
      errors.push(`Misleading clue ${mc.id} is missing an explanatory resolution`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
