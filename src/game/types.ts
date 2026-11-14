export type EraId = 'victorian' | 'modern' | 'future';

export type WorldConditionMode = 'normal' | 'crisis';

export type EvidenceRarity = 'common' | 'uncommon' | 'rare' | 'special';

export type EvidenceType = 'physical' | 'digital' | 'document' | 'biological' | 'statement' | 'timeline';

export type DialogueCategory = 'timeline' | 'motive' | 'other_suspect' | 'location' | 'object' | 'crime';

export type CharacterRoleSlot = 'insider' | 'access_holder' | 'specialist' | 'witness';

export type SuspectPersonalityTrait =
  | 'honest'
  | 'nervous'
  | 'observant'
  | 'secretive'
  | 'impulsive'
  | 'calm'
  | 'manipulative'
  | 'ambitious'
  | 'defensive'
  | 'intelligent';

export interface Evidence {
  id: string;
  name: { kk: string; en: string };
  description: { kk: string; en: string };
  type: EvidenceType;
  rarity: EvidenceRarity;
  roomId: string;
  discovered: boolean;
  analyzed: boolean;
  isEssential: boolean; // At least 3 essential clues per case
  isMisleading?: boolean; // Misleading clue with coherent explanation
  misleadingExplanation?: { kk: string; en: string };
  implicatesSuspectId?: string;
  exoneratesSuspectId?: string;
  svgIcon: string;
  clueWeight: number; // For Bayesian network (0.1 - 0.95)
  discoveredAt?: number;
}

export interface DialogueOption {
  id: string;
  category: DialogueCategory;
  question: { kk: string; en: string };
  response: { kk: string; en: string };
  confrontationResponse?: { kk: string; en: string }; // Revealed when challenged with evidence
  requiredEvidenceId?: string; // Evidence needed to challenge this statement
  revealsSecret?: boolean;
  tactic: 'friendly' | 'pressuring' | 'evidence_present' | 'bluff';
  stressDelta: number;
  trustDelta: number;
}

export interface SuspectAvatarStyle {
  skinTone: string;
  hairColor: string;
  hairStyle: 'curls' | 'slick' | 'short' | 'long' | 'buzz';
  clothingColor: string;
  accessory: 'monocle' | 'glasses' | 'cyber_eyepiece' | 'scarf' | 'none';
  expression: 'nervous' | 'calm' | 'smug' | 'defensive';
}

export interface ProfessionCapability {
  title: { kk: string; en: string };
  description: { kk: string; en: string };
}

export interface Suspect {
  id: string;
  portraitId: string;
  portraitSrc?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  roleSlot: CharacterRoleSlot;
  profession: { kk: string; en: string };
  professionCapability: ProfessionCapability;
  avatarStyle: SuspectAvatarStyle;
  bio: { kk: string; en: string };
  personalityTraits: SuspectPersonalityTrait[];
  trustScore: number; // 0 - 100
  stressLevel: number; // 0 - 100
  communicationStyle: 'nervous' | 'calm' | 'secretive' | 'manipulative' | 'honest' | 'defensive';
  relationships: { kk: string; en: string };
  hiddenSecret: { kk: string; en: string };
  motive: { kk: string; en: string };
  alibi: { kk: string; en: string };
  alibiRoomId: string;
  isCulprit: boolean; // Ground truth
  dialogues: DialogueOption[];
  interrogatedCount: number;
  challengedWithEvidence: boolean;
  alibiReinforcedByAI?: boolean; // Modified dynamically by Minimax culprit AI
}

export interface Hotspot {
  id: string;
  label: { kk: string; en: string };
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  evidenceId?: string;
  inspected: boolean;
  flavorText: { kk: string; en: string };
}

export interface Room {
  id: string;
  name: { kk: string; en: string };
  description: { kk: string; en: string };
  era: EraId;
  themeColor: string;
  hotspots: Hotspot[];
  isLocked: boolean;
  unlockRequirement?: { kk: string; en: string };
  inspected: boolean;
}

export interface TimelineStep {
  time: string; // e.g. "20:00", "20:30", "21:00", "21:30"
  trueLocation: Record<string, string>; // suspectId -> roomId
  apparentLocation: Record<string, string>; // What suspects claim
  eventDescription: { kk: string; en: string };
}

export interface CrisisEvent {
  id: string;
  title: { kk: string; en: string };
  description: { kk: string; en: string };
  dangerLevel: number; // 0 - 100
  maxDanger: number;
  resolved: boolean;
  emergencyDecisions: EmergencyDecision[];
}

export interface EmergencyDecision {
  id: string;
  title: { kk: string; en: string };
  description: { kk: string; en: string };
  dangerDelta: number; // Negative reduces danger, positive increases
  consequenceText: { kk: string; en: string };
}

export interface EvidenceConnectionRule {
  id: string;
  clueAId: string;
  clueBId: string;
  deductionTitle: { kk: string; en: string };
  deductionText: { kk: string; en: string };
  revealedSuspectId?: string;
}

export interface ActNarrative {
  hook: { kk: string; en: string };
  centralMystery: { kk: string; en: string };
  midpointTwist: { kk: string; en: string };
  finalTwist: { kk: string; en: string };
}

export interface GeneratedCase {
  id: string; // e.g. CV-1888-A93F
  seed: number;
  formattedSeed: string; // e.g. CV-0A8F123C
  generatorVersion: string;
  blueprintKey: string;
  title: { kk: string; en: string };
  introduction: { kk: string; en: string };
  era: EraId;
  year: number;
  worldConditionMode: WorldConditionMode;
  worldCondition: string;
  crisisEvent?: CrisisEvent;
  crimeCategory: string;
  crimeSummary: { kk: string; en: string };
  crimeTime: string;
  victim: {
    name: string;
    role: { kk: string; en: string };
  };
  culpritId: string; // Hidden ground truth
  suspects: Suspect[];
  rooms: Room[];
  evidenceList: Evidence[];
  timeline: TimelineStep[];
  actNarrative: ActNarrative;
  evidenceConnections: EvidenceConnectionRule[];
  solutionExplanation: { kk: string; en: string };
  misleadingExplanations: Array<{ clueId: string; text: { kk: string; en: string } }>;
  createdAt: number;
}

export interface CulpritCounterAction {
  actionType: 'hide_evidence' | 'reinforce_alibi' | 'create_distraction' | 'delay_investigation';
  message: { kk: string; en: string };
  targetId?: string;
}

export interface InvestigationState {
  activeCase: GeneratedCase | null;
  currentRoomId: string;
  investigationProgress: number; // 0 - 100
  actionPointsUsed: number;
  hintsUsed: number;
  currentHintLevel: number;
  dangerMeter: number; // 0 - 100 in crisis mode
  crisisDecisionsTaken: string[];
  connectedEvidencePairs: Array<[string, string]>;
  unlockedDeductions: string[];
  midpointTwistTriggered: boolean;
  accusedSuspectId: string | null;
  accusationOutcome: 'correct' | 'partial' | 'wrong' | null;
  isSolved: boolean;
  isGameOver: boolean;
  culpritCounterActionActive?: CulpritCounterAction;
  investigationLog: Array<{
    id: string;
    timestamp: number;
    text: { kk: string; en: string };
    type: 'discovery' | 'interrogation' | 'hint' | 'analysis' | 'crisis' | 'culprit_action';
  }>;
}

export interface CompletedCase {
  caseId: string;
  caseSeed: string;
  title: string;
  era: EraId;
  year: number;
  crimeCategory: string;
  outcome: 'correct' | 'partial' | 'wrong';
  score: number;
  culpritName: string;
  accusedName: string;
  solvedAt: number;
  evidenceFoundCount: number;
  totalEvidenceCount: number;
  hintsUsedCount: number;
  crisisSurvived: boolean;
}

export interface GameSettings {
  language: 'kk' | 'en';
  soundEnabled: boolean;
  reducedMotion: boolean;
  eraWeights: Record<EraId, number>;
  worldModeWeights: Record<WorldConditionMode, number>;
  itemRarityWeights: Record<EvidenceRarity, number>;
}
