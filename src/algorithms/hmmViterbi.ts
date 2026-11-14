import { Room, TimelineStep, Evidence, Suspect } from '../game/types.ts';
import { HMMViterbiResult, ViterbiStepResult, CandidateHMMFit } from './algorithmTypes.ts';

/**
 * Real Hidden Markov Model + Viterbi Dynamic Programming (Week 7: Sequential Reasoning)
 *
 * Hidden States (K): Actual case rooms (5 to 8 locations)
 * Time Steps (T): Discrete observation windows from the crime chronology
 * Observations: Discovered temporal clues, access swipes, CCTV sightings, or witness notes
 */
export function calculateHMMViterbi(
  suspectId: string,
  suspects: Suspect[],
  rooms: Room[],
  timeline: TimelineStep[],
  discoveredEvidence: Evidence[]
): HMMViterbiResult {
  const K = rooms.length;
  const T = timeline.length;
  const targetSuspect = suspects.find((s) => s.id === suspectId) || suspects[0];

  // Filter temporal & forensic observations
  const temporalClues = discoveredEvidence.filter(
    (e) =>
      e.type === 'timeline' ||
      e.type === 'digital' ||
      e.type === 'physical' ||
      e.type === 'biological' ||
      e.type === 'document' ||
      e.isEssential
  );

  const hasInsufficientData = temporalClues.length === 0;

  if (K === 0 || T === 0 || hasInsufficientData) {
    return {
      suspectId: targetSuspect.id,
      suspectName: targetSuspect.name,
      path: [],
      observationFitScore: 0,
      hasInsufficientData: true,
      explanation: {
        kk: "Витерби алгоритмімен қозғалысты қайта құру үшін кем дегенде бір уақытша немесе заттай айғақ қажет. Бөлмелерді мұқият тексеріңіз.",
        en: "Insufficient temporal observations. Discover timeline evidence, access records, or watches to reconstruct the sequence of movements.",
      },
      candidateComparison: [],
    };
  }

  // 1. Initial State Probability Vector Pi: based on claimed starting location
  function getInitialProbabilities(candidate: Suspect): number[] {
    const claimRoomId = timeline[0]?.apparentLocation[candidate.id];
    return rooms.map((room) => {
      if (room.id === claimRoomId) return 0.65;
      return 0.35 / Math.max(1, K - 1);
    });
  }

  // 2. Transition Probability Matrix A[i][j]: P(Room_j at t | Room_i at t-1)
  // Higher probability of staying or transitioning to neighboring rooms
  function buildTransitionMatrix(candidate: Suspect): number[][] {
    const A: number[][] = [];
    for (let i = 0; i < K; i++) {
      A[i] = [];
      for (let j = 0; j < K; j++) {
        if (i === j) {
          A[i][j] = 0.45; // staying in the same room
        } else {
          // Transition to adjacent room; slightly adjusted if candidate has professional room affinity
          A[i][j] = 0.55 / Math.max(1, K - 1);
        }
      }
    }
    return A;
  }

  // 3. Emission Probability Matrix B[j][t]: P(Observation_t | Room_j)
  function buildEmissionMatrix(candidate: Suspect): number[][] {
    const B: number[][] = [];
    for (let j = 0; j < K; j++) {
      B[j] = [];
      const room = rooms[j];

      for (let t = 0; t < T; t++) {
        const step = timeline[t];
        // Evidence discovered in this room that implicates or exonerates this candidate
        const roomClues = temporalClues.filter((e) => e.roomId === room.id);
        const matchingClue = roomClues.find((e) => e.implicatesSuspectId === candidate.id);
        const claimedHere = step.apparentLocation[candidate.id] === room.id;

        let emission = 0.15; // baseline noise
        if (matchingClue) {
          emission += matchingClue.clueWeight * 0.75;
        }
        if (claimedHere) {
          emission += 0.2;
        }

        B[j][t] = Math.min(0.98, Math.max(0.05, emission));
      }
    }
    return B;
  }

  // 4. Run Viterbi for a specific suspect
  function runViterbiForSuspect(candidate: Suspect) {
    const Pi = getInitialProbabilities(candidate);
    const A = buildTransitionMatrix(candidate);
    const B = buildEmissionMatrix(candidate);

    // Delta trellis table: V[t][j] = max probability of state j at step t
    const V: number[][] = Array.from({ length: T }, () => Array(K).fill(0));
    const backpointer: number[][] = Array.from({ length: T }, () => Array(K).fill(0));

    // Initialization (t = 0)
    for (let j = 0; j < K; j++) {
      V[0][j] = Pi[j] * B[j][0];
      backpointer[0][j] = 0;
    }

    // Recursion (t = 1 .. T-1)
    for (let t = 1; t < T; t++) {
      for (let j = 0; j < K; j++) {
        let maxVal = -1;
        let bestPrev = 0;

        for (let i = 0; i < K; i++) {
          const val = V[t - 1][i] * A[i][j];
          if (val > maxVal) {
            maxVal = val;
            bestPrev = i;
          }
        }

        V[t][j] = maxVal * B[j][t];
        backpointer[t][j] = bestPrev;
      }

      // Step normalization to prevent float underflow
      const sum = V[t].reduce((acc, val) => acc + val, 0) || 1e-9;
      for (let j = 0; j < K; j++) {
        V[t][j] = V[t][j] / sum;
      }
    }

    // Termination: Best final state
    let maxFinalProb = -1;
    let bestFinalState = 0;
    for (let j = 0; j < K; j++) {
      if (V[T - 1][j] > maxFinalProb) {
        maxFinalProb = V[T - 1][j];
        bestFinalState = j;
      }
    }

    // Backtracking the optimal hidden path
    const bestPath: number[] = new Array(T);
    bestPath[T - 1] = bestFinalState;
    for (let t = T - 1; t > 0; t--) {
      bestPath[t - 1] = backpointer[t][bestPath[t]];
    }

    // Build timeline results
    const stepResults: ViterbiStepResult[] = bestPath.map((roomIdx, t) => {
      const room = rooms[roomIdx];
      const step = timeline[t];
      const associated = temporalClues.find((e) => e.roomId === room.id);

      const columns = rooms.map((r, rIdx) => ({
        roomId: r.id,
        roomName: r.name,
        deltaScore: Math.round(V[t][rIdx] * 100) / 100,
      }));

      return {
        timestamp: step.time,
        mostLikelyRoomId: room.id,
        mostLikelyRoomName: room.name,
        probability: Math.round(V[t][roomIdx] * 100) / 100,
        logProbability: Math.round(Math.log(Math.max(1e-9, V[t][roomIdx])) * 100) / 100,
        trellisColumns: columns,
        associatedObservation: associated
          ? { id: associated.id, name: associated.name, type: associated.type }
          : undefined,
      };
    });

    const fitScore = Math.min(100, Math.round(maxFinalProb * 100));

    return {
      stepResults,
      fitScore,
      pathSummary: stepResults.map((s) => s.mostLikelyRoomName.en).join(' → '),
    };
  }

  // Run for target suspect
  const targetResult = runViterbiForSuspect(targetSuspect);

  // Candidate comparison across all 4 suspects
  const candidateComparison: CandidateHMMFit[] = suspects.map((cand) => {
    const res = runViterbiForSuspect(cand);
    return {
      suspectId: cand.id,
      suspectName: cand.name,
      fitScore: res.fitScore,
      pathSummary: res.pathSummary,
    };
  });

  return {
    suspectId: targetSuspect.id,
    suspectName: targetSuspect.name,
    path: targetResult.stepResults,
    observationFitScore: targetResult.fitScore,
    hasInsufficientData: false,
    candidateComparison,
    explanation: {
      kk: `Витерби алгоритмімен есептелген ${targetSuspect.name} үшін ең ықтимал жасырын қозғалыс тізбегі: ${targetResult.stepResults.map((s) => `${s.timestamp} (${s.mostLikelyRoomName.kk})`).join(' → ')}. Бақылауларға сәйкестік: ${targetResult.fitScore}%.`,
      en: `Viterbi dynamic programming optimal hidden path for ${targetSuspect.name}: ${targetResult.stepResults.map((s) => `${s.timestamp} (${s.mostLikelyRoomName.en})`).join(' → ')}. Observation timeline fit: ${targetResult.fitScore}%.`,
    },
  };
}
