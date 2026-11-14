import { GeneratedCase, InvestigationState, CompletedCase, GameSettings } from '../game/types.ts';
import { DEFAULT_PROBABILITY_WEIGHTS } from '../game/probabilityConfig.ts';

const ACTIVE_CASE_KEY = 'caseverse_active_case_v12';
const INVESTIGATION_STATE_KEY = 'caseverse_investigation_state_v12';
const COMPLETED_CASES_KEY = 'caseverse_completed_cases_v12';
const SETTINGS_KEY = 'caseverse_settings_v12';
const SCHEMA_VERSION_KEY = 'caseverse_schema_version';
const CURRENT_SCHEMA_VERSION = '1.2.0';

export const defaultSettings: GameSettings = {
  language: 'kk',
  soundEnabled: true,
  reducedMotion: false,
  eraWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.eras },
  worldModeWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.worldModes },
  itemRarityWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.itemRarity },
};

export const storage = {
  getSchemaVersion: (): string => {
    try {
      return localStorage.getItem(SCHEMA_VERSION_KEY) || CURRENT_SCHEMA_VERSION;
    } catch {
      return CURRENT_SCHEMA_VERSION;
    }
  },

  saveActiveCase: (generatedCase: GeneratedCase | null) => {
    try {
      if (!generatedCase) {
        localStorage.removeItem(ACTIVE_CASE_KEY);
      } else {
        localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
        localStorage.setItem(ACTIVE_CASE_KEY, JSON.stringify(generatedCase));
      }
    } catch {
      // ignore
    }
  },

  loadActiveCase: (): GeneratedCase | null => {
    try {
      const data = localStorage.getItem(ACTIVE_CASE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveInvestigationState: (state: InvestigationState | null) => {
    try {
      if (!state) {
        localStorage.removeItem(INVESTIGATION_STATE_KEY);
      } else {
        localStorage.setItem(INVESTIGATION_STATE_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
  },

  loadInvestigationState: (): InvestigationState | null => {
    try {
      const data = localStorage.getItem(INVESTIGATION_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCompletedCase: (completed: CompletedCase) => {
    try {
      const list = storage.loadCompletedCases();
      const filtered = list.filter((c) => c.caseId !== completed.caseId);
      filtered.unshift(completed);
      // Limit to latest 50 completed cases per requirement
      const capped = filtered.slice(0, 50);
      localStorage.setItem(COMPLETED_CASES_KEY, JSON.stringify(capped));
    } catch {
      // ignore
    }
  },

  loadCompletedCases: (): CompletedCase[] => {
    try {
      const data = localStorage.getItem(COMPLETED_CASES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  deleteCompletedCase: (caseId: string) => {
    try {
      const list = storage.loadCompletedCases();
      const filtered = list.filter((c) => c.caseId !== caseId);
      localStorage.setItem(COMPLETED_CASES_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  clearCompletedCases: () => {
    try {
      localStorage.removeItem(COMPLETED_CASES_KEY);
    } catch {
      // ignore
    }
  },

  saveSettings: (settings: GameSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  loadSettings: (): GameSettings => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...defaultSettings, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return defaultSettings;
  },

  clearAllGameData: () => {
    try {
      localStorage.removeItem(ACTIVE_CASE_KEY);
      localStorage.removeItem(INVESTIGATION_STATE_KEY);
      localStorage.removeItem(COMPLETED_CASES_KEY);
    } catch {
      // ignore
    }
  },
};
