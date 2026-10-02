import { Novel, Chapter } from '../types/novel';
import { FAMOUS_FANFIC_NOVELS } from './famousFanficNovels';
import { HYPER_FANFIC_NOVELS } from './hyperFanficCatalog';
import { EXTENDED_NOVELS } from './extendedNovelsData';
import { PUBLIC_DOMAIN_NOVELS } from './publicDomainNovelsData';
import { MASSIVE_LEGAL_NOVELS } from './massiveNovelsData';
import { buildNarrativeChapters } from '../utils/narrativeGenerator';

const BASE_NOVELS: Novel[] = [
  {
    id: 1,
    title: "The Stellar Voyager",
    author: "Arthur Vance",
    coverImage: '/covers/stellar_voyager.jpg',
    fallbackGradient: "from-blue-900 via-indigo-950 to-slate-950",
    genre: "Sci-Fi",
    tags: ["Space Exploration", "First Contact", "Hard Sci-Fi", "Artificial Intelligence", "500 Chapters"],
    status: "Ongoing",
    rating: 4.9,
    ratingCount: 1420,
    totalViews: "185.4K",
    viewCount: 18540,
    publishedYear: 2026,
    featured: true,
    synopsis: "When the deep-range survey cruiser 'Astraea' detects an impossible harmonic pulse radiating from the Cygnus-9 Veil, Commander Arthur Vance and his crew must chart a forbidden quadrant where the laws of physics appear to unravel across 500 serialized chapters.",
    chapters: buildNarrativeChapters(1, 500, {
      novelId: 1,
      title: "The Stellar Voyager",
      protagonist: "Commander Arthur Vance",
      mentorOrAlly: "Chief Science Officer Elena",
      antagonist: "The Cygnus Automated Dyson Lattice",
      powerSystem: "Sub-Space Resonance & Antimatter Drives",
      worldSetting: "Survey Cruiser Astraea & Cygnus-9 Veil",
      signatureTechnique: "Relativistic Vector Inversion",
      signatureArtifact: "Quantum Harmonic Sensor Core",
      subgenre: "scifi"
    })
  },
  {
    id: 2,
    title: "Shadows of Eldoria",
    author: "Lyra Moonshadow",
    coverImage: '/covers/shadows_eldoria.jpg',
    fallbackGradient: "from-purple-950 via-slate-900 to-indigo-950",
    genre: "Fantasy",
    tags: ["Epic Fantasy", "Magic System", "Dark Mystery", "Ancient Prophecy", "500 Chapters"],
    status: "Ongoing",
    rating: 4.85,
    ratingCount: 890,
    totalViews: "4.8K",
    viewCount: 4800,
    publishedYear: 2026,
    synopsis: "In the fractured realm of Eldoria, moonlight is not merely illumination—it is the physical residue of celestial gods slain during the First Sundering. An exiled spellweaver uncovers the shadow cabal across 500 chapters.",
    chapters: buildNarrativeChapters(2, 500, {
      novelId: 2,
      title: "Shadows of Eldoria",
      protagonist: "Kaelyn Moonshadow",
      mentorOrAlly: "Archmage Vaelin of the Ivory Tower",
      antagonist: "The Shadow Council of the Eclipse",
      powerSystem: "Lunar Weaving & Celestial Sigils",
      worldSetting: "Sanctuary of Silvermoon & Sunken Catacombs",
      signatureTechnique: "Silver Lunar Thread Annihilation",
      signatureArtifact: "Crescent Starfall Pendant",
      subgenre: "general_xianxia"
    })
  },
  {
    id: 3,
    title: "Chronicles of the Jade Immortal",
    author: "Feng Wei",
    coverImage: '/covers/jade_immortal.jpg',
    fallbackGradient: "from-emerald-950 via-teal-950 to-slate-950",
    genre: "Xianxia",
    tags: ["Cultivation", "Immortal Dao", "Martial Arts", "Reincarnation", "500 Chapters"],
    status: "Ongoing",
    rating: 4.95,
    ratingCount: 2310,
    totalViews: "98.2K",
    viewCount: 98200,
    publishedYear: 2025,
    synopsis: "Betrayed at the threshold of the Golden Immortal Tribulation by his closest martial brother, Shen Feiyan awakens three centuries in the past in the frail body of an outer courtyard herb gardener across 500 chapters of vengeance and ascension.",
    chapters: buildNarrativeChapters(3, 500, {
      novelId: 3,
      title: "Chronicles of the Jade Immortal",
      protagonist: "Shen Feiyan",
      mentorOrAlly: "Spirit Herb Elder Guan",
      antagonist: "Betrayer Patriarch Lu Zhen",
      powerSystem: "Nine-Rotation Jade Core & Sword Qi",
      worldSetting: "Azure Cloud Sect & Heavenly Tribulation Mountain",
      signatureTechnique: "Nine Heavens Jade Lotus Sword",
      signatureArtifact: "Ancestral Verdant Bamboo Flute",
      subgenre: "general_xianxia"
    })
  },
  {
    id: 4,
    title: "Protocol: Neon Dawn",
    author: "Kaito Tanaka",
    coverImage: '/covers/neon_dawn.jpg',
    fallbackGradient: "from-cyan-950 via-slate-900 to-rose-950",
    genre: "Cyberpunk",
    tags: ["Cyberpunk", "AI Rebellion", "Dystopian", "Netrunner", "500 Chapters"],
    status: "Ongoing",
    rating: 4.78,
    ratingCount: 640,
    totalViews: "31.2K",
    viewCount: 31200,
    publishedYear: 2025,
    synopsis: "In the rain-slicked underbelly of Neo-Kyoto 2099, black-market neural diver Ren Tanaka intercepts an encrypted AI memory core containing the final thoughts of the city's greatest assassinated tech mogul across 500 chapters.",
    chapters: buildNarrativeChapters(4, 500, {
      novelId: 4,
      title: "Protocol: Neon Dawn",
      protagonist: "Ren Tanaka",
      mentorOrAlly: "Cybernetic Specialist Maya",
      antagonist: "Aegis Corporation Security Director",
      powerSystem: "Neural Hacking & Nanotech Augmentation",
      worldSetting: "Neo-Kyoto Level 4 & Aegis Megatower",
      signatureTechnique: "Quantum Ghost Bypass",
      signatureArtifact: "Overclocked Cryo-Interface Deck",
      subgenre: "scifi"
    })
  },
  {
    id: 5,
    title: "The Clockwork Alchemist",
    author: "Vivienne Marche",
    coverImage: '/covers/clockwork_alchemist.jpg',
    fallbackGradient: "from-amber-950 via-stone-900 to-amber-900",
    genre: "Steampunk",
    tags: ["Steampunk", "Alchemy", "Victorian Mystery", "Automatons", "500 Chapters"],
    status: "Ongoing",
    rating: 4.76,
    ratingCount: 710,
    totalViews: "1.6K",
    viewCount: 1650,
    publishedYear: 2025,
    synopsis: "In the soot-choked metropolis of New Aethelgard, master horologist Cecelia Vance discovers that the grand brass automaton built by her late mentor possesses a clockwork heart infused with philosopher's mercury across 500 chapters.",
    chapters: buildNarrativeChapters(5, 500, {
      novelId: 5,
      title: "The Clockwork Alchemist",
      protagonist: "Cecelia Vance",
      mentorOrAlly: "Sentient Automaton Adam",
      antagonist: "Grand Inquisitor of the Watchmaker's Guild",
      powerSystem: "Alchemical Mercury Transmutation & Clockwork Resonators",
      worldSetting: "New Aethelgard Iron Bridge & Guild Vault",
      signatureTechnique: "Perpetual Motion Gear Drive",
      signatureArtifact: "Liquid Philosopher's Pocket Chronometer",
      subgenre: "scifi"
    })
  },
  {
    id: 6,
    title: "Ascension: Glitched Sovereign",
    author: "Devon Ray",
    coverImage: '/covers/glitched_sovereign.jpg',
    fallbackGradient: "from-violet-950 via-slate-900 to-indigo-950",
    genre: "LitRPG",
    tags: ["LitRPG", "System Apocalypse", "Leveling", "Overpowered", "500 Chapters"],
    status: "Ongoing",
    rating: 4.82,
    ratingCount: 1890,
    totalViews: "42.5K",
    viewCount: 42500,
    publishedYear: 2026,
    synopsis: "When the cosmic System arrives on Earth, everyone is granted standard fantasy classes—except Leo, who gets a debugger class capable of reading and exploiting the source code of reality across 500 chapters.",
    chapters: buildNarrativeChapters(6, 500, {
      novelId: 6,
      title: "Ascension: Glitched Sovereign",
      protagonist: "Leo Vance",
      mentorOrAlly: "AI Debugger Unit 'Null'",
      antagonist: "The Cosmic System Administrator",
      powerSystem: "Memory Address Rewriting & Reality Hex Overrides",
      worldSetting: "Integrated Earth Sector & System Spire",
      signatureTechnique: "Stack Overflow Nullification Beam",
      signatureArtifact: "Root Access Developer Terminal",
      subgenre: "scifi"
    })
  },
  {
    id: 7,
    title: "The Moonlit Duchess and the Dragon Lord",
    author: "Lady Evelyn Rivers",
    coverImage: '/covers/moonlit_duchess.jpg',
    fallbackGradient: "from-rose-950 via-purple-950 to-slate-950",
    genre: "Romance",
    tags: ["Fantasy Romance", "Enemies to Lovers", "Dragon Shifter", "Royal Court", "500 Chapters"],
    status: "Ongoing",
    rating: 4.92,
    ratingCount: 2450,
    totalViews: "68.4K",
    viewCount: 68400,
    publishedYear: 2026,
    featured: true,
    synopsis: "To save her duchy from ruin, Duchess Seraphina agrees to a political betrothal with Duke Gerald of the Black Peaks—a feared warlord rumored to harbor the untamed heart of an ancient golden dragon across 500 chapters.",
    chapters: buildNarrativeChapters(7, 500, {
      novelId: 7,
      title: "The Moonlit Duchess and the Dragon Lord",
      protagonist: "Duchess Seraphina",
      mentorOrAlly: "Duke Gerald of the Black Peaks",
      antagonist: "Corrupt Royal Regent of Highgarden",
      powerSystem: "Dragon Heart Aura & Ancient Bloodline Seals",
      worldSetting: "Sunken Rose Palace & Black Peak Fortress",
      signatureTechnique: "Golden Dragon Roaring Harmony",
      signatureArtifact: "Ancient Dragon Seal Signet",
      subgenre: "general_xianxia"
    })
  },
  {
    id: 8,
    title: "The Whispering Archives of Arkham Gate",
    author: "Prof. Thaddeus Sterling",
    coverImage: '/covers/whispering_archives.jpg',
    fallbackGradient: "from-stone-950 via-zinc-900 to-black",
    genre: "Mystery",
    tags: ["Lovecraftian", "Occult Mystery", "Cosmic Horror", "Investigation", "500 Chapters"],
    status: "Ongoing",
    rating: 4.79,
    ratingCount: 810,
    totalViews: "18.3K",
    viewCount: 18300,
    publishedYear: 2025,
    synopsis: "In 1928, an occult scholar at Arkham Gate University catalogues forbidden grimoires whisper-bound in human skin. When a celestial star alignment begins altering reality, he investigates across 500 eerie chapters.",
    chapters: buildNarrativeChapters(8, 500, {
      novelId: 8,
      title: "The Whispering Archives of Arkham Gate",
      protagonist: "Prof. Thaddeus Sterling",
      mentorOrAlly: "Archivist Inspector Finch",
      antagonist: "The Cult of the Drowned Star",
      powerSystem: "Eldritch Glyph Decryption & Sanity Anchors",
      worldSetting: "Miskatonic Sub-Basement & Arkham Wharf",
      signatureTechnique: "Elder Warding Inscription",
      signatureArtifact: "Brass Astronavigational Astrolabe",
      subgenre: "scifi"
    })
  },
  {
    id: 9,
    title: "Blade of the Autumn Mist",
    author: "Song Wuchen",
    coverImage: '/covers/blade_autumn_mist.jpg',
    fallbackGradient: "from-orange-950 via-red-950 to-stone-950",
    genre: "Wuxia",
    tags: ["Wuxia", "Swordsman", "Revenge", "Jianghu", "Martial Arts", "500 Chapters"],
    status: "Ongoing",
    rating: 4.88,
    ratingCount: 1120,
    totalViews: "52.1K",
    viewCount: 52100,
    publishedYear: 2026,
    synopsis: "A lone wandering swordswoman traverses the rain-soaked taverns and misty mountain passes of the Jianghu, seeking justice for the fallen Autumn Mist Pavilion across 500 chapters of peerless blade combat.",
    chapters: buildNarrativeChapters(9, 500, {
      novelId: 9,
      title: "Blade of the Autumn Mist",
      protagonist: "Song Wuchen",
      mentorOrAlly: "Drunken Daoist of Mount Tai",
      antagonist: "The Seven Flying Dagger Assassins",
      powerSystem: "Internal Qi Circulation & Autumn Leaf Steps",
      worldSetting: "Western Mountain Pass & Jianghu Inns",
      signatureTechnique: "Autumn Mist Severing Flash",
      signatureArtifact: "Cold Iron Autumn Dao",
      subgenre: "general_xianxia"
    })
  },
  {
    id: 10,
    title: "Reborn as an Infinite Dungeon Core",
    author: "G. R. Blackwood",
    coverImage: '/covers/infinite_dungeon.jpg',
    fallbackGradient: "from-emerald-950 via-slate-900 to-cyan-950",
    genre: "LitRPG",
    tags: ["LitRPG", "Dungeon Building", "Monster Evolution", "Reincarnation", "500 Chapters"],
    status: "Ongoing",
    rating: 4.85,
    ratingCount: 1430,
    totalViews: "61.4K",
    viewCount: 61400,
    publishedYear: 2026,
    synopsis: "Reincarnated into a subterranean cavern as a glowing blue crystal polyhedron, an ordinary gamer must manage mana flows, craft deadly traps, and breed mythical guardian monsters across 500 chapters.",
    chapters: buildNarrativeChapters(10, 500, {
      novelId: 10,
      title: "Reborn as an Infinite Dungeon Core",
      protagonist: "Core Designation 07",
      mentorOrAlly: "Dungeon Fairy Guide 'Pix'",
      antagonist: "The Grand Adventurer's Crusade",
      powerSystem: "Mana Well Expansion & Monster Spawner Logic",
      worldSetting: "Subterranean Labyrinth Floor 1 to 100",
      signatureTechnique: "Cataclysmic Labyrinth Shift",
      signatureArtifact: "Resonance Crystalline Heart",
      subgenre: "scifi"
    })
  },
  {
    id: 11,
    title: "The Abyssal Sovereign: Leviathan Rebirth",
    author: "M. K. Drake",
    coverImage: '/covers/abyssal_sovereign.jpg',
    fallbackGradient: "from-blue-950 via-teal-950 to-black",
    genre: "Supernatural",
    tags: ["Sea Monster", "Evolution", "Dark Fantasy", "Rebirth", "500 Chapters"],
    status: "Ongoing",
    rating: 4.87,
    ratingCount: 1670,
    totalViews: "73.9K",
    viewCount: 73900,
    publishedYear: 2026,
    synopsis: "Reborn into the pitch-black Mariana Trench as a juvenile deep-sea leviathan, a human spirit absorbs hydrothermal vent energies and ancient sunken relics to ascend to planetary oceanic supremacy across 500 chapters.",
    chapters: buildNarrativeChapters(11, 500, {
      novelId: 11,
      title: "The Abyssal Sovereign: Leviathan Rebirth",
      protagonist: "Leviathan 'Typhon'",
      mentorOrAlly: "Ancient Whale Spirit Elder",
      antagonist: "Deep Sea Abyssal Kraken Swarm",
      powerSystem: "Hydrostatic Pressure Dominance & Bioluminescent Rays",
      worldSetting: "Hadal Abyssal Trench & Sunken Continents",
      signatureTechnique: "Abyssal Singularity Vortex",
      signatureArtifact: "Primordial Oceanic Heart Pearl",
      subgenre: "general_xianxia"
    })
  }
];

function buildDeduplicatedNovelCatalog(rawNovels: Novel[]): Novel[] {
  const seenTitles = new Set<string>();
  const seenIds = new Set<number>();
  const uniqueCatalog: Novel[] = [];

  for (const novel of rawNovels) {
    const normalizedTitle = novel.title.toLowerCase().trim();
    if (seenTitles.has(normalizedTitle) || seenIds.has(novel.id)) {
      continue;
    }
    seenTitles.add(normalizedTitle);
    seenIds.add(novel.id);
    uniqueCatalog.push(novel);
  }

  return uniqueCatalog;
}

export const INITIAL_NOVELS: Novel[] = buildDeduplicatedNovelCatalog([
  ...FAMOUS_FANFIC_NOVELS,
  ...HYPER_FANFIC_NOVELS,
  ...BASE_NOVELS,
  ...EXTENDED_NOVELS,
  ...PUBLIC_DOMAIN_NOVELS,
  ...MASSIVE_LEGAL_NOVELS
]);

export const GENRE_LIST = [
  'All Genres',
  'Sci-Fi',
  'Fantasy',
  'Xianxia',
  'Sci-Fi Cultivation',
  'LitRPG',
  'Cyberpunk',
  'Steampunk',
  'Romance',
  'Mystery',
  'Wuxia',
  'Action',
  'Horror',
  'Historical',
  'Adventure',
  'Supernatural',
  'Thriller'
] as const;
