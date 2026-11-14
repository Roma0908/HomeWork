import { EraId } from './types.ts';

// Dynamic base path resolver compatible with Vite dev server, static GitHub Pages base path, and CLI tsx
const getBaseUrl = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
      return import.meta.env.BASE_URL.replace(/\/$/, '');
    }
  } catch {
    // Node environment fallback
  }
  return '';
};

const getPortraitPath = (era: string, filename: string) => `${getBaseUrl()}/assets/characters/${era}/${filename}`;

export interface CharacterPortrait {
  portraitId: string;
  imageSrc: string;
  era: EraId;
  gender: 'male' | 'female' | 'non-binary';
  ageRange: 'young' | 'middle' | 'elder';
  professionTags: string[];
  visualDescription: { kk: string; en: string };
}

export const PORTRAIT_LIBRARY: Record<string, CharacterPortrait> = {
  // --- VICTORIAN ERA (8 Portraits) ---
  vic_aristocrat_1: {
    portraitId: 'vic_aristocrat_1',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_one_1794245693493.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Lord', 'Noble', 'Heir', 'Gentleman', 'Insider'],
    visualDescription: {
      kk: 'Күміс шашты, сұсты қырынған ақсүйек джентльмен. Бағалы жүн пальто мен өрнекті камзол киген.',
      en: 'Aristocratic gentleman with silver-streaked hair, trimmed mustache, and tailored wool frock coat.',
    },
  },
  vic_housekeeper_2: {
    portraitId: 'vic_housekeeper_2',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_two_1794245716066.jpg'),
    era: 'victorian',
    gender: 'female',
    ageRange: 'middle',
    professionTags: ['Head Housekeeper', 'Governess', 'Lady', 'Witness', 'Insider'],
    visualDescription: {
      kk: 'Өрілген шашы жинақы, қырағы қарасты бас үй бикесі. Бордо барқыт көйлек пен қара кружевалы жаға.',
      en: 'Composed head housekeeper with braided auburn hair, dark burgundy dress and antique lace collar.',
    },
  },
  vic_clockmaker_3: {
    portraitId: 'vic_clockmaker_3',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_three_1794245716678.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Clockmaker', 'Artisan', 'Locksmith', 'Specialist', 'Mechanic'],
    visualDescription: {
      kk: 'Маңдайында жезден жасалған үлкейткіш лупасы бар шебер сағатшы. Тері алжапқыш және шеберхана киімі.',
      en: 'Master clockmaker with brass forehead loupe, weathered focused brow, and heavy leather craftsman vest.',
    },
  },
  vic_solicitor_4: {
    portraitId: 'vic_solicitor_4',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_four_1794245717680.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'young',
    professionTags: ['Solicitor', 'Lawyer', 'Barrister', 'Notary', 'Access Holder'],
    visualDescription: {
      kk: 'Ақшыл шашты, қатал назары бар жас мұрагерлік заңгер. Тік ақ жаға және сәнді қара сюртук.',
      en: 'Young estate solicitor with slicked blonde hair, sharp blue eyes, stiff wing collar and formal cravat.',
    },
  },
  vic_physician_5: {
    portraitId: 'vic_physician_5',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_five_1794245717370.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'elder',
    professionTags: ['Physician', 'Doctor', 'Surgeon', 'Coroner', 'Specialist'],
    visualDescription: {
      kk: 'Дөңгелек көзілдірік таққан тәжірибелі отбасылық дәрігер. Ақсақалды, твид камзол және қалта сағаты.',
      en: 'Distinguished family physician with round spectacles, gray beard, muttonchops, and tweed vest.',
    },
  },
  vic_rail_inspector_6: {
    portraitId: 'vic_rail_inspector_6',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_six_1794245737020.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Rail Inspector', 'Station Master', 'Conductor', 'Access Holder', 'Witness'],
    visualDescription: {
      kk: 'Теміржол инспекциясының әскери үлгідегі киімі мен фуражкасын киген салмақты инспектор.',
      en: 'Stern railway inspector wearing a brass-buttoned uniform coat and official peaked cap.',
    },
  },
  vic_curator_7: {
    portraitId: 'vic_curator_7',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_seven_1794245737919.jpg'),
    era: 'victorian',
    gender: 'female',
    ageRange: 'young',
    professionTags: ['Curator', 'Antiquarian', 'Historian', 'Archivist', 'Specialist'],
    visualDescription: {
      kk: 'Антикварлық музей кураторы. Изумруд барқыт көйлек, камея брошы және қолында көне күнделік.',
      en: 'Scholarly antiquarian museum curator in emerald velvet dress, delicate cameo brooch, and notebook.',
    },
  },
  vic_secretary_8: {
    portraitId: 'vic_secretary_8',
    imageSrc: getPortraitPath('victorian', 'vic_portrait_eight_1794245738479.jpg'),
    era: 'victorian',
    gender: 'male',
    ageRange: 'young',
    professionTags: ['Private Secretary', 'Clerk', 'Accountant', 'Witness', 'Insider'],
    visualDescription: {
      kk: 'Мазасыз қарасты жеке хатшы. Дөңгелек көзілдірік, қоңыр жүн кеудеше және сия жұққан саусақтар.',
      en: 'Anxious private secretary with wire spectacles, brown wool vest, quill pen, and ink-stained cuffs.',
    },
  },

  // --- MODERN ERA (8 Portraits) ---
  mod_director_1: {
    portraitId: 'mod_director_1',
    imageSrc: getPortraitPath('modern', 'mod_portrait_one_1794245738365.jpg'),
    era: 'modern',
    gender: 'female',
    ageRange: 'middle',
    professionTags: ['Research Director', 'CEO', 'Department Head', 'Insider', 'Executive'],
    visualDescription: {
      kk: 'Заманауи ғылыми орталықтың басшысы. Қара каре шаш, көк пиджак және цифрлық рұқсат бейджі.',
      en: 'Modern biotech research director with sharp black bob haircut, navy tailored blazer, and access badge.',
    },
  },
  mod_security_2: {
    portraitId: 'mod_security_2',
    imageSrc: getPortraitPath('modern', 'mod_portrait_two_1794245758660.jpg'),
    era: 'modern',
    gender: 'male',
    ageRange: 'young',
    professionTags: ['Security Engineer', 'Facility Guard', 'Surveillance Chief', 'Access Holder'],
    visualDescription: {
      kk: 'Тәулік бойы күзет бастығы. Тактикалық қара поло, құлаққап-радиобайланыс және нысан бейджі.',
      en: 'Facility security supervisor in black tactical polo, earpiece communicator, and electronic keycard.',
    },
  },
  mod_biochemist_3: {
    portraitId: 'mod_biochemist_3',
    imageSrc: getPortraitPath('modern', 'mod_portrait_three_1794245760327.jpg'),
    era: 'modern',
    gender: 'female',
    ageRange: 'young',
    professionTags: ['Biochemist', 'Lab Technician', 'Researcher', 'Specialist'],
    visualDescription: {
      kk: 'Биохимиялық зертхана маманы. Ақ халат, қорғаныс көзілдірігі және пипетка ұстаған сергек ғалым.',
      en: 'Lead biochemist in crisp laboratory coat, safety goggles resting on curly hair, analytical gaze.',
    },
  },
  mod_assistant_4: {
    portraitId: 'mod_assistant_4',
    imageSrc: getPortraitPath('modern', 'mod_portrait_four_1794245759370.jpg'),
    era: 'modern',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Executive Assistant', 'Corporate Counsel', 'Advisor', 'Insider', 'Witness'],
    visualDescription: {
      kk: 'Корпоративтік атқарушы көмекші. Қымбат сұр костюм, галстук, қолында құпия құжаттар папкісі.',
      en: 'Corporate executive assistant in fitted charcoal grey suit, neat hair, holding leather briefing binder.',
    },
  },
  mod_hacker_5: {
    portraitId: 'mod_hacker_5',
    imageSrc: getPortraitPath('modern', 'mod_portrait_five_1794245760947.jpg'),
    era: 'modern',
    gender: 'male',
    ageRange: 'young',
    professionTags: ['Cybersecurity Specialist', 'Programmer', 'Data Analyst', 'Specialist', 'Access Holder'],
    visualDescription: {
      kk: 'Киберқауіпсіздік маманы. Қара капюшон, мойнында құлаққап, монитор кодтары бетіне шағылысқан.',
      en: 'Cybersecurity programmer in dark hoodie, over-ear studio headphones, lit by glowing terminal code.',
    },
  },
  mod_journalist_6: {
    portraitId: 'mod_journalist_6',
    imageSrc: getPortraitPath('modern', 'mod_portrait_six_1794245780956.jpg'),
    era: 'modern',
    gender: 'female',
    ageRange: 'young',
    professionTags: ['Investigative Journalist', 'Reporter', 'Writer', 'Witness'],
    visualDescription: {
      kk: 'Зерттеуші журналист әйел. Қысқа ақшыл шаш, күздік плащ, баспасөз куәлігі және жазба дәптері.',
      en: 'Investigative reporter in khaki trench coat with press badge, sharp blonde pixie cut, notebook in hand.',
    },
  },
  mod_supervisor_7: {
    portraitId: 'mod_supervisor_7',
    imageSrc: getPortraitPath('modern', 'mod_portrait_seven_1794245781128.jpg'),
    era: 'modern',
    gender: 'male',
    ageRange: 'elder',
    professionTags: ['Night Supervisor', 'Chief Electrician', 'Maintenance Chief', 'Access Holder', 'Witness'],
    visualDescription: {
      kk: 'Түнгі ауысым шебері. Ақшыл-сұр сақалды, жарық шағылыстырғыш қызметтік күрте, кеудесінде рация.',
      en: 'Night maintenance supervisor with salt-and-pepper beard, heavy utility jacket, safety radio clip.',
    },
  },
  mod_pathologist_8: {
    portraitId: 'mod_pathologist_8',
    imageSrc: getPortraitPath('modern', 'mod_portrait_eight_1794245782910.jpg'),
    era: 'modern',
    gender: 'female',
    ageRange: 'middle',
    professionTags: ['Forensic Pathologist', 'Medical Examiner', 'Doctor', 'Specialist'],
    visualDescription: {
      kk: 'Криминалист-дәрігер. Жұқа көзілдірік, медициналық форма мен ақ халат, суық клиникалық назар.',
      en: 'Forensic pathologist in clinical rimless spectacles, teal hospital scrubs, white lab coat, perceptive eyes.',
    },
  },

  // --- FUTURE ERA (8 Portraits) ---
  fut_commander_1: {
    portraitId: 'fut_commander_1',
    imageSrc: getPortraitPath('future', 'fut_portrait_one_1794245781791.jpg'),
    era: 'future',
    gender: 'male',
    ageRange: 'elder',
    professionTags: ['Station Commander', 'Admiral', 'Sector Director', 'Insider', 'Executive'],
    visualDescription: {
      kk: 'Орбиталық станцияның бас қолбасшысы. Сұр шаш, обсидиан түстес алтын жалатылған мундир, жұлдызды терезе.',
      en: 'Orbital station commander with silver hair, stoic jawline, obsidian officer uniform with gold trim.',
    },
  },
  fut_neurogeneticist_2: {
    portraitId: 'fut_neurogeneticist_2',
    imageSrc: getPortraitPath('future', 'fut_portrait_two_1794245802761.jpg'),
    era: 'future',
    gender: 'female',
    ageRange: 'middle',
    professionTags: ['Chief Neurogeneticist', 'Quantum AI Researcher', 'Scientist', 'Specialist'],
    visualDescription: {
      kk: 'Бас нейро-генетик ғалым. Күлгін жолақты өрілген шаш, маңдайында күміс нейро-интерфейс, ғылыми скафандр.',
      en: 'Chief neurogeneticist with magenta-streaked braided hair, silver brow neural clip, sleek science flightsuit.',
    },
  },
  fut_reactor_eng_3: {
    portraitId: 'fut_reactor_eng_3',
    imageSrc: getPortraitPath('future', 'fut_portrait_three_1794245804116.jpg'),
    era: 'future',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Systems Engineer', 'Reactor Specialist', 'Life Support Chief', 'Access Holder'],
    visualDescription: {
      kk: 'Ауыр жүйелер мен реактор инженері. Қысқа қиылған шаш, қызғылт сары термо-қорғаныс скафандры.',
      en: 'Heavy systems and reactor engineer in orange-accented thermal containment pressure suit, airlock bay.',
    },
  },
  fut_navigator_4: {
    portraitId: 'fut_navigator_4',
    imageSrc: getPortraitPath('future', 'fut_portrait_four_1794245804553.jpg'),
    era: 'future',
    gender: 'female',
    ageRange: 'young',
    professionTags: ['Navigation Specialist', 'Sub-Orbital Pilot', 'Astrogator', 'Witness', 'Specialist'],
    visualDescription: {
      kk: 'Ғарыштық навигатор қыз. Асимметриялық изумруд шаш, голографиялық кабина экраны шағылысқан комбинезон.',
      en: 'Navigation specialist and pilot with teal hair, illuminated HUD collar flightsuit, star charts in view.',
    },
  },
  fut_synthetic_officer_5: {
    portraitId: 'fut_synthetic_officer_5',
    imageSrc: getPortraitPath('future', 'fut_portrait_five_1794245804432.jpg'),
    era: 'future',
    gender: 'female',
    ageRange: 'young',
    professionTags: ['Synthetic Life Officer', 'Robotics Specialist', 'Cybernetics Lead', 'Specialist'],
    visualDescription: {
      kk: 'Кибернетика және синтетикалық сана жөніндегі офицер. Көк жарықдиодты көз импланты, ақ техникалық костюм.',
      en: 'Cybernetics specialist with glowing pale-blue ocular implant, matte white technical uniform, datapad.',
    },
  },
  fut_med_officer_6: {
    portraitId: 'fut_med_officer_6',
    imageSrc: getPortraitPath('future', 'fut_portrait_six_1794245823175.jpg'),
    era: 'future',
    gender: 'female',
    ageRange: 'elder',
    professionTags: ['Chief Medical Officer', 'Biosurgeon', 'Xenobiologist', 'Specialist', 'Witness'],
    visualDescription: {
      kk: 'Станцияның бас медицина офицері. Ақшыл шаш, көгілдір биотұрақты костюм, жағасында цифрлық монитор.',
      en: 'Chief medical officer with swept silver hair, cyan high-collar biosurgery uniform with vitals collar.',
    },
  },
  fut_security_op_7: {
    portraitId: 'fut_security_op_7',
    imageSrc: getPortraitPath('future', 'fut_portrait_seven_1794245825048.jpg'),
    era: 'future',
    gender: 'male',
    ageRange: 'middle',
    professionTags: ['Security Operative', 'Tactical Commander', 'Perimeter Guard', 'Access Holder'],
    visualDescription: {
      kk: 'Ғарыш станциясының тактикалық күзет командирі. Қара көміртекті сауыт, жоғары көтерілген кәріптас визор.',
      en: 'Station tactical security operative with battle-tested jaw, carbon-weave armor, raised amber HUD visor.',
    },
  },
  fut_data_mercenary_8: {
    portraitId: 'fut_data_mercenary_8',
    imageSrc: getPortraitPath('future', 'fut_portrait_eight_1794245824039.jpg'),
    era: 'future',
    gender: 'male',
    ageRange: 'young',
    professionTags: ['Data Mercenary', 'Infiltrator', 'Freelance Hacker', 'Witness', 'Insider'],
    visualDescription: {
      kk: 'Орбиталық деректер жалдамалысы. Күлгін жарқылды шаш, былғары ұшу күртесі, неонды терминал алдында.',
      en: 'Young data mercenary in synth-leather jacket, electric violet-tipped hair, smirking before neon cyber-deck.',
    },
  },
};

/**
 * Returns a list of portraits matching the given Era.
 */
export function getPortraitsForEra(era: EraId): CharacterPortrait[] {
  return Object.values(PORTRAIT_LIBRARY).filter((p) => p.era === era);
}

/**
 * Deterministically picks a suitable portrait for a suspect role based on era, role tags, and already used portraits.
 */
export function assignPortrait(
  era: EraId,
  roleTags: string[],
  usedPortraitIds: Set<string>,
  preferredGender?: 'male' | 'female' | 'non-binary'
): CharacterPortrait {
  const eraPortraits = getPortraitsForEra(era);
  const available = eraPortraits.filter((p) => !usedPortraitIds.has(p.portraitId));

  const pool = available.length > 0 ? available : eraPortraits;

  // 1. Try matching both gender and role tag
  if (preferredGender) {
    const matched = pool.filter(
      (p) =>
        p.gender === preferredGender &&
        roleTags.some((tag) => p.professionTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase())))
    );
    if (matched.length > 0) return matched[0];

    const genderMatched = pool.filter((p) => p.gender === preferredGender);
    if (genderMatched.length > 0) return genderMatched[0];
  }

  // 2. Try matching role tag
  const tagMatched = pool.filter((p) =>
    roleTags.some((tag) => p.professionTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase())))
  );
  if (tagMatched.length > 0) return tagMatched[0];

  // 3. Fallback to first available
  return pool[0];
}
