import {
  EraId,
  WorldConditionMode,
  EvidenceRarity,
  GeneratedCase,
  Suspect,
  Room,
  Evidence,
  TimelineStep,
  CrisisEvent,
  SuspectPersonalityTrait,
  EvidenceConnectionRule,
} from './types.ts';
import { SeededRNG, GENERATOR_VERSION } from '../utils/seededRandom.ts';
import { validateCase } from './validation.ts';
import { DEFAULT_PROBABILITY_WEIGHTS, ProbabilityWeights } from './probabilityConfig.ts';
import { selectBlueprint, STORY_BLUEPRINTS, StoryBlueprint } from './storyBlueprints.ts';
import { assignPortrait } from './characterPortraits.ts';

/**
 * Procedural Case Generator for CASEVERSE
 * Builds a deterministic, validated, era-accurate detective mystery case
 * driven by the Story Blueprint Engine and real 24-portrait character library.
 */
export function generateCase(
  preferredEra?: EraId,
  customSeed?: number | string,
  customWeights?: ProbabilityWeights
): GeneratedCase {
  const rng = new SeededRNG(customSeed);
  const weights = customWeights || DEFAULT_PROBABILITY_WEIGHTS;

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const generated = buildScenario(rng, preferredEra, weights);
      const validation = validateCase(generated);

      if (validation.isValid) {
        return generated;
      }
    } catch {
      // Retry with shifted seed
    }
    attempts++;
  }

  // Deterministic guaranteed fallback scenario if all procedural attempts fail
  return buildDeterministicFallback(rng);
}

function buildScenario(
  rng: SeededRNG,
  preferredEra: EraId | undefined,
  weights: ProbabilityWeights
): GeneratedCase {
  const seed = rng.getSeed();
  const formattedSeed = rng.getFormattedSeed();

  // 1. Select Era using weighted random
  const eraList: EraId[] = ['victorian', 'modern', 'future'];
  const eraWeightsList = [
    weights.eras.victorian,
    weights.eras.modern,
    weights.eras.future,
  ];
  const era: EraId = preferredEra || rng.weightedPick(eraList, eraWeightsList);

  // 2. Select Year within Era
  let year = 1888;
  if (era === 'victorian') {
    year = rng.nextInt(1840, 1899);
  } else if (era === 'modern') {
    year = rng.nextInt(2005, 2026);
  } else {
    year = rng.nextInt(2120, 2290);
  }

  // 3. Select World Condition Mode
  const modeList: WorldConditionMode[] = ['normal', 'crisis'];
  const modeWeights = [weights.worldModes.normal, weights.worldModes.crisis];
  const worldMode: WorldConditionMode = rng.weightedPick(modeList, modeWeights);

  // 4. Select Story Blueprint
  const blueprintIndex = rng.nextInt(0, 100);
  const blueprint = selectBlueprint(era, blueprintIndex);

  return assembleBlueprintCase(rng, seed, formattedSeed, era, year, worldMode, weights, blueprint);
}

function assembleBlueprintCase(
  rng: SeededRNG,
  seed: number,
  formattedSeed: string,
  era: EraId,
  year: number,
  worldMode: WorldConditionMode,
  weights: ProbabilityWeights,
  blueprint: StoryBlueprint
): GeneratedCase {
  const caseId = `CV-${era.slice(0, 3).toUpperCase()}-${year}-${rng.nextInt(1000, 9999)}`;

  // 1. Build Crisis Event if crisis mode
  let crisisEvent: CrisisEvent | undefined = undefined;
  if (worldMode === 'crisis') {
    crisisEvent = buildCrisisForEra(era, rng);
  }

  // 2. Build 5 Rooms with Interactive Hotspots
  const rooms: Room[] = blueprint.rooms.map((r) => ({
    id: `room_${blueprint.key}_${r.idSuffix}`,
    name: r.name,
    description: r.description,
    era,
    themeColor: r.themeColor,
    isLocked: false,
    inspected: false,
    hotspots: r.hotspots.map((h) => ({
      id: `spot_${blueprint.key}_${h.idSuffix}`,
      label: h.label,
      x: h.x,
      y: h.y,
      inspected: false,
      evidenceId: h.evidenceSuffix ? `ev_${blueprint.key}_${h.evidenceSuffix}` : undefined,
      flavorText: h.flavorText,
    })),
  }));

  // 3. Suspect Assignment with Character Portraits (No duplicates per case)
  const usedPortraitIds = new Set<string>();

  // Determine culprit index based on blueprint defaultCulpritRole
  let culpritIndex = blueprint.roles.findIndex((r) => r.slot === blueprint.defaultCulpritRole);
  if (culpritIndex === -1) culpritIndex = 0;

  const suspects: Suspect[] = blueprint.roles.map((role, idx) => {
    const isCulprit = idx === culpritIndex;
    const portrait = assignPortrait(era, role.portraitTags, usedPortraitIds, role.genderPreference);
    usedPortraitIds.add(portrait.portraitId);

    const alibiRoom = rooms[role.alibiRoomIndex] || rooms[0];

    return {
      id: `suspect_${idx}`,
      portraitId: portrait.portraitId,
      portraitSrc: portrait.imageSrc,
      name: role.defaultName.en,
      age: 28 + ((idx * 13 + (seed % 17)) % 38),
      gender: role.genderPreference,
      roleSlot: role.slot,
      profession: role.profession,
      professionCapability: role.professionCapability,
      bio: role.bio,
      personalityTraits: role.personality,
      trustScore: isCulprit ? 35 : 68,
      stressLevel: isCulprit ? 65 : 22,
      communicationStyle: role.communicationStyle,
      relationships: role.relationships,
      hiddenSecret: role.hiddenSecret,
      motive: isCulprit ? role.culpritMotive : role.publicMotive,
      alibi: role.alibiClaim,
      alibiRoomId: alibiRoom.id,
      isCulprit,
      interrogatedCount: 0,
      challengedWithEvidence: false,
      avatarStyle: {
        skinTone: '#f5d0b5',
        hairColor: '#2b1810',
        hairStyle: 'slick',
        clothingColor: '#3f2e21',
        accessory: 'glasses',
        expression: isCulprit ? 'nervous' : 'calm',
      },
      dialogues: [
        {
          id: `dlg_${idx}_timeline`,
          category: 'timeline',
          question: {
            kk: `Оқиға кезінде сағат ${blueprint.crimeTime.split('—')[0]?.trim() || '21:00'} шамасында қайда болдыңыз?`,
            en: `Where exactly were you around ${blueprint.crimeTime.split('—')[0]?.trim() || '21:00'} during the incident?`,
          },
          response: isCulprit
            ? {
                kk: `Мен өз бөлмемде жұмыс істеп отырдым. Менің сөзіме күмәндануға ешқандай негіз жоқ!`,
                en: `I was attending to my scheduled obligations in my quarters. You have no right to interrogate me!`,
              }
            : {
                kk: `Мен өз орнымда болдым: ${role.alibiClaim.kk}. Мені басқалар да көре алды.`,
                en: `I was precisely at my post: ${role.alibiClaim.en}. Anyone can confirm my presence.`,
              },
          confrontationResponse: {
            kk: `(Сасқалақтап, дауысы дірілдей) Жарайды! Мен дәлізге шыққаным рас, бірақ мен мұны жалғыз жасамадым!`,
            en: `(Flustered and trembling) Fine! I admit I stepped into the restricted corridor, but I was not acting alone!`,
          },
          requiredEvidenceId: `ev_${blueprint.key}_${blueprint.evidenceTemplates[0]?.idSuffix || 'altered_gear'}`,
          tactic: 'evidence_present',
          stressDelta: isCulprit ? 25 : 5,
          trustDelta: isCulprit ? -15 : 5,
        },
        {
          id: `dlg_${idx}_motive`,
          category: 'motive',
          question: {
            kk: `Осы іске немесе құпияға қандай жеке мүддеңіз бар еді?`,
            en: `What personal stake did you hold regarding this incident or secret?`,
          },
          response: {
            kk: `${role.publicMotive.kk}. Бірақ бұл менің қылмыс жасайтынымды білдірмейді.`,
            en: `${role.publicMotive.en}. However, that hardly implies criminal intent on my part.`,
          },
          tactic: 'pressuring',
          stressDelta: isCulprit ? 18 : 5,
          trustDelta: -5,
        },
        {
          id: `dlg_${idx}_object`,
          category: 'object',
          question: {
            kk: `Оқиға орнында табылған заттай айғақтар туралы не білесіз?`,
            en: `What can you tell me about the evidence recovered from the primary scene?`,
          },
          response: isCulprit
            ? {
                kk: `Мен ол туралы ештеңе білмеймін! Бұл мені тұзаққа түсіру үшін жасалған жала!`,
                en: `I know nothing about it! Someone is deliberately trying to frame me!`,
              }
            : {
                kk: `Ондай жабдық тек арнайы рұқсаты бар мамандарда ғана болуы мүмкін. Менің қатысым жоқ.`,
                en: `Such tools or materials require specific authorization. I have had no involvement with them.`,
              },
          tactic: 'friendly',
          stressDelta: isCulprit ? 20 : 0,
          trustDelta: 0,
        },
      ],
    };
  });

  const culprit = suspects[culpritIndex];

  // Helper map for linking roles to suspect IDs
  const roleToSuspectId: Record<string, string> = {};
  suspects.forEach((s) => {
    roleToSuspectId[s.roleSlot] = s.id;
  });

  // 4. Evidence List Assembly (Guarantees at least 3 Essential Clues)
  const rarityList: EvidenceRarity[] = ['common', 'uncommon', 'rare', 'special'];
  const rarityWeights = [
    weights.itemRarity.common,
    weights.itemRarity.uncommon,
    weights.itemRarity.rare,
    weights.itemRarity.special,
  ];

  const evidenceList: Evidence[] = blueprint.evidenceTemplates.map((template) => {
    const targetRoom = rooms[template.roomIndex] || rooms[0];
    const implicatesId = template.implicatesRole ? roleToSuspectId[template.implicatesRole] : undefined;
    const exoneratesId = template.exoneratesRole ? roleToSuspectId[template.exoneratesRole] : undefined;

    return {
      id: `ev_${blueprint.key}_${template.idSuffix}`,
      name: template.name,
      description: template.description,
      type: template.type,
      rarity: template.isEssential ? 'rare' : rng.weightedPick(rarityList, rarityWeights),
      roomId: targetRoom.id,
      discovered: false,
      analyzed: false,
      isEssential: template.isEssential,
      isMisleading: template.isMisleading,
      misleadingExplanation: template.misleadingExplanation,
      implicatesSuspectId: implicatesId,
      exoneratesSuspectId: exoneratesId,
      svgIcon: template.svgIcon,
      clueWeight: template.clueWeight,
    };
  });

  // 5. Timeline Generation (Chronological consistency with rooms and suspects)
  const timeTokens = blueprint.crimeTime.split('—').map((t) => t.trim());
  const tStart = timeTokens[0] || '20:00';
  const tEnd = timeTokens[1] || '21:00';

  const timeline: TimelineStep[] = [
    {
      time: tStart,
      trueLocation: {
        suspect_0: suspects[0].alibiRoomId,
        suspect_1: suspects[1].alibiRoomId,
        suspect_2: suspects[2].alibiRoomId,
        suspect_3: suspects[3].alibiRoomId,
      },
      apparentLocation: {
        suspect_0: suspects[0].alibiRoomId,
        suspect_1: suspects[1].alibiRoomId,
        suspect_2: suspects[2].alibiRoomId,
        suspect_3: suspects[3].alibiRoomId,
      },
      eventDescription: {
        kk: `Барлық күдіктілер өздерінің бастапқы орындарында болғанын мәлімдейді.`,
        en: `All four persons of interest claim to be at their designated stations.`,
      },
    },
    {
      time: 'Incident',
      trueLocation: {
        suspect_0: culpritIndex === 0 ? rooms[0].id : suspects[0].alibiRoomId,
        suspect_1: culpritIndex === 1 ? rooms[0].id : suspects[1].alibiRoomId,
        suspect_2: culpritIndex === 2 ? rooms[0].id : suspects[2].alibiRoomId,
        suspect_3: culpritIndex === 3 ? rooms[0].id : suspects[3].alibiRoomId,
      },
      apparentLocation: {
        suspect_0: suspects[0].alibiRoomId,
        suspect_1: suspects[1].alibiRoomId,
        suspect_2: suspects[2].alibiRoomId,
        suspect_3: suspects[3].alibiRoomId,
      },
      eventDescription: {
        kk: `${blueprint.hook.kk} Қылмыскер қылмыс орнына жасырын өтіп, әрекет жасады.`,
        en: `${blueprint.hook.en} The perpetrator slipped into the scene to execute the act.`,
      },
    },
    {
      time: tEnd,
      trueLocation: {
        suspect_0: culpritIndex === 0 ? rooms[1].id : suspects[0].alibiRoomId,
        suspect_1: culpritIndex === 1 ? rooms[1].id : suspects[1].alibiRoomId,
        suspect_2: culpritIndex === 2 ? rooms[1].id : suspects[2].alibiRoomId,
        suspect_3: culpritIndex === 3 ? rooms[1].id : suspects[3].alibiRoomId,
      },
      apparentLocation: {
        suspect_0: suspects[0].alibiRoomId,
        suspect_1: suspects[1].alibiRoomId,
        suspect_2: suspects[2].alibiRoomId,
        suspect_3: suspects[3].alibiRoomId,
      },
      eventDescription: {
        kk: `Қылмыскер айғақтарды жасырып, жалған алибиін бекіту үшін кері оралды.`,
        en: `The culprit concealed the primary evidence and reinforced their fabricated alibi.`,
      },
    },
  ];

  // 6. Evidence Connection Rules for the Evidence Board
  const evidenceConnections: EvidenceConnectionRule[] = blueprint.connections.map((c) => ({
    id: `conn_${blueprint.key}_${c.id}`,
    clueAId: `ev_${blueprint.key}_${c.clueASuffix}`,
    clueBId: `ev_${blueprint.key}_${c.clueBSuffix}`,
    deductionTitle: c.deductionTitle,
    deductionText: c.deductionText,
    revealedSuspectId: c.culpritImplication ? culprit.id : undefined,
  }));

  // 7. Misleading Explanations
  const misleadingExplanations = evidenceList
    .filter((e) => e.isMisleading && e.misleadingExplanation)
    .map((e) => ({
      clueId: e.id,
      text: e.misleadingExplanation!,
    }));

  return {
    id: caseId,
    seed,
    formattedSeed,
    generatorVersion: GENERATOR_VERSION,
    blueprintKey: blueprint.key,
    title: blueprint.title,
    introduction: {
      kk: `${year} жыл. ${blueprint.hook.kk}`,
      en: `Year ${year}. ${blueprint.hook.en}`,
    },
    era,
    year,
    worldConditionMode: worldMode,
    worldCondition: crisisEvent ? crisisEvent.title.en : 'Standard Case Investigation',
    crisisEvent,
    crimeCategory: blueprint.crimeCategory,
    crimeSummary: blueprint.centralMystery,
    crimeTime: blueprint.crimeTime,
    victim: blueprint.victim,
    culpritId: culprit.id,
    suspects,
    rooms,
    evidenceList,
    timeline,
    actNarrative: {
      hook: blueprint.hook,
      centralMystery: blueprint.centralMystery,
      midpointTwist: blueprint.midpointTwist,
      finalTwist: blueprint.finalTwist,
    },
    evidenceConnections,
    solutionExplanation: blueprint.solutionExplanation,
    misleadingExplanations,
    createdAt: Date.now(),
  };
}

function buildCrisisForEra(era: EraId, rng: SeededRNG): CrisisEvent {
  if (era === 'victorian') {
    return {
      id: 'crisis_vic_blizzard',
      title: { kk: 'Қарлы боран оқшаулауы', en: 'Blizzard Isolation Emergency' },
      description: {
        kk: 'Қатты боран теміржол қатынасы мен телеграф сымдарын үзді. Жылу қазандығы бұзылу алдында.',
        en: 'A fierce blizzard severed all telegraph lines and mountain roads. The coal boiler is near collapse.',
      },
      dangerLevel: 30,
      maxDanger: 100,
      resolved: false,
      emergencyDecisions: [
        {
          id: 'dec_boiler',
          title: { kk: 'Қазандықты реттеу және жылуды сақтау', en: 'Stabilize Coal Boiler' },
          description: { kk: 'Қауіпті азайту үшін тергеуге 2 минут үзіліс жасау.', en: 'Divert attention to contain the heating system pressure.' },
          dangerDelta: -25,
          consequenceText: { kk: 'Қауіп деңгейі төмендеді, бірақ қылмыскер уақыт ұтты.', en: 'Danger abated safely, giving you breathing room.' },
        },
        {
          id: 'dec_push',
          title: { kk: 'Қауіпке қарамастан тергеуді үдету', en: 'Investigate at High Risk' },
          description: { kk: 'Уақыт жоғалтпай, суық дәліздерден қосымша айғақтар іздеу.', en: 'Push forward into freezing corridors without hesitation.' },
          dangerDelta: 20,
          consequenceText: { kk: 'Тергеу үдеді, бірақ ғимараттағы қауіп өсті.', en: 'Investigation accelerated, but structural danger spiked.' },
        },
      ],
    };
  } else if (era === 'modern') {
    return {
      id: 'crisis_mod_blackout',
      title: { kk: 'Қалалық электр желісінің бұзылуы (Blackout)', en: 'City-Wide Grid Blackout' },
      description: {
        kk: 'Ғимаратта негізгі жарық пен салқындату жүйесі сөнді. Қосалқы батареялар тез таусылуда.',
        en: 'The municipal power grid failed and backup server batteries are draining rapidly under cyberattack.',
      },
      dangerLevel: 35,
      maxDanger: 100,
      resolved: false,
      emergencyDecisions: [
        {
          id: 'dec_generator',
          title: { kk: 'Резервтік дизель генераторын қосу', en: 'Engage Auxiliary Diesel Generator' },
          description: { kk: 'Сервердің салқындауын сақтап, қауіп деңгейін төмендету.', en: 'Restore emergency lighting and backup ventilation.' },
          dangerDelta: -30,
          consequenceText: { kk: 'Ғимараттың қуат жүйесі тұрақталды.', en: 'Emergency power stabilized across all terminal decks.' },
        },
        {
          id: 'dec_bypass',
          title: { kk: 'Қауіпсіздік фаерволын айналып өту', en: 'Override Cyber Firewalls Directly' },
          description: { kk: 'Серверге жылдам кіру үшін қорғанысты төмендету.', en: 'Bypass security gates, risking electronic overload.' },
          dangerDelta: 20,
          consequenceText: { kk: 'Терминалдар қосылды, бірақ желілік қауіп өсті.', en: 'Network access gained at the cost of security stability.' },
        },
      ],
    };
  } else {
    return {
      id: 'crisis_fut_radiation',
      title: { kk: 'Күн жарқылы және радиациялық дабыл', en: 'Solar Flare Radiation Warning' },
      description: {
        kk: 'Станцияға жоғары радиациялық күн желі соғуда. Қорғаныс өрісінің қуаты 40%-ға төмендеді.',
        en: 'A high-intensity coronal mass ejection is bombarding the station shields; life-support is strained.',
      },
      dangerLevel: 40,
      maxDanger: 100,
      resolved: false,
      emergencyDecisions: [
        {
          id: 'dec_shields',
          title: { kk: 'Магниттік қалқандарды максималға қою', en: 'Boost Magnetic Deflector Grid' },
          description: { kk: 'Қауіп деңгейін төмендетіп, радиобөгеуілдерді азайту.', en: 'Divert reactor reserve power to re-align ionizing shields.' },
          dangerDelta: -30,
          consequenceText: { kk: 'Станция қорғанысы қалпына келтірілді.', en: 'Shield integrity stabilized across primary living rings.' },
        },
        {
          id: 'dec_evac',
          title: { kk: 'Радиациялық сектор арқылы тікелей өту', en: 'Bypass Through Hot Zone' },
          description: { kk: 'Шұғыл айғақ алу үшін радиация қаупіне бару.', en: 'Cross ionizing conduit bay without delay.' },
          dangerDelta: 25,
          consequenceText: { kk: 'Уақыт ұтылды, бірақ станцияның тұрақсыздығы күшейді.', en: 'Valuable time gained at significant radiation exposure cost.' },
        },
      ],
    };
  }
}

// Guaranteed deterministic fallback scenario
function buildDeterministicFallback(rng: SeededRNG): GeneratedCase {
  const fallbackBlueprint = STORY_BLUEPRINTS[0];
  return assembleBlueprintCase(
    rng,
    188801,
    'CV-VIC-1888-0001',
    'victorian',
    1888,
    'normal',
    DEFAULT_PROBABILITY_WEIGHTS,
    fallbackBlueprint
  );
}
