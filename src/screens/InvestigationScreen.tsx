import React, { useState } from 'react';
import {
  GeneratedCase,
  InvestigationState,
  Suspect,
  Hotspot,
  Evidence,
  DialogueOption,
  EmergencyDecision,
} from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { RoomIllustration } from '../components/cards/RoomIllustration.tsx';
import { SuspectCard } from '../components/cards/SuspectCard.tsx';
import { EvidenceIcon } from '../components/cards/EvidenceIcon.tsx';
import { InterrogationModal } from '../components/modals/InterrogationModal.tsx';
import { AccusationModal } from '../components/modals/AccusationModal.tsx';
import { ClueInspectModal } from '../components/modals/ClueInspectModal.tsx';
import { CharacterProfileModal } from '../components/modals/CharacterProfileModal.tsx';
import { EvidenceBoardModal } from '../components/investigation/EvidenceBoardModal.tsx';
import { sound } from '../utils/audio.ts';
import {
  BookOpen,
  Brain,
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';

interface InvestigationScreenProps {
  activeCase: GeneratedCase;
  investigationState: InvestigationState;
  onSelectRoom: (roomId: string) => void;
  onInspectHotspot: (spot: Hotspot) => void;
  onInterrogateDialogue: (suspectId: string, option: DialogueOption) => void;
  onChallengeSuspectWithEvidence: (suspectId: string, evidenceId: string) => void;
  onTakeCrisisDecision: (decision: EmergencyDecision) => void;
  onUseHint: (level: number) => void;
  onOpenJournal: () => void;
  onOpenAILab: () => void;
  onAccuseSuspect: (suspectId: string, reasoning: string) => void;
  onConnectEvidencePair: (clueAId: string, clueBId: string) => void;
}

export const InvestigationScreen: React.FC<InvestigationScreenProps> = ({
  activeCase,
  investigationState,
  onSelectRoom,
  onInspectHotspot,
  onInterrogateDialogue,
  onChallengeSuspectWithEvidence,
  onTakeCrisisDecision,
  onUseHint,
  onOpenJournal,
  onOpenAILab,
  onAccuseSuspect,
  onConnectEvidencePair,
}) => {
  const { language, t } = useTranslation();
  const [activeInterrogationSuspect, setActiveInterrogationSuspect] = useState<Suspect | null>(null);
  const [showAccusationModal, setShowAccusationModal] = useState<boolean>(false);
  const [inspectedClue, setInspectedClue] = useState<Evidence | null>(null);
  const [hintMessage, setHintMessage] = useState<{ level: number; text: string } | null>(null);
  const [showEvidenceBoard, setShowEvidenceBoard] = useState<boolean>(false);
  const [selectedProfileSuspect, setSelectedProfileSuspect] = useState<Suspect | null>(null);

  const currentRoom =
    activeCase.rooms.find((r) => r.id === investigationState.currentRoomId) || activeCase.rooms[0];
  const discoveredEvidence = activeCase.evidenceList.filter((e) => e.discovered);
  const essentialFound = discoveredEvidence.filter((e) => e.isEssential).length;
  const totalEssential = activeCase.evidenceList.filter((e) => e.isEssential).length;
  const suspectsInterviewedCount = activeCase.suspects.filter((s) => s.interrogatedCount > 0).length;
  const exploredRoomsCount = activeCase.rooms.filter((r) => r.hotspots.some((h) => h.inspected)).length;

  const unlockedDeductionsCount = investigationState.unlockedDeductions?.length || 0;
  const totalConnectionsCount = activeCase.evidenceConnections?.length || 0;

  // 3-Level Progressive Hint Generator
  const handleProgressiveHint = () => {
    sound.playClick();
    const currentLvl = (investigationState.currentHintLevel % 3) + 1;
    onUseHint(currentLvl);

    const unsearchedRoom = activeCase.rooms.find((r) => r.hotspots.some((h) => !h.inspected && h.evidenceId));
    const targetSuspect = activeCase.suspects.find((s) => s.isCulprit) || activeCase.suspects[0];

    if (currentLvl === 1) {
      setHintMessage({
        level: 1,
        text:
          language === 'kk'
            ? `1-деңгей (Бағыт): Сарайдағы әлі толық қаралмаған бөлмелерді аралап, заттай және уақыт айғақтарын жинаңыз.`
            : `Level 1 (General): Search unexplored rooms across the crime scene to uncover critical physical and temporal evidence.`,
      });
    } else if (currentLvl === 2) {
      setHintMessage({
        level: 2,
        text:
          unsearchedRoom
            ? language === 'kk'
              ? `2-деңгей (Орын): «${unsearchedRoom.name.kk}» бөлмесінде маңызды із бар. Ондағы нүктелерді тексеріңіз.`
              : `Level 2 (Location): Inspect the "${unsearchedRoom.name.en}". Crucial evidential traces remain untouched there.`
            : language === 'kk'
            ? `2-деңгей (Күдікті): ${targetSuspect.name} тұлғасының алибиін табылған сағат немесе құжатпен тексеріңіз.`
            : `Level 2 (Suspect): Challenge ${targetSuspect.name}'s stated alibi using the recovered timeline records.`,
      });
    } else {
      setHintMessage({
        level: 3,
        text:
          language === 'kk'
            ? `3-деңгей (Нақты қадам): ЖИ Зертханасына өтіп, Байес желісінің ең жоғары ықтималдығы мен Витерби траекториясын тексеріп, ресми айыптау тағыңыз!`
            : `Level 3 (Action): Open the AI Laboratory to evaluate Bayesian posteriors and the Viterbi timeline fit, then deliver your official accusation!`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP INVESTIGATION HUD STRIP */}
      <div className="p-4 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-wrap items-center justify-between gap-4">
        {/* Case Info */}
        <div className="space-y-0.5 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#D6AE67] uppercase font-bold tracking-wider">
              {activeCase.id}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#111827] text-[#A8B1C1] border border-[#2A3B54]">
              {activeCase.year} • {activeCase.era.toUpperCase()}
            </span>
          </div>
          <h1 className="text-base font-bold text-[#F3F4F6] font-serif tracking-wide truncate max-w-md">
            {activeCase.title[language]}
          </h1>
        </div>

        {/* Dynamic Investigation Progress Counters */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Essential Clues Found */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#2A3B54]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6AE67]" />
            <span className="text-[#A8B1C1]">{t.investigation.cluesDiscovered}:</span>
            <span
              className={`font-bold ${
                essentialFound >= totalEssential ? 'text-emerald-400' : 'text-[#D6AE67]'
              }`}
            >
              {essentialFound}/{totalEssential}
            </span>
          </div>

          {/* Deductions Unlocked Counter */}
          <button
            onClick={() => {
              sound.playClick();
              setShowEvidenceBoard(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#1A263B] border border-[#2B405D] text-xs font-mono transition-colors cursor-pointer"
            title={language === 'kk' ? 'Айғақтар тақтасын ашу' : 'Open Evidence Board'}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#6C94C5]" />
            <span className="text-[#A8B1C1]">{language === 'kk' ? 'Дедукция:' : 'Deductions:'}</span>
            <span className="font-bold text-[#6C94C5]">
              {unlockedDeductionsCount}/{totalConnectionsCount}
            </span>
          </button>

          {/* Suspects Questioned */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1]">{language === 'kk' ? 'Күдіктілер:' : 'Suspects:'}</span>
            <span className="text-white font-bold">{suspectsInterviewedCount}/4</span>
          </div>

          {/* Rooms Explored */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1]">{language === 'kk' ? 'Бөлмелер:' : 'Rooms:'}</span>
            <span className="text-white font-bold">{exploredRoomsCount}/{activeCase.rooms.length}</span>
          </div>
        </div>
      </div>

      {/* 2. DANGER METER (CRISIS MODE ACTIVE) */}
      {activeCase.worldConditionMode === 'crisis' && activeCase.crisisEvent && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3B1116] via-[#2A1218] to-[#182235] border border-rose-900/60 shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  {activeCase.crisisEvent.title[language]}
                </span>
                <span className="text-[11px] text-[#A8B1C1]">
                  {activeCase.crisisEvent.description[language]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#A8B1C1]">{t.crisis.dangerMeter}:</span>
              <span className="font-bold text-rose-400 text-sm">
                {investigationState.dangerMeter || 25}%
              </span>
            </div>
          </div>

          {/* Visual Danger Meter Bar */}
          <div className="w-full h-2 rounded-full bg-[#111827] overflow-hidden border border-rose-900/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-700 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, investigationState.dangerMeter || 25)}%` }}
            />
          </div>

          {/* Emergency Crisis Decisions */}
          {!activeCase.crisisEvent.resolved && activeCase.crisisEvent.emergencyDecisions.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2.5">
              {activeCase.crisisEvent.emergencyDecisions.map((decision) => (
                <button
                  key={decision.id}
                  onClick={() => onTakeCrisisDecision(decision)}
                  className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#202C40] border border-rose-500/40 hover:border-rose-400 text-xs font-medium text-[#F3F4F6] flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{decision.title[language]}</span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    ({decision.dangerDelta > 0 ? `+${decision.dangerDelta}` : decision.dangerDelta}%)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ADVERSARIAL CULPRIT ACTIVE COUNTER-ACTION ALERT */}
      {investigationState.culpritCounterActionActive && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-3 animate-slideDown">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <strong className="text-amber-300 mr-1">
              {language === 'kk' ? 'Қылмыскердің қарсы қимылы:' : 'Culprit Adversarial Maneuver:'}
            </strong>
            {investigationState.culpritCounterActionActive.message[language]}
          </div>
        </div>
      )}

      {/* 4. PROGRESSIVE HINT BANNER */}
      {hintMessage && (
        <div className="p-3.5 rounded-xl bg-[#1A263B] border border-[#D6AE67]/40 text-[#F3F4F6] text-xs flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#D6AE67] shrink-0 mt-0.5" />
            <div>
              <p className="leading-relaxed">{hintMessage.text}</p>
            </div>
          </div>
          <button
            onClick={() => setHintMessage(null)}
            className="text-[#A8B1C1] hover:text-white text-xs font-mono px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 5. MAIN INVESTIGATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Room Scene & Clue Hotspots */}
        <div className="lg:col-span-3 space-y-4">
          {/* Room Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#111827] rounded-xl border border-[#2A3B54] overflow-x-auto">
            {activeCase.rooms.map((room) => {
              const isSelected = room.id === currentRoom.id;
              const uninspectedCount = room.hotspots.filter((h) => !h.inspected).length;

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectRoom(room.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#182235] text-[#D6AE67] shadow-sm border border-[#D6AE67]/40 font-bold'
                      : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
                  }`}
                >
                  {room.isLocked && <Lock className="w-3 h-3 text-[#A8B1C1]" />}
                  <span>{room.name[language]}</span>
                  {uninspectedCount > 0 ? (
                    <span className="w-2 h-2 rounded-full bg-[#D6AE67]" />
                  ) : (
                    <span className="text-[10px] text-emerald-400">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Room Illustration Canvas */}
          <RoomIllustration room={currentRoom} onInspectHotspot={onInspectHotspot} />

          {/* Room Description & Guidance */}
          <div className="p-4 rounded-xl bg-[#182235] border border-[#2A3B54] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-[#A8B1C1]">
              <strong className="text-[#F3F4F6] mr-1">{currentRoom.name[language]}:</strong>
              {currentRoom.description[language]}
            </p>
            <span className="text-[#D6AE67] text-[11px] font-mono shrink-0">
              {t.investigation.hotspotHint}
            </span>
          </div>

          {/* Discovered Clues Strip with Evidence Board Button */}
          <div className="p-4 rounded-xl bg-[#182235] border border-[#2A3B54] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2">
                <span>{t.investigation.discoveredEvidence}</span>
                <span className="font-mono text-[#D6AE67]">({discoveredEvidence.length})</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowEvidenceBoard(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D6AE67]/15 hover:bg-[#D6AE67]/25 text-[#D6AE67] border border-[#D6AE67]/40 text-xs font-bold transition-all cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{language === 'kk' ? 'Айғақтар тақтасы' : 'Evidence Board'}</span>
                  {unlockedDeductionsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#D6AE67] text-[#0B1020] text-[10px] font-extrabold">
                      {unlockedDeductionsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenJournal}
                  className="text-[#6C94C5] hover:underline text-[11px] font-semibold cursor-pointer"
                >
                  {t.evidence.title} →
                </button>
              </div>
            </div>

            {discoveredEvidence.length === 0 ? (
              <p className="text-xs text-[#A8B1C1] italic py-2">
                {t.investigation.emptyEvidence}
              </p>
            ) : (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {discoveredEvidence.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      sound.playClick();
                      setInspectedClue(ev);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111827] border text-left shrink-0 transition-colors cursor-pointer ${
                      ev.isEssential ? 'border-[#D6AE67]' : 'border-[#2A3B54] hover:border-[#6C94C5]'
                    }`}
                  >
                    <div className="text-[#D6AE67]">
                      <EvidenceIcon icon={ev.svgIcon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#F3F4F6] block whitespace-nowrap">
                          {ev.name[language]}
                        </span>
                        {ev.isEssential && (
                          <span className="text-[9px] font-mono uppercase px-1 rounded bg-[#D6AE67]/20 text-[#D6AE67]">
                            Key
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A8B1C1] font-mono block">
                        P(E|C): {(ev.clueWeight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 col: Suspects List & Interrogation trigger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F3F4F6] font-serif uppercase tracking-wider">
              {t.investigation.suspectsTitle}
            </h2>
            <span className="text-xs text-[#A8B1C1] font-mono">
              4 Suspects
            </span>
          </div>

          {/* Suspects Cards with Real Illustrated Portraits */}
          <div className="space-y-3">
            {activeCase.suspects.map((suspect) => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                language={language}
                onInterrogate={(id) => {
                  sound.playClick();
                  const target = activeCase.suspects.find((s) => s.id === id);
                  if (target) setActiveInterrogationSuspect(target);
                }}
                onOpenProfile={(s) => {
                  sound.playClick();
                  setSelectedProfileSuspect(s);
                }}
              />
            ))}
          </div>

          {/* Action Dock */}
          <div className="p-4 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-2.5">
            {/* Interactive Evidence Board Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowEvidenceBoard(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#1E1B4B] hover:from-[#1E3A8A] hover:to-[#2E1065] border border-[#3B82F6]/50 text-xs font-bold text-[#93C5FD] flex items-center justify-between transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <LinkIcon className="w-4 h-4 text-[#D6AE67]" />
                <span>{language === 'kk' ? 'Айғақтар тақтасы' : 'Evidence Board'}</span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white">
                {unlockedDeductionsCount}/{totalConnectionsCount}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenJournal();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-[#202C40] border border-[#2A3B54] text-xs font-semibold text-[#F3F4F6] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#6C94C5]" />
              <span>{t.investigation.notebookBtn}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAILab();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-[#202C40] border border-[#6C94C5]/50 text-xs font-semibold text-[#6C94C5] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              <span>{t.investigation.aiLabBtn}</span>
            </button>

            <button
              onClick={handleProgressiveHint}
              className="w-full py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-[#202C40] border border-[#2A3B54] text-xs font-semibold text-[#D6AE67] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>
                {t.investigation.hintBtn} (Lvl {(investigationState.currentHintLevel % 3) + 1})
              </span>
            </button>

            {/* Official Accusation Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAccusationModal(true);
                }}
                className="w-full py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.investigation.accuseBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeInterrogationSuspect && (
        <InterrogationModal
          suspect={activeInterrogationSuspect}
          discoveredEvidence={discoveredEvidence}
          activeCaseSeed={activeCase.seed}
          onClose={() => setActiveInterrogationSuspect(null)}
          onApplyDialogue={(opt) => {
            onInterrogateDialogue(activeInterrogationSuspect.id, opt);
          }}
          onChallengeWithEvidence={(evidenceId) => {
            onChallengeSuspectWithEvidence(activeInterrogationSuspect.id, evidenceId);
          }}
        />
      )}

      {showAccusationModal && (
        <AccusationModal
          suspects={activeCase.suspects}
          hasAllEssentialClues={essentialFound >= 3}
          onClose={() => setShowAccusationModal(false)}
          onConfirmAccusation={(suspectId, reasoning) => {
            setShowAccusationModal(false);
            onAccuseSuspect(suspectId, reasoning);
          }}
        />
      )}

      {inspectedClue && (
        <ClueInspectModal
          evidence={inspectedClue}
          suspects={activeCase.suspects}
          onClose={() => setInspectedClue(null)}
        />
      )}

      {selectedProfileSuspect && (
        <CharacterProfileModal
          suspect={selectedProfileSuspect}
          language={language}
          onClose={() => setSelectedProfileSuspect(null)}
          onInterrogate={(suspectId) => {
            const target = activeCase.suspects.find((s) => s.id === suspectId);
            if (target) setActiveInterrogationSuspect(target);
          }}
        />
      )}

      {showEvidenceBoard && (
        <EvidenceBoardModal
          caseData={activeCase}
          language={language}
          discoveredEvidence={discoveredEvidence}
          connectedPairs={investigationState.connectedEvidencePairs || []}
          unlockedDeductionIds={investigationState.unlockedDeductions || []}
          onConnectPair={(clueAId, clueBId) => {
            onConnectEvidencePair(clueAId, clueBId);
          }}
          onClose={() => setShowEvidenceBoard(false)}
        />
      )}
    </div>
  );
};
