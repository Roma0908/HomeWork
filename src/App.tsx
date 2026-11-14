import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from './localization/LocalizationContext.tsx';
import { Header, ScreenId } from './components/layout/Header.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { ProbabilityPreview } from './screens/ProbabilityPreview.tsx';
import { CaseRevealScreen } from './screens/CaseRevealScreen.tsx';
import { InvestigationScreen } from './screens/InvestigationScreen.tsx';
import { EvidenceJournalScreen } from './screens/EvidenceJournalScreen.tsx';
import { AILabScreen } from './screens/AILabScreen.tsx';
import { FinalReportScreen } from './screens/FinalReportScreen.tsx';
import { CaseCollectionScreen } from './screens/CaseCollectionScreen.tsx';
import { HowToPlayScreen } from './screens/HowToPlayScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { generateCase } from './game/caseGenerator.ts';
import {
  GeneratedCase,
  InvestigationState,
  CompletedCase,
  GameSettings,
  EraId,
  Hotspot,
  DialogueOption,
  EmergencyDecision,
} from './game/types.ts';
import { storage } from './storage/localStorage.ts';
import { sound } from './utils/audio.ts';
import { ProbabilityWeights } from './game/probabilityConfig.ts';
import { runMinimaxAdversarialSearch } from './algorithms/minimax.ts';

export default function App() {
  return (
    <LocalizationProvider>
      <CaseverseCore />
    </LocalizationProvider>
  );
}

function CaseverseCore() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeCase, setActiveCase] = useState<GeneratedCase | null>(() => storage.loadActiveCase());
  const [investigationState, setInvestigationState] = useState<InvestigationState | null>(() =>
    storage.loadInvestigationState()
  );
  const [completedCases, setCompletedCases] = useState<CompletedCase[]>(() => storage.loadCompletedCases());
  const [settings, setSettings] = useState<GameSettings>(() => storage.loadSettings());

  // Initialize sound preferences
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save active case updates
  useEffect(() => {
    storage.saveActiveCase(activeCase);
  }, [activeCase]);

  // Save investigation state updates
  useEffect(() => {
    storage.saveInvestigationState(investigationState);
  }, [investigationState]);

  // Case Generation using current active weighted probability settings
  const handleGenerateCase = (preferredEra?: EraId) => {
    const activeWeights: ProbabilityWeights = {
      eras: settings.eraWeights,
      worldModes: settings.worldModeWeights,
      itemRarity: settings.itemRarityWeights,
    };

    const newCase = generateCase(preferredEra, undefined, activeWeights);

    const initialInvState: InvestigationState = {
      activeCase: newCase,
      currentRoomId: newCase.rooms[0].id,
      investigationProgress: 5,
      actionPointsUsed: 0,
      hintsUsed: 0,
      currentHintLevel: 0,
      dangerMeter: newCase.worldConditionMode === 'crisis' ? 25 : 0,
      crisisDecisionsTaken: [],
      connectedEvidencePairs: [],
      unlockedDeductions: [],
      midpointTwistTriggered: false,
      accusedSuspectId: null,
      accusationOutcome: null,
      isSolved: false,
      isGameOver: false,
      investigationLog: [
        {
          id: 'log_0',
          timestamp: Date.now(),
          text: {
            kk: `«${newCase.title.kk}» ісі ресми түрде ашылды. Бастапқы бөлме: ${newCase.rooms[0].name.kk}.`,
            en: `Case "${newCase.title.en}" officially opened. Initial crime scene room: ${newCase.rooms[0].name.en}.`,
          },
          type: 'discovery',
        },
      ],
    };

    setActiveCase(newCase);
    setInvestigationState(initialInvState);
    setCurrentScreen('reveal');
  };

  const handleSelectRoom = (roomId: string) => {
    if (!investigationState) return;
    setInvestigationState({
      ...investigationState,
      currentRoomId: roomId,
    });
  };

  const handleInspectHotspot = (spot: Hotspot) => {
    if (!activeCase || !investigationState) return;

    let clueFound = false;
    let foundEvidenceId: string | undefined = undefined;

    const updatedRooms = activeCase.rooms.map((room) => {
      const updatedSpots = room.hotspots.map((h) => {
        if (h.id === spot.id && !h.inspected) {
          if (h.evidenceId) {
            clueFound = true;
            foundEvidenceId = h.evidenceId;
          }
          return { ...h, inspected: true };
        }
        return h;
      });
      return { ...room, hotspots: updatedSpots };
    });

    let discoveredEvidenceName: { kk: string; en: string } | null = null;
    const updatedEvidence = activeCase.evidenceList.map((e) => {
      if (e.id === foundEvidenceId) {
        discoveredEvidenceName = e.name;
        return { ...e, discovered: true, discoveredAt: Date.now() };
      }
      return e;
    });

    if (clueFound) {
      sound.playClueFound();
    } else {
      sound.playInspect();
    }

    const updatedCase: GeneratedCase = {
      ...activeCase,
      rooms: updatedRooms,
      evidenceList: updatedEvidence,
    };

    // Calculate progress based on inspected hotspots, interrogations, and discovered evidence
    const totalHotspots = updatedRooms.reduce((acc, r) => acc + r.hotspots.length, 0);
    const inspectedHotspots = updatedRooms.reduce((acc, r) => acc + r.hotspots.filter((h) => h.inspected).length, 0);
    const totalInterrogations = activeCase.suspects.reduce((acc, s) => acc + s.interrogatedCount, 0);
    const discoveredCount = updatedEvidence.filter((e) => e.discovered).length;

    const progress = Math.min(
      95,
      Math.round(
        (inspectedHotspots / Math.max(1, totalHotspots)) * 40 +
          (totalInterrogations / 6) * 30 +
          (discoveredCount / Math.max(1, activeCase.evidenceList.length)) * 30
      )
    );

    const newLogs = [...investigationState.investigationLog];
    if (clueFound && discoveredEvidenceName) {
      newLogs.unshift({
        id: `log_clue_${Date.now()}`,
        timestamp: Date.now(),
        text: {
          kk: `Жаңа айғақ табылды: «${(discoveredEvidenceName as { kk: string; en: string }).kk}».`,
          en: `New clue discovered: "${(discoveredEvidenceName as { kk: string; en: string }).en}".`,
        },
        type: 'discovery',
      });
    }

    // Crisis mode danger increment on actions
    let newDanger = investigationState.dangerMeter;
    if (activeCase.worldConditionMode === 'crisis') {
      newDanger = Math.min(100, newDanger + 3);
    }

    setActiveCase(updatedCase);
    setInvestigationState({
      ...investigationState,
      actionPointsUsed: investigationState.actionPointsUsed + 1,
      investigationProgress: Math.max(investigationState.investigationProgress, progress),
      dangerMeter: newDanger,
      investigationLog: newLogs,
    });
  };

  const handleInterrogateDialogue = (suspectId: string, option: DialogueOption) => {
    if (!activeCase || !investigationState) return;

    const suspect = activeCase.suspects.find((s) => s.id === suspectId);

    const updatedSuspects = activeCase.suspects.map((s) => {
      if (s.id === suspectId) {
        const delta = option.stressDelta || 6;
        const newStress = Math.min(100, Math.max(0, s.stressLevel + delta));
        const newTrust = Math.min(100, Math.max(0, s.trustScore + (option.trustDelta || 0)));
        return {
          ...s,
          stressLevel: newStress,
          trustScore: newTrust,
          interrogatedCount: s.interrogatedCount + 1,
        };
      }
      return s;
    });

    const dialogueLog = {
      id: `log_dial_${Date.now()}`,
      timestamp: Date.now(),
      text: {
        kk: `${suspect?.name || 'Күдікті'} жауабы: «${option.response.kk}».`,
        en: `${suspect?.name || 'Suspect'} response: "${option.response.en}".`,
      },
      type: 'interrogation' as const,
    };

    const updatedCase = { ...activeCase, suspects: updatedSuspects };
    setActiveCase(updatedCase);
    setInvestigationState({
      ...investigationState,
      actionPointsUsed: investigationState.actionPointsUsed + 1,
      investigationLog: [dialogueLog, ...investigationState.investigationLog],
    });
  };

  const handleChallengeSuspectWithEvidence = (suspectId: string, evidenceId: string) => {
    if (!activeCase || !investigationState) return;

    const suspect = activeCase.suspects.find((s) => s.id === suspectId);
    const evidence = activeCase.evidenceList.find((e) => e.id === evidenceId);
    if (!suspect || !evidence) return;

    // Run real Minimax adversarial search to let the culprit AI execute optimal counter-actions
    const minimaxResult = runMinimaxAdversarialSearch(activeCase, investigationState, suspect);

    const updatedSuspects = activeCase.suspects.map((s) => {
      if (s.id === suspectId) {
        const addedStress = evidence.isEssential ? 25 : 12;
        return {
          ...s,
          challengedWithEvidence: true,
          stressLevel: Math.min(100, s.stressLevel + addedStress),
          trustScore: Math.max(0, s.trustScore - 15),
          alibiReinforcedByAI:
            minimaxResult.selectedCulpritAction === 'reinforce_alibi' ? true : s.alibiReinforcedByAI,
          interrogatedCount: s.interrogatedCount + 1,
        };
      }
      return s;
    });

    let newDanger = investigationState.dangerMeter;
    if (minimaxResult.selectedCulpritAction === 'delay_investigation' && activeCase.worldConditionMode === 'crisis') {
      newDanger = Math.min(100, newDanger + 10);
    }

    const confrontationLog = {
      id: `log_challenge_${Date.now()}`,
      timestamp: Date.now(),
      text: {
        kk: `«${evidence.name.kk}» айғағы бойынша ${suspect.name} күдіктісіне беттестіру жүргізілді.`,
        en: `Suspect ${suspect.name} was confronted with "${evidence.name.en}".`,
      },
      type: 'interrogation' as const,
    };

    const culpritActionLog = {
      id: `log_culprit_${Date.now()}`,
      timestamp: Date.now() + 1,
      text: minimaxResult.culpritActionMessage,
      type: 'culprit_action' as const,
    };

    sound.playInspect();

    setActiveCase({
      ...activeCase,
      suspects: updatedSuspects,
    });

    setInvestigationState({
      ...investigationState,
      actionPointsUsed: investigationState.actionPointsUsed + 1,
      dangerMeter: newDanger,
      culpritCounterActionActive: {
        actionType: minimaxResult.selectedCulpritAction,
        message: minimaxResult.culpritActionMessage,
        targetId: suspectId,
      },
      investigationLog: [culpritActionLog, confrontationLog, ...investigationState.investigationLog],
    });
  };

  const handleTakeCrisisDecision = (decision: EmergencyDecision) => {
    if (!activeCase || !investigationState) return;
    const currentDanger = investigationState.dangerMeter || 0;
    const newDanger = Math.min(100, Math.max(0, currentDanger + decision.dangerDelta));
    sound.playClick();

    const decisionLogItem = {
      id: `log_crisis_${Date.now()}`,
      timestamp: Date.now(),
      text: {
        kk: `Дағдарыс шешімі қабылданды: «${decision.title.kk}». Қауіп деңгейі: ${newDanger}%.`,
        en: `Emergency decision enacted: "${decision.title.en}". Danger level: ${newDanger}%.`,
      },
      type: 'crisis' as const,
    };

    setInvestigationState({
      ...investigationState,
      dangerMeter: newDanger,
      crisisDecisionsTaken: [...investigationState.crisisDecisionsTaken, decision.id],
      investigationLog: [decisionLogItem, ...investigationState.investigationLog],
    });
  };

  const handleAnalyzeEvidence = (evidenceId: string) => {
    if (!activeCase || !investigationState) return;

    const targetEvidence = activeCase.evidenceList.find((e) => e.id === evidenceId);
    if (!targetEvidence || targetEvidence.analyzed) return;

    const updatedEvidence = activeCase.evidenceList.map((e) => {
      if (e.id === evidenceId) {
        return { ...e, analyzed: true };
      }
      return e;
    });

    sound.playClueFound();

    const analysisLog = {
      id: `log_analysis_${Date.now()}`,
      timestamp: Date.now(),
      text: {
        kk: `«${targetEvidence.name.kk}» сараптамасы аяқталды. Криминалистикалық сипаттамасы журналға тіркелді.`,
        en: `Forensic analysis of "${targetEvidence.name.en}" completed. Results documented in journal.`,
      },
      type: 'analysis' as const,
    };

    setActiveCase({
      ...activeCase,
      evidenceList: updatedEvidence,
    });

    setInvestigationState({
      ...investigationState,
      actionPointsUsed: investigationState.actionPointsUsed + 1,
      investigationProgress: Math.min(98, investigationState.investigationProgress + 8),
      investigationLog: [analysisLog, ...investigationState.investigationLog],
    });
  };

  const handleConnectEvidence = (clueAId: string, clueBId: string) => {
    if (!activeCase || !investigationState) return;

    const match = activeCase.evidenceConnections?.find(
      (rule) =>
        (rule.clueAId === clueAId && rule.clueBId === clueBId) ||
        (rule.clueAId === clueBId && rule.clueBId === clueAId)
    );

    const existingPairs = investigationState.connectedEvidencePairs || [];
    const isAlready = existingPairs.some(
      ([a, b]) => (a === clueAId && b === clueBId) || (a === clueBId && b === clueAId)
    );
    if (isAlready) return;

    const newPairs: Array<[string, string]> = [...existingPairs, [clueAId, clueBId]];
    const newUnlocked = [...(investigationState.unlockedDeductions || [])];

    if (match && !newUnlocked.includes(match.id)) {
      newUnlocked.push(match.id);
      sound.playSuccess();
    } else {
      sound.playClick();
    }

    setInvestigationState({
      ...investigationState,
      connectedEvidencePairs: newPairs,
      unlockedDeductions: newUnlocked,
      investigationProgress: Math.min(100, investigationState.investigationProgress + (match ? 15 : 5)),
      investigationLog: [
        {
          id: `log_conn_${Date.now()}`,
          timestamp: Date.now(),
          text: match
            ? {
                kk: `Айғақтар тақтасы: Жаңа дедукция ашылды: «${match.deductionTitle.kk}».`,
                en: `Evidence Board: Breakthrough deduction unlocked: "${match.deductionTitle.en}".`,
              }
            : {
                kk: `Айғақтар тақтасында жаңа байланыс тексерілді.`,
                en: `Checked clue connection on the evidence board.`,
              },
          type: 'analysis',
        },
        ...investigationState.investigationLog,
      ],
    });
  };

  const handleUseHint = (level: number) => {
    if (!investigationState) return;

    const hintLog = {
      id: `log_hint_${Date.now()}`,
      timestamp: Date.now(),
      text: {
        kk: `${level}-деңгейлі тергеу анықтамасы қабылданды (айыппұл: -${level * 50} балл).`,
        en: `Level ${level} investigative hint consulted (penalty: -${level * 50} pts).`,
      },
      type: 'hint' as const,
    };

    sound.playClick();

    setInvestigationState({
      ...investigationState,
      hintsUsed: investigationState.hintsUsed + 1,
      currentHintLevel: Math.max(investigationState.currentHintLevel, level),
      investigationLog: [hintLog, ...investigationState.investigationLog],
    });
  };

  const handleAccuseSuspect = (suspectId: string, _reasoning: string) => {
    if (!activeCase || !investigationState) return;

    const isCulpritMatch = suspectId === activeCase.culpritId;
    const discoveredEssentialCount = activeCase.evidenceList.filter((e) => e.discovered && e.isEssential).length;
    const totalDiscoveredCount = activeCase.evidenceList.filter((e) => e.discovered).length;

    // Outcome 1: Perfect deduction (Right culprit + >= 3 essential clues)
    // Outcome 2: Lucky guess / incomplete evidence (Right culprit + < 3 essential clues)
    // Outcome 3: False accusation (Wrong suspect accused)
    let outcome: 'correct' | 'partial' | 'wrong' = 'wrong';
    if (isCulpritMatch) {
      outcome = discoveredEssentialCount >= 3 ? 'correct' : 'partial';
    }

    let baseScore = 200;
    if (outcome === 'correct') {
      baseScore = 1200;
    } else if (outcome === 'partial') {
      baseScore = 650;
    }

    const essentialBonus = discoveredEssentialCount * 120;
    const optionalBonus = (totalDiscoveredCount - discoveredEssentialCount) * 50;
    const hintPenalty = investigationState.hintsUsed * 75;
    const actionPenalty = Math.max(0, (investigationState.actionPointsUsed - 8) * 10);
    const dangerPenalty = Math.round((investigationState.dangerMeter || 0) * 2);

    const totalScore = Math.max(
      50,
      baseScore + essentialBonus + optionalBonus - hintPenalty - actionPenalty - dangerPenalty
    );

    const actualCulprit = activeCase.suspects.find((s) => s.id === activeCase.culpritId);
    const accusedSuspect = activeCase.suspects.find((s) => s.id === suspectId);

    const completed: CompletedCase = {
      caseId: activeCase.id,
      caseSeed: activeCase.formattedSeed,
      title: activeCase.title.kk,
      era: activeCase.era,
      year: activeCase.year,
      crimeCategory: activeCase.crimeCategory,
      outcome: outcome,
      score: totalScore,
      culpritName: actualCulprit?.name || 'Белгісіз',
      accusedName: accusedSuspect?.name || 'Белгісіз',
      solvedAt: Date.now(),
      evidenceFoundCount: totalDiscoveredCount,
      totalEvidenceCount: activeCase.evidenceList.length,
      hintsUsedCount: investigationState.hintsUsed,
      crisisSurvived: (investigationState.dangerMeter || 0) < 100,
    };

    storage.saveCompletedCase(completed);
    setCompletedCases(storage.loadCompletedCases());

    if (outcome === 'correct') {
      sound.playVictory();
    } else {
      sound.playDefeat();
    }

    setInvestigationState({
      ...investigationState,
      accusedSuspectId: suspectId,
      accusationOutcome: outcome,
      isSolved: outcome === 'correct' || outcome === 'partial',
      isGameOver: true,
      investigationProgress: 100,
    });

    setCurrentScreen('report');
  };

  const handleResetAllData = () => {
    storage.clearAllGameData();
    setActiveCase(null);
    setInvestigationState(null);
    setCompletedCases([]);
    setCurrentScreen('home');
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F3F4F6] flex flex-col">
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        hasActiveCase={!!activeCase}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          sound.setEnabled(next);
          handleUpdateSettings({ ...settings, soundEnabled: next });
        }}
      />

      <main className="flex-1 w-full pb-16">
        {currentScreen === 'home' && (
          <HomeScreen
            hasActiveCase={!!activeCase}
            onNavigate={setCurrentScreen}
            onStartNewCaseFlow={() => setCurrentScreen('probability')}
          />
        )}

        {currentScreen === 'probability' && (
          <ProbabilityPreview
            weights={{
              eras: settings.eraWeights,
              worldModes: settings.worldModeWeights,
              itemRarity: settings.itemRarityWeights,
            }}
            onGenerateCase={handleGenerateCase}
            onNavigateToSettings={() => setCurrentScreen('settings')}
          />
        )}

        {currentScreen === 'reveal' && activeCase && (
          <CaseRevealScreen
            activeCase={activeCase}
            onStartInvestigation={() => setCurrentScreen('investigation')}
          />
        )}

        {currentScreen === 'investigation' && activeCase && investigationState && (
          <InvestigationScreen
            activeCase={activeCase}
            investigationState={investigationState}
            onSelectRoom={handleSelectRoom}
            onInspectHotspot={handleInspectHotspot}
            onInterrogateDialogue={handleInterrogateDialogue}
            onChallengeSuspectWithEvidence={handleChallengeSuspectWithEvidence}
            onTakeCrisisDecision={handleTakeCrisisDecision}
            onUseHint={handleUseHint}
            onOpenJournal={() => setCurrentScreen('evidence')}
            onOpenAILab={() => setCurrentScreen('aiLab')}
            onAccuseSuspect={handleAccuseSuspect}
            onConnectEvidencePair={handleConnectEvidence}
          />
        )}

        {currentScreen === 'evidence' && activeCase && (
          <EvidenceJournalScreen
            activeCase={activeCase}
            onReturnToInvestigation={() => setCurrentScreen('investigation')}
            onAnalyzeEvidence={handleAnalyzeEvidence}
          />
        )}

        {currentScreen === 'aiLab' && (
          <AILabScreen
            activeCase={activeCase}
            investigationState={investigationState}
            onReturnToInvestigation={activeCase ? () => setCurrentScreen('investigation') : undefined}
            onStartNewCase={() => setCurrentScreen('probability')}
          />
        )}

        {currentScreen === 'report' && activeCase && investigationState && (
          <FinalReportScreen
            activeCase={activeCase}
            investigationState={investigationState}
            onNewCase={() => setCurrentScreen('probability')}
            onGoHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'collection' && (
          <CaseCollectionScreen
            completedCases={completedCases}
            onStartNewCase={() => setCurrentScreen('probability')}
            onGoBack={() => setCurrentScreen('home')}
            onDeleteCase={(caseId) => {
              storage.deleteCompletedCase(caseId);
              setCompletedCases(storage.loadCompletedCases());
            }}
            onClearCollection={() => {
              storage.clearCompletedCases();
              setCompletedCases([]);
            }}
          />
        )}

        {currentScreen === 'howToPlay' && (
          <HowToPlayScreen
            onGoBack={() => setCurrentScreen('home')}
            onStartNewCase={() => setCurrentScreen('probability')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
            onGoBack={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#2A3B54] bg-[#070a14] py-4 px-6 text-center text-xs text-[#A8B1C1]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CASEVERSE · Every Case Has a Different Truth</span>
          <span className="font-mono text-[11px] text-[#D6AE67]">
            Procedural 2D Mystery Engine & AI Laboratory
          </span>
        </div>
      </footer>
    </div>
  );
}
