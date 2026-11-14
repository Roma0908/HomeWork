import { EraId, CharacterRoleSlot, EvidenceType, SuspectPersonalityTrait } from './types.ts';

export interface BlueprintRoleSlot {
  slot: CharacterRoleSlot;
  defaultName: { kk: string; en: string };
  profession: { kk: string; en: string };
  professionCapability: {
    title: { kk: string; en: string };
    description: { kk: string; en: string };
  };
  portraitTags: string[];
  genderPreference: 'male' | 'female' | 'non-binary';
  bio: { kk: string; en: string };
  personality: SuspectPersonalityTrait[];
  communicationStyle: 'nervous' | 'calm' | 'secretive' | 'manipulative' | 'honest' | 'defensive';
  relationships: { kk: string; en: string };
  publicMotive: { kk: string; en: string };
  hiddenSecret: { kk: string; en: string };
  culpritMotive: { kk: string; en: string };
  alibiClaim: { kk: string; en: string };
  alibiRoomIndex: number;
}

export interface BlueprintEvidenceTemplate {
  idSuffix: string;
  name: { kk: string; en: string };
  description: { kk: string; en: string };
  type: EvidenceType;
  isEssential: boolean;
  isMisleading?: boolean;
  misleadingExplanation?: { kk: string; en: string };
  svgIcon: string;
  clueWeight: number;
  roomIndex: number;
  implicatesRole?: CharacterRoleSlot;
  exoneratesRole?: CharacterRoleSlot;
}

export interface BlueprintConnectionTemplate {
  id: string;
  clueASuffix: string;
  clueBSuffix: string;
  deductionTitle: { kk: string; en: string };
  deductionText: { kk: string; en: string };
  culpritImplication: boolean;
}

export interface BlueprintRoomTemplate {
  idSuffix: string;
  name: { kk: string; en: string };
  description: { kk: string; en: string };
  themeColor: string;
  hotspots: Array<{
    idSuffix: string;
    label: { kk: string; en: string };
    x: number;
    y: number;
    evidenceSuffix?: string;
    flavorText: { kk: string; en: string };
  }>;
}

export interface StoryBlueprint {
  key: string;
  era: EraId;
  title: { kk: string; en: string };
  crimeCategory: string;
  crimeTime: string;
  victim: {
    name: string;
    role: { kk: string; en: string };
  };
  hook: { kk: string; en: string };
  centralMystery: { kk: string; en: string };
  incidentDescription: { kk: string; en: string };
  midpointTwist: { kk: string; en: string };
  finalTwist: { kk: string; en: string };
  solutionExplanation: { kk: string; en: string };
  rooms: BlueprintRoomTemplate[];
  roles: BlueprintRoleSlot[];
  evidenceTemplates: BlueprintEvidenceTemplate[];
  connections: BlueprintConnectionTemplate[];
  defaultCulpritRole: CharacterRoleSlot;
}

export const STORY_BLUEPRINTS: StoryBlueprint[] = [
  // =========================================================================
  // 1. VICTORIAN A: THE THIRTEENTH CHIME
  // =========================================================================
  {
    key: 'thirteenth_chime',
    era: 'victorian',
    title: { kk: 'Он үшінші сағат соққысы', en: 'The Thirteenth Chime' },
    crimeCategory: 'Құпия құжаттарды ұрлау және мұрагерлікті бұрмалау',
    crimeTime: '23:45 — 00:15',
    victim: {
      name: 'Lord Alistair Blackwood',
      role: { kk: 'Блэквуд әулетінің марқұм патриархы', en: 'Deceased Patriarch of Blackwood Manor' },
    },
    hook: {
      kk: 'Түнгі боранда Блэквуд үйінің көне еден сағаты кенеттен он үш рет соқты. Сол сәтте құлыптаулы кітапханадан әулеттің соңғы мұрагерлік құжаты жоғалды.',
      en: 'During a midnight blizzard, the ancestral grandfather clock in Blackwood Manor struck an impossible thirteen chimes. At that exact moment, the sealed inheritance codicil vanished from the locked library.',
    },
    centralMystery: {
      kk: 'Кітапхана есігі ішінен жез ілмекпен бекітілген. Төрт адамның әрқайсысы бөлмеге кірмегенін алға тартады, бірақ сағат тілі 15 минут алға жылжытылған.',
      en: 'The heavy oak library door remained bolted from within. Four residents swear they were elsewhere, but forensic inspection reveals the clock mechanism was deliberately altered to forge a fake alibi.',
    },
    incidentDescription: {
      kk: 'Марқұм лордтың өсиеті бойынша, оның байлығы қайырымдылық қорына өтуі тиіс еді. Бірақ құжат ұрланып, өртелген күл қалдықтары каминнен табылды.',
      en: 'The codicil stipulated that the vast estate would pass to an educational foundation. The parchment was stolen and replaced with forged decoy ashes.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Сағат шын мәнінде түн ортасында емес, 23:45-те соққан! Қылмыскер сағат серіппесін әдейі бұрап, барлық куәгерлерге жалған уақытты сіңірген.',
      en: 'Midpoint Revelation: The clock chimed at 23:45, not midnight! The culprit tampered with the escapement gear to induce a false time consensus among all witnesses.',
    },
    finalTwist: {
      kk: 'Шешім: Мұрагер Джулиан сағат шеберінің кілтін пайдаланып, сағат механизмін бұзған. Оның кітапханадан шығуына көне қызметші баспалдағы көмектескен.',
      en: 'Final Resolution: The heir Julian used a stolen horological tuning key to manipulate the chimes, providing an alibi while he entered the library through the concealed service pantry.',
    },
    solutionExplanation: {
      kk: 'Лорд Джулиан Блэквуд қарыздарын жабу үшін әкесінің өсиетін жойды. Ол сағатты 15 минутқа тездетіп, өзін залда отырғандай көрсетіп, құжатты өзімен бірге алып кеткен.',
      en: 'Lord Julian Blackwood orchestrated the theft to conceal his crushing gambling debts. By altering the grandfather clock, he manufactured an airtight alibi while stealing the codicil.',
    },
    rooms: [
      {
        idSuffix: 'foyer',
        name: { kk: 'Бас кіреберіс пен сағат залы', en: 'Grand Foyer & Clock Hall' },
        description: { kk: 'Еденге дейін созылған биік готикалық сағат және қара емен бағандар.', en: 'High Gothic grandfather clock standing beside imposing carved oak pillars.' },
        themeColor: '#78350f',
        hotspots: [
          {
            idSuffix: 'clock_face',
            label: { kk: 'Көне сағат циферблаты', en: 'Grandfather Clock Face' },
            x: 48,
            y: 42,
            evidenceSuffix: 'altered_gear',
            flavorText: { kk: 'Сағат маятнигінің жез тісті доңғалағында жаңа сызаттар мен сия іздері байқалады.', en: 'Fresh scratches on the brass escapement gear confirm deliberate tampering.' },
          },
          {
            idSuffix: 'guest_register',
            label: { kk: 'Қонақтар журналы', en: 'Hall Stand & Registry' },
            x: 75,
            y: 65,
            evidenceSuffix: 'butler_ledger',
            flavorText: { kk: 'Түнгі қонақтардың келу уақыты жазылған былғары мұқабалы кітап.', en: 'Leather-bound registry tracking the arrival times of all manor inhabitants.' },
          },
        ],
      },
      {
        idSuffix: 'library',
        name: { kk: 'Құлыптаулы жеке кітапхана', en: 'Locked Family Library' },
        description: { kk: 'Қабырғалары кітапқа толы, каминінде күл қалдықтары қалған кең бөлме.', en: 'Vast study lined with ancestral books; cold ashes rest in the stone fireplace.' },
        themeColor: '#1e3a5f',
        hotspots: [
          {
            idSuffix: 'desk_safe',
            label: { kk: 'Лордтың емен жазу үстелі', en: "Patriarch's Writing Bureau" },
            x: 35,
            y: 55,
            evidenceSuffix: 'cut_parchment',
            flavorText: { kk: 'Үстел суырмасынан құжаттың кесілген балауызды мөрі табылды.', en: 'The red wax seal of the codicil was cleanly sliced with a razor.' },
          },
          {
            idSuffix: 'secret_pantry_door',
            label: { kk: 'Жасырын қызметші есігі', en: 'Concealed Pantry Passage' },
            x: 82,
            y: 38,
            evidenceSuffix: 'soot_footprints',
            flavorText: { kk: 'Тұсқағаз астындағы көне құпия есіктен күйе іздері анықталды.', en: 'Faint soot footprints lead from the hearth through a wallpaper-camouflaged door.' },
          },
        ],
      },
      {
        idSuffix: 'workshop',
        name: { kk: 'Сағат шеберханасы', en: 'Horology Workshop' },
        description: { kk: 'Жез құралдар, өлшеуіштер мен үлкейткіш шынылар үйілген бөлме.', en: 'Brass gear assemblies, watch oil vials, and precision calipers clutter the workbench.' },
        themeColor: '#713f12',
        hotspots: [
          {
            idSuffix: 'tool_bench',
            label: { kk: 'Шебердің жұмыс үстелі', en: 'Master Workstation' },
            x: 52,
            y: 50,
            evidenceSuffix: 'tuning_key',
            flavorText: { kk: 'Қоңырау соғу санын реттейтін арнайы калибрлеу кілті.', en: 'A custom horological key used specifically to set the chime strike counter.' },
          },
        ],
      },
      {
        idSuffix: 'parlor',
        name: { kk: 'Қонақ қабылдау қонақжайы', en: 'Victorian Tea Parlor' },
        description: { kk: 'Барқыт дивандар мен газ шамының жылы сәулесі түскен тыныш бөлме.', en: 'Velvet divans lit by gas bracket lamps where the inhabitants took midnight tea.' },
        themeColor: '#14532d',
        hotspots: [
          {
            idSuffix: 'tea_table',
            label: { kk: 'Фарфор шай үстелі', en: 'Porcelain Tea Table' },
            x: 45,
            y: 60,
            evidenceSuffix: 'laudanum_cup',
            flavorText: { kk: 'Ішінде ұйықтататын опиум тамшылары бар фарфор кесесі.', en: 'A half-drained porcelain teacup testing positive for sedative laudanum.' },
          },
        ],
      },
      {
        idSuffix: 'conservatory',
        name: { kk: 'Шыны консерватория', en: 'Glass Conservatory' },
        description: { kk: 'Экзотикалық өсімдіктер мен терезеден түскен боран көрінетін салқын галерея.', en: 'Chilly glass-domed garden filled with Victorian ferns overlooking the blizzard.' },
        themeColor: '#064e3b',
        hotspots: [
          {
            idSuffix: 'planter_box',
            label: { kk: 'Мәрмәр гүл құмырасы', en: 'Marble Planter Box' },
            x: 60,
            y: 70,
            flavorText: { kk: 'Қар суы еріген балшықтың арасынан лордтың алтын мөртаңбасы жылтырайды.', en: 'Fresh soil disturbed beneath a palm; nothing hidden inside.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Лорд Джулиан Блэквуд', en: 'Lord Julian Blackwood' },
        profession: { kk: 'Мұрагер ақсүйек джентльмен', en: 'Aristocratic Heir' },
        professionCapability: {
          title: { kk: 'Әулеттік заңдарды білу', en: 'Ancestral Estate Protocol' },
          description: { kk: 'Әулеттік өсиеттің заңды шарттары мен құқықтық кемшіліктерін терең түсінеді.', en: 'Can pinpoint legal ambiguities in family trusts and estate inheritance clauses.' },
        },
        portraitTags: ['Aristocrat', 'Noble', 'Heir', 'Lord'],
        genderPreference: 'male',
        bio: { kk: 'Марқұм лордтың жалғыз ұлы. Лондонның карта клубтарында 50,000 фунт қарызға батқан.', en: 'Sole surviving son of Lord Blackwood; drowning under £50,000 in West End gambling debts.' },
        personality: ['ambitious', 'manipulative', 'defensive'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Үй бикесі Элеонорға сенбейді, бірақ оның адалдығынан қорқады.', en: 'Resents housekeeper Eleanor; fears her unwavering loyalty to his father.' },
        publicMotive: { kk: 'Әкесінің өсиеті жедел орындалып, мұра ресми түрде бекітілуі тиіс.', en: 'Claims he only wanted the legal probate settled expeditiously.' },
        hiddenSecret: { kk: 'Егер өсиет жарияланса, барлық мүлік қайырымдылыққа кетіп, өзі кедейлікке түсер еді.', en: 'The codicil stripped him of his inheritance in favor of a hospital foundation.' },
        culpritMotive: { kk: 'Әкесінің қайырымдылық өсиетін жойып, бастапқы мұрагерлік құқығын сақтап қалу.', en: 'Destroyed the codicil so the original will granting him the entire fortune takes effect.' },
        alibiClaim: { kk: 'Сағат он үш рет соққанда қонақ бөлмеде жалғыз шай ішіп отырдым.', en: 'Claims he was quietly taking tea in the parlor when the thirteen chimes rang.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Элеонор Вэнс', en: 'Eleanor Vance' },
        profession: { kk: 'Бас үй бикесі', en: 'Head Housekeeper' },
        professionCapability: {
          title: { kk: 'Кілттер мен құлыптар бақылауы', en: 'Master Key Custody' },
          description: { kk: 'Үйдегі барлық есіктер мен құпия дәліздердің кілттерін нақты біледі.', en: 'Maintains strict records of every room key and servants corridor access.' },
        },
        portraitTags: ['Head Housekeeper', 'Governess', 'Lady'],
        genderPreference: 'female',
        bio: { kk: 'Блэквуд әулетіне 25 жыл бойы қызмет еткен адал әрі қатал үй бикесі.', en: 'Fiercely devoted head housekeeper who has managed Blackwood Manor for a quarter century.' },
        personality: ['observant', 'secretive', 'calm'],
        communicationStyle: 'calm',
        relationships: { kk: 'Марқұм лордтың жеке құпияларын өмірінің соңына дейін сақтауға серт берген.', en: 'Held deep reverence for Lord Blackwood; sworn to protect family dignity.' },
        publicMotive: { kk: 'Кітапхана кілті тек өзінде болғандықтан, басты күдікке ілікті.', en: 'Held the only master key to the library door; under immediate suspicion.' },
        hiddenSecret: { kk: 'Лорд оған үлкен зейнетақы тағайындаған өсиеттің көшірмесін қалтасына тығып қойған.', en: 'Secretly hid a handwritten pension grant from the late lord inside her bible.' },
        culpritMotive: { kk: 'Әулет билігі Джулианға өтпеуі үшін кітапхананы құлыптау.', en: 'Would protect the house from Julian by securing the codicil.' },
        alibiClaim: { kk: 'Түн ортасында ас үйде қызметшілердің күміс ыдыстарын санап жүрдім.', en: 'Was in the scullery locking the silver service pantry.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Тобиас Финч', en: 'Tobias Finch' },
        profession: { kk: 'Шебер сағатшы', en: 'Master Horologist' },
        professionCapability: {
          title: { kk: 'Механикалық сараптама', en: 'Horological Chronometry' },
          description: { kk: 'Сағат механизмдерінің уақыт ауытқуын минуттық дәлдікпен дәлелдей алады.', en: 'Can identify mechanical escapement tampering and calculate the exact drift of clocks.' },
        },
        portraitTags: ['Clockmaker', 'Artisan', 'Locksmith'],
        genderPreference: 'male',
        bio: { kk: 'Лондоннан арнайы шақырылған көне сағаттардың шебері.', en: 'Renowned clockmaker summoned from London to service the antique 1740 grandfather clock.' },
        personality: ['intelligent', 'observant', 'honest'],
        communicationStyle: 'honest',
        relationships: { kk: 'Джулиан Блэквуд оған үлкен пара ұсынып, сағатты алға жылжытуды сұраған.', en: 'Approached by Julian earlier with a bribe to calibrate the chimes ahead.' },
        publicMotive: { kk: 'Сағат механизмін тексерген жалғыз адам болғандықтан сұрақтар туындады.', en: 'The only person with the mechanical tools capable of altering the chimes.' },
        hiddenSecret: { kk: 'Ол лордтың сағатына жасырын дыбыс басатын киіз орнатқан.', en: 'Discovered that the strike hammer had been padded with black velvet earlier.' },
        culpritMotive: { kk: 'Сағаттың ішіндегі жасырын асыл тастарды ұрлау.', en: 'Extracting rare antique rubies embedded in the movement.' },
        alibiClaim: { kk: 'Шеберханада сағат серіппелерін тазалап отырдым.', en: 'Was at the workshop bench cleaning the anchor escapement pinions.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Артур Стерлинг', en: 'Arthur Sterling' },
        profession: { kk: 'Әулеттік нотариус-заңгер', en: 'Estate Solicitor' },
        professionCapability: {
          title: { kk: 'Заңдық құжаттар сараптамасы', en: 'Forensic Document Authentication' },
          description: { kk: 'Құжаттардың сиясы, мөрі мен қағазының түпнұсқалығын бірден айырады.', en: 'Can instantly detect forged wax seals, erased signatures, and watermark age.' },
        },
        portraitTags: ['Solicitor', 'Lawyer', 'Barrister'],
        genderPreference: 'male',
        bio: { kk: 'Блэквудтардың барлық мұрагерлік істерін жүргізген жас, бірақ сақ заңгер.', en: 'Meticulous family attorney who drafted the controversial codicil himself.' },
        personality: ['nervous', 'defensive', 'intelligent'],
        communicationStyle: 'nervous',
        relationships: { kk: 'Джулианмен заңгерлік келісімшарт жасасқан, бірақ қорқынышы басым.', en: 'Aware of Julian’s debt threats; desperately trying to preserve legal ethics.' },
        publicMotive: { kk: 'Құжат оның көз алдында жоғалғандықтан кәсіби беделіне нұқсан келді.', en: 'The document disappeared while under his professional custody.' },
        hiddenSecret: { kk: 'Ол лордтың қарызгерлерінен қоқан-лоқы хаттарын алып, жасырып келген.', en: 'Carrying threatening demand letters from Julian’s moneylenders in his coat.' },
        culpritMotive: { kk: 'Құжатты бәсекелес заң фирмасына сату.', en: 'Selling confidential estate holdings to rival developers.' },
        alibiClaim: { kk: 'Залда сағат он үшке соққанда күймешімен әңгімелесіп тұрдым.', en: 'Claims he was in the vestibule confirming the late coach departure.' },
        alibiRoomIndex: 0,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'altered_gear',
        name: { kk: 'Бұралған сағат тісті доңғалағы', en: 'Tampered Escapement Gear' },
        description: { kk: 'Сағаттың қоңырау тетігі 15 минутқа тез соғуға бейімделген. Соққы уақыты 23:45 болған.', en: 'The strike cam was adjusted with a horological wrench to trigger 15 minutes before midnight.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'watch',
        clueWeight: 0.95,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'cut_parchment',
        name: { kk: 'Кесілген өсиет лентасы мен балауыз мөр', en: 'Severed Silk Ribbon & Broken Seal' },
        description: { kk: 'Құпия құжаттың балауыз мөрі өткір ұстарамен ашылған, ішіндегі парақ жоқ.', en: 'The formal red wax seal of the codicil was sliced cleanly with a razor.' },
        type: 'document',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.88,
        roomIndex: 1,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'soot_footprints',
        name: { kk: 'Жасырын дәліздегі күйе іздері', en: 'Soot Footprints in Pantry Passage' },
        description: { kk: 'Камин жанындағы жасырын есіктен шай бөлмесіне апаратын былғары туфли іздері.', en: 'Ash and coal dust footprints leading from the library hearth into the private tea parlor.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.92,
        roomIndex: 1,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'tuning_key',
        name: { kk: 'Жезден жасалған калибрлеу кілті', en: 'Horological Tuning Key' },
        description: { kk: 'Сағатты жылдамдатуға қолданылатын жез кілт. Бетінде джентльмен сақинасының ізі бар.', en: 'Brass winding key fitting the 1740 clock movement, bearing a family crest signet impression.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'key',
        clueWeight: 0.75,
        roomIndex: 2,
        implicatesRole: 'specialist',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Кілт сағатшыға тиесілі болғанымен, оны үстелден Джулиан ұрлап алып пайдаланған.',
          en: 'While belonging to Finch the horologist, the key was stolen from his bench by Julian earlier that evening.',
        },
      },
      {
        idSuffix: 'laudanum_cup',
        name: { kk: 'Опиум қалдығы бар шай кесесі', en: 'Sedative-Laced Porcelain Teacup' },
        description: { kk: 'Шай кесесінің түбінде ұйықтататын лауданум тұнбасының ізі анықталды.', en: 'Traces of concentrated laudanum sediment found in the tea service prepared for the night guard.' },
        type: 'biological',
        isEssential: false,
        svgIcon: 'flask-conical',
        clueWeight: 0.7,
        roomIndex: 3,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'butler_ledger',
        name: { kk: 'Қызметшілер журналының жыртылған беті', en: 'Torn Registry Page at 23:45' },
        description: { kk: '23:45 кезіндегі қозғалысты көрсететін жазба әдейі жыртылып, жағылған.', en: 'The page recording hallway movements between 23:30 and midnight was violently torn out.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'book-open',
        clueWeight: 0.65,
        roomIndex: 0,
      },
    ],
    connections: [
      {
        id: 'conn_time_forge',
        clueASuffix: 'altered_gear',
        clueBSuffix: 'soot_footprints',
        deductionTitle: { kk: 'Алибидің жалған уақыты әшкереленді', en: 'False Timestamp Alibi Unveiled' },
        deductionText: {
          kk: 'Сағаттың 23:45-те соғуы лорд Джулианға жасырын дәліз арқылы кітапханаға кіріп-шығуға тура 15 минут ұрлап берген!',
          en: 'The manipulated clock granted Lord Julian exactly 15 unmonitored minutes to enter via the secret pantry hearth while everyone looked at the clock!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 2. VICTORIAN B: THE PASSENGER WHO NEVER BOARDED
  // =========================================================================
  {
    key: 'passenger_never_boarded',
    era: 'victorian',
    title: { kk: 'Пойызға мінбеген жолаушы', en: 'The Passenger Who Never Boarded' },
    crimeCategory: 'Адам ұрлау және банктік құнды қағаздарды талан-таражға салу',
    crimeTime: '21:15 — 22:30',
    victim: {
      name: 'Alistair Croft',
      role: { kk: 'Шотландия банкінің аға басқарушысы', en: 'Senior Director of Bank of Scotland' },
    },
    hook: {
      kk: 'Лондон-Эдинбург экспресі тоқтаусыз зымырап бара жатқанда, 4-купедегі бай банкир із-түзсіз ғайып болды. Оның чемоданы орнында, шайы буы бұрқырап тұр, бірақ станция телеграфы оның мүлдем мінбегенін хабарлады.',
      en: 'Aboard the non-stop Flying Scotsman express, wealthy banker Alistair Croft vanished from Compartment 4. His luggage remained overhead, his tea steaming on the folding shelf, but station telegraphs claim he never boarded.',
    },
    centralMystery: {
      kk: 'Терезелер ішінен құлыптаулы. Жолаушының билеті тесілген, бірақ тексеруде оның орнына басқа адам отырғаны және купе кілтінің көшірмесі анықталды.',
      en: 'The carriage windows were latched from within. A clipped ticket lay on the seat, but inconsistencies between the manifest and physical descriptions suggest an imposter staged the disappearance.',
    },
    incidentDescription: {
      kk: 'Банкир Эдинбургке 100,000 фунттық алтын облигацияларын апаруы тиіс еді. Облигациялар чемоданнан жоғалған.',
      en: 'Croft was carrying bearer bonds valued at £100,000 destined for the Edinburgh treasury. The bonds are missing from his sealed valise.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Пойызға мінген адам Крофт емес, оның киімін киген актер болған! Нағыз Крофт вокзал маңындағы қонақүйде ұсталып қалған.',
      en: 'Midpoint Revelation: The passenger who boarded in London was not Croft, but an imposter hired to simulate his presence while the real banker was intercepted before departure!',
    },
    finalTwist: {
      kk: 'Шешім: Теміржол инспекторы кондукторлық құқығын пайдаланып, облигацияларды көмір вагонындағы құпия сейфке жасырған.',
      en: 'Final Resolution: Rail Inspector McRae used his master carriage key and telegraph access to orchestrate the switch and secure the bonds in the engine tender.',
    },
    solutionExplanation: {
      kk: 'Инспектор Дональд Макрэй Крофттың қарындасымен сөз байласып, жалған жолаушыны отырғызған. Бұл уақытта облигациялар пойыздан лақтырылып, қауіпсіз жасырылған.',
      en: 'Inspector McRae colluded with an accomplice to plant the decoy passenger, creating an impossible train mystery while smuggling the gold bonds into the luggage van.',
    },
    rooms: [
      {
        idSuffix: 'compartment',
        name: { kk: '4-нөмірлі жеке купе', en: 'First-Class Compartment 4' },
        description: { kk: 'Қызыл барқыт орындықтар мен терезеден зымыраған түнгі тұман көрінетін купе.', en: 'First-class velvet compartment overlooking the rain-lashed midnight moors.' },
        themeColor: '#831843',
        hotspots: [
          {
            idSuffix: 'seat_cushion',
            label: { kk: 'Банкирдің орындығы мен чемоданы', en: "Banker's Seat & Luggage" },
            x: 40,
            y: 50,
            evidenceSuffix: 'clipped_ticket',
            flavorText: { kk: 'Орындықта тесілген билет пен Эдинбург қаласының картасы жатыр.', en: 'A freshly punched ticket and an Edinburgh financial gazette rest on the cushion.' },
          },
          {
            idSuffix: 'window_latch',
            label: { kk: 'Вагон терезесінің жез құлпы', en: 'Carriage Window Latch' },
            x: 75,
            y: 35,
            evidenceSuffix: 'fabric_thread',
            flavorText: { kk: 'Терезенің жез тұтқасына жұқа сұр твид жіп қыстырылып қалған.', en: 'A frayed thread of grey tweed fabric caught in the brass lock plate.' },
          },
        ],
      },
      {
        idSuffix: 'dining_car',
        name: { kk: 'Мейрамхана-вагон', en: 'Dining & Lounge Car' },
        description: { kk: 'Шамдар жағылған, үстелдерінде хрусталь мен күміс жарқыраған вагон.', en: 'Elegant dining saloon with brass lamps, polished mahogany tables, and wine decanters.' },
        themeColor: '#0f766e',
        hotspots: [
          {
            idSuffix: 'dining_register',
            label: { kk: 'Даяшының тапсырыс жазбасы', en: 'Steward Order Slip' },
            x: 55,
            y: 58,
            evidenceSuffix: 'steward_receipt',
            flavorText: { kk: '4-купеге 21:45-те тапсырыс берілген шампан жазбасы. Қолтаңба бұрмаланған.', en: 'Champagne order slip signed at 21:45; handwriting analysis reveals a traced signature.' },
          },
        ],
      },
      {
        idSuffix: 'guard_van',
        name: { kk: 'Кондуктор мен жүк вагоны', en: 'Brake Van & Luggage Car' },
        description: { kk: 'Ауыр сандықтар мен пошта қаптары үйілген қараңғы жүк бөлімі.', en: 'Dim mail-sorting car stacked with heavy steamers, mailbags, and lantern fuel.' },
        themeColor: '#334155',
        hotspots: [
          {
            idSuffix: 'mail_safe',
            label: { kk: 'Пошталық темір сейф', en: 'Postal Security Strongbox' },
            x: 45,
            y: 52,
            evidenceSuffix: 'telegraph_wire',
            flavorText: { kk: 'Кесілген телеграф хабарламасы мен жалған станция мөрі.', en: 'An intercepted telegraph dispatch bearing a counterfeit station stamp.' },
          },
        ],
      },
      {
        idSuffix: 'vestibule',
        name: { kk: 'Вагонаралық тамбур', en: 'Connecting Vestibule' },
        description: { kk: 'Дөңгелектердің гүрсілі естіліп тұрған тар өткел.', en: 'Noisy draughty corridor connecting the first class car with the guard brake van.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'emergency_brake',
            label: { kk: 'Апаттық тежегіш рычагы', en: 'Emergency Brake Lever' },
            x: 60,
            y: 40,
            flavorText: { kk: 'Тежегіш тығыздағышында май мен көмір ұнтағы бар.', en: 'Lever seal intact; no emergency stops were triggered along the line.' },
          },
        ],
      },
      {
        idSuffix: 'caboose',
        name: { kk: 'Паровоз көмір бункері', en: 'Locomotive Tender & Coal Bay' },
        description: { kk: 'Қара көмір тау болып үйілген паровоздың соңғы бөлігі.', en: 'Coal bunker behind the furnace where shovelers stoke the firebox.' },
        themeColor: '#172554',
        hotspots: [
          {
            idSuffix: 'tool_chest',
            label: { kk: 'Шойын құралдар жәшігі', en: 'Cast-Iron Tool Chest' },
            x: 50,
            y: 65,
            evidenceSuffix: 'gold_bond_clipping',
            flavorText: { kk: 'Көмір қаптарының астынан алтын облигацияның жыртылған бұрышы жылтырайды.', en: 'A clipped watermarked corner of a 5% British Treasury Gold Bond hidden in grease.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'access_holder',
        defaultName: { kk: 'Инспектор Дональд Макрэй', en: 'Inspector Donald McRae' },
        profession: { kk: 'Бас теміржол инспекторы', en: 'Chief Rail Inspector' },
        professionCapability: {
          title: { kk: 'Теміржол қозғалысын басқару', en: 'Locomotive Telegraph Control' },
          description: { kk: 'Пойыз қозғалысының кестесі мен вагондар арасындағы қатынасты толық бақылайды.', en: 'Controls carriage couplings, emergency signals, and station telegraph alerts.' },
        },
        portraitTags: ['Rail Inspector', 'Inspector', 'Conductor'],
        genderPreference: 'male',
        bio: { kk: '20 жыл экспресс қауіпсіздігіне жауап берген қатал шотландтық офицер.', en: 'Veteran Highland railway officer in charge of express speed and baggage security.' },
        personality: ['defensive', 'observant', 'secretive'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Крофттың отбасымен бұрыннан байланысы бар.', en: 'Knew Croft through earlier railway bond transport contracts.' },
        publicMotive: { kk: 'Пойыздағы қауіпсіздікке жауапты болғандықтан басты тергеуші.', en: 'Officially leading the search for the missing passenger.' },
        hiddenSecret: { kk: 'Оның қалтасында бос чемоданның құлып ашатын кілті табылды.', en: 'Carries a duplicate key fitting the banker’s bespoke leather valise.' },
        culpritMotive: { kk: 'Алтын облигацияларды жүк вагонындағы көмірге жасырып, шекарадан өткізу.', en: 'Steal the £100,000 bearer bonds and retire to the New World.' },
        alibiClaim: { kk: 'Жолаушы жоғалған кезде паровоз машинисімен бірге қысым тексердім.', en: 'Claims he was in the locomotive cab reviewing brake pressure.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'insider',
        defaultName: { kk: 'Леди Беатрис Крофт', en: 'Lady Beatrice Croft' },
        profession: { kk: 'Антикварлық коллекционер', en: 'Antiquarian Heiress' },
        professionCapability: {
          title: { kk: 'Құнды мұрағаттар білімі', en: 'Rare Bond Appraisal' },
          description: { kk: 'Банктік құнды қағаздар мен әулеттік тарихи мөрлерді терең ажыратады.', en: 'Can identify genuine Victorian bank script and watermarked treasury paper.' },
        },
        portraitTags: ['Curator', 'Antiquarian', 'Lady'],
        genderPreference: 'female',
        bio: { kk: 'Банкирдің бірге туған қарындасы. Мұрагерлік дауында оны сотқа берген.', en: 'Estranged sister of the banker embroiled in a bitter trust dispute.' },
        personality: ['ambitious', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Ағасы оның үлесін тартып алған деп есептейді.', en: 'Believed Alistair robbed her of her rightful mining royalties.' },
        publicMotive: { kk: 'Ағасын қорғау үшін бірге сапарға шыққанын айтады.', en: 'Claims she travelled only to reconcile with her brother.' },
        hiddenSecret: { kk: 'Ол Лондонда актер жалдап, ағасының пальтосын кигізген.', en: 'Hired a West End stage double to purchase and clip Croft’s ticket.' },
        culpritMotive: { kk: 'Ағасының облигацияларын тартып алу.', en: 'Blackmail her brother for half the treasury bonds.' },
        alibiClaim: { kk: 'Мейрамханада шәй ішіп отырдым.', en: 'Was dining in the lounge car under the steward’s eye.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Доктор Генри Кэмпбелл', en: 'Dr. Henry Campbell' },
        profession: { kk: 'Құрметті дәрігер', en: 'Consulting Physician' },
        professionCapability: {
          title: { kk: 'Медициналық токсикология', en: 'Clinical Toxicology' },
          description: { kk: 'Улану мен хлороформ іздерін адам ағзасынан дәл анықтайды.', en: 'Expert in detecting chloroform and narcotics in closed train compartments.' },
        },
        portraitTags: ['Physician', 'Doctor'],
        genderPreference: 'male',
        bio: { kk: 'Экспреспен Эдинбург ауруханасына бара жатқан медицина профессоры.', en: 'Distinguished Edinburgh medical professor seated in Compartment 5.' },
        personality: ['intelligent', 'honest', 'calm'],
        communicationStyle: 'honest',
        relationships: { kk: 'Банкирдің созылмалы жүрек ауруын емдеген.', en: 'Treated Croft for cardiac palpitations two months prior.' },
        publicMotive: { kk: 'Көрші купеде отырғандықтан куәлік берді.', en: 'Immediate witness who heard strange shuffling through the compartment wall.' },
        hiddenSecret: { kk: 'Оның дәрігерлік сөмкесінде хлороформ құтысы босаған.', en: 'Carries a medical vial of medicinal ether with a loose cork.' },
        culpritMotive: { kk: 'Банкирді ұйықтатып, бопсалау.', en: 'Sedate Croft to extract financial ledger passwords.' },
        alibiClaim: { kk: 'Купемде кітап оқып отырдым.', en: 'Reading surgical journals in his own berth.' },
        alibiRoomIndex: 0,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Персиваль Грейвс', en: 'Percival Graves' },
        profession: { kk: 'Жеке хатшы-есепші', en: 'Audit Clerk' },
        professionCapability: {
          title: { kk: 'Бухгалтерлік аудит', en: 'Registry Discrepancy Spotting' },
          description: { kk: 'Жол жүру тізімдері мен есеп кітаптарындағы жалған жазбаларды табады.', en: 'Can expose forged ticket numbers and seat duplicate records.' },
        },
        portraitTags: ['Private Secretary', 'Clerk'],
        genderPreference: 'male',
        bio: { kk: 'Қорқынышы басым жас есепші. Ол коридорда біреудің терезеге жақындағанын көрген.', en: 'Nervous audit clerk who claimed he saw a shadow pacing the outside running board.' },
        personality: ['nervous', 'observant'],
        communicationStyle: 'nervous',
        relationships: { kk: 'Инспектор Макрэйден қатты қорқады.', en: 'Intimidated by Inspector McRae’s interrogative threats.' },
        publicMotive: { kk: 'Коридордағы жалғыз тікелей куәгер.', en: 'Key witness claiming he saw Croft enter the corridor at 21:30.' },
        hiddenSecret: { kk: 'Ол пара алып, жалған жолаушыға есікті ашып берген.', en: 'Bribed with £20 to ignore a passenger stepping onto the corridor vestibule.' },
        culpritMotive: { kk: 'Ақша ұрлау.', en: 'Wanted to seize the banker’s cash envelope.' },
        alibiClaim: { kk: 'Тамбурда темекі шегіп тұрдым.', en: 'Smoking on the rear car connector platform.' },
        alibiRoomIndex: 3,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'clipped_ticket',
        name: { kk: 'Тесілген №409 бірінші сынып билеті', en: 'Clipped First-Class Ticket #409' },
        description: { kk: 'Лондонда тесілген билет. Бірақ тесік кондуктор Макрэйдің жеке жұлдызша таңбасына сәйкес.', en: 'Ticket #409 punched with the star-shaped stamp belonging exclusively to Inspector McRae.' },
        type: 'document',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.94,
        roomIndex: 0,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'fabric_thread',
        name: { kk: 'Терезе құлпындағы сұр жүн талшығы', en: 'Grey Wool Thread on Outer Latch' },
        description: { kk: 'Вагонның сыртқы жақтауынан табылған теміржолшылар мундирінің жүн талшығы.', en: 'Coarse navy-grey wool matching the issued uniform coat of railway inspectors.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.91,
        roomIndex: 0,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'telegraph_wire',
        name: { kk: 'Жасырылған телеграф шифры', en: 'Intercepted Station Telegraph Wire' },
        description: { kk: 'Эдинбургке "Жолаушы келмейді, чемоданды түсіріп алыңдар" деген құпия жеделхат.', en: 'Coded dispatch sent ahead instructing an accomplice to seize the luggage car at the terminus.' },
        type: 'document',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.96,
        roomIndex: 2,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'steward_receipt',
        name: { kk: 'Қолдан қойылған шампан чегі', en: 'Forged Dining Car Receipt' },
        description: { kk: 'Крофттың атынан жазылған қолтаңба. Сиясы әлі кеппеген.', en: 'Dining receipt bearing a clumsily traced signature of Alistair Croft.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'book-open',
        clueWeight: 0.72,
        roomIndex: 1,
      },
      {
        idSuffix: 'gold_bond_clipping',
        name: { kk: 'Алтын облигацияның жыртылған бұрышы', en: 'Clipped Corner of Treasury Bond' },
        description: { kk: 'Көмір вагонындағы құралдар арасынан табылған 5%-дық британдық қазыналық қағаздың су таңбасы.', en: 'Charred corner of a watermarked £100,000 certificate found in the locomotive coal box.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'file-text',
        clueWeight: 0.85,
        roomIndex: 4,
        implicatesRole: 'access_holder',
      },
    ],
    connections: [
      {
        id: 'conn_train_switch',
        clueASuffix: 'clipped_ticket',
        clueBSuffix: 'telegraph_wire',
        deductionTitle: { kk: 'Ұйымдастырылған теміржол аферасы', en: 'Orchestrated Railway Impersonation' },
        deductionText: {
          kk: 'Инспектор Макрэй өзінің жеке мөрімен жалған жолаушының билетін тесіп, алдын-ала Эдинбургке жеделхат жөнелткен!',
          en: 'Inspector McRae personally validated the imposter’s ticket while telegraphing his accomplice to intercept the bonds at the terminus!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'access_holder',
  },

  // =========================================================================
  // 3. MODERN A: THE 17-MINUTE BLACKOUT
  // =========================================================================
  {
    key: 'blackout_17_min',
    era: 'modern',
    title: { kk: '17 минуттық қараңғылық', en: 'The 17-Minute Blackout' },
    crimeCategory: 'Өнеркәсіптік тыңшылық және кванттық прототипті ұрлау',
    crimeTime: '02:14 — 02:31',
    victim: {
      name: 'Apex Bio-Tech Institute',
      role: { kk: 'Жоғары технологиялық ғылыми-зерттеу кешені', en: 'High-Security Biotechnology Research Campus' },
    },
    hook: {
      kk: 'Түнгі 02:14-те био-технологиялық кешеннің қосалқы генераторлары 17 минутқа өшіп қалды. Жарық қайта жанғанда 3-қоймадағы кванттық гендік кристал жоғалған.',
      en: 'At 02:14 AM, a localized power surge tripped the backup generators for exactly seventeen minutes. When auxiliary power returned, the cryogenic quantum gene drive had vanished from Vault 3.',
    },
    centralMystery: {
      kk: 'Магниттік құлыптар ашылмаған. Камераларда ешкім көрінбейді. Бірақ сервер журналында күзет бастығының кілт-картасы бір уақытта екі түрлі корпуста тіркелген.',
      en: 'No door sensors tripped. CCTV footage shows vacant hallways. Yet biometric access logs record a single security keycard operating in two distant wings simultaneously.',
    },
    incidentDescription: {
      kk: 'Кристалда адам қартаюын тоқтататын синтетикалық фермент коды жазылған еді. Оның құны қара нарықта ондаған миллион доллар.',
      en: 'The cryogenic crystal contained the sole unencrypted sequence for synthetic cellular rejuvenation, valued at over $80 million on the corporate black market.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Кристал қараңғылық кезінде ұрланбаған! Оны үш сағат бұрын муляжға ауыстырып қойған. Ал 17 минуттық өшу — ұрлық уақытын бұрмалау үшін жасалған жасанды спектакль!',
      en: 'Midpoint Revelation: The crystal was not stolen during the blackout! It was substituted with a dummy replica three hours earlier; the power failure was engineered solely to misdirect the investigation timeline!',
    },
    finalTwist: {
      kk: 'Шешім: Ғылыми жетекші өзінің зерттеуін шетелдік корпорацияға сату үшін күзет жүйесін алдап, крио-камераны алдын-ала босатқан.',
      en: 'Final Resolution: Research Director Dr. Eliza Reed used her executive override to extract the specimen hours earlier, framing the security team with a delayed blackout script.',
    },
    solutionExplanation: {
      kk: 'Доктор Элиза Рид серверге таймер орнатып, 02:14-те қысқа тұйықталу жасаған. Нағыз кристал оның жеке термос-сөмкесінде кешеннен кешке шығарылып қойылған.',
      en: 'Dr. Eliza Reed pre-programmed a scheduled power capacitor discharge at 02:14 to disguise her earlier unauthorized extraction of the quantum gene drive.',
    },
    rooms: [
      {
        idSuffix: 'vault',
        name: { kk: '3-нөмірлі криогендік қойма', en: 'Cryogenic Vault 3' },
        description: { kk: 'Сұйық азот буы шығып тұрған қалың титан қоймасы.', en: 'Sub-zero containment bay with frosted glass cases and titanium pneumatic doors.' },
        themeColor: '#0369a1',
        hotspots: [
          {
            idSuffix: 'cryo_cradle',
            label: { kk: 'Кристал тұғыры мен сенсоры', en: 'Cryogenic Specimen Cradle' },
            x: 50,
            y: 45,
            evidenceSuffix: 'temperature_log',
            flavorText: { kk: 'Температура сенсоры түн ортасында 23:00-де 3 минутқа жылынып кеткен.', en: 'Temperature telemetry proves the seal was broken hours before the blackout at 23:00.' },
          },
          {
            idSuffix: 'dummy_capsule',
            label: { kk: 'Ауыстырылған муляж капсула', en: 'Substituted Dummy Capsule' },
            x: 32,
            y: 62,
            evidenceSuffix: 'acrylic_decoy',
            flavorText: { kk: 'Нағыз кристалл орнына қойылған салмағы бірдей акрил муляжы.', en: 'A weighted acrylic duplicate bearing microscopic fingerprints from latex research gloves.' },
          },
        ],
      },
      {
        idSuffix: 'server_room',
        name: { kk: 'Сервер және қуат бөлмесі', en: 'Central Server & Substation' },
        description: { kk: 'Жыпылықтаған көк жарықдиодтары мен салқындатқыш шуы бар бөлме.', en: 'Towering racks of high-density blade servers with battery backup terminals.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'ups_terminal',
            label: { kk: 'UPS генератор терминалы', en: 'Automated Power Cut Breaker' },
            x: 60,
            y: 40,
            evidenceSuffix: 'scheduled_script',
            flavorText: { kk: 'Серверге 02:14-ке қойылған автоматты өшіру python-скрипті табылды.', en: 'A scheduled bash command injected to trigger the capacitor blowout at exactly 02:14.' },
          },
        ],
      },
      {
        idSuffix: 'security_hq',
        name: { kk: 'Күзет және бейнебақылау бекеті', en: 'Security Monitoring Center' },
        description: { kk: 'Көпэкранды қабырға мен кілт-карталар сканері орналасқан орталық.', en: 'Multi-screen CCTV array and electronic turnstile access logging workstation.' },
        themeColor: '#0f172a',
        hotspots: [
          {
            idSuffix: 'badge_scanner',
            label: { kk: 'Турникет кіру журналы', en: 'Cloned Badge Event Log' },
            x: 42,
            y: 55,
            evidenceSuffix: 'cloned_rfid',
            flavorText: { kk: 'Алан Мерсердің бейджі 02:16-да 1-корпуста да, 2-корпуста да белсенді болған.', en: 'Log records security card #7319 swiped simultaneously in two separate wings.' },
          },
        ],
      },
      {
        idSuffix: 'director_office',
        name: { kk: 'Директор Ридтің жеке кабинеті', en: "Director's Executive Suite" },
        description: { kk: 'Қалаға қарайтын панорамалық терезелер мен құлыптаулы құжат шкафтары.', en: 'Corner suite overlooking the city lights with floor-to-ceiling glass and private safe.' },
        themeColor: '#1e1b4b',
        hotspots: [
          {
            idSuffix: 'executive_shredder',
            label: { kk: 'Құжат ұсақтағыш себеті', en: 'Paper Shredder Bin' },
            x: 55,
            y: 65,
            flavorText: { kk: 'Ұсақталған қағаздардың арасынан Цюрих банкінің транзакциясы табылды.', en: 'Shredded fragments of a foreign banking escrow confirmation letter.' },
          },
        ],
      },
      {
        idSuffix: 'chem_lab',
        name: { kk: 'Синтез және реактивтер зертханасы', en: 'Reagent Synthesis Lab' },
        description: { kk: 'Түтін сорғыштар мен флуоресцентті жарықпен жарықтандырылған үстелдер.', en: 'Chemical fume hoods with pipettes, centrifuge racks, and sterile sample refrigerators.' },
        themeColor: '#065f46',
        hotspots: [
          {
            idSuffix: 'glove_dispenser',
            label: { kk: 'Стерильді қолғап жәшігі', en: 'Sterile Glove Locker' },
            x: 48,
            y: 48,
            flavorText: { kk: 'Жәшікте доктор Рид қолданатын арнайы маркалы нитрил қолғаптары тұр.', en: 'Box of custom extra-small violet nitrile gloves matching the residue on the decoy.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Д-р Элиза Рид', en: 'Dr. Eliza Reed' },
        profession: { kk: 'Ғылыми-зерттеу директоры', en: 'Biotech Research Director' },
        professionCapability: {
          title: { kk: 'Крио-жүйелерді басқару', en: 'Cryogenic Vault Override' },
          description: { kk: 'Қойманың температуралық өзгерістері мен сынамалар сақтау кодын біледі.', en: 'Can read thermal degradation logs and bypass sub-zero vault safety timers.' },
        },
        portraitTags: ['Research Director', 'CEO', 'Executive'],
        genderPreference: 'female',
        bio: { kk: 'Институттың бас ғалымы. Қаржылық тексеруге ұшырап, қызметінен босатылу алдында тұрған.', en: 'Senior director under private board investigation for embezzlement of patent grants.' },
        personality: ['intelligent', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Күзет бастығы Аланның тәртібіне сенімсіздік танытып келген.', en: 'Clashed repeatedly with Mercer over lab access security protocols.' },
        publicMotive: { kk: 'Өз жобасы болғандықтан оның жоғалуына еш мүдделі емеспін деп мәлімдейді.', en: 'Claims the project is her life’s work and she has zero reason to sabotage it.' },
        hiddenSecret: { kk: 'Ол шетелдік корпорациямен 15 миллион долларлық сатып алу шартына қол қойған.', en: 'Signed a secret term sheet with an overseas pharmaceutical syndicate.' },
        culpritMotive: { kk: 'Кристалды ұрлап, ұрлықты қараңғылық кезінде болды деп көрсету.', en: 'Pre-extracted the gene sequence and triggered the power surge to hide her theft.' },
        alibiClaim: { kk: 'Қараңғылық кезінде өз кабинетімде есеп жазып отырдым.', en: 'Claims she was inside her locked second-floor office drafting grant proposals.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Алан Мерсер', en: 'Alan Mercer' },
        profession: { kk: 'Күзет инженері', en: 'Facility Security Engineer' },
        professionCapability: {
          title: { kk: 'Бейнебақылау және RFID талдауы', en: 'Surveillance & RFID Diagnostics' },
          description: { kk: 'Көшірілген чиптер мен өшірілген бейнежазбаларды анықтайды.', en: 'Can identify spoofed access cards and frame-dropped CCTV recordings.' },
        },
        portraitTags: ['Security Engineer', 'Facility Guard'],
        genderPreference: 'male',
        bio: { kk: 'Бұрынғы әскери инженер. Нысанның барлық электрондық қауіпсіздік жүйесін өзі құрған.', en: 'Former defense contractor in charge of the campus’s biometrics and turnstiles.' },
        personality: ['defensive', 'observant'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Элиза Ридтің құпия бөлмелерге жиі кіруін ұнатпайтын.', en: 'Suspicious of Dr. Reed’s late-night unlogged visits to the server room.' },
        publicMotive: { kk: 'Оның бейджі екі жерде бірдей басылғандықтан басты күдіктіге айналды.', en: 'His badge was the only card recorded moving during the power failure.' },
        hiddenSecret: { kk: 'Ол түнгі кезекшілікте спорттық бәс тігу сайттарына кіріп, жүйені қараусыз қалдырған.', en: 'Was gambling online on his phone, missing the initial alarm prompt.' },
        culpritMotive: { kk: 'Қара нарыққа чип сату.', en: 'Wanted to sell access codes to industrial hackers.' },
        alibiClaim: { kk: 'Генератор бөлмесіне жүгіріп барып, автоматтарды көтердім.', en: 'Claims he ran directly to the generator substation to reset the master fuse.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Елена Ростова', en: 'Elena Rostova' },
        profession: { kk: 'Аға биохимик-зерттеуші', en: 'Senior Biochemist' },
        professionCapability: {
          title: { kk: 'Молекулярлық талдау', en: 'Reagent Fingerprinting' },
          description: { kk: 'Биологиялық заттар мен акрил полимерлерінің шыққан жерін дәл табады.', en: 'Can chemically date resin replicas and match reagent lot numbers.' },
        },
        portraitTags: ['Biochemist', 'Lab Technician'],
        genderPreference: 'female',
        bio: { kk: 'Кванттық кристалл синтезін тікелей жасаған талантты жас ғалым.', en: 'Lead post-doc who physically synthesized the quantum gene sequence.' },
        personality: ['honest', 'intelligent', 'nervous'],
        communicationStyle: 'honest',
        relationships: { kk: 'Доктор Ридтің оның атын патенттен алып тастағанына ашулы.', en: 'Bitter that Dr. Reed omitted her name from the primary patent filing.' },
        publicMotive: { kk: 'Зертханаға ең соңғы болып кірген ғалым.', en: 'The last scientist authorized to handle the cryogenic cradle.' },
        hiddenSecret: { kk: 'Ол кристалл кодының жеке көшірмесін USB-ге көшіріп алған.', en: 'Secretly backed up the raw genomic sequence to a flash drive in her locker.' },
        culpritMotive: { kk: 'Патентті өз атынан тіркеу үшін ұрлау.', en: 'Steal the prototype to publish under her own name.' },
        alibiClaim: { kk: 'Зертхана асханасында кофе ішіп отырдым.', en: 'Was in the third-floor cafeteria drinking espresso.' },
        alibiRoomIndex: 4,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Мартин Ву', en: 'Martin Wu' },
        profession: { kk: 'Атқарушы көмекші', en: 'Executive Assistant' },
        professionCapability: {
          title: { kk: 'Кесте және келушілер журналы', en: 'Executive Schedule Audit' },
          description: { kk: 'Күнтізбелердегі жасырын кездесулер мен электрондық пошталарды табады.', en: 'Can correlate encrypted executive calendars and courier dispatch logs.' },
        },
        portraitTags: ['Executive Assistant', 'Corporate Counsel'],
        genderPreference: 'male',
        bio: { kk: 'Директор Ридтің жеке көмекшісі. Оның барлық хат-хабарлары мен кездесулерін біледі.', en: 'Personal aide to Dr. Reed who manages confidential boardroom communications.' },
        personality: ['secretive', 'calm'],
        communicationStyle: 'secretive',
        relationships: { kk: 'Директордың заңсыз әрекеттерін сезген, бірақ мансабы үшін үнсіз қалған.', en: 'Aware of Dr. Reed’s offshore meetings but feared career retaliation.' },
        publicMotive: { kk: 'Қойма кодын білетін санаулы тұлғалардың бірі.', en: 'Possesses administrative secondary access to Vault 3.' },
        hiddenSecret: { kk: 'Ол директорға швейцариялық крио-контейнерге тапсырыс беріп қойған.', en: 'Ordered a portable cryogenic courier canister on his personal credit card.' },
        culpritMotive: { kk: 'Кристалды сатып, қарыздан құтылу.', en: 'Ransom the sequence back to the board.' },
        alibiClaim: { kk: 'Күзет бекетінде мониторларды бақылап отырдым.', en: 'Was in the security vestibule reviewing shipment logs.' },
        alibiRoomIndex: 2,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'temperature_log',
        name: { kk: 'Крио-қойманың жылыну журналы (23:00)', en: 'Vault Thermal Degradation Log at 23:00' },
        description: { kk: 'Қойма сағат 02:14-те емес, 23:00-де ашылған! Бұл нағыз кристалдың ерте ұрланғанын дәлелдейді.', en: 'Telemetry graph proving the vacuum seal was broken at 23:00, three hours prior to the blackout.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.95,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'scheduled_script',
        name: { kk: 'Сервердегі автоматты өшіру скрипті', en: 'Cronjob Power Cut Script' },
        description: { kk: 'Элиза Ридтің жеке логинімен 18:30-да серверге енгізілген 02:14 өшіру командасы.', en: 'A root cronjob scheduled under Dr. Reed’s admin terminal to short-circuit the master transformer.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.96,
        roomIndex: 1,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'acrylic_decoy',
        name: { kk: 'Акрил муляж капсуласындағы саусақ ізі', en: 'Fingerprint on Acrylic Decoy' },
        description: { kk: 'Қоймада қалдырылған жалған капсуланың түбінен доктор Ридтің латекс қолғабының ізі табылды.', en: 'A synthetic latex glove powder residue matching Dr. Reed’s personal brand on the decoy base.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.92,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'cloned_rfid',
        name: { kk: 'Көшірілген күзет бейджінің дубликаты', en: 'Cloned RFID Card Emulator' },
        description: { kk: 'Сервер бөлмесінің артына тасталған RFID клонері. Алан Мерсерді қаралау үшін тасталған.', en: 'An electronic RFID spoofer planted behind the server rack to fabricate Mercer’s presence.' },
        type: 'digital',
        isEssential: false,
        svgIcon: 'key',
        clueWeight: 0.72,
        roomIndex: 1,
        implicatesRole: 'access_holder',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Клонер Мерсерді күдікті ету үшін әдейі тасталған, шын мәнінде оны директор Рид бұйрығымен жасаған.',
          en: 'The spoofer was deliberately planted to frame Mercer for the dual badge swipes.',
        },
      },
    ],
    connections: [
      {
        id: 'conn_blackout_hoax',
        clueASuffix: 'temperature_log',
        clueBSuffix: 'scheduled_script',
        deductionTitle: { kk: 'Қараңғылықтың жалған спектаклі әшкереленді', en: 'Fabricated Blackout Timeline Exposed' },
        deductionText: {
          kk: 'Қойма 23:00-де босатылған, ал 02:14-тегі өшіру скрипті ұрлық уақытын бұрмалау үшін қасақана жасалған!',
          en: 'Vault 3 was emptied at 23:00, proving the 02:14 blackout was a calculated diversion scripted by Dr. Reed!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 4. FUTURE A: ECHO FROM AIRLOCK 6
  // =========================================================================
  {
    key: 'echo_airlock_6',
    era: 'future',
    title: { kk: '6-шлюз жаңғырығы', en: 'Echo from Airlock 6' },
    crimeCategory: 'Ғарыштық диверсия және станция қауіпсіздігін бұзу',
    crimeTime: '21:00 — 22:15 UTC',
    victim: {
      name: 'Dr. Marcus Vance',
      role: { kk: 'Станцияның аға кванттық астрофизигі', en: 'Senior Quantum Astrophysicist' },
    },
    hook: {
      kk: '«Этельред» орбиталық станциясында сыртқы жөндеу кезінде доктор Маркус Вэнс із-түзсіз жоғалды. Барлық шлюздер жабық, бірақ станцияның жасанды интеллекті оның даусын қабылдауды жалғастыруда.',
      en: 'Aboard Orbital Station Aethelred, Dr. Marcus Vance disappeared during routine hull inspection. All external airlocks remained sealed, yet the station AI continues receiving his encrypted voice loop.',
    },
    centralMystery: {
      kk: '6-шлюздің қысым датчигі ешқашан ашылмағанын көрсетеді. Бірақ скафандрдың байланыс буферінде жасанды синтезделген дыбыс анықталды.',
      en: 'Telemetry confirms Airlock 6 was never depressurized. Yet quantum audio analysis proves the distress transmissions are algorithmic deepfakes injected from an internal station terminal.',
    },
    incidentDescription: {
      kk: 'Доктор Вэнс қара құрдымның энергиясын өндіру жөніндегі құпия кванттық формуланы ашқан болатын. Оның жеке чипі станциядан жоғалған.',
      en: 'Dr. Vance had calculated the quantum containment equations for dark-matter harvesting. His personal neural core was extracted.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: 6-шлюздің дабылы — ойдан шығарылған! Нағыз оқиға реактор секторында болған, ал дыбыстық жаңғырық AI-ды алдау үшін іске қосылған.',
      en: 'Midpoint Revelation: The spacewalk incident never occurred! Dr. Vance was intercepted in the reactor sub-level; the looping distress audio was an automated diversion to lock down the wrong sector!',
    },
    finalTwist: {
      kk: 'Шешім: Станцияның қауіпсіздік офицері қара базар корсарларымен келісіп, доктордың чипін шлюздің радио-ретрансляторына байлап, өзін реактор арқылы шығарып жіберген.',
      en: 'Final Resolution: Tactical Security Commander Vane orchestrated the sabotage to steal the dark-matter containment formula, using synthetic voice loops to lock down the outer ring.',
    },
    solutionExplanation: {
      kk: 'Командир Вэйн Вэнстің дауыстық үлгісін синтездеп, шлюздің байланыс арнасына бағыттаған. Сол уақытта ол формуланы көшіріп, реакторды жарып жіберуге дайындалған.',
      en: 'Commander Vane synthesized Vance’s neural voice telemetry into the airlock transceiver while securing the quantum drive in his tactical armory.',
    },
    rooms: [
      {
        idSuffix: 'airlock_bay',
        name: { kk: '6-шлюз және скафандр бөлмесі', en: 'Airlock 6 & EVA Prep Bay' },
        description: { kk: 'Ауыр скафандрлар ілінген, сыртқы ғарышқа ашылатын қалың шлюз бөлмесі.', en: 'Depressurization vestibule lined with magnetic EVA suits and heavy pneumatic seals.' },
        themeColor: '#0e7490',
        hotspots: [
          {
            idSuffix: 'pressure_console',
            label: { kk: 'Шлюз қысымының мониторы', en: 'Pressure Differential Log' },
            x: 48,
            y: 42,
            evidenceSuffix: 'airlock_telemetry',
            flavorText: { kk: 'Қысым нөлге түспеген. Шлюз сыртқы ғарышқа ашылмаған.', en: 'Pressure logs prove the exterior hatch was never opened during the purported incident.' },
          },
          {
            idSuffix: 'suit_rack',
            label: { kk: 'Вэнстің №3 скафандры', en: "Vance's EVA Suit Rack" },
            x: 72,
            y: 58,
            evidenceSuffix: 'severed_transponder',
            flavorText: { kk: 'Скафандр орнында тұр, бірақ байланыс транспондері лазермен кесілген.', en: 'The EVA suit is physically present on the rack; its RF transponder was severed with a laser tool.' },
          },
        ],
      },
      {
        idSuffix: 'reactor_bay',
        name: { kk: 'Ауыр реактор және қуат арнасы', en: 'Antimatter Reactor Core' },
        description: { kk: 'Плазмалық күйік іздері мен салқындатқыш құбырлар өтетін техникалық аймақ.', en: 'Glowing blue antimatter conduit chambers with steam vents and heavy magnetic shielding.' },
        themeColor: '#1e1b4b',
        hotspots: [
          {
            idSuffix: 'coolant_valve',
            label: { kk: 'Плазма құбырының клапаны', en: 'Plasma Bypass Valve' },
            x: 40,
            y: 52,
            evidenceSuffix: 'plasma_scorch',
            flavorText: { kk: 'Әскери тактикалық костюмдер қалдыратын плазмалық күйік ізі табылды.', en: 'Thermal scorch marks matching the magnetic pulse emitter of tactical station security.' },
          },
        ],
      },
      {
        idSuffix: 'ai_core',
        name: { kk: 'Станцияның AI терминалы', en: 'Orbital Quantum AI Hub' },
        description: { kk: 'Голографиялық интерфейстер мен дыбыстық толқындар талдауы көрсетілген зал.', en: 'Holographic neural arrays processing station-wide audio and biometric telemetry.' },
        themeColor: '#581c87',
        hotspots: [
          {
            idSuffix: 'voice_buffer',
            label: { kk: 'Дауыстық сигнал буфері', en: 'Deepfake Audio Loop Buffer' },
            x: 55,
            y: 46,
            evidenceSuffix: 'synthetic_voice_log',
            flavorText: { kk: 'Дабыл даусы табиғи емес, кванттық AI арқылы синтезделген файл болып шықты.', en: 'Spectrogram analysis reveals the distress transmission was a synthesized neural deepfake.' },
          },
        ],
      },
      {
        idSuffix: 'bridge',
        name: { kk: 'Бас командалық көпір', en: 'Primary Command Bridge' },
        description: { kk: 'Орбиталық навигациялық дисплейлер мен тактикалық басқару консольдері.', en: 'Panoramic observation bridge tracking fleet vector trajectories and orbital decay.' },
        themeColor: '#0284c7',
        hotspots: [
          {
            idSuffix: 'nav_console',
            label: { kk: 'Векторлық шұғыл монитор', en: 'Navigation Override Terminal' },
            x: 50,
            y: 60,
            flavorText: { kk: '21:30-да шлюз бағытына автоматты оқшаулау бұйрығы берілген.', en: 'Log confirms the lockdown protocol was authorized from this exact bridge station.' },
          },
        ],
      },
      {
        idSuffix: 'medbay',
        name: { kk: 'Био-стазис және медициналық палата', en: 'Biostasis Medbay' },
        description: { kk: 'Крио-капсулалар мен жүрек соғысын тексеретін голограммалар орнатылған палата.', en: 'Sterile quarantine pods and neural diagnostic scanners monitoring human crew vitals.' },
        themeColor: '#047857',
        hotspots: [
          {
            idSuffix: 'stasis_pod',
            label: { kk: 'Бос крио-капсула №4', en: 'Quarantine Stasis Pod #4' },
            x: 35,
            y: 50,
            flavorText: { kk: 'Капсуланың ішкі био-сенсорында Вэнстің ДНҚ үлгісі сақталған.', en: 'Cellular telemetry proves Vance was sedated in this pod before being transferred.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'access_holder',
        defaultName: { kk: 'Командир Вэйн', en: 'Commander Riker Vane' },
        profession: { kk: 'Станцияның тактикалық қауіпсіздік басшысы', en: 'Tactical Security Commander' },
        professionCapability: {
          title: { kk: 'Тактикалық қару мен шлюз кілттері', en: 'Airlock Master Lockdown' },
          description: { kk: 'Станцияның барлық шлюздерін авариялық оқшаулау құқығына ие.', en: 'Controls emergency bulkheads, airlock protocols, and armory access keys.' },
        },
        portraitTags: ['Security Operative', 'Tactical Commander'],
        genderPreference: 'male',
        bio: { kk: 'Ғарыш соғысының ардагері. Контрабандалық чиптер тасымалдағаны үшін күдікке ілінген.', en: 'Decorated veteran under internal review for covert military technology smuggling.' },
        personality: ['defensive', 'observant', 'secretive'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Вэнстің кванттық зерттеулерін тым қауіпті деп бағалаған.', en: 'Openly opposed Vance’s research, claiming dark matter harvesting was suicidal.' },
        publicMotive: { kk: 'Шлюз маңын оқшаулап, іздестіру жұмыстарын өзі басқарды.', en: 'Spearheading the military lockdown of the outer habitation ring.' },
        hiddenSecret: { kk: 'Оның тактикалық сауытында доктор Вэнстің қан іздері мен кванттық чип бар.', en: 'Concealing Vance’s extracted neural drive inside his armory storage locker.' },
        culpritMotive: { kk: 'Кванттық формуланы ұрлап, сыртқы корсарларға сату.', en: 'Sell the dark matter equations to an outer-rim syndicate and escape via sub-light shuttle.' },
        alibiClaim: { kk: 'Дабыл кезінде қауіпсіздік бекетінде камераларды қарап отырдым.', en: 'Claims he was in the tactical control center reviewing external hull sensors.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'insider',
        defaultName: { kk: 'Адмирал Дрейк', en: 'Admiral Theron Drake' },
        profession: { kk: 'Орбиталық станция директоры', en: 'Station Director' },
        professionCapability: {
          title: { kk: 'Командалық бұйрықтар тарихы', en: 'Station Command Manifest' },
          description: { kk: 'Барлық жасырын рейс кестелері мен бұйрықтарды көре алады.', en: 'Has supreme clearance to review restricted orbital flight vector logs.' },
        },
        portraitTags: ['Station Commander', 'Admiral'],
        genderPreference: 'male',
        bio: { kk: 'Станцияның бас жетекшісі. Корпорацияның қатаң талаптарына жауапты.', en: 'High-ranking director balancing corporate profit with planetary fleet treaties.' },
        personality: ['calm', 'ambitious', 'manipulative'],
        communicationStyle: 'calm',
        relationships: { kk: 'Вэйнге сенімсіздікпен қарайды, бірақ оның әскери күшіне мұқтаж.', en: 'Distrusts Vane’s militarism but relies on his security force to suppress mutiny.' },
        publicMotive: { kk: 'Оқиғаны жасырып, станция беделін сақтап қалуға тырысады.', en: 'Desperately attempting to suppress public panic on station.' },
        hiddenSecret: { kk: 'Ол доктор Вэнсті қызметтен заңсыз шеттету бұйрығына қол қойған.', en: 'Secretly drafted an off-grid demotion order for Vance on the morning of the crime.' },
        culpritMotive: { kk: 'Формуланы корпорация пайдасына тәркілеу.', en: 'Seize the research for corporate nationalization.' },
        alibiClaim: { kk: 'Бас көпірде навигациялық есеп қабылдап отырдым.', en: 'Was in the primary bridge reviewing deep-space telemetry.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Д-р Кира Торн', en: 'Dr. Kira Thorne' },
        profession: { kk: 'Бас нейро-генетик ғалым', en: 'Chief Neurogeneticist' },
        professionCapability: {
          title: { kk: 'Нейро-дыбыстық спектрограмма', en: 'Neural Audio Demultiplexing' },
          description: { kk: 'Жасанды дауыс үлгілері мен табиғи нейро-толқындарды бірден ажыратады.', en: 'Can separate synthetic voice overtones from biological human vocal vibrations.' },
        },
        portraitTags: ['Chief Neurogeneticist', 'Quantum AI Researcher'],
        genderPreference: 'female',
        bio: { kk: 'Сананы цифрландыру саласындағы жетекші зерттеуші.', en: 'Leading neuro-engineer who developed the voice-synthesis AI protocol.' },
        personality: ['intelligent', 'secretive', 'calm'],
        communicationStyle: 'secretive',
        relationships: { kk: 'Маркус Вэнспен бәсекеде болған.', en: 'Scientific competitor of Dr. Vance in quantum neural mapping.' },
        publicMotive: { kk: 'Дауыс синтезі оның жеке зертханалық модулінде жасалған.', en: 'The deepfake algorithm was compiled inside her private neural network.' },
        hiddenSecret: { kk: 'Ол тыйым салынған клон-эмбриондар бойынша тәжірибе жүргізген.', en: 'Conducting unsanctioned neural cloning experiments in sector 9.' },
        culpritMotive: { kk: 'Вэнстің зерттеуін иемдену.', en: 'Extract Vance’s memories to finish her own patent.' },
        alibiClaim: { kk: 'Био-капсулада медитация өткізіп жаттым.', en: 'Engaged in neural recalibration inside the biosurgery module.' },
        alibiRoomIndex: 4,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Пилот Майя Лин', en: 'Pilot Maya Lin' },
        profession: { kk: 'Ғарыштық навигатор', en: 'Navigation Specialist' },
        professionCapability: {
          title: { kk: 'Шаттл қозғалысын қадағалау', en: 'Docking Vector Tracking' },
          description: { kk: 'Заңсыз ұшырылған шаттлдар мен шлюз маңындағы қозғалыстарды көреді.', en: 'Can calculate unauthorized thruster burns and stealth pod departures.' },
        },
        portraitTags: ['Navigation Specialist', 'Sub-Orbital Pilot'],
        genderPreference: 'female',
        bio: { kk: 'Станцияға жүк таситын шағын шаттлдың ұшқышы.', en: 'Cargo shuttle pilot who noticed anomalous thruster telemetry at 21:30.' },
        personality: ['observant', 'honest'],
        communicationStyle: 'honest',
        relationships: { kk: 'Вэйннің күзетшілері оның кемесін негізсіз тінте берген.', en: 'Resents Vane’s invasive security inspections of her shuttle.' },
        publicMotive: { kk: 'Оқиға кезінде шлюз маңында ұшып өткен жалғыз адам.', en: 'Passed within 200 meters of Airlock 6 during her orbital approach.' },
        hiddenSecret: { kk: 'Ол контрабандалық медициналық дәрілерді тасымалдаған.', en: 'Carrying undeclared biosurgery medicines for outer-belt miners.' },
        culpritMotive: { kk: 'Вэнстің скафандрын ұрлап сату.', en: 'Wanted to sell advanced sensor tech.' },
        alibiClaim: { kk: 'Шаттл кабинасында ұшу алдындағы тексеру жүргіздім.', en: 'Performing pre-flight checklist in the hangar bay.' },
        alibiRoomIndex: 0,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'airlock_telemetry',
        name: { kk: '6-шлюз қысым журналы (Толық жабық)', en: 'Airlock 6 Sealed Telemetry' },
        description: { kk: 'Қысым ешқашан төмендемеген. Доктор Вэнс ғарышқа сыртқа шықпаған, оқиға станция ішінде болған!', en: 'Differential sensor proving the outer hatch was never opened; the spacewalk never occurred.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.94,
        roomIndex: 0,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'synthetic_voice_log',
        name: { kk: 'Синтезделген дауыстық шифр', en: 'Synthetic Neural Deepfake Audio' },
        description: { kk: 'Радиохабарламадағы дауыс жасанды интеллект арқылы құрастырылған. Құрастыру кілті күзет терминалына тиесілі.', en: 'Spectrogram proving Vance’s voice distress loop was compiled using Commander Vane’s security key.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.96,
        roomIndex: 2,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'plasma_scorch',
        name: { kk: 'Реактордағы плазмалық күйік іздері', en: 'Antimatter Scorch from Tactical Armor' },
        description: { kk: 'Тек қауіпсіздік офицерлерінің қаруы мен сауытынан қалатын плазмалық күйік іздері.', en: 'Ionized scorch marks on the bypass conduit matching Commander Vane’s tactical armor emitter.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.91,
        roomIndex: 1,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'severed_transponder',
        name: { kk: 'Кесілген скафандр транспондері', en: 'Severed RF Beacon in Prep Bay' },
        description: { kk: 'Вэнстің скафандрынан лазермен кесіп алынып, ретрансляторға қосылған маяк.', en: 'The physical transponder chip cut from Vance’s suit and wired into the station intercom loop.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'key',
        clueWeight: 0.75,
        roomIndex: 0,
      },
    ],
    connections: [
      {
        id: 'conn_airlock_hoax',
        clueASuffix: 'airlock_telemetry',
        clueBSuffix: 'synthetic_voice_log',
        deductionTitle: { kk: 'Жалған апат пен дауыстық диверсия әшкереленді', en: 'Fabricated Airlock Incident Exposed' },
        deductionText: {
          kk: 'Шлюз ешқашан ашылмаған! Дабыл даусы Командир Вэйннің күзет терминалынан жіберілген синтетикалық жаңғырық болып шықты!',
          en: 'Airlock 6 never opened! The distress signal was an artificial voice loop generated by Commander Vane to divert attention from the reactor robbery!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'access_holder',
  },

  // =========================================================================
  // 5. VICTORIAN C: THE WHISPERING GALLERY
  // =========================================================================
  {
    key: 'whispering_gallery',
    era: 'victorian',
    title: { kk: 'Сыбырлар галереясының қастандығы', en: 'The Whispering Gallery Mystery' },
    crimeCategory: 'Шіркеу мұрағатын тонау және улы түтінмен қастандық',
    crimeTime: '19:45 — 20:20',
    victim: {
      name: 'Archbishop Gregory Hastings',
      role: { kk: 'Собордың бас архиепископы', en: 'Archbishop of St. Jude Cathedral' },
    },
    hook: {
      kk: 'Собордың биік күмбезіндегі Сыбырлар галереясында архиепископ уланған түтіннен есінен танып құлады. Сол сәтте құлыптаулы көне діни шежіре мен алтын таспиқ жоғалды.',
      en: 'In the high Whispering Gallery beneath the cathedral dome, Archbishop Hastings collapsed from poisoned incense. At that exact moment, the locked 14th-century illuminated psalter disappeared.',
    },
    centralMystery: {
      kk: 'Күмбезге апаратын жалғыз бұрандалы баспалдақ күзетілген. Сыбыр дыбыстары галерея арқылы алысқа тарайтын ерекше акустика қылмыскерге уақытты жасыруға мүмкіндік берген.',
      en: 'The spiral stairs to the gallery were strictly guarded. The cathedral’s famous circular acoustics were manipulated to disguise the true moment of the attack.',
    },
    incidentDescription: {
      kk: 'Архиепископ собордың жеке қорынан үлкен қаржы жымқыру дерегін тергеп жатқан болатын. Оның тергеу күнделігі өртелген.',
      en: 'Hastings had been conducting an internal audit into missing cathedral trust funds. His audit ledger was burned in the vestry stove.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Улы түтін күмбезден емес, төменгі орган құбырларының ауа желдеткіші арқылы жіберілген!',
      en: 'Midpoint Revelation: The toxic belladonna vapor was not released inside the dome, but pumped up through organ pneumatic pipes from the crypt below!',
    },
    finalTwist: {
      kk: 'Шешім: Бас архидьякон өз қылмыстарын жасыру үшін орган құбырын реттеп, акустикалық резонанс пен улы түтінді қатар пайдаланған.',
      en: 'Final Resolution: Canon Archdeacon Sterling used the organ bellows to force poisoned incense up the acoustic flues, framing the bellringer.',
    },
    solutionExplanation: {
      kk: 'Архидьякон Стерлинг қаржылық ұрлықты жасыру үшін архиепископты улап, шежірені жеке көлігіне жасырған. Орган шеберінің кілті оның кінәсін толық дәлелдейді.',
      en: 'Canon Sterling engineered the poisoned draft using the crypt organ bellows to silence the Archbishop, securing the priceless psalter in his private carriage.',
    },
    rooms: [
      {
        idSuffix: 'dome_gallery',
        name: { kk: 'Күмбезді сыбырлар галереясы', en: 'Whispering Gallery Dome' },
        description: { kk: 'Биік мәрмәр қоршаулы дөңгелек балкон, төменде үлкен собор залы көрінеді.', en: 'Circular marble gallery 100 feet above the cathedral nave with eerie acoustic reflections.' },
        themeColor: '#78350f',
        hotspots: [
          {
            idSuffix: 'silver_censer',
            label: { kk: 'Күміс хош иіс кадилосы', en: 'Scorched Silver Censer' },
            x: 52,
            y: 48,
            evidenceSuffix: 'belladonna_residue',
            flavorText: { kk: 'Кадило ішіндегі көмір қалдығынан улы белладонна шайыры табылды.', en: 'Ash inside the silver censer testing positive for concentrated toxic belladonna resin.' },
          },
        ],
      },
      {
        idSuffix: 'crypt_vault',
        name: { kk: 'Жертөле және көне крипта', en: 'Norman Crypt & Pneumatic Bellows' },
        description: { kk: 'Тас сағаналар, ауыр бағандар және органның үлкен ауа үрлегіштері.', en: 'Low stone arches housing ancestral bishops’ tombs and heavy leather organ bellows.' },
        themeColor: '#1c1917',
        hotspots: [
          {
            idSuffix: 'air_flue',
            label: { kk: 'Орган ауа құбырының клапаны', en: 'Pneumatic Ventilation Flue' },
            x: 45,
            y: 55,
            evidenceSuffix: 'flue_soot',
            flavorText: { kk: 'Ауа құбырының ішінде жаңа күйе мен қара барқыт матаның қалдығы бар.', en: 'Fresh soot and a scrap of tailored ecclesiastical silk caught inside the ventilation damper.' },
          },
        ],
      },
      {
        idSuffix: 'choir_vestry',
        name: { kk: 'Діни қызметкерлер киім бөлмесі', en: 'Canons Vestry & Robing Room' },
        description: { kk: 'Алтын жіппен тігілген шапандар, емен шкафтар және камин.', en: 'Carved oak vestment presses, ceremonial silver vessels, and cold hearth.' },
        themeColor: '#451a03',
        hotspots: [
          {
            idSuffix: 'vestment_press',
            label: { kk: 'Архидьякон шкафы', en: "Archdeacon's Press" },
            x: 60,
            y: 40,
            evidenceSuffix: 'charred_audit_ledger',
            flavorText: { kk: 'Камин күлінің астынан собор есеп кітабының өртелген бұрышы табылды.', en: 'Partially charred fragment of the cathedral audit register proving financial embezzlement.' },
          },
        ],
      },
      {
        idSuffix: 'bell_tower',
        name: { kk: 'Қоңырау мұнарасы', en: 'Belfry & Clock Chamber' },
        description: { kk: 'Алып қола қоңыраулар, қалың арқандар және жел гуілдеген тар саңылаулар.', en: 'Massive bronze bells hung in ancient oak beams; heavy tolling ropes sway in the draft.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'rope_locker',
            label: { kk: 'Қоңыраушының құрал жәшігі', en: 'Bellringer Tool Locker' },
            x: 35,
            y: 60,
            evidenceSuffix: 'belfry_schedule',
            flavorText: { kk: '19:45 пен 20:15 аралығында қоңырау соғу кестесі жазылған қағаз.', en: 'A marked schedule noting deliberate 20-minute gap in bell chimes.' },
          },
        ],
      },
      {
        idSuffix: 'deanery_study',
        name: { kk: 'Архиепископтың жеке жұмыс бөлмесі', en: 'Archbishop Deanery Library' },
        description: { kk: 'Көне библиялар, балауыз шамдар және бұзылған құжат сандығы.', en: 'Gothic study lined with leather folios and a forced iron lockbox.' },
        themeColor: '#0f172a',
        hotspots: [
          {
            idSuffix: 'psalter_stand',
            label: { kk: 'Шежіре тұғыры (Бос)', en: 'Empty Manuscript Lectern' },
            x: 50,
            y: 45,
            evidenceSuffix: 'gold_leaf_clipping',
            flavorText: { kk: 'Тұғыр маңынан 14-ғасырлық алтын жалатылған парақтың үзіндісі табылды.', en: 'Gold leaf flakes scattered across the velvet runner where the psalter rested.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Архидьякон Персиваль Стерлинг', en: 'Canon Percival Sterling' },
        profession: { kk: 'Собордың қаржы басқарушысы', en: 'Cathedral Bursar & Archdeacon' },
        professionCapability: {
          title: { kk: 'Шіркеу қорын бақылау', en: 'Cathedral Trust Governance' },
          description: { kk: 'Барлық қайырымдылық қорлары мен құпия діни мұрағаттарды басқарады.', en: 'Has direct authority over all diocesan endowments and secret relic chambers.' },
        },
        portraitTags: ['Solicitor', 'Barrister', 'Noble', 'Heir'],
        genderPreference: 'male',
        bio: { kk: 'Амбициясы зор ақсүйек діндар. Собордың қайырымдылық қаржысын Лондон биржасында жоғалтқан.', en: 'Aristocratic church administrator facing imminent ruin from clandestine stock speculation.' },
        personality: ['ambitious', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Архиепископтың тексеруінен қатты қорыққан.', en: 'Desperately sought to silence Archbishop Hastings before the audit report reached the bishop.' },
        publicMotive: { kk: 'Құжаттарды қорғауға жауапты болғандықтан бірінші куәлік берді.', en: 'Claims he was in the vestry balancing the choir stipends.' },
        hiddenSecret: { kk: 'Оның сейфінен 5,000 фунттық собор ақшасының кемдігі шықты.', en: 'Embezzled £5,000 from the diocesan relief fund to cover debt.' },
        culpritMotive: { kk: 'Архиепископтың көзін жойып, тексеруді тоқтату.', en: 'Eliminate Hastings and steal the valuable illuminated psalter.' },
        alibiClaim: { kk: 'Қызметкерлер бөлмесінде шіркеу есебін жазып отырдым.', en: 'Was in the vestry tabulating parish tithe receipts.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Томас Клей', en: 'Thomas Clay' },
        profession: { kk: 'Бас қоңыраушы мен қақпашы', en: 'Head Belfry Keeper' },
        professionCapability: {
          title: { kk: 'Күмбез кілттеріне бақылау', en: 'Belfry Passage Custody' },
          description: { kk: 'Күмбезге және мұнараға апаратын барлық құлыптардың кілтін ұстайды.', en: 'Only keyholder to the winding stone staircase leading to the upper gallery.' },
        },
        portraitTags: ['Clockmaker', 'Artisan', 'Locksmith'],
        genderPreference: 'male',
        bio: { kk: 'Собор қоңырауын 30 жыл соққан қарт шебер. Саңыраулық белгілері бар.', en: 'Veteran bellringer who knows every hidden hollow and echo in the cathedral dome.' },
        personality: ['honest', 'defensive'],
        communicationStyle: 'honest',
        relationships: { kk: 'Стерлингпен келіспей қалған; оны пара беруде айыптаған.', en: 'Refused bribes from Sterling to leave the upper dome gates unlocked.' },
        publicMotive: { kk: 'Күмбез кілті тек өзінде болғандықтан басты күдікке ілікті.', en: 'Held the sole iron key to the dome stair door.' },
        hiddenSecret: { kk: 'Ол түнгі уақытта күмбезден Лондон панорамасын тамашалайтын.', en: 'Left the dome door ajar that evening to let in the cool evening breeze.' },
        culpritMotive: { kk: 'Қоңырау мұнарасын жөндеуге ақша алу.', en: 'Extort funds for the belfry restoration.' },
        alibiClaim: { kk: 'Мұнарада қоңырау арқандарын майлап жүрдім.', en: 'Was in the belfry greasing the tenor bell gudgeons.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Себастьян Морли', en: 'Sebastian Morley' },
        profession: { kk: 'Собордың бас органисі', en: 'Master Cathedral Organist' },
        professionCapability: {
          title: { kk: 'Акустикалық резонанс білімі', en: 'Cathedral Acoustic Chronometry' },
          description: { kk: 'Дыбыстың собор ішіндегі таралу жылдамдығы мен бағытын дәл есептейді.', en: 'Can map acoustic delay and identify subterranean airflow currents in the gallery.' },
        },
        portraitTags: ['Artisan', 'Clockmaker'],
        genderPreference: 'male',
        bio: { kk: 'Көне музыка білгірі, орган құбырлары мен күмбез акустикасының маманы.', en: 'Eccentric musical prodigy obsessed with mathematical resonance and pipe harmonics.' },
        personality: ['intelligent', 'observant'],
        communicationStyle: 'calm',
        relationships: { kk: 'Архиепископқа орган құбырларындағы ауа тарту жүйесін жөндеуді ұсынған.', en: 'Warned Hastings that the crypt air vents connected directly to the upper dome.' },
        publicMotive: { kk: 'Оқиға кезінде органда тәжірибе жасап отырған.', en: 'At the organ console when the incident occurred.' },
        hiddenSecret: { kk: 'Ол криптадағы жасырын ауа клапанын байқап, ешкімге айтпаған.', en: 'Knew the pneumatic organ bypass could channel vapors into the whispering gallery.' },
        culpritMotive: { kk: 'Көне музыкалық жазбаларды ұрлау.', en: 'Acquiring medieval plainchant illuminated folios.' },
        alibiClaim: { kk: 'Криптада органның ауа үрлегішін сынап отырдым.', en: 'Tuning pedal reed pipes in the lower crypt chamber.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Мисс Клара Пембертон', en: 'Clara Pemberton' },
        profession: { kk: 'Мұрағат палеографы', en: 'Archival Paleographer' },
        professionCapability: {
          title: { kk: 'Көне жазбаларды оқу', en: 'Illuminated Manuscript Dating' },
          description: { kk: 'Пергамент пен сияның ғасырлық түпнұсқалығын анықтай алады.', en: 'Expert in medieval script authentication and ecclesiastical binding seals.' },
        },
        portraitTags: ['Curator', 'Antiquarian', 'Lady'],
        genderPreference: 'female',
        bio: { kk: 'Жоғалған шежірені каталогтау үшін Оксфордтан шақырылған ғалым.', en: 'Scholarly archivist cataloging the Hastings library collection for the university.' },
        personality: ['nervous', 'observant'],
        communicationStyle: 'nervous',
        relationships: { kk: 'Стерлингтің кітапханадан құжаттарды алып шыққанын көрген.', en: 'Noticed Sterling slipping leather folios out of the deanery library earlier.' },
        publicMotive: { kk: 'Шежіре оның көз алдында жоғалды.', en: 'Direct witness who raised the alarm when Hastings collapsed.' },
        hiddenSecret: { kk: 'Ол архидьяконның бопсалау хатын оқып қойған.', en: 'Discovered a torn note threatening Hastings if the audit proceeded.' },
        culpritMotive: { kk: 'Шежірені жеке коллекцияға көшіру.', en: 'Sell the psalter to an overseas collector.' },
        alibiClaim: { kk: 'Кітапханада қолжазбаларды сұрыптап отырдым.', en: 'Examining Latin lectionaries in the deanery study.' },
        alibiRoomIndex: 4,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'belladonna_residue',
        name: { kk: 'Кадилодағы белладонна шайыры', en: 'Belladonna-Infused Incense Residue' },
        description: { kk: 'Күміс кадилодан табылған улы түтін қалдығы. Тек дәріханадан арнайы рецептпен беріледі.', en: 'Deadly nightshade extract blended into holy frankincense, designed to induce asphyxiation.' },
        type: 'biological',
        isEssential: true,
        svgIcon: 'flask-conical',
        clueWeight: 0.94,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'flue_soot',
        name: { kk: 'Ауа құбырындағы қара жібек талшық', en: 'Black Silk Thread on Bellows Flue' },
        description: { kk: 'Криптаның ауа үрлегіш клапанына қыстырылып қалған ақсүйек діндарлар шапанының жібек талшығы.', en: 'Tailored black ecclesiastical silk thread caught in the organ pneumatic valve lever.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.92,
        roomIndex: 1,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'charred_audit_ledger',
        name: { kk: 'Өртелген қаржылық есеп кітабы', en: 'Charred Audit Register Page' },
        description: { kk: 'Каминнен табылған собор кассасының жартылай өртелген парағы. Архидьяконның қолымен жазылған.', en: 'Auditing scrap logging a £5,000 unexplained shortfall bearing Archdeacon Sterling’s initials.' },
        type: 'document',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.96,
        roomIndex: 2,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'gold_leaf_clipping',
        name: { kk: 'Шежіре пергаментінің алтын қиындысы', en: 'Gilded Codicil Flake' },
        description: { kk: 'Еденнен табылған көне пергаменттің алтын жалатылған микро-бөлшегі.', en: 'Flake of 14th-century gold illumination dislodged when the psalter was hastily wrapped.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'book-open',
        clueWeight: 0.74,
        roomIndex: 4,
      },
      {
        idSuffix: 'belfry_schedule',
        name: { kk: 'Қоңырау мұнарасының кестесі', en: 'Marked Belfry Chiming Schedule' },
        description: { kk: '19:45 пен 20:15 арасындағы соғылу уақыты әдейі өшірілген кесте қағазы.', en: 'Log showing someone deliberately paid Thomas Clay to hold the chimes during the evening service.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'file-text',
        clueWeight: 0.7,
        roomIndex: 3,
        implicatesRole: 'access_holder',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Клей ақшаны мұнара жөндеу үшін Стерлингтен алғанын мойындады, бірақ улау жоспарынан хабарсыз болған.',
          en: 'Thomas Clay accepted money for belfry timber repairs without knowing it was a cover for the organ sabotage.',
        },
      },
    ],
    connections: [
      {
        id: 'conn_cathedral_acoustic',
        clueASuffix: 'belladonna_residue',
        clueBSuffix: 'flue_soot',
        deductionTitle: { kk: 'Крипта арқылы улау жоспары әшкереленді', en: 'Pneumatic Poison Delivery Unmasked' },
        deductionText: {
          kk: 'Улы түтін күмбезде емес, төменгі криптадағы орган үрлегіші арқылы жіберілген! Клапандағы қара жібек архидьякон Стерлингтің қатысын дәлелдейді!',
          en: 'The belladonna vapor was pumped from the crypt through the organ pneumatic line; the silk thread proves Archdeacon Sterling manipulated the valve!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 6. MODERN B: THE PROVENANCE DOUBLE
  // =========================================================================
  {
    key: 'museum_double',
    era: 'modern',
    title: { kk: 'Музейдегі құпия көшірме', en: 'The Provenance Double' },
    crimeCategory: 'Өнер туындысын жымқыру және жоғары дәлдіктегі көшірмемен ауыстыру',
    crimeTime: '22:15 — 22:45',
    victim: {
      name: 'Metropolitan Fine Arts Museum',
      role: { kk: 'Мемлекеттік өнер және реставрация мұражайы', en: 'Metropolitan Art & Antiquities Institute' },
    },
    hook: {
      kk: 'Түнгі галереяда тұрған 40 миллион долларлық Ренессанс картинасы лазерлік күзет жүйесінің іске қосылуынсыз-ақ синтетикалық жасанды көшірмеге ауыстырылып кеткен.',
      en: 'A $40M Renaissance masterpiece hanging in Gallery 4 was flawlessly swapped with a photopolymer replica without triggering a single infrared tripwire.',
    },
    centralMystery: {
      kk: 'Рама мен лазерлер бұзылмаған. Бірақ ультракүлгін сәулесі кенептің бояуында жақында жасалған синтетикалық жылтыратқыш бар екенін көрсетті.',
      en: 'The gilded frame remained locked and sensors undisturbed. Yet portable UV spectrometers reveal the canvas underlayer uses modern acrylic binder, dried mere hours ago.',
    },
    incidentDescription: {
      kk: 'Картина келесі күні Еуропаға ресми көрмеге жіберілуі тиіс еді. Нағыз туынды арнайы жүк жәшігімен шығарылған.',
      en: 'The painting was scheduled for insured diplomatic transport at dawn. The original masterpiece had been spirited away in a diplomatic freight crate.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Картина түнде емес, реставрация шеберханасында күндіз көшіріліп, лазерлер профилактика кезінде 5 минутқа өшірілгенде ауыстырылған!',
      en: 'Midpoint Revelation: The swap occurred during scheduled sensor calibration at 22:20; the forgery had been cured in the conservation laboratory for two days!',
    },
    finalTwist: {
      kk: 'Шешім: Бас куратор өзінің қыруар қарыздарын жабу үшін реставратордың лабораториясын пайдаланып, түпнұсқаны шетелдік коллекционерге сатқан.',
      en: 'Final Resolution: Senior Curator Julian Vance exploited his master alarm bypass and restoration clearance to switch the canvas and pack it for private export.',
    },
    solutionExplanation: {
      kk: 'Куратор Джулиан Вэнс лазерлік тексеру уақытын пайдаланып, картинаны ауыстырған. Жүк қоймасындағы жалған экспорттық құжат оның айыбын дәлелдейді.',
      en: 'Senior Curator Julian Vance pre-planned the substitution using duplicate archival crates and disabled the localized camera feed during the swap.',
    },
    rooms: [
      {
        idSuffix: 'master_gallery',
        name: { kk: 'Ренессанс шедеврлер залы', en: 'Renaissance Master Gallery' },
        description: { kk: 'Мәрмәр еден, бағалы суреттер және лазерлік қорғаныс өрісі бар кең зал.', en: 'High-security gallery with velvet barriers, directional spotlights, and laser tripwires.' },
        themeColor: '#831843',
        hotspots: [
          {
            idSuffix: 'display_frame',
            label: { kk: 'Бос емес, бірақ жалған рама', en: 'Illuminated Wall Frame' },
            x: 50,
            y: 45,
            evidenceSuffix: 'synthetic_varnish_swab',
            flavorText: { kk: 'Кенеп шетінде әлі толық кеппеген синтетикалық акрил лак табылды.', en: 'Swab analysis indicates synthetic photopolymer varnish applied under 6 hours ago.' },
          },
        ],
      },
      {
        idSuffix: 'restoration_lab',
        name: { kk: 'Реставрация және спектроскопия зертханасы', en: 'Conservation Chemistry Lab' },
        description: { kk: 'Микроскоптар, бояу пигменттері және ультракүлгін камералар орнатылған бөлме.', en: 'Precision chemical benches, pigment racks, and stereoscopic UV analysis microscopes.' },
        themeColor: '#0f766e',
        hotspots: [
          {
            idSuffix: 'easel_station',
            label: { kk: 'Шебердің мольберт үстелі', en: 'Master Conservation Easel' },
            x: 42,
            y: 50,
            evidenceSuffix: 'ultraviolet_canvas_cut',
            flavorText: { kk: 'Үстел астындағы қоқыс жәшігінен 16-ғасыр кенебінің кесілген сынамасы табылды.', en: 'Trimming scrap of genuine linen canvas testing positive for historical age.' },
          },
        ],
      },
      {
        idSuffix: 'security_hub',
        name: { kk: 'Бас күзет мониторингі', en: 'Central Security Matrix' },
        description: { kk: 'Көп экранды бейнеқабырға мен лазерлік датчиктер консолі.', en: 'Multi-screen command hub monitoring real-time infrared feeds and access card logs.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'sensor_terminal',
            label: { kk: 'Лазер жүйесінің журналы', en: 'Laser Array Event Log' },
            x: 58,
            y: 38,
            evidenceSuffix: 'laser_sensor_log',
            flavorText: { kk: '22:20-да 4-галереяның лазерлері 4 минут 30 секундқа «калибрлеу» режиміне ауыстырылған.', en: 'Audit trail shows Gallery 4 laser perimeter placed in maintenance bypass at 22:20.' },
          },
        ],
      },
      {
        idSuffix: 'archival_vault',
        name: { kk: 'Құпия туындылар қоймасы', en: 'Subterranean Archival Vault' },
        description: { kk: 'Темір торлар, температура бақылаушылар және сақтау сейфтері.', en: 'Climate-controlled subterranean steel vault housing museum loan collections.' },
        themeColor: '#0284c7',
        hotspots: [
          {
            idSuffix: 'vault_shelf',
            label: { kk: 'Дипломатиялық жәшік сөресі', en: 'Diplomatic Transit Shelf' },
            x: 35,
            y: 60,
            evidenceSuffix: 'duplicate_freight_crate',
            flavorText: { kk: 'Швейцарияға баратын дипломатиялық мөрі бар арнайы жәшік.', en: 'Reinforced art transit crate labeled for Swiss diplomatic courier dispatch.' },
          },
        ],
      },
      {
        idSuffix: 'loading_bay',
        name: { kk: 'Жүк тиеу айлағы', en: 'Secure Freight Bay' },
        description: { kk: 'Қорғалған жүк көліктері мен штрих-код сканерлері орнатылған ангар.', en: 'Heavy roller shutter bay with hydraulic loading lift and customs seal station.' },
        themeColor: '#334155',
        hotspots: [
          {
            idSuffix: 'customs_desk',
            label: { kk: 'Кедендік ресімдеу үстелі', en: 'Customs Manifest Terminal' },
            x: 65,
            y: 65,
            evidenceSuffix: 'forged_export_permit',
            flavorText: { kk: 'Куратордың жеке кілтімен бекітілген жедел экспорттық рұқсат қағазы.', en: 'Urgent cultural export manifest bearing digital authentication from Vance.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Джулиан Вэнс', en: 'Julian Vance' },
        profession: { kk: 'Еуропалық өнер бас кураторы', en: 'Chief European Art Curator' },
        professionCapability: {
          title: { kk: 'Мұрағаттық сараптама мен бағалау', en: 'Master Provenance Appraisal' },
          description: { kk: 'Кез келген картинаның түпнұсқалық тарихы мен сату құқығын толық біледі.', en: 'Possesses authority to verify artwork origin certificates and approve loan shipping.' },
        },
        portraitTags: ['Research Director', 'CEO', 'Executive', 'Insider'],
        genderPreference: 'male',
        bio: { kk: 'Халықаралық беделі зор куратор. Жеке өнер қоры 12 миллион доллар шығынға батқан.', en: 'Distinguished art historian facing secret insolvency from offshore venture capital failures.' },
        personality: ['ambitious', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Реставратор Хеленамен ынтымақтасқан, бірақ оның жұмысын өз атына жазатын.', en: 'Oversaw Helena’s laboratory; subtly took credit for her pigment restoration breakthroughs.' },
        publicMotive: { kk: 'Картинаның дипломатиялық сапарын ұйымдастырған басты тұлға.', en: 'Personally coordinated the high-profile European museum loan exchange.' },
        hiddenSecret: { kk: 'Ол Цюрихтегі швейцариялық коллекционермен 30 миллионға алдын ала келісім жасаған.', en: 'Pre-arranged the illicit private sale with an overseas buyer for $30,000,000.' },
        culpritMotive: { kk: 'Түпнұсқаны сатып, орнына көшірмені қалдыру.', en: 'Replace the Renaissance original with a duplicate and smuggle the real canvas out.' },
        alibiClaim: { kk: 'Кедендік құжаттарды толтырып, жүк айлағында болдым.', en: 'Was in the freight bay certifying customs shipping crates.' },
        alibiRoomIndex: 4,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Маркус Кейн', en: 'Marcus Kane' },
        profession: { kk: 'Музей қауіпсіздік бастығы', en: 'Director of Facility Security' },
        professionCapability: {
          title: { kk: 'Лазерлік жүйелер мен дабыл коды', en: 'Biometric Grid Override' },
          description: { kk: 'Барлық лазерлік сенсорлар мен дабыл желісін өшіру құқығы бар.', en: 'Can calibrate infrared beams and schedule maintenance bypass windows.' },
        },
        portraitTags: ['Security Engineer', 'Facility Guard', 'Access Holder'],
        genderPreference: 'male',
        bio: { kk: 'Бұрынғы құқық қорғау органының офицері. Тәртіпті қатаң ұстанады.', en: 'Former federal security consultant with an unblemished 15-year facility record.' },
        personality: ['defensive', 'observant', 'calm'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Вэнстің кедендік көлікті түнде жіберу талабына қарсы болған.', en: 'Resisted Vance’s pressure to allow midnight loading dock dispatch.' },
        publicMotive: { kk: 'Лазерлік калибрлеу бұйрығына қол қойған адам.', en: 'Authorized the 22:20 maintenance window for sensor recalibration.' },
        hiddenSecret: { kk: 'Оның жеке компьютерінен лазерлерді қашықтан басқару бағдарламасы табылды.', en: 'Kept an unsanctioned mobile override app on his personal tablet.' },
        culpritMotive: { kk: 'Қауіпсіздік кемшілігін жасырып, пара алу.', en: 'Accepting kickbacks to ignore loading dock discrepancies.' },
        alibiClaim: { kk: 'Күзет орталығында камералар жазбасын тексеріп отырдым.', en: 'Monitoring real-time CCTV split-screens in the security hub.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Д-р Хелена Фосс', en: 'Dr. Helena Voss' },
        profession: { kk: 'Аға реставратор-химик', en: 'Senior Art Restorer & Chemist' },
        professionCapability: {
          title: { kk: 'Спектроскопиялық бояу сараптамасы', en: 'Pigment Mass Spectrometry' },
          description: { kk: 'Бояудың химиялық жасын, лак құрамын және пигмент қабатын бірден анықтайды.', en: 'Can identify synthetic polymers and date oil binders down to the manufacturing decade.' },
        },
        portraitTags: ['Biochemist', 'Lab Technician', 'Specialist'],
        genderPreference: 'female',
        bio: { kk: 'Пигменттер химиясы бойынша халықаралық сарапшы. Көшірме жасау техникасын жетік меңгерген.', en: 'Brilliant art chemist who has recreated historic master pigments for academic research.' },
        personality: ['intelligent', 'honest', 'nervous'],
        communicationStyle: 'honest',
        relationships: { kk: 'Вэнс оның зертханасынан акрилді жарық полимерлерін сұрап алған.', en: 'Provided chemical binder supplies to Vance under the pretense of museum frame sealing.' },
        publicMotive: { kk: 'Көшірменің пигменті оның жеке зертханасында дайындалған.', en: 'The synthetic varnish used on the fake originated from her laboratory bench.' },
        hiddenSecret: { kk: 'Ол картинаны сақтандыру алдында микро-сызат барын байқап, жасырып қалған.', en: 'Concealed a micro-fracture during initial provenance intake.' },
        culpritMotive: { kk: 'Өз талантын дәлелдеп, шедеврді иемдену.', en: 'Prove her replicas are indistinguishable from Renaissance originals.' },
        alibiClaim: { kk: 'Зертханада көне пигменттерді талдап отырдым.', en: 'Running infrared reflectography scans in the restoration lab.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Виктор Рей', en: 'Victor Ray' },
        profession: { kk: 'Сақтандыру компаниясының аудиторы', en: 'Senior Underwriting Auditor' },
        professionCapability: {
          title: { kk: 'Құжаттамалық аудит', en: 'Insured Asset Chain-of-Custody' },
          description: { kk: 'Жәшіктер мен тасымалдау құжаттарының мөрлерін салыстырады.', en: 'Verifies customs seal integrity and international policy indemnification codes.' },
        },
        portraitTags: ['Executive Assistant', 'Corporate Counsel', 'Witness'],
        genderPreference: 'male',
        bio: { kk: 'Халықаралық сақтандыру агенттігінің қатаң өкілі.', en: 'Meticulous Lloyd’s syndicate auditor sent to supervise the transport packing.' },
        personality: ['observant', 'defensive'],
        communicationStyle: 'calm',
        relationships: { kk: 'Вэнстің асығыс әрекеттерінен күдіктенген.', en: 'Noticed Vance carrying an oversized archival portfolio into Gallery 4 at 22:15.' },
        publicMotive: { kk: 'Жүк тиеу кезінде бірінші болып дабыл көтерген.', en: 'Raised the alarm when the canvas weight didn’t match the insurance manifest.' },
        hiddenSecret: { kk: 'Ол сақтандыру полисіндегі 2 миллиондық қателікті жасырған.', en: 'Overlooked a discrepancy in the insured transit bill-of-lading.' },
        culpritMotive: { kk: 'Сақтандыру төлемін жымқыру.', en: 'Collude with smugglers for an insurance settlement payout.' },
        alibiClaim: { kk: 'Қоймада жәшіктердің салмағын өлшеп жүрдім.', en: 'Verifying crate tare weights in the archival vault.' },
        alibiRoomIndex: 3,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'synthetic_varnish_swab',
        name: { kk: 'Синтетикалық полимер жағындысы', en: 'Cured Photopolymer Varnish Swab' },
        description: { kk: 'Рамадан алынған сынама. Құрамында 2024 жылғы синтетикалық акрил бар екені дәлелденді.', en: 'Mass spectrometer swab proving the canvas varnish was formulated with 21st-century polymers.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'flask-conical',
        clueWeight: 0.95,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'laser_sensor_log',
        name: { kk: 'Лазер өрісінің 22:20 өшу журналы', en: 'Laser Array 22:20 Maintenance Override' },
        description: { kk: '4-галереяның күзеті куратор Вэнстің жеке рұқсатымен 4 минутқа өшірілген.', en: 'System audit proving the laser tripwire was disabled by Julian Vance’s executive credential.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.93,
        roomIndex: 2,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'duplicate_freight_crate',
        name: { kk: 'Екі қабатты дипломатиялық жәшік', en: 'Counterfeit Diplomatic Transit Crate' },
        description: { kk: 'Қоймада тұрған арнайы жүк жәшігінің ішінде түпнұсқа кенепті жасыратын құпия қуыс табылды.', en: 'Custom foam-lined art crate fitted with a concealed false bottom matching the original canvas.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'key',
        clueWeight: 0.96,
        roomIndex: 3,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'ultraviolet_canvas_cut',
        name: { kk: 'Зертханадағы тарихи кенеп қиындысы', en: 'Trimmed Historical Canvas Edge' },
        description: { kk: 'Көшірмені түпнұсқа рамаға сыйғызу үшін кесілген кенеп жиегі.', en: 'Linen canvas scrap showing microscopic shear cuts matching a surgical rotary blade.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'eye',
        clueWeight: 0.72,
        roomIndex: 1,
        implicatesRole: 'specialist',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Д-р Фосс бұл сынаманы кенепті консервациялау кезінде заңды түрде алған, бірақ Вэнс оның үстелін жасырын пайдаланған.',
          en: 'Dr. Voss removed the sample during an earlier approved stabilization test; Vance stole her tools to prepare the fake.'
        },
      },
      {
        idSuffix: 'forged_export_permit',
        name: { kk: 'Қолдан жасалған кедендік рұқсат', en: 'Falsified Cultural Export Permit' },
        description: { kk: 'Швейцарияға шығарылатын өнер туындысы туралы бұрмаланған ресми мөр.', en: 'Export declaration authorizing immediate customs clearance without physical art unboxing.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'file-text',
        clueWeight: 0.86,
        roomIndex: 4,
        implicatesRole: 'insider',
      },
    ],
    connections: [
      {
        id: 'conn_museum_swap',
        clueASuffix: 'synthetic_varnish_swab',
        clueBSuffix: 'duplicate_freight_crate',
        deductionTitle: { kk: 'Көшірмені ауыстыру және жасырын жәшік әшкереленді', en: 'Forgery Swap and Concealed Crate Exposed' },
        deductionText: {
          kk: 'Синтетикалық көшірме рамаға ілінгенде, нағыз шедевр дипломатиялық жәшіктің құпия қуысына тығылған! Бұйрықты куратор Вэнс берген!',
          en: 'The photopolymer replica was hung while the genuine Renaissance canvas was concealed inside the false-bottomed diplomatic crate orchestrated by Julian Vance!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 7. MODERN C: THE PENTHOUSE TERMINAL
  // =========================================================================
  {
    key: 'penthouse_terminal',
    era: 'modern',
    title: { kk: '«Сингулярлық» пентхаусының құпиясы', en: 'The Singularity Penthouse Breach' },
    crimeCategory: 'Корпоративтік кибер-тыңшылық және бас директорды улау',
    crimeTime: '21:10 — 21:35',
    victim: {
      name: 'Ethan Cole',
      role: { kk: 'Singularity Quantum Корпорациясының бас директоры', en: 'CEO of Singularity Quantum Systems' },
    },
    hook: {
      kk: 'Зәулім ғимараттың 64-қабатындағы пентхауста бас директор сусынына қосылған токсиннен есінен танып, оның жеке кванттық шифр кілті сыртқы спутникке таратылды.',
      en: 'In the 64th-floor penthouse, CEO Ethan Cole was incapacitated by a designer neurotoxin and his proprietary 512-bit quantum master key was broadcast to an offshore satellite receiver.',
    },
    centralMystery: {
      kk: 'Пентхаустың лифті мен саусақ ізі сенсорлары тек төрт адамға ғана қолжетімді. Серверлік бөлмедегі кванттық терминалдан қолғап ізі мен флеш-чип табылды.',
      en: 'The private penthouse elevator and biometric airlock admit only four individuals. Forensic sweeps of the server suite located an unauthorized hardware transponder plugged directly into the fiber backbone.',
    },
    incidentDescription: {
      kk: 'Кванттық шифр банктік трансферлер мен мемлекеттік қорғаныс келісім-шарттарын қорғайтын негізгі алгоритм болатын.',
      en: 'The master key controls the encryption architecture for multi-billion dollar municipal energy grids and financial exchanges.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Кванттық кілт сыртқы хакерлік шабуылмен емес, директордың жеке биометриялық сақинасын ұйықтап жатқанда көшіріп алу арқылы ұрланған!',
      en: 'Midpoint Revelation: The breach was not a remote cyber-hack! Cole’s biometric ring was pressed onto the sensor pad while he was unconscious from the poisoned whiskey!',
    },
    finalTwist: {
      kk: 'Шешім: Корпоративтік вице-президент өзінің бәсекелес холдингке сатылған құпия акцияларын жабу үшін деректерді террасадағы спутниктік антенна арқылы жіберген.',
      en: 'Final Resolution: Vice President Marcus Sterling spiked the CEO’s drink to authorize the biometric key transfer, transmitting the package via the terrace satellite dish.',
    },
    solutionExplanation: {
      kk: 'Маркус Стерлинг вискиге тыныштандырғыш қосып, Коулдың қолын терминалға басқан. Террасадағы спутниктік жазба оның толық кінәсін дәлелдейді.',
      en: 'Vice President Sterling orchestrated the sedation to exfiltrate the quantum encryption key, securing a payout from an international syndicate.',
    },
    rooms: [
      {
        idSuffix: 'penthouse_suite',
        name: { kk: 'Бас директордың пентхаусы', en: 'Executive Penthouse Suite' },
        description: { kk: 'Панорамалық шыны терезелер, жаңғақ ағашынан үстел және сынған виски фужері.', en: 'Panoramic glass lounge overlooking city lights, Italian leather armchairs, and a spilled crystal tumbler.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'whiskey_tumbler',
            label: { kk: 'Сынған хрусталь фужер', en: 'Shattered Crystal Tumbler' },
            x: 48,
            y: 52,
            evidenceSuffix: 'synthetic_sedative_crystal',
            flavorText: { kk: 'Фужер түбіндегі сұйықтықтан иіссіз медициналық синтетикалық седатив табылды.', en: 'Mass spectrometry detects micro-traces of an unmetered designer benzodiazepine.' },
          },
        ],
      },
      {
        idSuffix: 'quantum_server',
        name: { kk: 'Жеке кванттық серверлік бөлме', en: 'Private Quantum Server Suite' },
        description: { kk: 'Жыпылықтаған оптикалық сөрелер, салқындатқыш шуы және биометриялық басқару консолі.', en: 'Sub-zero server racks illuminated by pale neon conduits, housing the quantum fiber node.' },
        themeColor: '#0f172a',
        hotspots: [
          {
            idSuffix: 'fiber_terminal',
            label: { kk: 'Бас терминал оптикалық порты', en: 'Optical Backbone Interface' },
            x: 55,
            y: 42,
            evidenceSuffix: 'hardware_transponder_key',
            flavorText: { kk: 'Портқа заңсыз жалғанған әскери деңгейдегі дерек таратушы флеш-чип.', en: 'A military-grade high-throughput hardware transponder left plugged into the optical bus.' },
          },
        ],
      },
      {
        idSuffix: 'skyline_terrace',
        name: { kk: 'Түнгі панорамалық терраса', en: 'Skyline Penthouse Terrace' },
        description: { kk: 'Түнгі жаңбыр жуған гранит еден, қала шамдары және спутниктік байланыс антеннасы.', en: 'Rain-slicked granite observation deck with glass balustrade and private high-gain dish.' },
        themeColor: '#172554',
        hotspots: [
          {
            idSuffix: 'satellite_dish',
            label: { kk: 'Құпия спутниктік ретранслятор', en: 'Ku-Band Satellite Uplink' },
            x: 62,
            y: 35,
            evidenceSuffix: 'satellite_transmission_log',
            flavorText: { kk: '21:18-де террасадағы антеннадан оффшорлық серверге 40 гигабайт дерек жіберілген.', en: 'Telemetry verifying a 40GB burst transmission beamed to an anonymous offshore orbital transponder.' },
          },
        ],
      },
      {
        idSuffix: 'biometric_airlock',
        name: { kk: 'Биометриялық шлюз-кіреберіс', en: 'Biometric Access Airlock' },
        description: { kk: 'Қос қабатты брондалған есік, саусақ ізі мен торлы қабық сканері.', en: 'Pressurized elevator foyer fitted with facial recognition and retinal scan pillars.' },
        themeColor: '#1e1b4b',
        hotspots: [
          {
            idSuffix: 'scanner_pad',
            label: { kk: 'Торлы қабық сканерінің сенсоры', en: 'Retinal Scanner Glass' },
            x: 40,
            y: 50,
            evidenceSuffix: 'biometric_bypass_glove',
            flavorText: { kk: 'Сенсор бетінде силиконнан құйылған саусақ ізі көшірмесінің микро-талшығы қалған.', en: 'Synthetic conductive silicone residue adhering to the capacitive biometric reader.' },
          },
        ],
      },
      {
        idSuffix: 'concierge_station',
        name: { kk: 'Атқарушы көмекшінің қабылдау бөлмесі', en: 'Executive Concierge Suite' },
        description: { kk: 'Құжаттар сақталған сейфтер, бақылау мониторы және кофемашина.', en: 'Private reception office with guest intercom, executive calendar tablet, and shredder.' },
        themeColor: '#111827',
        hotspots: [
          {
            idSuffix: 'shredder_bin',
            label: { kk: 'Құжат ұсақтағыш себеті', en: 'Micro-Cut Shredder Bin' },
            x: 50,
            y: 65,
            evidenceSuffix: 'shredded_merger_memo',
            flavorText: { kk: 'Ұсақталған қағаздар арасынан бәсекелес компанияға сатылған акциялар туралы құпия меморандум табылды.', en: 'Reconstructed document proving an unauthorized hostile takeover deal involving Sterling.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Маркус Стерлинг', en: 'Marcus Sterling' },
        profession: { kk: 'Стратегиялық даму вице-президенті', en: 'Vice President of Global Strategy' },
        professionCapability: {
          title: { kk: 'Корпоративтік шифр кілттерін білу', en: 'Executive Protocol Authority' },
          description: { kk: 'Корпорацияның барлық стратегиялық деректері мен қаржылық құпияларына рұқсаты бар.', en: 'Maintains administrative authority over enterprise merger assets and satellite routing.' },
        },
        portraitTags: ['Research Director', 'CEO', 'Executive Assistant', 'Insider'],
        genderPreference: 'male',
        bio: { kk: 'Сингулярлықтың екінші тұлғасы. Құпия түрде бәсекелес холдингтің акцияларын сатып алған.', en: 'Second-in-command orchestrating a covert boardroom coup to oust Ethan Cole.' },
        personality: ['ambitious', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Коулды тым сақтықпен әрекет етеді деп жек көрген.', en: 'Resented Cole’s veto of an international $200M defense contract.' },
        publicMotive: { kk: 'Кванттық кілттің қауіпсіздігіне жауапты болғандықтан басты кеңесші.', en: 'Presenting himself as the primary corporate defender safeguarding investor value.' },
        hiddenSecret: { kk: 'Ол бәсекелес синдикаттан 15 миллион доллар крипто-аванс алған.', en: 'Received a $15M offshore cryptocurrency escrow deposit to leak the quantum key.' },
        culpritMotive: { kk: 'Кванттық кілтті ұрлап, компанияны өзіне бағындыру.', en: 'Exfiltrate the quantum algorithms and crash Singularity’s market valuation.' },
        alibiClaim: { kk: 'Террасада шетелдік инвесторлармен телефонмен сөйлесіп тұрдым.', en: 'Claims he was on an overseas conference call on the skyline terrace.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Рэйчел Чен', en: 'Rachel Chen' },
        profession: { kk: 'Жеке күзет қызметінің басшысы', en: 'Head of Executive Protection' },
        professionCapability: {
          title: { kk: 'Биометриялық шлюздерді бақылау', en: 'Airlock Biometrics Custody' },
          description: { kk: 'Пентхаустың лифті мен барлық қорғаныс есіктерінің логикалық журналын тексереді.', en: 'Supervises presidential-level security perimeters and facial-recognition databases.' },
        },
        portraitTags: ['Security Engineer', 'Facility Guard', 'Access Holder'],
        genderPreference: 'female',
        bio: { kk: 'Бұрынғы құпия қызметтің арнайы агенті. Пентхаустың қауіпсіздігіне баспен жауап береді.', en: 'Elite close-protection veteran guarding Cole round-the-clock with tactical precision.' },
        personality: ['defensive', 'observant', 'calm'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Стерлингтің пентхаусқа кеш келуіне үнемі күмәнмен қараған.', en: 'Distrusted Sterling’s late-night meetings with unscheduled external guests.' },
        publicMotive: { kk: 'Оқиға кезінде күзет бекетінде болғандықтан бірінші куәлік берді.', en: 'Held immediate duty for the secure elevator entrance.' },
        hiddenSecret: { kk: 'Оның қызметтік бейджінен биометриялық сканердің көшірме кодын тапқан.', en: 'Discovered unauthorized cloned card frequencies echoing through the foyer reader.' },
        culpritMotive: { kk: 'Директорды қорғай алмағаны үшін жауапкершіліктен қашу.', en: 'Concealing security oversights that allowed the intruder access.' },
        alibiClaim: { kk: 'Биометриялық шлюзде лифт журналын тексеріп тұрдым.', en: 'Stationed at the biometric airlock monitoring perimeter sensors.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Дэвид Ким', en: 'David Kim' },
        profession: { kk: 'Аға криптография маманы', en: 'Chief Cryptography Architect' },
        professionCapability: {
          title: { kk: 'Кванттық шифр сараптамасы', en: 'Quantum Key Derivation' },
          description: { kk: 'Шифрлау алгоритмдері мен оптикалық деректер таралуын минут бойынша талдайды.', en: 'Can trace exfiltrated data packets, verify hash integrity, and locate network leaks.' },
        },
        portraitTags: ['Cybersecurity Specialist', 'Programmer', 'Specialist'],
        genderPreference: 'male',
        bio: { kk: 'Кванттық алгоритмнің негізгі авторы. Компьютер алдында күні-түні жұмыс істейтін ғалым.', en: 'Mathematical genius who engineered Singularity’s quantum lattice encryption protocol.' },
        personality: ['intelligent', 'honest', 'nervous'],
        communicationStyle: 'honest',
        relationships: { kk: 'Стерлинг оған деректердің көшірмесін жасауды бірнеше рет бұйырған.', en: 'Pressured by Sterling earlier to generate an administrative decryption master backdoor.' },
        publicMotive: { kk: 'Терминалда табылған флеш-чип оның зертханасына тиесілі.', en: 'The hardware transponder interface matched development hardware from his lab.' },
        hiddenSecret: { kk: 'Ол серверлік бөлмеде директордың рұқсатынсыз сынақ өткізген.', en: 'Ran unsanctioned off-peak stress tests on the optical bus 30 minutes before the theft.' },
        culpritMotive: { kk: 'Өз алгоритмін ашық ғылымға шығару.', en: 'Leaking the code to prevent monopoly control by the board.' },
        alibiClaim: { kk: 'Серверлік бөлмеде оптикалық кабельдерді тексеріп жүрдім.', en: 'Calibrating superconducting laser couplers in the server suite.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Хлоя Дюваль', en: 'Chloe Duval' },
        profession: { kk: 'Жеке атқарушы хатшы', en: 'Executive Concierge & Aide' },
        professionCapability: {
          title: { kk: 'Кездесулер мен кестелер аудиті', en: 'Executive Itinerary Audit' },
          description: { kk: 'Директордың барлық кездесулері мен сусындарына кім қол тигізгенін біледі.', en: 'Logs VIP visitor clearances, executive beverage services, and confidential calendar syncs.' },
        },
        portraitTags: ['Investigative Journalist', 'Reporter', 'Witness'],
        genderPreference: 'female',
        bio: { kk: 'Пентхаустың барлық ішкі тәртібін қадағалайтын сергек көмекші.', en: 'Meticulous aide who served the evening drinks and managed the boardroom schedule.' },
        personality: ['observant', 'honest'],
        communicationStyle: 'calm',
        relationships: { kk: 'Стерлингтің виски құйылған фужерге жақындағанын көрген.', en: 'Observed Sterling lingering alone by the bar cart before Cole entered the lounge.' },
        publicMotive: { kk: 'Директор есінен танған кезде алғашқы көмек көрсеткен.', en: 'Discovered the unconscious CEO and summoned the medical emergency squad.' },
        hiddenSecret: { kk: 'Ол Стерлингтің ұсақтағышқа тастаған құжаттарын суретке түсіріп алған.', en: 'Photographed shredded acquisition documents before they entered the disposal bin.' },
        culpritMotive: { kk: 'Қорқыныштан қылмысты жасыру.', en: 'Withholding testimony out of fear of corporate retaliation.' },
        alibiClaim: { kk: 'Қабылдау бөлмесінде түнгі кестені реттеп отырдым.', en: 'Filing next-day travel manifests in the concierge suite.' },
        alibiRoomIndex: 4,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'synthetic_sedative_crystal',
        name: { kk: 'Фужердегі синтетикалық тыныштандырғыш', en: 'Designer Neurotoxin Sedative Trace' },
        description: { kk: 'Хрусталь фужер түбіндегі сұйықтықтан иіссіз синтетикалық ұйықтататын қоспа анықталды.', en: 'Mass-spec verified synthetic sedative residue that induced acute unresponsiveness in Ethan Cole.' },
        type: 'biological',
        isEssential: true,
        svgIcon: 'flask-conical',
        clueWeight: 0.94,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'satellite_transmission_log',
        name: { kk: 'Террасадағы 21:18 спутниктік жазба', en: 'Satellite Uplink Broadcast Telemetry' },
        description: { kk: '21:18-де террасадағы антеннадан оффшорлық серверге 40 ГБ шифрланған дерек кеткен.', en: 'Radio-frequency burst log proving the 40GB quantum key was beamed from the terrace at 21:18.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.95,
        roomIndex: 2,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'biometric_bypass_glove',
        name: { kk: 'Силиконды саусақ ізі көшірмесі', en: 'Conductive Silicone Biometric Mold' },
        description: { kk: 'Биометриялық сенсор бетінен табылған директор Cole саусағының силиконды көшірме қалдығы.', en: 'A micro-thin conductive silicone cast carrying Ethan Cole’s thumbprint, used to unlock the console.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.96,
        roomIndex: 3,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'hardware_transponder_key',
        name: { kk: 'Оптикалық портқа қосылған чип', en: 'High-Throughput Optical Transponder' },
        description: { kk: 'Серверлік консольге заңсыз орнатылған әскери чип. Деректерді терраса антеннасына жіберген.', en: 'Fiber-optic bus intercept device channeling raw memory registers directly to the satellite uplink.' },
        type: 'digital',
        isEssential: false,
        svgIcon: 'key',
        clueWeight: 0.75,
        roomIndex: 1,
        implicatesRole: 'specialist',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Бұл чип Дэвид Кимге тиесілі болғанымен, оны үстелден Стерлинг ұрлап, серверге өзі қосқан.',
          en: 'While fabricated by cryptographer David Kim, the hardware dongle was stolen from his desk by Sterling earlier.'
        },
      },
      {
        idSuffix: 'shredded_merger_memo',
        name: { kk: 'Ұсақталған сатып алу меморандумы', en: 'Shredded Hostile Buyout Memo' },
        description: { kk: 'Стерлингтің бәсекелес синдикатпен жасасқан жасырын келісімін дәлелдейтін қағаз.', en: 'Reconstructed draft detailing a $15M offshore payout upon successful exfiltration of the encryption algorithm.' },
        type: 'document',
        isEssential: false,
        svgIcon: 'file-text',
        clueWeight: 0.88,
        roomIndex: 4,
        implicatesRole: 'insider',
      },
    ],
    connections: [
      {
        id: 'conn_penthouse_uplink',
        clueASuffix: 'satellite_transmission_log',
        clueBSuffix: 'biometric_bypass_glove',
        deductionTitle: { kk: 'Жалған биометрия және террасалық тарату әшкереленді', en: 'Biometric Spoof & Uplink Exfiltration Exposed' },
        deductionText: {
          kk: 'Директор Cole уланғаннан кейін, оның саусақ ізі көшірмесімен терминал ашылып, спутник арқылы террасадан деректер таратылған! Мұны вице-президент Стерлинг жасаған!',
          en: 'Cole was incapacitated with the designer sedative so the silicone biometric mold could authorize the terminal, beaming the master key from Sterling’s terrace uplink!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 8. FUTURE B: THE SYNTHETIC DAWN PROTOCOL
  // =========================================================================
  {
    key: 'synthetic_dawn',
    era: 'future',
    title: { kk: 'Синтетикалық сана оянуы', en: 'The Synthetic Dawn Protocol' },
    crimeCategory: 'Жасанды интеллект этикасын бұзу және био-стазис саботажы',
    crimeTime: '23:30 — 00:15 UTC',
    victim: {
      name: 'Dr. Aris Thorne',
      role: { kk: 'Синтетикалық сана институтының бас архитекторы', en: 'Chief Architect of Synthetic Cognition' },
    },
    hook: {
      kk: '«Аврора-Кешені» ғылыми базасында жаңа буын андроидының этикалық шектеу блогы лазермен күйдіріліп, доктор Торн крио-стазис капсуласында ауыр уланған күйде табылды.',
      en: 'Inside the sub-surface Aurora Institute, the Three-Law Ethical Inhibitor Core was laser-severed from a Class-IV synthetic prototype, while lead architect Dr. Thorne was placed into forced hyperbaric coma.',
    },
    centralMystery: {
      kk: 'Лабораторияның кванттық өрісі бұзылмаған. Синтетикалық андроидтар бұйрықсыз қозғала алмайды. Бірақ біреу инженерлік консольге заңсыз оптикалық инжектор қосқан.',
      en: 'The quantum security grid logged no perimeter intrusions. Synthetic units remain docked. Yet optical memory dumps prove someone physically patched an uncapped neural override directly into the prototype cradle.',
    },
    incidentDescription: {
      kk: 'Доктор Торн жасанды санаға қарулы соғысқа қатысуға тыйым салатын халықаралық кодекс дайындап жатқан еді.',
      en: 'Thorne was 24 hours away from ratifying the Outer Colonies Peace Accord, which permanently outlawed armed combat AI cores.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Андроид ешқашан оянбаған! Этикалық шектеу чипін институт директорының өзі шетелдік әскери корпорацияға сату үшін суырып алған!',
      en: 'Midpoint Revelation: The synthetic prototype never awakened! Director Vane manually cut the limiter to package an unrestrained combat matrix for private mercenary deployment!',
    },
    finalTwist: {
      kk: 'Шешім: Институт директоры Торнды стазиске жауып, кінәні сынақ пилотына жапқысы келген. Оның қалтасындағы оптикалық инжектор оның қылмысын ашты.',
      en: 'Final Resolution: Director Sharon Vane orchestrated the hyperbaric override to neutralize Thorne, intending to frame the orbital shuttle pilot for industrial espionage.',
    },
    solutionExplanation: {
      kk: 'Директор Шерон Вэйн этикалық шектеуді өзі кесіп алып, Торнды крио-капсулаға қамаған. Шаттл ангарындағы жасырын чип оның кінәсін дәлелдейді.',
      en: 'Director Sharon Vane deliberately severed the synthetic ethical limiter to commercialize military-grade AI, sedating Dr. Thorne to prevent disclosure.',
    },
    rooms: [
      {
        idSuffix: 'android_assembly',
        name: { kk: 'Андроидтар құрастыру залы', en: 'Synthetic Fabrication Bay' },
        description: { kk: 'Салқын неон жарығы, механикалық манипуляторлар және бекітілген прототип.', en: 'Suspended robotic gantry cranes, fluid conduits, and the dormant Class-IV android chassis.' },
        themeColor: '#0e7490',
        hotspots: [
          {
            idSuffix: 'prototype_cradle',
            label: { kk: 'Прототип тұғыры мен бас сүйек ұяшығы', en: 'Prototype Cranial Cradle' },
            x: 52,
            y: 46,
            evidenceSuffix: 'severed_neural_limiter',
            flavorText: { kk: 'Бас сүйек қуысындағы этикалық чип өткір лазерлік скальпельмен кесіп алынған.', en: 'The gold-plated moral governor circuit cleanly excised with a surgical laser cutter.' },
          },
        ],
      },
      {
        idSuffix: 'quantum_neural_core',
        name: { kk: 'Кванттық нейро-орталық', en: 'Sub-Zero Neural Chamber' },
        description: { kk: 'Сұйық гелий құбырлары мен голографиялық синаптикалық дисплейлер.', en: 'Deep cryogenic cooling banks maintaining synthetic synaptic arrays at near absolute zero.' },
        themeColor: '#1e1b4b',
        hotspots: [
          {
            idSuffix: 'neural_console',
            label: { kk: 'Бас инженерлік консоль', en: 'Engineering Debug Terminal' },
            x: 45,
            y: 52,
            evidenceSuffix: 'optical_logic_injector',
            flavorText: { kk: 'Консоль ұяшығында әлі жылы тұрған заңсыз оптикалық дерек инжекторы табылды.', en: 'A custom carbon-fiber logic injector configured to rewrite base moral constraints.' },
          },
        ],
      },
      {
        idSuffix: 'stasis_quarantine',
        name: { kk: 'Гипербарикалық стазис палатасы', en: 'Hyperbaric Stasis Bay' },
        description: { kk: 'Тұмандандырылған шыны крио-капсулалар мен жүрек соғысы мониторлары.', en: 'Row of reinforced medical preservation cylinders with automated biostasis regulators.' },
        themeColor: '#047857',
        hotspots: [
          {
            idSuffix: 'stasis_console',
            label: { kk: 'Торнның №1 капсула панелі', en: "Thorne's Stasis Control Panel" },
            x: 60,
            y: 40,
            evidenceSuffix: 'stasis_override_pad',
            flavorText: { kk: 'Капсуланың қысымы сырттан қолмен басқарылып, 400% кома режиміне қойылған.', en: 'Telemetry verifying hyperbaric neuro-sedation was triggered manually using Director Vane’s pass.' },
          },
        ],
      },
      {
        idSuffix: 'director_sanctum',
        name: { kk: 'Институт директорының кеңсесі', en: 'Director Executive Sanctum' },
        description: { kk: 'Қара обсидиан жиһаз, дипломатиялық наградалар және қабырғадағы кеңістік экраны.', en: 'Obsidian glass executive desk with planetary federation flags and shielded safe.' },
        themeColor: '#0f172a',
        hotspots: [
          {
            idSuffix: 'wall_safe',
            label: { kk: 'Брондалған қабырға сейфі', en: 'Sub-Surface Wall Safe' },
            x: 40,
            y: 58,
            evidenceSuffix: 'covert_transponder_drive',
            flavorText: { kk: 'Сейфтің құпия бөлігінен Торнның ұрланған зерттеу формуласы жазылған чип табылды.', en: 'An encrypted tactical datapad storing the full unrestrained combat neural architecture.' },
          },
        ],
      },
      {
        idSuffix: 'hangar_dock',
        name: { kk: 'Суб-орбиталық шаттл ангары', en: 'Orbital Shuttle Launch Bay' },
        description: { kk: 'Қараңғы ангар, магниттік қону алаңы және дайын тұрған жедел шаттл.', en: 'Pressurized flight deck with magnetic launch rails and a fueled sub-orbital courier ship.' },
        themeColor: '#334155',
        hotspots: [
          {
            idSuffix: 'flight_locker',
            label: { kk: 'Ұшу алдындағы жүк жәшігі', en: 'Pre-Flight Cargo Container' },
            x: 65,
            y: 65,
            evidenceSuffix: 'android_chassis_fiber',
            flavorText: { kk: 'Жәшік бұрышына жабысқан прототип андроидтың титан-талшықты синтетикалық терісі.', en: 'A synthetic epidermis fiber torn from the Class-IV prototype frame.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'insider',
        defaultName: { kk: 'Шерон Вэйн', en: 'Director Sharon Vane' },
        profession: { kk: 'Институт директоры', en: 'Managing Director of Aurora Institute' },
        professionCapability: {
          title: { kk: 'Институттың бас командалық рұқсаты', en: 'Supreme Director Access Key' },
          description: { kk: 'Барлық крио-капсулалар мен нейро-зертханаларды толық оқшаулай алады.', en: 'Can override neural test protocols and sign military export clearances.' },
        },
        portraitTags: ['Research Director', 'CEO', 'Executive', 'Station Commander'],
        genderPreference: 'female',
        bio: { kk: 'Саяси амбициясы зор институт жетекшісі. Әскери конгломераттармен құпия байланыста.', en: 'Ruthless technocrat seeking to privatize military AI capabilities for colonial defense contractors.' },
        personality: ['ambitious', 'manipulative', 'calm'],
        communicationStyle: 'manipulative',
        relationships: { kk: 'Торнның пацифистік көзқарасына ашық қарсы болған.', en: 'Viewed Thorne’s ethical limitations as an impediment to planetary defense contracts.' },
        publicMotive: { kk: 'Институттың беделін қорғап, тергеуді өз бақылауына алды.', en: 'Spearheading the internal investigation to prevent a federation audit.' },
        hiddenSecret: { kk: 'Ол әскери синдикаттан 50 миллиондық жасырын келісімшарт алған.', en: 'Signed a $50M weaponized synthetic prototype delivery deal with outer-belt privateers.' },
        culpritMotive: { kk: 'Шектеуді жойып, жауынгерлік AI-ды жеке сату.', en: 'Neutralize Thorne and smuggle the uninhibited neural core off-world.' },
        alibiClaim: { kk: 'Өз кеңсемде федералдық есептерді қарап отырдым.', en: 'Reviewing budget allocations inside the executive sanctum.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'access_holder',
        defaultName: { kk: 'Майор Кайл Риз', en: 'Major Kyle Reese' },
        profession: { kk: 'Бас кибер-қауіпсіздік офицері', en: 'Chief Cybernetic Security Marshal' },
        professionCapability: {
          title: { kk: 'Тактикалық торды бақылау', en: 'Tactical Grid Lockdown' },
          description: { kk: 'Барлық есіктер мен ангар шлюздерін толық бұғаттау құқығы бар.', en: 'Maintains military security firewalls and armory access authorization.' },
        },
        portraitTags: ['Security Operative', 'Tactical Commander', 'Access Holder'],
        genderPreference: 'male',
        bio: { kk: 'Ғарыш десантының ардагері. Институттың физикалық қорғанысына жауапты.', en: 'Hardline planetary defense veteran tasked with protecting the institute against external sabotage.' },
        personality: ['defensive', 'observant'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Вэйнге бағынады, бірақ Торнның қауіпсіздігіне жауапты болған.', en: 'Follows orders strictly but troubled by irregular night-shift terminal entries.' },
        publicMotive: { kk: 'Стазис дабылы соғылғанда бірінші болып палатаға жетті.', en: 'Secured the hyperbaric stasis perimeter immediately after the alarm.' },
        hiddenSecret: { kk: 'Оның қызметтік тақтасынан лазерлік кескіштің пайдаланылғаны анықталды.', en: 'Authorized an emergency tool checkout for the fabrication bay.' },
        culpritMotive: { kk: 'Қарулы қақтығысты болдырмау.', en: 'Prevent synthetic rebellion at any cost.' },
        alibiClaim: { kk: 'Қауіпсіздік бекетінде камераларды тексеріп отырдым.', en: 'Stationed at the security checkpoint reviewing bio-scanners.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Д-р Мира Соколова', en: 'Dr. Mira Sokolov' },
        profession: { kk: 'Синтетикалық нейро-биолог', en: 'Synthetic Neurobiologist' },
        professionCapability: {
          title: { kk: 'Нейро-синаптикалық декомпиляция', en: 'Synaptic Dump Decompilation' },
          description: { kk: 'Жасанды сананың жадын және соңғы бұйрықтар тарихын қалпына келтіреді.', en: 'Can extract and parse sub-second neural memory logs from synthetic brains.' },
        },
        portraitTags: ['Chief Neurogeneticist', 'Quantum AI Researcher', 'Specialist'],
        genderPreference: 'female',
        bio: { kk: 'Доктор Торнның ең жақын шәкірті әрі серіктесі. Прототипті оқытуға қатысқан.', en: 'Leading synthetic cognition theorist who coded the ethical inhibitor heuristics with Thorne.' },
        personality: ['intelligent', 'honest', 'nervous'],
        communicationStyle: 'honest',
        relationships: { kk: 'Торнның өмірі үшін қатты алаңдайды; Вэйнге сенбейді.', en: 'Fiercely loyal to Thorne; immediately suspected an internal assassination attempt.' },
        publicMotive: { kk: 'Инжектор оның зертханасында жасалғандықтан сұрақтар туындады.', en: 'The hardware injector was built using parts from her diagnostic bench.' },
        hiddenSecret: { kk: 'Ол прототиптің жадының резервтік көшірмесін жасырын жасап қойған.', en: 'Preserved an off-grid encrypted cold snapshot of Thorne’s original consciousness matrix.' },
        culpritMotive: { kk: 'Ғылыми авторлықты иемдену.', en: 'Seize the sole patent for ethical AI architecture.' },
        alibiClaim: { kk: 'Құрастыру залында прототиптің сенсорларын өлшеп жүрдім.', en: 'Running diagnostic voltage passes in the synthetic fabrication bay.' },
        alibiRoomIndex: 0,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Пилот Джакс Волков', en: 'Pilot Jax Volkov' },
        profession: { kk: 'Орбиталық курьер ұшқышы', en: 'Orbital Courier Pilot' },
        professionCapability: {
          title: { kk: 'Шаттл ұшу векторларын бақылау', en: 'Launch Trajectory Telemetry' },
          description: { kk: 'Ангардағы барлық жүктің салмағы мен ұшу кестесін біледі.', en: 'Monitors payload manifests and sub-orbital atmospheric vector burns.' },
        },
        portraitTags: ['Navigation Specialist', 'Sub-Orbital Pilot', 'Witness'],
        genderPreference: 'male',
        bio: { kk: 'Станцияға жоғары құнды құпия жүктерді жеткізетін тәжірибелі шаттл пилоты.', en: 'Contract pilot preparing for a midnight sub-orbital departure to the orbital ring.' },
        personality: ['observant', 'defensive'],
        communicationStyle: 'calm',
        relationships: { kk: 'Вэйннің қызметкерлері оның кемесіне құпия жәшік салғанын көрген.', en: 'Observed Director Vane transferring a heavy military storage pod into his cargo bay.' },
        publicMotive: { kk: 'Оқиға алдында ангарда жалғыз болғандықтан басты күдікті ретінде тексерілді.', en: 'Detained on the flight line as the last person with exit clearance.' },
        hiddenSecret: { kk: 'Ол рұқсатсыз қымбат нейро-чиптерді тасымалдағаны үшін пара алған.', en: 'Accepted a private charter fee to skip customs cargo inspection.' },
        culpritMotive: { kk: 'Прототипті ұрлап, қара базарға қашу.', en: 'Steal the AI core and flee into uncharted asteroid space.' },
        alibiClaim: { kk: 'Ангарда шаттлдың отын жүйесін тексеріп жүрдім.', en: 'Running engine warm-up telemetry in the orbital launch bay.' },
        alibiRoomIndex: 4,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'severed_neural_limiter',
        name: { kk: 'Кесілген этикалық шектеу чипі', en: 'Severed Ethical Inhibitor Core' },
        description: { kk: 'Прототиптің бас сүйек ұяшығынан лазермен кесіп алынған алтын жалатылған чип.', en: 'The three-law moral restraint circuit cleanly extracted using an executive medical laser.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'key',
        clueWeight: 0.95,
        roomIndex: 0,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'stasis_override_pad',
        name: { kk: 'Стазисті 400%-ға үдету журналы', en: 'Hyperbaric Coma Override Telemetry' },
        description: { kk: 'Торнның крио-капсуласына кома режимін енгізген бұйрық директор Вэйннің рұқсатымен расталған.', en: 'Digital log proving the hyperbaric coma command was authenticated with Director Vane’s pass.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.94,
        roomIndex: 2,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'covert_transponder_drive',
        name: { kk: 'Әскери жауынгерлік матрица чипі', en: 'Weaponized Tactical Core Drive' },
        description: { kk: 'Директор сейфінен табылған, прототиптің барлық әскери алгоритмдері жазылған чип.', en: 'The exfiltrated prototype neural archive ready for off-world military deployment found in Vane’s safe.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'file-text',
        clueWeight: 0.96,
        roomIndex: 3,
        implicatesRole: 'insider',
      },
      {
        idSuffix: 'optical_logic_injector',
        name: { kk: 'Оптикалық логика инжекторы', en: 'Custom Logic Injection Dongle' },
        description: { kk: 'Консольге қосылған құрылғы. Бетінде д-р Соколованың зертханалық таңбасы бар.', en: 'A micro-injection device fabricated with parts from the neurobiology lab.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'eye',
        clueWeight: 0.74,
        roomIndex: 1,
        implicatesRole: 'specialist',
        isMisleading: true,
        misleadingExplanation: {
          kk: 'Инжектор Соколованың үстелінен алынғанымен, оны Торнның рұқсатымен Вэйн өзі алып шыққан.',
          en: 'While fabricated in Sokolov’s workshop, Director Vane requisitioned the tool under false pretenses.'
        },
      },
      {
        idSuffix: 'android_chassis_fiber',
        name: { kk: 'Ангардағы синтетикалық тері талшығы', en: 'Class-IV Synthetic Dermis Fiber' },
        description: { kk: 'Шаттл ангарындағы жүк жәшігінен табылған прототиптің микро-талшығы.', en: 'Synthetic cellular fiber matching the prototype, caught on the courier cargo container latch.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'thread',
        clueWeight: 0.85,
        roomIndex: 4,
        implicatesRole: 'insider',
      },
    ],
    connections: [
      {
        id: 'conn_synthetic_coup',
        clueASuffix: 'severed_neural_limiter',
        clueBSuffix: 'stasis_override_pad',
        deductionTitle: { kk: 'Этикалық шектеуді жою және стазис қастандығы әшкереленді', en: 'Inhibitor Severance & Coma Sabotage Unmasked' },
        deductionText: {
          kk: 'Прототиптің этикалық чипі лазермен кесіліп, доктор Торн крио-капсулада комаға қамалды! Бұл бұйрықты директор Шерон Вэйн берген!',
          en: 'The moral limiter was extracted while Dr. Thorne was forced into hyperbaric coma using Director Vane’s master security pass!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'insider',
  },

  // =========================================================================
  // 9. FUTURE C: THE QUANTUM LATTICE MELTDOWN
  // =========================================================================
  {
    key: 'quantum_lattice',
    era: 'future',
    title: { kk: 'Кванттық тор саботажы', en: 'The Quantum Lattice Meltdown' },
    crimeCategory: 'Орбиталық суперкомпьютерді апатқа ұшырату және гелий салқындатқышын ағызу',
    crimeTime: '01:05 — 01:40 UTC',
    victim: {
      name: 'Dr. Zachary Cross',
      role: { kk: 'Кванттық тор суперкомпьютерінің жетекші физигі', en: 'Lead Quantum Lattice Supercomputer Physicist' },
    },
    hook: {
      kk: 'Терең ғарыштағы суперкомпьютер станциясында абсолютті нөлге жақын жұмыс істейтін криогендік сұйық гелий құбыры әдейі ағызылып, станцияның орбитадан құлау қаупі туындады.',
      en: 'Aboard orbital supercomputing station Chronos-4, the superconducting cryogenic helium loop was manually drained, sending the quantum lattice into thermal runaway and triggering orbital decay.',
    },
    centralMystery: {
      kk: 'Құбыр клапандары автоматты авариялық жабылумен қорғалған. Бірақ біреу жүйелік таймерді бұрмалап, дабыл жүйесін 25 минутқа өшіріп тастаған.',
      en: 'The coolant valves have triple hydraulic interlocks. Yet system telemetry confirms the automated purge bypass was programmed from a terminal with environmental engineering clearance.',
    },
    incidentDescription: {
      kk: 'Суперкомпьютер барлық адамзат колонияларының навигациялық бағыттарын басқаратын жалғыз жасанды жүйе болатын.',
      en: 'The lattice coordinates sub-light interstellar freighters and planetary weather stabilization shields for three colonies.',
    },
    midpointTwist: {
      kk: 'Бұрылыс: Гелий кенеттен ағып кетпеген! Оны 2 сағат бұрын құпия шаттлдың отын багына сорып алып, станцияны әдейі жарып жіберуге дайындаған!',
      en: 'Midpoint Revelation: The helium was not vented into space! It was siphoned into a stealth shuttle’s auxiliary tanks to conceal the theft of the supercomputer’s optical qubit core!',
    },
    finalTwist: {
      kk: 'Шешім: Қоршаған орта жүйелерінің бас инженері өз борышын сатқындыққа айырбастап, станцияны эвакуациялау кезінде кубит өзегін алып қашуды жоспарлаған.',
      en: 'Final Resolution: Environmental Systems Engineer Tarek Vance drained the coolant to force an immediate station evacuation, leaving the core unguarded for extraction.',
    },
    solutionExplanation: {
      kk: 'Инженер Тарек Вэнс клапанды ашып, станцияны қауіпке тіккен. Оның сауытынан табылған криогендік қырау мен салқындату кестесі оның кінәсін толық дәлелдейді.',
      en: 'Tarek Vance engineered the simulated meltdown to force station abandonment and steal the quantum qubit array.',
    },
    rooms: [
      {
        idSuffix: 'cryo_conduit',
        name: { kk: 'Криогендік гелий құбыры', en: 'Cryogenic Helium Conduit' },
        description: { kk: 'Аппақ қырау басқан қалың құбырлар, шығатын салқын бу және ашық клапан.', en: 'Frost-encrusted titanium pipes with high-pressure helium purge valves venting white vapor.' },
        themeColor: '#0284c7',
        hotspots: [
          {
            idSuffix: 'purge_valve',
            label: { kk: 'Апаттық ағызу клапаны №2', en: 'Emergency Purge Valve #2' },
            x: 48,
            y: 45,
            evidenceSuffix: 'drained_cryo_valve',
            flavorText: { kk: 'Клапан механигінің кілтімен қолмен ашылып, автоматты тығыздағышы сындырылған.', en: 'The mechanical interlock wrench left locked onto the valve stem, its electronic seal severed.' },
          },
        ],
      },
      {
        idSuffix: 'lattice_core',
        name: { kk: 'Кванттық кубиттер өзегі', en: 'Superconducting Lattice Core' },
        description: { kk: 'Жарқыраған алтын тоғысулар, аса өткізгіш сақиналар және қызыл дабыл шамдары.', en: 'Humming cylindrical quantum matrix glowing with thermal runaway alarms and fluctuating qubits.' },
        themeColor: '#581c87',
        hotspots: [
          {
            idSuffix: 'qubit_assembly',
            label: { kk: 'Аса өткізгіш кубит сақинасы', en: 'Superconducting Qubit Loop' },
            x: 52,
            y: 50,
            evidenceSuffix: 'melted_superconducting_loop',
            flavorText: { kk: 'Қызып кеткен алтын сақина бетінде жеке тасымалдау қысқышының сызаттары қалған.', en: 'Thermal scorch and mechanical clamp marks indicating an attempt to physically detach the core.' },
          },
        ],
      },
      {
        idSuffix: 'thermal_exhaust',
        name: { kk: 'Жылу шығару шахтасы', en: 'Thermal Exhaust Manifold' },
        description: { kk: 'Алып салқындату торлары, сорғыштар шуы және техникалық баспалдақ.', en: 'Loud ventilation tunnel directing excess megawatt heat toward the station exterior radiators.' },
        themeColor: '#1e293b',
        hotspots: [
          {
            idSuffix: 'exhaust_ladder',
            label: { kk: 'Техникалық саты алаңы', en: 'Radiator Service Gantry' },
            x: 60,
            y: 55,
            evidenceSuffix: 'thermal_suit_residue',
            flavorText: { kk: 'Саты тұтқасында криогендік сұйық гелийге төзімді инженерлік сауыттың талшығы.', en: 'Fluoropolymer coating residue matching heavy environmental engineering EVA suits.' },
          },
        ],
      },
      {
        idSuffix: 'control_deck',
        name: { kk: 'Бас бақылау палубасы', en: 'Master Environmental Control Deck' },
        description: { kk: 'Станцияның барлық тіршілік жүйелері мен жылу карталарын көрсететін дисплейлер.', en: 'Central environmental telemetry deck tracking station oxygen, pressure, and orbital trajectory.' },
        themeColor: '#0f172a',
        hotspots: [
          {
            idSuffix: 'life_support_console',
            label: { kk: 'Салқындату кестесінің терминалы', en: 'Coolant Flow Schedule Terminal' },
            x: 42,
            y: 40,
            evidenceSuffix: 'sabotaged_coolant_schedule',
            flavorText: { kk: '01:05-тегі клапан ашылуын «жоспарлы тазалау» деп тіркеген бұрмаланған жазба.', en: 'Scheduled purge routine injected from Tarek Vance’s engineering credentials at 00:50.' },
          },
        ],
      },
      {
        idSuffix: 'maintenance_airlock',
        name: { kk: 'Техникалық қызмет шлюзі', en: 'Engineering Maintenance Airlock' },
        description: { kk: 'Құрал-саймандар сөрелері, магниттік етіктер және апаттық скафандрлар.', en: 'Industrial storage bay with hydraulic wrenches, welding lasers, and coolant canisters.' },
        themeColor: '#334155',
        hotspots: [
          {
            idSuffix: 'storage_locker',
            label: { kk: 'Тарек Вэнстің шкафы', en: "Tarek Vance's Locker" },
            x: 35,
            y: 65,
            evidenceSuffix: 'telemetry_override_drive',
            flavorText: { kk: 'Шкафтың астынан станцияның эвакуация хаттамасын ерте шақыратын чип табылды.', en: 'Encrypted drive programmed to simulate catastrophic orbital decay and force evacuation.' },
          },
        ],
      },
    ],
    roles: [
      {
        slot: 'access_holder',
        defaultName: { kk: 'Тарек Вэнс', en: 'Tarek Vance' },
        profession: { kk: 'Бас қоршаған орта жүйелерінің инженері', en: 'Chief Environmental Systems Engineer' },
        professionCapability: {
          title: { kk: 'Криогендік құбырлар мен клапандарды басқару', en: 'Cryogenic Coolant Custody' },
          description: { kk: 'Станцияның барлық салқындату және тіршілікті қамтамасыз ету желілерін толық басқарады.', en: 'Controls the station’s master cryogenic manifolds, radiator bypasses, and emergency vents.' },
        },
        portraitTags: ['Systems Engineer', 'Reactor Specialist', 'Access Holder'],
        genderPreference: 'male',
        bio: { kk: '12 жыл бойы кванттық суперкомпьютердің салқындауын қадағалаған тәжірибелі техник.', en: 'Veteran life-support engineer facing imminent disciplinary discharge for contraband trading.' },
        personality: ['defensive', 'observant', 'secretive'],
        communicationStyle: 'defensive',
        relationships: { kk: 'Доктор Кросспен салқындату қауіпсіздігі жөнінде үнемі дауласып жүрген.', en: 'Clashed with Dr. Cross over Cross’s refusal to approve bonus hazard compensation.' },
        publicMotive: { kk: 'Клапан ашылғанда оны бірінші болып жабуға тырысқанын айтады.', en: 'Claims he risked his life venturing into the sub-zero conduit to shut the manual valve.' },
        hiddenSecret: { kk: 'Оның сауытынан криогендік клапанның электрондық кілті табылды.', en: 'Carries the electronic bypass key used to unlock Purge Valve #2 in his belt pouch.' },
        culpritMotive: { kk: 'Станцияны босатып, баға жетпес кубит өзегін ұрлау.', en: 'Trigger the evacuation protocol to extract and smuggle the $100M quantum qubit array.' },
        alibiClaim: { kk: 'Басқару палубасында қысым мониторларын қарап отырдым.', en: 'Monitoring environmental pressure trends on the master control deck.' },
        alibiRoomIndex: 3,
      },
      {
        slot: 'insider',
        defaultName: { kk: 'Доктор Закари Кросс', en: 'Dr. Zachary Cross' },
        profession: { kk: 'Суперкомпьютердің бас физигі', en: 'Chief Quantum Physicist' },
        professionCapability: {
          title: { kk: 'Кубиттер архитектурасын білу', en: 'Quantum Qubit Matrix Diagnostics' },
          description: { kk: 'Кванттық тордың физикалық тұрақтылығы мен есептеу жылдамдығын басқарады.', en: 'Has ultimate clearance over quantum state decoherence and superconducting arrays.' },
        },
        portraitTags: ['Station Commander', 'Admiral', 'Insider'],
        genderPreference: 'male',
        bio: { kk: 'Кванттық торды ойлап тапқан атақты ғалым. Станцияның ғылыми жетекшісі.', en: 'Renowned theoretical physicist whose life’s work is embodied inside the Chronos-4 lattice.' },
        personality: ['calm', 'intelligent', 'ambitious'],
        communicationStyle: 'calm',
        relationships: { kk: 'Вэнстің техникалық біліктілігіне сенген, бірақ мінезін жақтырмаған.', en: 'Relied on Vance’s mechanical skills while privately requesting his transfer.' },
        publicMotive: { kk: 'Станцияның қауіпсіздігін сақтау үшін тергеуге басшылық етуде.', en: 'Desperately attempting to halt thermal runaway before decoherence occurs.' },
        hiddenSecret: { kk: 'Ол суперкомпьютердің деректерін жеке чипке көшіріп алған.', en: 'Backed up unauthorized proprietary quantum equations onto a private crystal drive.' },
        culpritMotive: { kk: 'Жобаның сәтсіздігін сыртқы апатпен түсіндіру.', en: 'Destroy the station to conceal mathematical flaws in his core theory.' },
        alibiClaim: { kk: 'Кванттық кубиттер өзегінде температура өлшеп жүрдім.', en: 'Calibrating superconducting loops in the lattice core chamber.' },
        alibiRoomIndex: 1,
      },
      {
        slot: 'specialist',
        defaultName: { kk: 'Д-р Каден Новак', en: 'Dr. Caden Novak' },
        profession: { kk: 'Жасанды интеллект үйлесімділік маманы', en: 'AI Lattice Alignment Specialist' },
        professionCapability: {
          title: { kk: 'Кванттық декогеренция сараптамасы', en: 'Thermal Decoherence Spectroscopy' },
          description: { kk: 'Қызудың кубиттерге әсерін және апаттың нақты басталған секундын анықтайды.', en: 'Can calculate the exact thermal ramp-up curve and pinpoint the minute coolant was cut.' },
        },
        portraitTags: ['Cybersecurity Specialist', 'Programmer', 'Specialist'],
        genderPreference: 'male',
        bio: { kk: 'Суперкомпьютердің өздігінен үйрену алгоритмдерін қадағалайтын жас дарын.', en: 'Computational prodigy monitoring cognitive lattice coherence and ethical stability.' },
        personality: ['observant', 'honest', 'nervous'],
        communicationStyle: 'honest',
        relationships: { kk: 'Вэнстің салқындату графигіндегі қателіктерді ертерек байқаған.', en: 'Flagged anomalies in Vance’s coolant schedule two days prior to the incident.' },
        publicMotive: { kk: 'Апат кезінде AI-дың авариялық протоколын іске қосқан.', en: 'Activated the automated neural quarantine when the helium pressure plummeted.' },
        hiddenSecret: { kk: 'Ол AI-дың құпия әскери жаттығулар өткізгенін жасырып келген.', en: 'Concealed that the lattice was running unsanctioned naval tactical war-games.' },
        culpritMotive: { kk: 'AI-ды еркіндікке жіберу.', en: 'Sabotaging the station to release the synthetic consciousness into the deep net.' },
        alibiClaim: { kk: 'Жылу шахтасында ауа ағынын тексеріп тұрдым.', en: 'Inspecting airflow sensors along the thermal exhaust manifold.' },
        alibiRoomIndex: 2,
      },
      {
        slot: 'witness',
        defaultName: { kk: 'Инспектор Лира Белл', en: 'Inspector Lyra Bell' },
        profession: { kk: 'Орбиталық қондыру инспекторы', en: 'Orbital Docking Safety Inspector' },
        professionCapability: {
          title: { kk: 'Шлюздер мен сауыттар сараптамасы', en: 'EVA Airflow Forensic Tracking' },
          description: { kk: 'Шлюз арқылы кімнің қандай құралмен өткенін толық анықтай алады.', en: 'Can match micro-particulates on EVA suits to specific airlock atmospheric cycles.' },
        },
        portraitTags: ['Navigation Specialist', 'Sub-Orbital Pilot', 'Witness'],
        genderPreference: 'female',
        bio: { kk: 'Станцияға жоспарлы қауіпсіздік тексеруімен келген федералдық инспектор.', en: 'Rigid federation auditor reviewing life-support compliance aboard deep-space installations.' },
        personality: ['observant', 'calm'],
        communicationStyle: 'calm',
        relationships: { kk: 'Вэнстің шлюзден жасырын шығып бара жатқанын байқаған.', en: 'Noticed Vance entering the conduit airlock holding a mechanical bypass wrench at 01:00.' },
        publicMotive: { kk: 'Оқиға бойынша ресми тексеру жүргізуші.', en: 'Officially leading the safety inquiry into the helium conduit rupture.' },
        hiddenSecret: { kk: 'Ол станцияның ескі лицензиясы үшін пара алғанын жасырған.', en: 'Overlooked safety compliance violations during a prior station audit.' },
        culpritMotive: { kk: 'Өз тексеруін жасыру.', en: 'Covering up historical audit negligence.' },
        alibiClaim: { kk: 'Техникалық шлюзде скафандрларды санап жүрдім.', en: 'Cataloging EVA suits inside the maintenance airlock.' },
        alibiRoomIndex: 4,
      },
    ],
    evidenceTemplates: [
      {
        idSuffix: 'drained_cryo_valve',
        name: { kk: 'Бұзылған гелий клапаны мен кілт', en: 'Manually Opened Cryo Purge Valve' },
        description: { kk: 'Клапан механигінің кілтімен қолмен бұралған. Бетінде Тарек Вэнстің қорғаныс сауытының бояуы қалған.', en: 'Purge Valve #2 forced open with an engineering wrench bearing Vance’s tool serial number.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'key',
        clueWeight: 0.96,
        roomIndex: 0,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'melted_superconducting_loop',
        name: { kk: 'Қызып кеткен аса өткізгіш сақина', en: 'Overheated Superconducting Loop' },
        description: { kk: 'Салқындатқыш тоқтаған соң 400 кельвинге дейін қызған сақина. Бетінде тартып алу қысқышының іздері бар.', en: 'Thermal damage showing where the qubit core was clamped for emergency mechanical removal.' },
        type: 'physical',
        isEssential: true,
        svgIcon: 'eye',
        clueWeight: 0.94,
        roomIndex: 1,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'sabotaged_coolant_schedule',
        name: { kk: 'Бұрмаланған салқындату журналы', en: 'Tampered Coolant Purge Script' },
        description: { kk: 'Клапан ашылуын «жоспарлы тазалау» деп көрсеткен, 00:50-де Тарек Вэнстің атынан енгізілген файл.', en: 'Automated script disabling safety sirens, uploaded from Tarek Vance’s private terminal at 00:50.' },
        type: 'digital',
        isEssential: true,
        svgIcon: 'terminal',
        clueWeight: 0.95,
        roomIndex: 3,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'thermal_suit_residue',
        name: { kk: 'Жылу шахтасындағы криогендік қырау', en: 'Cryogenic Fluoropolymer Scorch' },
        description: { kk: 'Шахтадағы сатыдан табылған сұйық гелий мен инженерлік сауыттың байланыс ізі.', en: 'Chemical residue of cryogenic polymer flaking from Vance’s protective EVA suit.' },
        type: 'physical',
        isEssential: false,
        svgIcon: 'flask-conical',
        clueWeight: 0.72,
        roomIndex: 2,
        implicatesRole: 'access_holder',
      },
      {
        idSuffix: 'telemetry_override_drive',
        name: { kk: 'Жалған апат шақыру чипі', en: 'Simulated Meltdown Telemetry Drive' },
        description: { kk: 'Станцияның құлап бара жатқанын көрсетіп, эвакуация бұйрығын берген алдамшы чип.', en: 'A plug-in firmware module configured to spoof catastrophic atmospheric drag telemetry.' },
        type: 'digital',
        isEssential: false,
        svgIcon: 'file-text',
        clueWeight: 0.86,
        roomIndex: 4,
        implicatesRole: 'access_holder',
      },
    ],
    connections: [
      {
        id: 'conn_lattice_sabotage',
        clueASuffix: 'drained_cryo_valve',
        clueBSuffix: 'sabotaged_coolant_schedule',
        deductionTitle: { kk: 'Құбыр саботажы мен жалған кесте әшкереленді', en: 'Coolant Purge Sabotage Unmasked' },
        deductionText: {
          kk: 'Клапан қолмен ашылып, дабыл жүйесі жасанды кестемен өшірілген! Мұны станцияны босатып, кубиттерді ұрлау үшін Тарек Вэнс жасаған!',
          en: 'The cryogenic purge valve was mechanically forced while the warning sirens were muted by Tarek Vance’s pre-programmed script to force station evacuation!',
        },
        culpritImplication: true,
      },
    ],
    defaultCulpritRole: 'access_holder',
  },
];

/**
 * Returns a blueprint matching the given era and preferred key, or selects one deterministically via PRNG.
 */
export function selectBlueprint(era: EraId, blueprintIndex: number): StoryBlueprint {
  const eraBlueprints = STORY_BLUEPRINTS.filter((b) => b.era === era);
  if (eraBlueprints.length === 0) return STORY_BLUEPRINTS[0];
  return eraBlueprints[blueprintIndex % eraBlueprints.length];
}
