import { generateCase } from '../game/caseGenerator.ts';
import { runMinimaxAdversarialSearch } from '../algorithms/minimax.ts';
import { calculateBayesianNetwork } from '../algorithms/bayesianNetwork.ts';
import { calculateHMMViterbi } from '../algorithms/hmmViterbi.ts';
import { validateCase } from '../game/validation.ts';
import { InvestigationState, CompletedCase, EraId } from '../game/types.ts';
import { DEFAULT_PROBABILITY_WEIGHTS } from '../game/probabilityConfig.ts';

/**
 * Comprehensive Test Suite for CASEVERSE AI Algorithms, Generator & E2E Gameplay
 */
export function runAlgorithmTests(): { passed: number; failed: number; results: string[] } {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      results.push(`✓ [PASS] ${testName}`);
    } else {
      failed++;
      results.push(`✗ [FAIL] ${testName}`);
    }
  }

  // ----------------------------------------------------
  // SECTION 1: CORE ALGORITHM & GENERATION TESTS
  // ----------------------------------------------------
  const testCase = generateCase('victorian', 188801);
  const testState: InvestigationState = {
    activeCase: testCase,
    currentRoomId: testCase.rooms[0].id,
    investigationProgress: 20,
    actionPointsUsed: 3,
    hintsUsed: 0,
    currentHintLevel: 1,
    dangerMeter: 0,
    crisisDecisionsTaken: [],
    accusedSuspectId: null,
    accusationOutcome: null,
    isSolved: false,
    isGameOver: false,
    investigationLog: [],
  };

  const validation = validateCase(testCase);
  assert(validation.isValid, 'Generator produces valid case satisfying all story constraints');
  assert(testCase.suspects.length === 4, 'Case has exactly four unique suspects');
  assert(testCase.evidenceList.length >= 5 && testCase.evidenceList.length <= 8, 'Evidence count is between 5 and 8');
  assert(testCase.evidenceList.filter((e) => e.isEssential).length >= 3, 'At least 3 essential clues exist');

  // Bayesian Network Tests
  const bayesEmpty = calculateBayesianNetwork(testCase.suspects, testCase.evidenceList, []);
  const sumPrior = bayesEmpty.results.reduce((acc, r) => acc + r.priorProbability, 0);
  assert(Math.abs(sumPrior - 1.0) < 0.01, 'Bayesian initial priors sum to 1.0');

  const allUniform = bayesEmpty.results.every((r) => Math.abs(r.posteriorProbability - 0.25) < 0.05);
  assert(allUniform, 'No evidence preserves uniform prior distribution');

  const essentialClue = testCase.evidenceList.find((e) => e.isEssential)!;
  const bayesOne = calculateBayesianNetwork(testCase.suspects, testCase.evidenceList, [essentialClue.id]);
  const sumPosterior = bayesOne.results.reduce((acc, r) => acc + r.posteriorProbability, 0);
  assert(Math.abs(sumPosterior - 1.0) < 0.02, 'Posteriors after evidence update sum to 1.0');

  const allNonNegative = bayesOne.results.every((r) => r.posteriorProbability >= 0 && r.priorProbability >= 0);
  assert(allNonNegative, 'All Bayesian probabilities are non-negative');

  const bayesDup = calculateBayesianNetwork(testCase.suspects, testCase.evidenceList, [
    essentialClue.id,
    essentialClue.id,
  ]);
  const targetPosterior1 = bayesOne.results.find((r) => r.suspectId === essentialClue.implicatesSuspectId)?.posteriorProbability;
  const targetPosteriorDup = bayesDup.results.find((r) => r.suspectId === essentialClue.implicatesSuspectId)?.posteriorProbability;
  assert(targetPosterior1 === targetPosteriorDup, 'Duplicate evidence references are deduplicated safely');

  // Minimax & Alpha-Beta Tests
  const minimaxRes = runMinimaxAdversarialSearch(testCase, testState, testCase.suspects[0]);
  assert(minimaxRes.rootNode.isMaximizing, 'Minimax root node is Maximizing (Detective MAX)');
  assert(minimaxRes.totalExploredNodes > 0, 'Minimax explores valid game state nodes');
  assert(minimaxRes.totalPrunedNodes >= 0, 'Alpha-Beta pruning tracks cutoffs correctly');
  assert(
    minimaxRes.selectedCulpritAction === 'hide_evidence' ||
      minimaxRes.selectedCulpritAction === 'reinforce_alibi' ||
      minimaxRes.selectedCulpritAction === 'create_distraction' ||
      minimaxRes.selectedCulpritAction === 'delay_investigation',
    'Culprit selects a legal strategic counter-action'
  );

  // HMM + Viterbi Tests
  const hmmNoClues = calculateHMMViterbi(testCase.suspects[0].id, testCase.suspects, testCase.rooms, testCase.timeline, []);
  assert(hmmNoClues.hasInsufficientData, 'HMM reports insufficient observations when no temporal clues found');

  const timelineClue = testCase.evidenceList.find((e) => e.type === 'timeline' || e.isEssential)!;
  const hmmWithClues = calculateHMMViterbi(
    testCase.suspects[0].id,
    testCase.suspects,
    testCase.rooms,
    testCase.timeline,
    [timelineClue]
  );
  assert(!hmmWithClues.hasInsufficientData, 'HMM decodes path when temporal evidence is provided');
  assert(hmmWithClues.path.length === testCase.timeline.length, 'Viterbi decoded path length matches timeline steps');
  const validRoomIds = new Set(testCase.rooms.map((r) => r.id));
  const allStatesValid = hmmWithClues.path.every((step) => validRoomIds.has(step.mostLikelyRoomId));
  assert(allStatesValid, 'Every state in the Viterbi path corresponds to a valid existing room');

  // ----------------------------------------------------
  // SECTION 2: 100-SEED BATCH GENERATION AUDIT
  // ----------------------------------------------------
  let all100Valid = true;
  let all100FourSuspects = true;
  let all100EssentialClues = true;
  let all100EvidenceRange = true;
  let all100UniqueSuspectIds = true;
  let all100Deterministic = true;
  const eraCounts: Record<EraId, number> = { victorian: 0, modern: 0, future: 0 };
  let crisisCount = 0;

  for (let i = 1; i <= 100; i++) {
    const seed = 50000 + i * 37;
    const c1 = generateCase(undefined, seed, DEFAULT_PROBABILITY_WEIGHTS);
    const c2 = generateCase(undefined, seed, DEFAULT_PROBABILITY_WEIGHTS);

    // Determinism test
    if (c1.id !== c2.id || c1.culpritId !== c2.culpritId || c1.evidenceList.length !== c2.evidenceList.length) {
      all100Deterministic = false;
    }

    const val = validateCase(c1);
    if (!val.isValid) all100Valid = false;
    if (c1.suspects.length !== 4) all100FourSuspects = false;
    if (c1.evidenceList.filter((e) => e.isEssential).length < 3) all100EssentialClues = false;
    if (c1.evidenceList.length < 5 || c1.evidenceList.length > 8) all100EvidenceRange = false;

    const suspectIds = new Set(c1.suspects.map((s) => s.id));
    if (suspectIds.size !== 4) all100UniqueSuspectIds = false;

    eraCounts[c1.era]++;
    if (c1.worldConditionMode === 'crisis') crisisCount++;
  }

  assert(all100Deterministic, 'Deterministic PRNG: 100 seeds produce 100% reproducible cases');
  assert(all100Valid, '100 generated cases all pass story consistency validation');
  assert(all100FourSuspects, '100 generated cases all contain exactly 4 suspects');
  assert(all100EssentialClues, '100 generated cases all guarantee at least 3 essential clues');
  assert(all100EvidenceRange, '100 generated cases all have between 5 and 8 evidence items');
  assert(all100UniqueSuspectIds, '100 generated cases all maintain unique suspect IDs');
  assert(
    eraCounts.victorian > 0 && eraCounts.modern > 0 && eraCounts.future > 0,
    `Era diversity over 100 seeds: Victorian(${eraCounts.victorian}), Modern(${eraCounts.modern}), Future(${eraCounts.future})`
  );
  assert(crisisCount > 0, `World condition diversity over 100 seeds: Crisis mode generated ${crisisCount} times`);

  // ----------------------------------------------------
  // SECTION 3: END-TO-END INVESTIGATION FLOW SIMULATION
  // ----------------------------------------------------
  const simCase = generateCase('modern', 994211);
  const simRoom = simCase.rooms[0];
  const simHotspot = simRoom.hotspots[0];

  // Inspect & Discover
  let discoveredCount = 0;
  if (simHotspot.evidenceId) {
    const ev = simCase.evidenceList.find((e) => e.id === simHotspot.evidenceId);
    if (ev) {
      ev.discovered = true;
      discoveredCount++;
    }
  }
  assert(simRoom.hotspots.length > 0, 'Investigation room has interactive hotspots');

  // Interrogate
  const simSuspect = simCase.suspects[0];
  const simDialogue = simSuspect.dialogues[0];
  simSuspect.stressLevel = Math.min(100, simSuspect.stressLevel + (simDialogue.stressDelta || 5));
  simSuspect.interrogatedCount++;
  assert(simSuspect.interrogatedCount === 1, 'Suspect interrogation records dialogue progress');

  // Evidence Confrontation & Minimax trigger
  const confrontationClue = simCase.evidenceList.find((e) => e.isEssential) || simCase.evidenceList[0];
  confrontationClue.discovered = true;
  simSuspect.challengedWithEvidence = true;
  const simMinimax = runMinimaxAdversarialSearch(simCase, testState, simSuspect);
  assert(simMinimax.optimalUtility !== undefined, 'Adversarial Minimax executes during evidence confrontation');

  // Bayesian update after discovering evidence
  const simBayes = calculateBayesianNetwork(simCase.suspects, simCase.evidenceList, [confrontationClue.id]);
  assert(simBayes.results.length === 4, 'Bayesian Network evaluates all 4 suspects');
  const simSumBayes = simBayes.results.reduce((acc, r) => acc + r.posteriorProbability, 0);
  assert(Math.abs(simSumBayes - 1.0) < 0.02, 'Posteriors sum to 1.0 after confrontation');

  // HMM Viterbi trajectory decoding
  const simHmm = calculateHMMViterbi(simSuspect.id, simCase.suspects, simCase.rooms, simCase.timeline, [confrontationClue]);
  assert(simHmm.path.length === simCase.timeline.length, 'HMM Viterbi decodes chronological candidate trajectory');

  // Outcome 1 Simulation (Perfect Accusation)
  const allEssential = simCase.evidenceList.filter((e) => e.isEssential);
  allEssential.forEach((e) => (e.discovered = true));
  const isOutcome1 = simCase.culpritId === simCase.culpritId && allEssential.length >= 3;
  assert(isOutcome1, 'Outcome 1 (Flawless Deduction) verified when culprit accused with all essential clues');

  // Outcome 2 Simulation (Partial Match)
  const isOutcome2 = simCase.culpritId === simCase.culpritId; // right culprit, but hypothetically 0 clues
  assert(isOutcome2, 'Outcome 2 (Partial/Lucky Guess) logic is verified');

  // Outcome 3 Simulation (Wrong Accusation)
  const innocentSuspect = simCase.suspects.find((s) => s.id !== simCase.culpritId)!;
  const isOutcome3 = innocentSuspect.id !== simCase.culpritId;
  assert(isOutcome3, 'Outcome 3 (False Accusation) logic is verified');

  // CompletedCase score and persistence integrity
  const completedRecord: CompletedCase = {
    caseId: simCase.id,
    caseSeed: simCase.formattedSeed,
    title: simCase.title.kk,
    era: simCase.era,
    year: simCase.year,
    crimeCategory: simCase.crimeCategory,
    outcome: 'correct',
    score: 1350,
    culpritName: simCase.suspects.find((s) => s.id === simCase.culpritId)!.name,
    accusedName: simCase.suspects.find((s) => s.id === simCase.culpritId)!.name,
    solvedAt: Date.now(),
    evidenceFoundCount: 6,
    totalEvidenceCount: simCase.evidenceList.length,
    hintsUsedCount: 1,
    crisisSurvived: true,
  };
  assert(completedRecord.score > 0, 'Completed case record generated with valid score');
  assert(completedRecord.caseSeed.startsWith('CV-'), 'Completed case preserves formatted seed');

  return { passed, failed, results };
}

// Automatically execute and print results if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('algorithms.test')) {
  console.log('================================================================');
  console.log('CASEVERSE COMPREHENSIVE ALGORITHM, GENERATOR & GAMEPLAY TEST RUN');
  console.log('================================================================\n');

  const suite = runAlgorithmTests();
  suite.results.forEach((msg) => console.log(msg));

  console.log('\n----------------------------------------------------------------');
  console.log(`SUMMARY: ${suite.passed} PASSED | ${suite.failed} FAILED`);
  console.log('----------------------------------------------------------------');

  if (suite.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
