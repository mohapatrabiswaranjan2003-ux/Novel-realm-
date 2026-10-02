import { Novel } from '../types/novel';
import { buildNarrativeChapters } from '../utils/narrativeGenerator';

export const FAMOUS_FANFIC_NOVELS: Novel[] = [
  // 1. Swallowed Star: Devourer of the Cosmos (500 Chapters)
  {
    id: 9001,
    title: "Swallowed Star: Devourer of the Cosmos",
    author: "I Eat Tomatoes (Homage Serial Edition)",
    coverImage: '/covers/swallowed_star.jpg',
    fallbackGradient: "from-slate-900 via-indigo-950 to-blue-950",
    genre: "Sci-Fi Cultivation",
    tags: ["Cultivation", "Sci-Fi", "Cosmic Beast", "Fighter Tier", "Space Exploration", "500 Chapters"],
    status: "Ongoing",
    rating: 4.95,
    ratingCount: 3820,
    totalViews: "420.5K",
    viewCount: 42050,
    publishedYear: 2026,
    featured: true,
    synopsis: "In a post-apocalyptic Earth ravaged by the RR Virus, monstrous mutated beasts rule the wilderness. Luo Feng, a student from the Jiangnan headquarter city, awakens rare genetic spirit reader talents and embarks on a journey from human martial fighter to the master of the devouring Golden Horned Beast, ascending into the infinite starry cosmos across 500 epic serialized chapters.",
    chapters: buildNarrativeChapters(9001, 500, {
      novelId: 9001,
      title: "Swallowed Star: Devourer of the Cosmos",
      protagonist: "Luo Feng",
      mentorOrAlly: "Master Hong and Thunder God",
      antagonist: "Li Yao and the Golden Horned Behemoth",
      powerSystem: "Cosmic Gene & Fighter Tier",
      worldSetting: "Jiangnan Wilderness & Virtual Universe",
      signatureTechnique: "Ninefold Thunder Blade & Soaring Shuttle",
      signatureArtifact: "Dark Golden Core & Cloud Contact Vine",
      subgenre: "swallowed_star"
    })
  },

  // 2. Douluo Dalu: Spirit Awakening (500 Chapters)
  {
    id: 9002,
    title: "Douluo Dalu: Spirit Awakening",
    author: "Tang Jia San Shao (Homage Serial Edition)",
    coverImage: '/covers/douluo_dalu.jpg',
    fallbackGradient: "from-blue-950 via-cyan-950 to-indigo-950",
    genre: "Fantasy",
    tags: ["Martial Souls", "Spirit Rings", "Shrek Seven Devils", "Tang Sect", "500 Chapters"],
    status: "Ongoing",
    rating: 4.97,
    ratingCount: 4910,
    totalViews: "580.2K",
    viewCount: 58020,
    publishedYear: 2026,
    featured: true,
    synopsis: "Tang San, an outer court disciple of the legendary Tang Sect, falls from the Ghost Peak and reincarnates into the Douluo Continent. Born with supposedly useless Blue Silver Grass and an innate twin martial soul Clear Sky Hammer, he trains alongside the Shrek Seven Devils to overthrow the tyranny of Spirit Hall across 500 chapters of cultivation and romance.",
    chapters: buildNarrativeChapters(9002, 500, {
      novelId: 9002,
      title: "Douluo Dalu: Spirit Awakening",
      protagonist: "Tang San",
      mentorOrAlly: "Grandmaster Yu Xiaogang & Xiao Wu",
      antagonist: "Supreme Pontiff Bibi Dong & Qian Daoliu",
      powerSystem: "Twin Martial Souls & Spirit Rings",
      worldSetting: "Douluo Continent & Star Dou Great Forest",
      signatureTechnique: "Ghost Shadow Perplexing Step & Mysterious Heaven Skill",
      signatureArtifact: "Clear Sky Hammer & Blue Silver Emperor",
      subgenre: "douluo"
    })
  },

  // 3. Douluo Dalu II: The Unrivaled Tang Sect (500 Chapters)
  {
    id: 9003,
    title: "Douluo Dalu II: The Unrivaled Tang Sect",
    author: "Tang Jia San Shao (Homage Serial Edition)",
    coverImage: '/covers/douluo_2.jpg',
    fallbackGradient: "from-sky-950 via-indigo-950 to-slate-950",
    genre: "Fantasy",
    tags: ["Spirit Eyes", "Soul Tools", "Ultimate Ice", "Tang Sect Revival", "500 Chapters"],
    status: "Ongoing",
    rating: 4.91,
    ratingCount: 3120,
    totalViews: "340.1K",
    viewCount: 34010,
    publishedYear: 2026,
    featured: true,
    synopsis: "Ten thousand years after Tang San ascended to the God Realm, the Tang Sect has fallen into decline on Douluo Continent. Huo Yuhao, an orphaned youth bearing the miraculous Spirit Eyes mutation, bonds with the million-year Tianmeng Ice Silkworm and the Ultimate Ice Empress to revolutionize soul tools across 500 serialized chapters.",
    chapters: buildNarrativeChapters(9003, 500, {
      novelId: 9003,
      title: "Douluo Dalu II: The Unrivaled Tang Sect",
      protagonist: "Huo Yuhao",
      mentorOrAlly: "Tianmeng Ice Silkworm & Tang Ya",
      antagonist: "Holy Ghost Sect Elders & Sun Moon Imperial Court",
      powerSystem: "Spirit Eyes & Ultimate Ice Domain",
      worldSetting: "Shrek Academy & Extreme North Ice Plains",
      signatureTechnique: "Spiritual Detection & Empress Palm",
      signatureArtifact: "Ice Empress Stinger & Soul Tool Cannon",
      subgenre: "douluo"
    })
  },

  // 4. Douluo Dalu III: Legend of the Dragon King (500 Chapters)
  {
    id: 9004,
    title: "Douluo Dalu III: Legend of the Dragon King",
    author: "Tang Jia San Shao (Homage Serial Edition)",
    coverImage: '/covers/douluo_3.jpg',
    fallbackGradient: "from-amber-950 via-red-950 to-slate-950",
    genre: "Fantasy",
    tags: ["Dragon King", "Battle Armor", "Mecha", "Bloodline Awakening", "500 Chapters"],
    status: "Ongoing",
    rating: 4.89,
    ratingCount: 2950,
    totalViews: "310.8K",
    viewCount: 31080,
    publishedYear: 2026,
    featured: true,
    synopsis: "With human advancement, spirit beasts face imminent extinction. Tang Wulin awakens the sealed Golden Dragon King bloodline within his veins and navigates the clash between human technology and nature, forging four-word divine battle armor across 500 chapters.",
    chapters: buildNarrativeChapters(9004, 500, {
      novelId: 9004,
      title: "Douluo Dalu III: Legend of the Dragon King",
      protagonist: "Tang Wulin",
      mentorOrAlly: "Gu Yuena & Shrek Inner Court Elders",
      antagonist: "Spirit Pagoda Patriarch & Abyssal Plane Monarch",
      powerSystem: "Golden Dragon King Bloodline & Battle Armor",
      worldSetting: "Douluo Federation & Spirit Pagoda",
      signatureTechnique: "Golden Dragon Claw & Bloodline Roar",
      signatureArtifact: "Sea God Trident & Four-Word Battle Armor",
      subgenre: "douluo"
    })
  },

  // 5. Battle Through the Heavens: Flame of Destiny (500 Chapters)
  {
    id: 9005,
    title: "Battle Through the Heavens: Flame of Destiny",
    author: "Heavenly Silkworm Potato (Homage Serial Edition)",
    coverImage: '/covers/battle_heavens.jpg',
    fallbackGradient: "from-orange-950 via-red-950 to-zinc-950",
    genre: "Xianxia",
    tags: ["Heavenly Flames", "Alchemy", "Dou Qi", "Xiao Clan", "500 Chapters"],
    status: "Ongoing",
    rating: 4.96,
    ratingCount: 5200,
    totalViews: "610.4K",
    viewCount: 61040,
    publishedYear: 2026,
    featured: true,
    synopsis: "A land of Dou Qi where the strong make the rules. Xiao Yan, once a prodigy labeled a cripple after losing his power, uncovers the spirit of master alchemist Yao Lao inside his mother's ring. Chasing the 23 Heavenly Flames across 500 chapters, he proves that thirty years along the eastern river can bring absolute supremacy.",
    chapters: buildNarrativeChapters(9005, 500, {
      novelId: 9005,
      title: "Battle Through the Heavens: Flame of Destiny",
      protagonist: "Xiao Yan",
      mentorOrAlly: "Yao Lao (Venerable Yao)",
      antagonist: "Misty Cloud Sect & Hall of Souls",
      powerSystem: "Dou Qi & Heavenly Flames",
      worldSetting: "Jia Ma Empire & Central Plains",
      signatureTechnique: "Flame Splitting Tsunami & Buddha Angry Lotus",
      signatureArtifact: "Heavy Xuan Ruler & Green Lotus Core Flame",
      subgenre: "btth"
    })
  },

  // 6. A Will Eternal: The Immortal (500 Chapters)
  {
    id: 9006,
    title: "A Will Eternal: The Immortal",
    author: "Er Gen (Homage Serial Edition)",
    coverImage: '/covers/will_eternal.jpg',
    fallbackGradient: "from-emerald-950 via-teal-950 to-slate-950",
    genre: "Xianxia",
    tags: ["Comedic", "Undying Technique", "Alchemy Chef", "Turtle Cauldron", "500 Chapters"],
    status: "Ongoing",
    rating: 4.94,
    ratingCount: 3980,
    totalViews: "390.6K",
    viewCount: 39060,
    publishedYear: 2026,
    featured: true,
    synopsis: "All Bai Xiaochun ever wanted was to live forever. Afraid of death and terribly fond of chicken stew, his hilarious and unpredictable pursuit of immortality shakes sects and heavenspan rivers across 500 chapters of laughter and undying determination.",
    chapters: buildNarrativeChapters(9006, 500, {
      novelId: 9006,
      title: "A Will Eternal: The Immortal",
      protagonist: "Bai Xiaochun",
      mentorOrAlly: "Li Qinghou & Grand Elder",
      antagonist: "Blood Stream Sect Patriarch & Celestial",
      powerSystem: "Undying Live Forever Technique & Qi Condensation",
      worldSetting: "Spirit Stream Sect & Heavenspan River",
      signatureTechnique: "Undying Skin & Throat Crushing Grasp",
      signatureArtifact: "Turtle-Wok Cauldron & Eternal Umbrella",
      subgenre: "will_eternal"
    })
  }
];
