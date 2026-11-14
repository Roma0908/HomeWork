export type CulpritActionType =
  | 'hide_evidence'
  | 'reinforce_alibi'
  | 'create_distraction'
  | 'delay_investigation';

export type BayesianFactor =
  | 'motive'
  | 'opportunity'
  | 'physical'
  | 'timeline'
  | 'access';

export interface MinimaxNode {
  id: string;
  depth: number;
  isMaximizing: boolean; // Detective = Max, Culprit = Min
  actionLabel: { kk: string; en: string };
  score: number;
  alpha: number;
  beta: number;
  isPruned?: boolean;
  isBest?: boolean;
  children?: MinimaxNode[];
}

export interface MinimaxResult {
  suspectId: string;
  suspectName: string;
  isCulprit: boolean;
  rootNode: MinimaxNode;
  optimalUtility: number;
  selectedCulpritAction: CulpritActionType;
  culpritActionMessage: { kk: string; en: string };
  totalExploredNodes: number;
  totalPrunedNodes: number;
  searchDepth: number;
  executionTimeMs: number;
  explanation: { kk: string; en: string };
}

export interface BayesianSuspectResult {
  suspectId: string;
  suspectName: string;
  priorProbability: number; // 0.25
  posteriorProbability: number; // 0.0 - 1.0
  likelihoodScore: number;
  factorProbabilities: Record<BayesianFactor, number>;
  evidenceInfluences: Array<{
    evidenceId: string;
    evidenceName: string;
    factor: BayesianFactor;
    weight: number;
    direction: 'positive' | 'negative' | 'neutral';
  }>;
}

export interface BayesianAnalysisResult {
  results: BayesianSuspectResult[];
  mostLikelySuspectId: string;
  confidenceScore: number;
  activeEvidenceCount: number;
  graphNodes: Array<{
    id: string;
    label: string;
    type: 'hypothesis' | 'factor' | 'observation';
  }>;
  graphEdges: Array<{
    from: string;
    to: string;
  }>;
  explanation: {
    kk: string;
    en: string;
  };
}

export interface ViterbiStepResult {
  timestamp: string;
  mostLikelyRoomId: string;
  mostLikelyRoomName: { kk: string; en: string };
  probability: number;
  logProbability: number;
  trellisColumns: Array<{
    roomId: string;
    roomName: { kk: string; en: string };
    deltaScore: number;
  }>;
  associatedObservation?: {
    id: string;
    name: { kk: string; en: string };
    type: string;
  };
}

export interface CandidateHMMFit {
  suspectId: string;
  suspectName: string;
  fitScore: number; // Observation Likelihood %
  pathSummary: string;
}

export interface HMMViterbiResult {
  suspectId: string;
  suspectName: string;
  path: ViterbiStepResult[];
  observationFitScore: number; // 0 - 100%
  hasInsufficientData: boolean;
  explanation: {
    kk: string;
    en: string;
  };
  candidateComparison: CandidateHMMFit[];
}
