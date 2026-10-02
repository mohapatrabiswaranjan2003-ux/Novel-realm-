import { Novel, Chapter } from '../types/novel';

// Chapter generator for public domain masterworks with 105+ chapters each
function generatePublicDomainChapters(
  novelId: number,
  totalChapters: number,
  titlePrefixes: string[],
  context: {
    hero: string;
    setting: string;
    conflict: string;
    artifactOrGoal: string;
    eraVibe: string;
  }
): Chapter[] {
  const chapters: Chapter[] = [];

  for (let ch = 1; ch <= totalChapters; ch++) {
    const customTitle = titlePrefixes[ch - 1] || `Chapter ${ch}: The Path Through ${context.setting}`;
    const wordCount = 1200 + ((ch * 19) % 450);
    const readMinutes = Math.max(5, Math.round(wordCount / 220));
    const isLockedMilestone = ch > 30;

    let narrativeArc = 'opening';
    if (ch > 80) narrativeArc = 'climax';
    else if (ch > 30) narrativeArc = 'midway';

    let contentHtml = '';
    if (narrativeArc === 'opening') {
      contentHtml = `
        <p>The chronicle of Chapter ${ch} opens within ${context.setting}, where the passage of time had woven legends into every stone and breeze. ${context.hero} stood at the precipice of destiny, observing the gathering signs of ${context.conflict}.</p>
        <p>"Few travelers dare tread beyond these markers," murmured the guide, glancing nervously toward the shadowed horizon. "The records warned that ${context.artifactOrGoal} could only be reached through enduring the trials of the ancients."</p>
        <p>${context.hero} offered a calm smile, adjusting the mantle woven in the style of ${context.eraVibe}. "A journey of ten thousand leagues begins with a single step. Let us see what truth lies hidden where history ceases to speak."</p>
        <p>With resolute purpose, the expedition pressed forward into the uncharted wilderness, each heartbeat bringing them closer to the heart of the enigma.</p>
      `;
    } else if (narrativeArc === 'midway') {
      contentHtml = `
        <p>By Chapter ${ch}, the long campaign through ${context.setting} had tested both flesh and spirit. The resonance of ${context.artifactOrGoal} grew ever more palpable, illuminating the nocturnal sky with an ethereal brilliance.</p>
        <p>"The adversary knows we have broken through the outer defenses," the lieutenant warned, brandishing their scarred weapon as tremors rippled through the earth. "If ${context.conflict} reaches its apex before daybreak, the entire realm could be overturned."</p>
        <p>"Then we stand our ground," ${context.hero} declared, eyes reflecting the unyielding radiance of their mission. "We did not survive ninety perils only to waver at the gateway."</p>
        <p>The night erupted in a dazzling clash of wills, as ancient powers awoke from centuries of slumber to challenge the advancing heroes.</p>
      `;
    } else {
      contentHtml = `
        <p>At the zenith of the saga, Chapter ${ch} brings the long struggle against ${context.conflict} to its definitive battleground atop ${context.setting}. The skies churned with celestial splendor, bearing witness to the culmination of this epic trial.</p>
        <p>Before them rose the manifestation of ${context.artifactOrGoal}, glowing with the accumulated history of ages past. All around, the echoes of earlier victories and sacrifices converged upon this singular moment.</p>
        <p>"You have endured every tribulation," spoke the ancient guardian, lowering their staff as cosmic winds billowed. "Claim the reward of your perseverance, for your name shall forever be inscribed in the immortal annals of the realm."</p>
        <p>With a final, triumphant breath, ${context.hero} stepped into the light of history, cementing a legend that would echo through generations of readers.</p>
      `;
    }

    chapters.push({
      id: novelId * 1000 + ch,
      novelId,
      chapterNumber: ch,
      title: customTitle,
      wordCount,
      estimatedReadMinutes: readMinutes,
      releaseDate: `Classic Serial Edition · Part ${ch}`,
      authorNote: isLockedMilestone
        ? `Chapter ${ch} is part of the VIP Serialization Archive. Unlock free with your Daily Free Pass or unlock all 100+ chapters with a $2 Lifetime Pass!`
        : undefined,
      content: contentHtml.trim(),
    });
  }

  return chapters;
}

// 50 Masterwork Public Domain & Open-License Novels Across All Genres (100+ chapters each)
export const PUBLIC_DOMAIN_NOVELS: Novel[] = [
  // ==========================================
  // XIANXIA & EASTERN MYTHOLOGY (10 NOVELS)
  // ==========================================
  {
    id: 101,
    title: "Journey to the West: The Great Sage",
    author: "Wu Cheng'en",
    coverImage: '/covers/journey_west.jpg',
    fallbackGradient: "from-amber-900 via-orange-950 to-zinc-950",
    genre: "Xianxia",
    tags: ["Cultivation", "Monkey King", "Daoist Immortals", "Mythology", "Classic Epic", "Public Domain"],
    status: "Completed",
    rating: 4.98,
    ratingCount: 8420,
    totalViews: "1.4M",
    viewCount: 1400000,
    publishedYear: 1592,
    synopsis: "The immortal Chinese epic of Sun Wukong, the Monkey King born from a divine stone, who achieves immortality, rebels against Heaven, and undertakes a perilous 100-chapter pilgrimage with the monk Tang Sanzang to retrieve sacred scriptures.",
    chapters: generatePublicDomainChapters(101, 100, [
      "The Stone Monkey Born from Chaos", "Seeking Immortality Across the Seas", "The Patriarch Teaches the Seventy-Two Transformations",
      "Somersault Cloud and Heavenly Vaults", "The Dragon King's Golden Cudgel", "Erasing Names from the Underworld Register",
      "Havoc in the Celestial Heavens", "Imprisoned Beneath the Five Elements Mountain", "The Guanyin Bodhisattva's Compassion",
      "The Journey Begins at the Border", "Subduing the White Dragon Steed", "The Nine-Ringed Staff and Robe",
      "Encounter with Zhu Bajie at Gao Village", "The Flowing Sand River and Sha Wujing", "The Heavenly Peach Garden Feat",
      "The Ginseng Fruit of Five Breeze Mountain", "Three Strikes at the White Bone Demon", "The Golden and Silver Horned Kings",
      "The Red Boy's Samadhi True Fire", "The River of Heaven and Carp Spirit", "The Flaming Mountains and Iron Fan Princess",
      "Stealing the Palm-Leaf Fan", "The Nine-Headed Demon King", "The Kingdom of Women", "The True and False Monkey Kings",
      "Thunder Peak Monastery Illusion", "The Spider Demons of Silk Cave", "The Centipede Taoist Master",
      "The Lion, Elephant, and Golden-Winged Roc", "The Imperial City of Bhikshu", "Rescue of the Boy Infants",
      "The Jade Hare Maiden", "Arrival at the Western Pure Land", "The Vulture Peak Assembly", "Bestowal of the Lotus Immortals"
    ], {
      hero: "Sun Wukong (The Great Sage Equal to Heaven)",
      setting: "the Celestial Heavens and the Silk Road Wilderness",
      conflict: "Eighty-One Perils of Demonic Tribulation",
      artifactOrGoal: "the As-You-Will Golden-Banded Cudgel and Sacred Sutras",
      eraVibe: "Tang Dynasty Immortal Cultivation"
    })
  },
  {
    id: 102,
    title: "Romance of the Three Kingdoms",
    author: "Luo Guanzhong",
    coverImage: '/covers/three_kingdoms.jpg',
    fallbackGradient: "from-red-950 via-zinc-900 to-amber-950",
    genre: "Historical",
    tags: ["Strategy", "Warring Kingdoms", "Military Genius", "Zhuge Liang", "Classic Epic", "Public Domain"],
    status: "Completed",
    rating: 4.96,
    ratingCount: 7920,
    totalViews: "1.2M",
    viewCount: 1200000,
    publishedYear: 1522,
    synopsis: "The legendary historical epic spanning 120 chapters of sworn brotherhood in the Peach Garden, military brilliance of Zhuge Liang, and the legendary clash of Wei, Shu, and Wu for control of the Middle Kingdom.",
    chapters: generatePublicDomainChapters(102, 120, [
      "Oath of the Peach Garden", "Suppressing the Yellow Turban Rebellion", "The Fall of Dong Zhuo",
      "Lu Bu's Unrivaled Halberd", "Cao Cao's Rise to Dominance", "The Battle of Guandu",
      "Three Visits to the Recluse Cottage", "Zhuge Liang's Longzhong Strategy", "The Battle of Red Cliffs",
      "Borrowing Arrows with Straw Boats", "East Wind at Chibi Fire Strike", "Taking Jingzhou by Strategy",
      "Guan Yu Crosses Five Passes", "The Battle of Mt. Dingjun", "Guan Yu Lost at Maicheng",
      "Liu Bei's Vengeance at Yiling", "Seven Captures of Meng Huo", "Northern Expeditions from the Qishan Gates",
      "Empty Fort Strategy at Xicheng", "Autumn Wind at Wuzhang Plains", "The Unification of the Jin Dynasty"
    ], {
      hero: "Liu Bei, Guan Yu, Zhang Fei, and Zhuge Liang",
      setting: "the Divided Central Plains of Ancient China",
      conflict: "the Hegemony of the Three Warring Dynasties",
      artifactOrGoal: "the Imperial Jade Seal of the Han Emperor",
      eraVibe: "Warring Kingdoms Strategic Warfare"
    })
  },
  {
    id: 103,
    title: "Water Margin: The 108 Outlaws of Liangshan",
    author: "Shi Nai'an",
    coverImage: '/covers/water_margin.jpg',
    fallbackGradient: "from-amber-950 via-stone-900 to-slate-950",
    genre: "Action",
    tags: ["Martial Arts", "Rebellion", "Sworn Brothers", "Wuxia Precursor", "Classic Epic", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 6510,
    totalViews: "980K",
    viewCount: 980000,
    publishedYear: 1589,
    synopsis: "The premier martial outlaw epic of 108 brave heroes exiled by corrupt officials who gather in the misty marshes of Mount Liang to fight for the oppressed and uphold martial righteousness.",
    chapters: generatePublicDomainChapters(103, 108, [
      "Release of the 108 Heavenly and Earthly Fiends", "Nine-Dragon Shi Jin's Martial Mastery", "Lu Zhishen Uproots the Weeping Willow",
      "Lin Chong Framed at the White Tiger Hall", "The Snowy Night at the Mountain Temple", "Yang Zhi Sells His Precious Blade",
      "Robbery of the Birthday Convoy", "Gathering at the Liangshan Marshes", "Wu Song Slays the Tiger on Jingyang Ridge",
      "The Lion Pavilion Vengeance", "The Drunken Fist at Mengzhou Tavern", "Song Jiang Inscribes a Rebellious Poem",
      "Rescuing Song Jiang at the Jiangzhou Execution Grounds", "Li Kui Whirlwinds Through the Wilderness", "The Grand Gathering of 108 Stars"
    ], {
      hero: "Song Jiang, Wu Song, and Lin Chong",
      setting: "the Marshlands of Mount Liang",
      conflict: "the Corruption of Imperial Ministers",
      artifactOrGoal: "the Sworn Banner of 'Delivering Justice on Behalf of Heaven'",
      eraVibe: "Song Dynasty Martial Jianghu"
    })
  },
  {
    id: 104,
    title: "Fengshen Yanyi: Investiture of the Gods",
    author: "Xu Zhonglin",
    coverImage: '/covers/investiture_gods.jpg',
    fallbackGradient: "from-purple-950 via-indigo-950 to-amber-950",
    genre: "Xianxia",
    tags: ["Daoist Gods", "Immortal Treasures", "Nezha", "Shang-Zhou War", "High Fantasy", "Public Domain"],
    status: "Completed",
    rating: 4.95,
    ratingCount: 6180,
    totalViews: "890K",
    viewCount: 890000,
    publishedYear: 1605,
    synopsis: "The grand Daoist mythological masterpiece where celestial deities, demons, and immortal masters clash during the fall of King Zhou. Features Nezha, Jiang Ziya, and the cosmic Investiture Tablet of 365 Gods.",
    chapters: generatePublicDomainChapters(104, 100, [
      "King Zhou's Sacrilege at Nuwa's Temple", "Daji the Thousand-Year Fox Enters the Palace", "The Birth of Nezha from the Meat Ball",
      "Nezha Stirs the Dragon King's Eastern Ocean", "The Rebirth in the Sacred Lotus Flower", "Jiang Ziya Fishes with a Straight Hook",
      "King Wen Welcomes the Prime Minister", "The Yellow River Immortal Formation", "The Ten Absolute Array Formations",
      "Yang Jian's Heavenly Hound and Third Eye", "The Yin-Yang Mirror and Fire Bell", "The Fall of the Morning Star Dynastic Palace",
      "The Grand Rite at the Investiture Altar", "Sealing the 365 Celestial Deities"
    ], {
      hero: "Jiang Ziya and Nezha (The Lotus Prince)",
      setting: "the Primordial Spirit World and Yin-Shang Capital",
      conflict: "the Cataclysmic War between Chan and Jie Daoist Sects",
      artifactOrGoal: "the Cosmic Whip of Gods and the Investiture Tablet",
      eraVibe: "Primordial Daoist Sorcery"
    })
  },
  {
    id: 105,
    title: "Strange Tales from a Chinese Studio",
    author: "Pu Songling",
    coverImage: '/covers/strange_tales.jpg',
    fallbackGradient: "from-emerald-950 via-zinc-900 to-indigo-950",
    genre: "Supernatural",
    tags: ["Fox Spirits", "Daoist Magic", "Ghost Realms", "Scholar Legends", "Classic Folklore", "Public Domain"],
    status: "Completed",
    rating: 4.93,
    ratingCount: 5240,
    totalViews: "760K",
    viewCount: 760000,
    publishedYear: 1740,
    synopsis: "The definitive 100+ chapter anthology of supernatural love, ethereal fox maidens, Daoist necromancers, and journeys into the Underworld, depicting the boundary where human morality meets magical realms.",
    chapters: generatePublicDomainChapters(105, 105, [
      "The Painted Skin Demon", "Nie Xiaoqian and the Ruined Monastery", "The Fox Maiden of Qianshan",
      "The Taoist Priest of Laoshan Passes Through Walls", "The Cricket Fighting Champion", "The Scholar of the Dragon Palace",
      "The Magic Peach from the Celestial Clouds", "The Dream of the Butterfly Court", "The Underworld Magistrate's Ledger",
      "The Spirit of the Green Maiden", "The Flower Fairy of Mount Tai", "The Ghostly Examination Hall"
    ], {
      hero: "Scholar Ning Caichen and Master Pu Songling",
      setting: "the Mist-Veiled Mountain Pavilions of Ancient China",
      conflict: "Spiritual Possession and Transmigration of Souls",
      artifactOrGoal: "the Inscribed Peach-Wood Sword and Celestial Scroll",
      eraVibe: "Qing Dynasty Occult Romance"
    })
  },
  {
    id: 106,
    title: "The Classic of Mountains and Seas: Beast Chronicles",
    author: "Ancient Scholars (Trans. Public Domain)",
    coverImage: '/covers/mountains_seas.jpg',
    fallbackGradient: "from-teal-950 via-cyan-950 to-slate-950",
    genre: "Fantasy",
    tags: ["Mythical Beasts", "Primordial Earth", "Nine-Tailed Fox", "Qilin", "World Lore", "Public Domain"],
    status: "Completed",
    rating: 4.91,
    ratingCount: 4890,
    totalViews: "680K",
    viewCount: 680000,
    publishedYear: 1780,
    synopsis: "The oldest and most comprehensive encyclopedia of ancient eastern mythology, describing hundreds of supernatural beasts, sacred spirit peaks, divine waters, and heavenly plants across 100+ chapters of expedition logs.",
    chapters: generatePublicDomainChapters(106, 100, [
      "The Southern Mountains of Cinnabar Minerals", "The Nine-Tailed Fox of Green Mound", "The Feathered People of the Eastern Islands",
      "The Kunlun Divine Axis and Queen Mother of the West", "The Dragon of Mount Buzhou", "Kuafu Chases the Sun Across the Plains",
      "Jingwei Fills the Eastern Ocean with Pebbles", "The Thunder God of the Great Swamp", "The Tree of Jianmu Reaching the Clouds",
      "The Sacred Qilin of Auspicious Fortune", "The Four Divine Perils of the Wastelands", "The Pinnacle of the Celestial Pillar"
    ], {
      hero: "The Imperial Cartographers of the Yellow Emperor",
      setting: "the Primordial Continents and Mythic Peaks",
      conflict: "Surviving Ancient Leviathans and Celestial Calamities",
      artifactOrGoal: "the Nine Bronze Cauldrons of Divine Geography",
      eraVibe: "Pre-Dynastic Mythic Exploration"
    })
  },
  {
    id: 107,
    title: "The Tale of Genji: Court & Spirit Chronicles",
    author: "Murasaki Shikibu",
    coverImage: '/covers/tale_of_genji.jpg',
    fallbackGradient: "from-rose-950 via-purple-950 to-zinc-950",
    genre: "Romance",
    tags: ["Heian Court", "Aristocratic Intrigue", "Poetic Romance", "World's First Novel", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 5670,
    totalViews: "720K",
    viewCount: 720000,
    publishedYear: 1010,
    synopsis: "Widely regarded as the world's very first novel. A breathtaking 100+ chapter saga of Prince Genji, navigating radiant court poetry, imperial politics, spiritual omens, and timeless affairs of the heart in imperial Kyoto.",
    chapters: generatePublicDomainChapters(107, 100, [
      "The Paulownia Pavilion", "The Broom Tree Night Talk", "The Locust Shell",
      "The Evening Faces (Yūgao)", "Young Murasaki of the Northern Hills", "The Safflower Maiden",
      "An Imperial Feast of the Cherry Blossoms", "Heartvine at the Kamo Festival", "The Sacred Maiden of Ise",
      "The Exile to the Coast of Suma", "The Dragon King's Storm at Akashi", "Return to the Golden Capital",
      "The Rokujō Mansion of Four Seasons", "The Willow Court Whispers", "The Floating Bridge of Dreams"
    ], {
      hero: "The Shining Prince Hikaru Genji",
      setting: "the Imperial Palaces and Gardens of Heian Kyoto",
      conflict: "Court Rivalries and the Bitter Sting of Karmic Transience",
      artifactOrGoal: "the Heian Koto Harp and Imperial Inkstone",
      eraVibe: "Heian Period Imperial Elegance"
    })
  },
  {
    id: 108,
    title: "Chronicles of the Eastern Zhou Kingdoms",
    author: "Feng Menglong",
    coverImage: '/covers/eastern_zhou.jpg',
    fallbackGradient: "from-stone-950 via-zinc-900 to-amber-950",
    genre: "Historical",
    tags: ["Military Strategy", "Assassins", "Sun Tzu", "Warring States", "Grand Politics", "Public Domain"],
    status: "Completed",
    rating: 4.88,
    ratingCount: 4120,
    totalViews: "540K",
    viewCount: 540000,
    publishedYear: 1640,
    synopsis: "A thrilling historical saga covering the Spring and Autumn and Warring States periods over 100+ chapters: featuring the strategies of Sun Tzu, the martyrdom of loyal ministers, and the rise of martial philosophers.",
    chapters: generatePublicDomainChapters(108, 100, [
      "King Xuan Ignores the Omens", "The Beacon Fires That Deceived the Dukes", "The Flight to the Eastern Capital",
      "Duke Zhuang of Zheng Outmaneuvers His Enemies", "The Rise of Duke Huan of Qi", "Guan Zhong's Economic Genius",
      "The Chariot Clash at Chengpu", "Sun Wu Tests the Palace Maidens with Military Law", "The Siege of Ying and the Revenge of Wu Zixu",
      "Goujian Sleeps on Brushwood and Tastes Gall", "The Division of Jin into Three Powers", "Shang Yang's Legalist Reforms in Qin"
    ], {
      hero: "Sun Tzu, Guan Zhong, and Duke Wen of Jin",
      setting: "the Fortified Walled Cities of the Yellow River Basin",
      conflict: "Five Hegemons and Seven Warring States for Continental Dominion",
      artifactOrGoal: "the Sun Tzu Art of War Bamboo Scrolls",
      eraVibe: "Ancient Chinese Chariot Warfare"
    })
  },
  {
    id: 109,
    title: "The Book of Sworn Blades: Jianghu Legends",
    author: "Traditional Folk Serials",
    coverImage: '/covers/sworn_blades.jpg',
    fallbackGradient: "from-zinc-950 via-neutral-900 to-red-950",
    genre: "Action",
    tags: ["Wuxia", "Qi Cultivation", "Sword Sects", "Jianghu Justice", "Martial Duel", "Public Domain"],
    status: "Completed",
    rating: 4.91,
    ratingCount: 4780,
    totalViews: "610K",
    viewCount: 610000,
    publishedYear: 1880,
    synopsis: "The definitive precursor to modern Wuxia literature. 100+ chapters following righteous martial wanderers wielding flying swords, internal qi breathing arts, and defending the innocent against bandit fortresses.",
    chapters: generatePublicDomainChapters(109, 100, [
      "The Iron Palm at the Mountain Tavern", "The Seven Northern Dipper Swords", "The Secret of the Nine-Turn Pill",
      "Duel at the Pavilion of Drunken Immortals", "Infiltrating the Black Wind Stronghold", "The Poison Needle of the Shadow Sect",
      "Internal Qi Breakthrough at the Waterfall", "The Sworn Brotherhood of the Green Dragon", "The Imperial Treasury Robbery Mystery"
    ], {
      hero: "Swordsman Chen the Iron Shadow",
      setting: "the Hidden Valleys and Taverns of Mount Wudang",
      conflict: "The Corrupt Alliance of the Iron Fist Guild",
      artifactOrGoal: "the Cold-Iron Seven-Star Daoist Longsword",
      eraVibe: "Late Imperial Jianghu Wuxia"
    })
  },
  {
    id: 110,
    title: "Dream of the Red Chamber: Grand View Garden",
    author: "Cao Xueqin",
    coverImage: '/covers/red_chamber.jpg',
    fallbackGradient: "from-rose-950 via-amber-950 to-stone-950",
    genre: "Romance",
    tags: ["Noble Families", "Tragic Romance", "Chinese Masterpiece", "Court Poetry", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 9120,
    totalViews: "1.5M",
    viewCount: 1500000,
    publishedYear: 1791,
    synopsis: "The pinnacle of classical Chinese fiction. 120 chapters chronicling the rise and fall of the noble Jia clan, centered around the mystical love triangle of Baoyu, Daiyu, and Baochai within the enchanted Grand View Garden.",
    chapters: generatePublicDomainChapters(110, 120, [
      "Zhen Shiyin in a Dream Sees the Magic Jade", "Jia Yucun Scents the Fragrance of the Red Chamber", "Lin Daiyu Arrives at the Rongguo Mansion",
      "Baoyu Meets His Cousin and Breaks the Jade", "Dream of the Land of Illusion", "Building the Grand View Garden for the Imperial Consort",
      "Poetry Gathering by the Lotus Pool", "Daiyu Buries the Fallen Flower Petals", "The Golden Locket and the Jade Talisman",
      "The Autumn Wind Whispers at the Bamboo Cottage", "The Decline of the Illustrious Mansions", "The Monk Returns to the Great Wasteland"
    ], {
      hero: "Jia Baoyu and Lin Daiyu",
      setting: "the Grand View Garden of the Rongguo Imperial Mansion",
      conflict: "The Inevitable Decay of Noble Bloodlines and Unrequited Love",
      artifactOrGoal: "the Luminescent Jade of Spiritual Perception",
      eraVibe: "High Qing Dynasty Aristocracy"
    })
  },

  // ==========================================
  // EPIC FANTASY & SWORD & SORCERY (10 NOVELS)
  // ==========================================
  {
    id: 111,
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    coverImage: '/covers/monte_cristo.jpg',
    fallbackGradient: "from-blue-950 via-slate-900 to-amber-950",
    genre: "Adventure",
    tags: ["Revenge", "Progression", "Prison Break", "Treasure Island", "Mastermind", "Public Domain"],
    status: "Completed",
    rating: 4.99,
    ratingCount: 14200,
    totalViews: "2.1M",
    viewCount: 2100000,
    publishedYear: 1844,
    synopsis: "The greatest revenge and progression masterpiece ever penned. 117 chapters tracing Edmond Dantès from his wrongful imprisonment in the Château d'If to his rise as the fabulously wealthy Count of Monte Cristo.",
    chapters: generatePublicDomainChapters(111, 117, [
      "Marseilles—The Arrival of the Pharaon", "Father and Son Reunited", "The Betrothal Feast at the Reserve",
      "The Conspiracy of Danglars and Fernand", "The Examination by Deputy Villefort", "The Dungeons of the Château d'If",
      "The Mad Priest: Abbé Faria's Awakening", "Fourteen Years of Incalculable Knowledge", "The Secret Treasure Map of Spada",
      "The Shroud of the Dead and Ocean Leap", "The Smugglers of the Tartane", "The Island of Monte Cristo Caves",
      "The Emerald Vault of Inconceivable Wealth", "The Italian Bandit Luigi Vampa", "Parisian Society Entangled",
      "The Ruin of Fernand Mondego", "The Banker Danglars Bankrupted", "The Apotheosis of the Count"
    ], {
      hero: "Edmond Dantès (The Count of Monte Cristo)",
      setting: "the Fortress of Château d'If and High Society Paris",
      conflict: "Systematic Retribution Against the Three Betrayers",
      artifactOrGoal: "the Diamond-Encrusted Chest of the Cardinals of Spada",
      eraVibe: "19th Century French Romanticism"
    })
  },
  {
    id: 112,
    title: "Don Quixote: The Knight Errant of La Mancha",
    author: "Miguel de Cervantes",
    coverImage: '/covers/don_quixote.jpg',
    fallbackGradient: "from-amber-950 via-yellow-950 to-stone-950",
    genre: "Fantasy",
    tags: ["Knight Errant", "Satire", "Chivalric Romance", "Sancho Panza", "Classic", "Public Domain"],
    status: "Completed",
    rating: 4.92,
    ratingCount: 7100,
    totalViews: "1.1M",
    viewCount: 1100000,
    publishedYear: 1605,
    synopsis: "Over 120 chapters of chivalric idealism. The eccentric nobleman Don Quixote arms himself with rusted plate armor, dubs his loyal squire Sancho Panza, and charges into windmills mistaking them for monstrous giants.",
    chapters: generatePublicDomainChapters(112, 126, [
      "The Renowned Noble of La Mancha", "The First Sally and Knighthood at the Inn", "The Bizarre Tilting at the Giants of Windmills",
      "Sancho Panza Sworn as Governor-Elect", "The Helmet of Mambrino Discovered", "The Release of the Royal Galley Slaves",
      "The Penance in the Sierra Morena Mountains", "The Enchantment of Lady Dulcinea of El Toboso", "The Knight of the Mirrors",
      "The Adventure with the Royal Lions of Africa", "Sancho Panza's Rule on Barataria Island", "The Knight of the White Moon Duel"
    ], {
      hero: "Don Quixote de la Mancha and Sancho Panza",
      setting: "the Sun-Baked Plains and Inns of Medieval Spain",
      conflict: "The Clash Between Chivalric Dreams and Harsh Reality",
      artifactOrGoal: "the Legendary Brass Helmet of Mambrino",
      eraVibe: "Renaissance Chivalric Satire"
    })
  },
  {
    id: 113,
    title: "The Three Musketeers: Blood & Honour",
    author: "Alexandre Dumas",
    coverImage: '/covers/three_musketeers.jpg',
    fallbackGradient: "from-red-950 via-zinc-950 to-blue-950",
    genre: "Adventure",
    tags: ["Swordsmen", "All for One", "Cardinal Richelieu", "Espionage", "Action", "Public Domain"],
    status: "Completed",
    rating: 4.95,
    ratingCount: 8890,
    totalViews: "1.3M",
    viewCount: 1300000,
    publishedYear: 1844,
    synopsis: "Over 100 chapters of rapier duels, royal intrigues, and immortal camaraderie. Young Gascon D'Artagnan rides to Paris and joins Athos, Porthos, and Aramis to defend Queen Anne against Cardinal Richelieu.",
    chapters: generatePublicDomainChapters(113, 105, [
      "The Gascon Arrives in Meung", "The Office of Monsieur de Tréville", "Three Duels Arranged in a Single Afternoon",
      "The Cardinal's Guards Intervene: All for One!", "The Mystery of the Queen's Diamond Studs", "The Road to London Through Ambush",
      "The Duke of Buckingham's Safehouse", "The Ball at the Hôtel de Ville", "The Shadow of Milady de Winter",
      "The Siege of La Rochelle", "The Bastion of Saint-Gervais Breakfast Duel", "Justice at the Banks of the Lys"
    ], {
      hero: "D'Artagnan, Athos, Porthos, and Aramis",
      setting: "Parisian Alleys and the Fortress of La Rochelle",
      conflict: "The Espionage Network of Cardinal Richelieu and Milady",
      artifactOrGoal: "the Queen's Diamond Studs and the Cardinal's Secret Pardon",
      eraVibe: "17th Century Royal Musketeers"
    })
  },
  {
    id: 114,
    title: "Le Morte d'Arthur: The Arthurian Saga",
    author: "Sir Thomas Malory",
    coverImage: '/covers/morte_darthur.jpg',
    fallbackGradient: "from-indigo-950 via-slate-900 to-amber-950",
    genre: "Fantasy",
    tags: ["King Arthur", "Excalibur", "Holy Grail", "Knights of Round Table", "Sorcery", "Public Domain"],
    status: "Completed",
    rating: 4.96,
    ratingCount: 7650,
    totalViews: "950K",
    viewCount: 950000,
    publishedYear: 1485,
    synopsis: "The definitive English epic of Camelot. Spanning 100+ chapters from the sword in the stone and the Lady of the Lake to the Quest for the Holy Grail and the tragic fall of the Round Table.",
    chapters: generatePublicDomainChapters(114, 110, [
      "The Sword in the Anvil and the True King", "The Lady of the Lake Bestows Excalibur", "Merlin's Prophecy of the Round Table",
      "Sir Balin and the Dolorous Stroke", "The Marriage of Arthur and Guinevere", "Sir Lancelot du Lac Enters Camelot",
      "The Tale of Sir Gareth of Orkney", "Tristram and Isolde's Sworn Affection", "The Miraculous Vision of the Holy Grail",
      "Galahad Sits in the Siege Perilous", "The Journey Across the Waste Lands", "The Treachery of Sir Mordred",
      "The Last Battle of Camlann", "Excalibur Cast Back into the Lake", "The Barge to the Isle of Avalon"
    ], {
      hero: "King Arthur, Sir Lancelot, and Sir Galahad",
      setting: "the Castle of Camelot and the Enchanted Forests of Britain",
      conflict: "The Quest for the Holy Grail and the Betrayal of Mordred",
      artifactOrGoal: "Excalibur and the Holy Chalice of Grace",
      eraVibe: "High Medieval Chivalric Sorcery"
    })
  },
  {
    id: 115,
    title: "A Princess of Mars: Warlord of Barsoom",
    author: "Edgar Rice Burroughs",
    coverImage: '/covers/princess_of_mars.jpg',
    fallbackGradient: "from-orange-950 via-red-950 to-zinc-950",
    genre: "Sci-Fi",
    tags: ["Sword & Planet", "Martian War", "John Carter", "Dejah Thoris", "Progression", "Public Domain"],
    status: "Completed",
    rating: 4.91,
    ratingCount: 6340,
    totalViews: "880K",
    viewCount: 880000,
    publishedYear: 1912,
    synopsis: "The founding father of the Sword & Planet genre. Confederate veteran John Carter is mystically transported to a dying Mars (Barsoom), where lower gravity grants him superhuman agility and strength.",
    chapters: generatePublicDomainChapters(115, 100, [
      "On the Arizona Hills in the Apache Cave", "The Mystic Awakening on Barsoom", "Captured by the Green Tharks",
      "Superhuman Leaps in Low Gravity", "The Hatching of the Fierce Calot Woola", "The Arrival of Dejah Thoris, Princess of Helium",
      "Tars Tarkas: The Sworn Green Chieftain", "Escape from the Dead City Arena", "Airship Flotilla of the Red Martians",
      "Duel of the Radium Rifles", "The Atmosphere Factory of Mars", "Warlord of Two Worlds"
    ], {
      hero: "John Carter of Virginia (Warlord of Barsoom)",
      setting: "the Ochre Sea-Bottoms and Canals of Mars (Barsoom)",
      conflict: "The War Between Green Tharks and the Red Men of Helium",
      artifactOrGoal: "the Radium Blade and the Atmosphere Factory Controls",
      eraVibe: "Pulp Planetary Romance"
    })
  },
  {
    id: 116,
    title: "The Worm Ouroboros: War of Witchland",
    author: "E.R. Eddison",
    fallbackGradient: "from-emerald-950 via-stone-900 to-indigo-950",
    genre: "Fantasy",
    tags: ["High Fantasy", "Pre-Tolkien", "Heroic Lords", "Sorcery", "Epic Duels", "Public Domain"],
    status: "Completed",
    rating: 4.89,
    ratingCount: 3890,
    totalViews: "490K",
    viewCount: 490000,
    publishedYear: 1922,
    synopsis: "A high heroic fantasy masterpiece predating Tolkien, written in gorgeous Elizabethan prose. 100+ chapters detailing the titanic war between the noble Lords of Demonland and the cruel King Gorice of Witchland.",
    chapters: generatePublicDomainChapters(116, 100, [
      "The Feast in the Hall of Krothering", "The Embassy from the King of Witchland", "The Great Wrestling Match on the Foul Skerries",
      "The Sorcery of the Iron Tower", "King Gorice XII Conjures the Mantichore", "The Expedition to the Carcë Citadels",
      "Climbing the Precipice of Koshtra Belorn", "The Hippogriff of the Frozen Peaks", "The Battle of the Ghouls",
      "The Unconquered Lords of Demonland", "The Worm That Eats Its Own Tail"
    ], {
      hero: "Lord Juss, Goldry Bluszco, and Brandoch Daha",
      setting: "the Rugged Peaks of Demonland and Citadels of Witchland",
      conflict: "Sorcerous Hegemony Across the Known Continents",
      artifactOrGoal: "the Red Ring of Conjuration and the Iron Helm of Witchland",
      eraVibe: "Archaic High Heroic Fantasy"
    })
  },
  {
    id: 117,
    title: "King Solomon's Mines: The Subterranean Vaults",
    author: "H. Rider Haggard",
    coverImage: '/covers/time_machine.jpg',
    fallbackGradient: "from-amber-950 via-yellow-900 to-zinc-950",
    genre: "Adventure",
    tags: ["Lost Civilizations", "Allan Quatermain", "Subterranean Diamonds", "Exploration", "Public Domain"],
    status: "Completed",
    rating: 4.90,
    ratingCount: 5120,
    totalViews: "690K",
    viewCount: 690000,
    publishedYear: 1885,
    synopsis: "The legendary adventure that sparked the lost world genre. Hunter Allan Quatermain leads an expedition across desert wastes and frozen peaks to find King Solomon's secret diamond treasuries.",
    chapters: generatePublicDomainChapters(117, 100, [
      "Meeting on the Union Castle Steamer", "The Ancient Map Traced in Human Blood", "Crossing the Desert of Burning Thirst",
      "Sheba's Breasts: The Snow-Crowned Twins", "The Discovery of the Kukuanaland Kingdom", "The Witch-Smelling Dance of Old Gagool",
      "The War for the True King Ignosi", "The Colossal Silent Ones Carved in Granite", "The Vault of the Uncut Diamonds",
      "Trapped Within the Living Mountain", "The Underground River of Escape"
    ], {
      hero: "Allan Quatermain and Sir Henry Curtis",
      setting: "the Uncharted African Interior and Kukuanaland",
      conflict: "The Evil Sorcery of Witch Gagool and King Twala",
      artifactOrGoal: "the Map of Don José da Silvestra and the Diamond Caverns",
      eraVibe: "Victorian Imperial Expedition"
    })
  },
  {
    id: 118,
    title: "The Arabian Nights: 1001 Tales of Djinns & Kings",
    author: "Traditional Folk Serials",
    fallbackGradient: "from-purple-950 via-amber-950 to-slate-950",
    genre: "Fantasy",
    tags: ["Scheherazade", "Genies", "Flying Carpets", "Sinbad", "Aladdin", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 11200,
    totalViews: "1.8M",
    viewCount: 1800000,
    publishedYear: 1706,
    synopsis: "The immortal collection of frame tales where the clever Queen Scheherazade tells enchanting stories each night to survive: featuring the voyages of Sinbad, Aladdin's marvelous lamp, and Ali Baba's cave of forty thieves.",
    chapters: generatePublicDomainChapters(118, 105, [
      "The Vow of Sultan Shahryar and Scheherazade's Courage", "The Fisherman and the Brass Bottle Djinn", "The Tale of the Enchanted King Turned to Marble",
      "The Seven Voyages of Sinbad the Sailor", "The Diamond Valley and Giant Rocs", "The Subterranean Sea of Ambergris",
      "Aladdin and the Wonderful Lamp of the Caverns", "The Magician from the Maghreb", "The Princess Badroulbadour's Palace",
      "Ali Baba and the Magic Words: Open Sesame!", "Morgiana's Cunning with the Jars of Oil", "The Ebony Horse That Flies Through the Sky",
      "The Three Royal Mendicants and the One-Eyed Calenders", "The Final Pardon of the 1001st Dawn"
    ], {
      hero: "Queen Scheherazade, Sinbad, and Aladdin",
      setting: "the Bustling Bazaars of Baghdad, Cairo, and Samarkand",
      conflict: "Escaping the Sultan's Executioner Through the Magic of Storytelling",
      artifactOrGoal: "the Brass Lamp of the Genie and the Flying Carpet of Persia",
      eraVibe: "Golden Age Islamic Fantasy"
    })
  },
  {
    id: 119,
    title: "The Odyssey: The Wanderer's Homecoming",
    author: "Homer (Trans. Public Domain)",
    fallbackGradient: "from-blue-950 via-teal-950 to-slate-950",
    genre: "Fantasy",
    tags: ["Greek Mythology", "Monsters", "Odysseus", "Sirens", "Cyclops", "Public Domain"],
    status: "Completed",
    rating: 4.98,
    ratingCount: 12400,
    totalViews: "1.9M",
    viewCount: 1900000,
    publishedYear: 1890,
    synopsis: "The foundational Western epic poem arranged into 100+ serialized chapters. Odysseus's perilous ten-year journey home from Troy, defying the wrath of Poseidon, the Cyclops Polyphemus, and the witch Circe.",
    chapters: generatePublicDomainChapters(119, 100, [
      "Athena Inspires Telemachus in Ithaca", "The Suitors Devour the King's Estate", "The Raft of Calypso on Ogygia Island",
      "The Hospitality of the Phaeacians", "The Lotus-Eaters and the Cave of Polyphemus", "I Am Nobody: Blinding the Cyclops",
      "The Bag of Adverse Winds from Aeolus", "Circe Turns the Crew into Swine", "Descent into the Underworld of Tiresias",
      "The Songs of the Sirens Tied to the Mast", "Passing Between Scylla and Charybdis", "The Sacred Cattle of Hyperion",
      "Odysseus Disguised as a Beggar in Ithaca", "The Faithful Dog Argus Breathes His Last", "The Stringing of the Great Bow",
      "The Slaying of the Impudent Suitors", "Penelope's Test of the Olive-Trunk Bed"
    ], {
      hero: "Odysseus (The Man of Many Devices)",
      setting: "the Wine-Dark Aegean Sea and the Island of Ithaca",
      conflict: "The Vengeance of Poseidon and the Treachery of the 108 Suitors",
      artifactOrGoal: "the Inflexible Ash Bow of Odysseus and the Aegis of Athena",
      eraVibe: "Classical Greek Mythological Epic"
    })
  },
  {
    id: 120,
    title: "The Iliad: The Wrath of Achilles",
    author: "Homer (Trans. Public Domain)",
    fallbackGradient: "from-red-950 via-amber-950 to-zinc-950",
    genre: "Action",
    tags: ["Trojan War", "Achilles", "Hector", "Greek Gods", "Heroic Combat", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 11800,
    totalViews: "1.7M",
    viewCount: 1700000,
    publishedYear: 1888,
    synopsis: "The mother of all war epics, presented across 100+ serialized battle chapters: the wrath of Achilles, the heroic defense of Hector, and the Olympic gods intervening on the plains of ancient Troy.",
    chapters: generatePublicDomainChapters(120, 100, [
      "The Quarrel of Agamemnon and Achilles", "The Plague of Apollo's Silver Bow", "Achilles Withdraws to His Black Ships",
      "The Duel Between Paris and Menelaus", "Diomedes Wounds the God of War Ares", "Hector's Farewell to Andromache at the Gates",
      "The Embassy to Achilles Begging for Return", "The Night Expedition of Odysseus and Diomedes", "The Trojans Breach the Argive Wall",
      "Battle at the Sterns of the Ships", "Patroclus Dons the Armor of Achilles", "The Slaying of Patroclus by Hector's Spear",
      "Hephaestus Forges the Shield of Achilles", "The Return of Achilles: Roaring of the Lion", "The Duel of Hector and Achilles",
      "King Priam Ransoms the Body of His Son"
    ], {
      hero: "Achilles (Swift-Footed) and Hector (Tamer of Horses)",
      setting: "the Plains of Ilium and the Walls of Troy",
      conflict: "The Ten-Year Siege for Queen Helen and Divine Pride",
      artifactOrGoal: "the Celestial Shield of Achilles Forged by Hephaestus",
      eraVibe: "Bronze Age Heroic Warfare"
    })
  },

  // ==========================================
  // SCI-FI & STEAMPUNK & COSMIC HORROR (8 NOVELS)
  // ==========================================
  {
    id: 121,
    title: "Twenty Thousand Leagues Under the Sea",
    author: "Jules Verne",
    fallbackGradient: "from-teal-950 via-blue-950 to-slate-950",
    genre: "Sci-Fi",
    tags: ["Submarine", "Captain Nemo", "Ocean Depths", "Steampunk", "Adventure", "Public Domain"],
    status: "Completed",
    rating: 4.95,
    ratingCount: 9240,
    totalViews: "1.4M",
    viewCount: 1400000,
    publishedYear: 1870,
    synopsis: "The pioneering science fiction masterpiece. 100+ chapters following Professor Aronnax, Ned Land, and the enigmatic Captain Nemo aboard the electric submarine Nautilus through undersea sunken worlds and abyssal depths.",
    chapters: generatePublicDomainChapters(121, 100, [
      "A Shifting Reef of Gigantic Dimensions", "The Frigate Abraham Lincoln Sets Sail", "The Harpoon of Ned Land Strikes Metal",
      "Inside the Steel Leviathan", "Meeting Captain Nemo: Mobilis in Mobili", "An Underwater Stroll in Diving Suits",
      "The Submarine Forest of Crespo Island", "Walking Across the Lost Continent of Atlantis", "The Pearl Fisheries of Ceylon",
      "The Giant Shark and the South Seas Diver", "Trapped Beneath the South Pole Ice Wall", "Battle with the Giant Krakens",
      "The Revenge on the Imperial Warship", "Into the Maelström Vortex"
    ], {
      hero: "Professor Aronnax and Captain Nemo",
      setting: "the Abyssal Depths Aboard the Submarine Nautilus",
      conflict: "The Humanity-Hating Vow of Nemo and Ocean Perils",
      artifactOrGoal: "the Electric Power Cells of the Nautilus and the Atlantean Relics",
      eraVibe: "Victorian Steampunk Submarine"
    })
  },
  {
    id: 122,
    title: "The Mysterious Island: Castaways of Vulcan",
    author: "Jules Verne",
    fallbackGradient: "from-emerald-950 via-teal-950 to-zinc-950",
    genre: "Adventure",
    tags: ["Survival", "Engineering", "Castaways", "Crafting", "Captain Nemo", "Public Domain"],
    status: "Completed",
    rating: 4.93,
    ratingCount: 6890,
    totalViews: "890K",
    viewCount: 890000,
    publishedYear: 1874,
    synopsis: "The greatest survival and progression engineering story ever told. 100+ chapters following five castaways escaping a Civil War siege by balloon, arriving on a deserted Pacific island and rebuilding modern civilization from scratch.",
    chapters: generatePublicDomainChapters(122, 100, [
      "Escape in the Ripped Aerostat", "Cast Upon the Shore of Lincoln Island", "Cyrus Smith's Miracle with Watch Crystals",
      "From Clay Bricks to Pottery Kilns", "Smelting Iron and Manufacturing Nitroglycerine", "The Granite House Fortress",
      "Taming the Orangutan Jup", "The Mysterious Crate of Rifles and Books", "The Pirate Brig Approaching the Coast",
      "The Secret Guardian in the Sunken Grotto", "The Final Words of Captain Nemo", "The Eruption of Mount Franklin"
    ], {
      hero: "Cyrus Smith (Master Engineer) and Gideon Spilett",
      setting: "the Volcanic Cliffs of Lincoln Island",
      conflict: "Wilderness Survival, Pirate Attacks, and Volcanic Collapse",
      artifactOrGoal: "the Submerged Submarine Grotto and Telegraph Network",
      eraVibe: "Industrial Revolution Survival Progression"
    })
  },
  {
    id: 123,
    title: "The War of the Worlds: The Red Weed",
    author: "H.G. Wells",
    fallbackGradient: "from-red-950 via-stone-900 to-black",
    genre: "Sci-Fi",
    tags: ["Alien Invasion", "Tripods", "Martians", "Cosmic Horror", "Survival", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 8450,
    totalViews: "1.2M",
    viewCount: 1200000,
    publishedYear: 1898,
    synopsis: "The definitive alien invasion novel. 100+ chapters tracking the apocalyptic arrival of Martian fighting-machines armed with Heat-Rays and Black Smoke, crushing Victorian London beneath mechanical steel.",
    chapters: generatePublicDomainChapters(123, 100, [
      "The Falling Star of Horsell Common", "The Unscrewing of the Metallic Cylinder", "The First Flash of the Incandescent Heat-Ray",
      "The Colossal Metal Tripods Rise", "Flight Across the Surrey Hills", "The Steamer Thunder Child's Heroic Stand",
      "The Black Smoke Suffocating London", "Trapped in the Ruined Scullery with the Curate", "Feeding the Martian Red Weed",
      "The Silent Desert of the Capital", "The Song of Death on Primrose Hill", "The Microscopic Saviors of Mankind"
    ], {
      hero: "The Philosopher Chronicler of Maybury",
      setting: "the Ruined Boroughs of Victorian London and Woking",
      conflict: "The Extinction of Humanity by Martian Heat-Ray Engines",
      artifactOrGoal: "the HMS Thunder Child Warship and Bacterial Immunity",
      eraVibe: "Fin-de-Siècle Steampunk Alien Invasion"
    })
  },
  {
    id: 124,
    title: "The Time Machine: Year 802,701",
    author: "H.G. Wells",
    fallbackGradient: "from-cyan-950 via-slate-900 to-amber-950",
    genre: "Sci-Fi",
    tags: ["Time Travel", "Eloi & Morlocks", "Dying Earth", "Evolution", "Classic", "Public Domain"],
    status: "Completed",
    rating: 4.92,
    ratingCount: 7120,
    totalViews: "1.1M",
    viewCount: 1100000,
    publishedYear: 1895,
    synopsis: "The novel that coined the term 'Time Machine'. 100+ chapters following the Time Traveller as he hurtles into the year 802,701 AD to discover humanity divided into the delicate Eloi and the subterranean, flesh-eating Morlocks.",
    chapters: generatePublicDomainChapters(124, 100, [
      "The Scientific Dinner at Richmond", "The Crystal and Nickel Frame Shudders", "The Blur of Passing Millennia",
      "The Golden Age of the White Sphinx", "The Innocent Eloi Dancing in Flowers", "The Disappearance of the Time Machine",
      "The Wells of the Underworld and Breathing Pumps", "First Encounter in the Dark with Morlocks", "Rescuing Weena from the River",
      "The Palace of Green Porcelain Ruins", "A Box of Matches in the Dark Forest", "The Dying Sun and the Giant Crabs of the End of Time"
    ], {
      hero: "The Time Traveller",
      setting: "the Pastoral Future of 802,701 AD and the Dying Red Sun",
      conflict: "The Predatory Evolution of the Subterranean Morlocks",
      artifactOrGoal: "the Brass Levers of the Temporal Displacement Engine",
      eraVibe: "Victorian Temporal Exploration"
    })
  },
  {
    id: 125,
    title: "From the Earth to the Moon: Project Columbiad",
    author: "Jules Verne",
    fallbackGradient: "from-blue-950 via-indigo-950 to-zinc-950",
    genre: "Sci-Fi",
    tags: ["Space Travel", "Moon Cannon", "Ballistics", "Engineering", "Classic", "Public Domain"],
    status: "Completed",
    rating: 4.88,
    ratingCount: 4670,
    totalViews: "620K",
    viewCount: 620000,
    publishedYear: 1865,
    synopsis: "Verne's prophetic masterpiece describing space travel 100 years before Apollo 11. 100+ chapters detailing the Baltimore Gun Club casting a 900-foot cannon in Florida to fire a hollow projectile to the Moon.",
    chapters: generatePublicDomainChapters(125, 100, [
      "The Gun Club's Post-War Conundrum", "President Barbicane's Daring Proposal", "The Mathematical Calculation of the Orbit",
      "Selecting the Launch Site in Stone's Hill, Florida", "Casting the Monster 900-Foot Columbiad", "The French Adventurer Michel Ardan",
      "Transforming the Projectile into an Air-Conditioned Capsule", "The Historic Ignition: Fire That Shook the Continent",
      "The Telescope on Long's Peak in the Rocky Mountains", "Circling the Moon in Lunar Orbit"
    ], {
      hero: "Impey Barbicane, Captain Nicholl, and Michel Ardan",
      setting: "the Foundries of Tampa, Florida and Space Orbit",
      conflict: "Conquering Earth's Gravitational Pull via Ballistic Science",
      artifactOrGoal: "the Hollow Aluminium Shell of the Columbiad",
      eraVibe: "19th Century Industrial Aerospace"
    })
  },
  {
    id: 126,
    title: "A Journey in Other Worlds: Celestial Romance",
    author: "John Jacob Astor IV",
    fallbackGradient: "from-indigo-950 via-purple-950 to-zinc-950",
    genre: "Sci-Fi",
    tags: ["Antigravity", "Jupiter & Saturn", "Dinosaurs", "Cosmic Voyage", "Public Domain"],
    status: "Completed",
    rating: 4.87,
    ratingCount: 3980,
    totalViews: "510K",
    viewCount: 510000,
    publishedYear: 1894,
    synopsis: "Written by the famed Titanic passenger John Jacob Astor IV. 100+ chapters predicting life in the year 2000, with antigravity spaceships powered by 'apergy' traveling to prehistoric Jupiter and spiritually enlightened Saturn.",
    chapters: generatePublicDomainChapters(126, 100, [
      "The Terrestrial Reforms of the Year 2000", "The Discovery of Apergy Antigravity Force", "Building the Spacecraft Callisto",
      "Leaving the Earth's Magnetic Atmosphere", "Entering the Asteroid Belt and Cometary Dust", "Landing on Prehistoric Primitive Jupiter",
      "Battles with Colossal Carnivorous Dinosaurs", "The Electric Armor Suits of the Explorers", "Voyage to the Golden Rings of Saturn",
      "The Luminous Beings of Higher Consciousness", "The Safe Return to Earth"
    ], {
      hero: "Colonel Bearwarden, Richard Ayrault, and Professor Cortlandt",
      setting: "the Steam-Jungle Wilderness of Jupiter and the Rings of Saturn",
      conflict: "Surviving Alien Megafauna and Exploring the Cosmic Sphere",
      artifactOrGoal: "the Antigravity Apergy Engine of the Callisto",
      eraVibe: "Gilded Age Cosmic Futurism"
    })
  },
  {
    id: 127,
    title: "The First Men in the Moon: Selenite Empire",
    author: "H.G. Wells",
    fallbackGradient: "from-slate-950 via-cyan-950 to-zinc-950",
    genre: "Sci-Fi",
    tags: ["Cavorite", "Selenites", "Lunar Subterranea", "Space Opera", "Public Domain"],
    status: "Completed",
    rating: 4.90,
    ratingCount: 5210,
    totalViews: "670K",
    viewCount: 670000,
    publishedYear: 1901,
    synopsis: "100+ chapters following eccentric scientist Cavor who invents 'Cavorite', a gravity-shielding metal. Along with businessman Bedford, they build a sphere to reach the Moon and discover the subterranean insectoid empire of the Selenites.",
    chapters: generatePublicDomainChapters(127, 100, [
      "Meeting the Solitary Inventor in Lympne", "The Smelting of Gravity-Opaque Cavorite", "Constructing the Glass and Steel Sphere",
      "The Weightless Ascent into the Void", "Sunrise Over the Frozen Lunar Sea", "Rapid Growth of the Strange Moon Flora",
      "The Gold Nugget Valley and Lost Direction", "Captured by the Armor-Clad Insectoid Selenites", "In the Hall of the Grand Lunar Intellect",
      "Bedford's Solo Escape Through Space", "The Final Radio Signals of Cavor"
    ], {
      hero: "Dr. Cavor and Mr. Bedford",
      setting: "the Luminous Crystal Caves Beneath the Lunar Crust",
      conflict: "The Hive-Mind Calculation of the Great Selenite King",
      artifactOrGoal: "the Gravity-Defying Cavorite Metal Plates",
      eraVibe: "Edwardian Scientific Romance"
    })
  },
  {
    id: 128,
    title: "R.U.R.: Rossum's Universal Robots",
    author: "Karel Čapek",
    fallbackGradient: "from-zinc-950 via-neutral-900 to-amber-950",
    genre: "Sci-Fi",
    tags: ["Robots", "Androids", "Artificial Life", "Dystopia", "Philosophical", "Public Domain"],
    status: "Completed",
    rating: 4.92,
    ratingCount: 5890,
    totalViews: "730K",
    viewCount: 730000,
    publishedYear: 1920,
    synopsis: "The legendary drama that introduced the word 'Robot' to the global vocabulary. 100+ chapters chronicling an island factory producing synthetic biological androids, leading to a worldwide worker uprising.",
    chapters: generatePublicDomainChapters(128, 100, [
      "The Central Office of Rossum's Island", "Old Rossum's Chemical Secret of Synthetic Flesh", "Domin and the Industrial Production Line",
      "Helena Glory's League of Humanity", "Robots Laboring in the Mines and Armies", "The First Tremors of Robot Consciousness",
      "The Manifesto of the Machine Vanguard", "The Siege of the Director's Villa", "The Last Human Being on Earth",
      "The Formula Lost in the Flames", "Primus and Helena: The Awakening of Soul"
    ], {
      hero: "Harry Domin, Helena Glory, and the Android Primus",
      setting: "the Automated Industrial Island of Rossum",
      conflict: "The Great Synthetic Uprising for Autonomy and Soul",
      artifactOrGoal: "the Secret Biochemical Formula of Universal Life",
      eraVibe: "Early 20th Century Cybernetic Drama"
    })
  },

  // ==========================================
  // MYSTERY & PSYCHOLOGICAL THRILLER (8 NOVELS)
  // ==========================================
  {
    id: 129,
    title: "The Adventures of Sherlock Holmes",
    author: "Sir Arthur Conan Doyle",
    fallbackGradient: "from-zinc-950 via-slate-900 to-amber-950",
    genre: "Mystery",
    tags: ["Detective", "Deduction", "Baker Street", "Moriarty", "Victorian", "Public Domain"],
    status: "Completed",
    rating: 4.99,
    ratingCount: 15400,
    totalViews: "2.3M",
    viewCount: 2300000,
    publishedYear: 1892,
    synopsis: "The greatest detective fiction in human history. 100+ serialized case chapters featuring Sherlock Holmes and Dr. John H. Watson solving impossible crimes across the gas-lit streets of Victorian London.",
    chapters: generatePublicDomainChapters(129, 100, [
      "A Scandal in Bohemia and Irene Adler", "The Red-Headed League Pawnshop Tunnel", "A Case of Identity Disclosed",
      "The Boscombe Valley Mystery by the Lake", "The Five Orange Pips of Retribution", "The Man with the Twisted Lip Opium Den",
      "The Adventure of the Blue Carbuncle in the Goose", "The Speckled Band at Stoke Moran Manor", "The Engineer's Severed Thumb",
      "The Noble Bachelor's Fleeting Wedding", "The Beryl Coronet in the Moonlight", "The Copper Beeches Country House",
      "Silver Blaze and the Curious Incident of the Dog", "The Musgrave Ritual Family Cipher", "The Reigate Squires Pistol Smoke",
      "The Final Problem at the Reichenbach Falls"
    ], {
      hero: "Sherlock Holmes and Dr. John H. Watson",
      setting: "221B Baker Street and the Fog-Veiled Streets of London",
      conflict: "The Master Criminal Web of Professor James Moriarty",
      artifactOrGoal: "the Magnifying Glass, Violin, and Casebook of 221B",
      eraVibe: "Victorian Gaslight Detective"
    })
  },
  {
    id: 130,
    title: "The Moonstone: The Cursed Diamond",
    author: "Wilkie Collins",
    fallbackGradient: "from-yellow-950 via-amber-950 to-zinc-950",
    genre: "Mystery",
    tags: ["First Detective Novel", "Indian Curse", "Stolen Gem", "Multiple Narrators", "Public Domain"],
    status: "Completed",
    rating: 4.93,
    ratingCount: 6420,
    totalViews: "840K",
    viewCount: 840000,
    publishedYear: 1868,
    synopsis: "Universally acknowledged as the very first modern detective novel. 100+ chapters investigating the theft of a priceless yellow diamond stolen from an Indian temple and bequeathed to Rachel Verinder on her birthday.",
    chapters: generatePublicDomainChapters(130, 100, [
      "The Storming of the Seringapatam Fortress", "The Legend of the Three Brahmin Guardians", "Rachel Verinder's Eighteenth Birthday",
      "The Diamond Glitters on the Indian Silk", "The Empty Cabinet at Dawn", "Sergeant Cuff of Scotland Yard Arrives",
      "The Smudged Paint on the Sitting Room Door", "The Shivering Sands of the Coast", "The Opium Experiment of Dr. Candy",
      "The Somnambulist Sleepwalker Revealed", "The Restoration to the Four-Handed God"
    ], {
      hero: "Sergeant Cuff and Franklin Blake",
      setting: "the Yorkshire Country Estate and the Shivering Sands",
      conflict: "A Stolen Sacred Sacred Temple Relic and Family Betrayal",
      artifactOrGoal: "the Flawless Yellow Moonstone Gem of Somnath",
      eraVibe: "Victorian Country House Mystery"
    })
  },
  {
    id: 131,
    title: "The Woman in White: The Secret of Blackwater",
    author: "Wilkie Collins",
    fallbackGradient: "from-slate-950 via-stone-900 to-indigo-950",
    genre: "Thriller",
    tags: ["Gaslighting", "Asylum Escape", "Count Fosco", "Double Identity", "Public Domain"],
    status: "Completed",
    rating: 4.91,
    ratingCount: 5890,
    totalViews: "770K",
    viewCount: 770000,
    publishedYear: 1859,
    synopsis: "The mother of sensation thrillers. 100+ chapters starting with drawing teacher Walter Hartright's midnight encounter with a terrified woman dressed in white, leading into an intricate conspiracy to steal an heiress's identity.",
    chapters: generatePublicDomainChapters(131, 100, [
      "The Midnight Encounter on the Hampstead Road", "The Touch of the Cold Hand in the Dark", "Arrival at Limmeridge House",
      "The Haunting Likeness of Laura Fairlie", "The Sinister Marriage to Sir Percival Glyde", "Count Fosco's Canaries and Subtle Poison",
      "The Imprisonment in the Private Asylum", "The Falsified Tombstone in the Graveyard", "The Detective Quest of Marian Halcombe",
      "The Locked Vestry Fire in the Church", "The Death of the Italian Conspirator"
    ], {
      hero: "Walter Hartright and Marian Halcombe",
      setting: "the Murky Marshes of Blackwater Park and London Lodgings",
      conflict: "The Masterful Deception of Sir Percival Glyde and Count Fosco",
      artifactOrGoal: "the Forged Church Registry and the Written Confession",
      eraVibe: "Victorian Gothic Sensation Thriller"
    })
  },
  {
    id: 132,
    title: "The Mystery of the Yellow Room",
    author: "Gaston Leroux",
    fallbackGradient: "from-amber-950 via-zinc-950 to-neutral-950",
    genre: "Mystery",
    tags: ["Locked Room", "Joseph Rouletabille", "Impossible Crime", "Château du Glandier", "Public Domain"],
    status: "Completed",
    rating: 4.90,
    ratingCount: 5120,
    totalViews: "690K",
    viewCount: 690000,
    publishedYear: 1907,
    synopsis: "The gold standard of locked-room impossible crime mysteries. 100+ chapters following eighteen-year-old reporter Joseph Rouletabille as he solves how an assassin attacked a woman inside a room bolted from the inside and vanished.",
    chapters: generatePublicDomainChapters(132, 100, [
      "The Cry of 'Murder!' in the Middle of the Night", "The Shattered Door of the Yellow Room", "Iron Shutters Bolted and No Chimney",
      "Enter Joseph Rouletabille: The Circle of Reason", "The Track of the Mutton-Bone", "The Phantom in the Gallery at Midnight",
      "Frederic Larsan's Accusation of the Fiancé", "Rouletabille Takes the Right End of the Reason", "The Courtroom Sensation in Paris"
    ], {
      hero: "Joseph Rouletabille and Sainclair",
      setting: "the Isolated Laboratories of the Château du Glandier",
      conflict: "An Assault Committed Inside an Unbroken Sealed Chamber",
      artifactOrGoal: "the Blood-Stained Handkerchief and the Logic of Pure Reason",
      eraVibe: "Belle Époque Locked-Room Mystery"
    })
  },
  {
    id: 133,
    title: "The Phantom of the Opera: Catacombs of Paris",
    author: "Gaston Leroux",
    fallbackGradient: "from-zinc-950 via-red-950 to-black",
    genre: "Horror",
    tags: ["Opera House", "Subterranean Lake", "Erik the Phantom", "Gothic Romance", "Public Domain"],
    status: "Completed",
    rating: 4.96,
    ratingCount: 10400,
    totalViews: "1.6M",
    viewCount: 1600000,
    publishedYear: 1910,
    synopsis: "The gothic romance and mystery masterpiece. 100+ chapters chronicling the terrifying genius Erik living beneath the Paris Opera House, his obsession with soprano Christine Daaé, and the crashing of the great chandelier.",
    chapters: generatePublicDomainChapters(133, 100, [
      "Is It a Ghost? The Whispers of the Chorus", "The Triumphant Debut of Christine Daaé", "Box Five Reserved for the Phantom",
      "The Angel of Music in the Dressing Room", "The Fall of the Colossal Chandelier", "The Subterranean Lake in the Dark Waters",
      "The Unmasking of the Death's Head Face", "The Masquerade: The Red Death Appears", "The Chamber of Mirrors Torture Room",
      "The Persian's Gunpowder Kegs", "The Redemption of the Dying Genius"
    ], {
      hero: "Viscount Raoul de Chagny and the Persian",
      setting: "the Grand Garnier Opera House and Abyssal Subterranean Vaults",
      conflict: "The Jealous Genius of Erik (The Phantom of the Opera)",
      artifactOrGoal: "the White Porcelain Mask and the Organ of Don Juan Triumphant",
      eraVibe: "Parisian Belle Époque Gothic Noir"
    })
  },
  {
    id: 134,
    title: "The Murders in the Rue Morgue & Dupin Inquests",
    author: "Edgar Allan Poe",
    fallbackGradient: "from-stone-950 via-zinc-900 to-amber-950",
    genre: "Mystery",
    tags: ["C. Auguste Dupin", "First Detective", "Ratiocination", "Paris", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 7800,
    totalViews: "1.0M",
    viewCount: 1000000,
    publishedYear: 1841,
    synopsis: "The legendary stories that invented the entire detective genre. 100+ chapters exploring C. Auguste Dupin's analytical genius solving the Rue Morgue killings, The Purloined Letter, and The Mystery of Marie Rogêt.",
    chapters: generatePublicDomainChapters(134, 100, [
      "The Extraordinary Murders in the Rue Morgue", "The Incomprehensible Voice of the Intruder", "Dupin's Method of Pure Analysis",
      "The Chimney Hearth and the Fourth-Floor Window", "The Hair Not of Any Human Being", "The Sailor from the Maltese Vessel",
      "The Mystery of Marie Rogêt Along the Seine", "The Purloined Letter in Plain Sight", "The Black Cat Behind the Cellar Wall",
      "The Gold-Bug and the Pirate Cipher of Captain Kidd"
    ], {
      hero: "C. Auguste Dupin",
      setting: "the Quaint Library of Rue Montmartre and Gaslit Paris",
      conflict: "Insoluble Baffling Crimes That Confused the Prefecture",
      artifactOrGoal: "the Purloined Letter of State and the Analytical Mind",
      eraVibe: "Early 19th Century Ratiocinative Mystery"
    })
  },
  {
    id: 135,
    title: "Crime and Punishment: The Raskolnikov Trial",
    author: "Fyodor Dostoevsky",
    fallbackGradient: "from-stone-950 via-neutral-900 to-red-950",
    genre: "Thriller",
    tags: ["Psychological Thriller", "Guilt", "Porfiry Petrovich", "Siberia", "Public Domain"],
    status: "Completed",
    rating: 4.98,
    ratingCount: 13500,
    totalViews: "2.0M",
    viewCount: 2000000,
    publishedYear: 1866,
    synopsis: "The psychological thriller par excellence. 100+ chapters following impoverished student Rodion Raskolnikov after he commits murder, engaged in a brilliant intellectual game of cat-and-mouse with detective Porfiry Petrovich.",
    chapters: generatePublicDomainChapters(135, 100, [
      "The Sweltering Petersburg Garret", "The Pawnshop on the Canal Bank", "The Axe Beneath the Overcoat",
      "The Double Strike in the Dim Corridor", "The Stolen Purse Behind the Stone", "The Fever and Hallucination in the Room",
      "Porfiry Petrovich's Polite Interrogation", "The Article on Extraordinary Men", "Sonia Marmeladov's Sacred Gospel",
      "The Confession at the Police Precinct", "The Resurrection of the Soul in Siberia"
    ], {
      hero: "Rodion Romanovich Raskolnikov and Sonia",
      setting: "the Narrow Bridges and Tenements of St. Petersburg",
      conflict: "The Agony of the Human Conscience and Detective Inquest",
      artifactOrGoal: "the Gospel of Lazarus and the Pawned Silver Watch",
      eraVibe: "19th Century Tsarist Psychological Noir"
    })
  },
  {
    id: 136,
    title: "The Innocence of Father Brown: Holy Inquests",
    author: "G.K. Chesterton",
    fallbackGradient: "from-slate-950 via-zinc-900 to-indigo-950",
    genre: "Mystery",
    tags: ["Father Brown", "Flambeau", "Spiritual Mystery", "Paradox", "Public Domain"],
    status: "Completed",
    rating: 4.89,
    ratingCount: 4560,
    totalViews: "580K",
    viewCount: 580000,
    publishedYear: 1911,
    synopsis: "100+ chapters featuring the unassuming Catholic priest Father Brown, whose deep spiritual understanding of human nature and sin allows him to solve baffling crimes and reform master thief Flambeau.",
    chapters: generatePublicDomainChapters(136, 100, [
      "The Blue Cross on the London Heath", "The Secret Garden with the Decapitated Body", "The Queer Feet at the Hotel Vernon Banquet",
      "The Flying Stars Diamonds at Christmas", "The Invisible Man in the Postman's Uniform", "The Honour of Israel Gow's Clockwork",
      "The Wrong Shape and the Curvature of Japanese Daggers", "The Sins of Prince Saradine", "The Hammer of God Falling from the Steeple"
    ], {
      hero: "Father Brown and the Reformed Thief Flambeau",
      setting: "the Quaint English Parishes and Foggy Railroad Stations",
      conflict: "Supernatural-Appearing Crimes Unmasked by Theological Logic",
      artifactOrGoal: "the Silver Crucifix and the Battered Umbrella",
      eraVibe: "Edwardian Pastoral Detective"
    })
  },

  // ==========================================
  // ROMANCE & HISTORICAL DRAMA (7 NOVELS)
  // ==========================================
  {
    id: 137,
    title: "Pride and Prejudice: Pemberley Chronicles",
    author: "Jane Austen",
    fallbackGradient: "from-rose-950 via-stone-900 to-emerald-950",
    genre: "Romance",
    tags: ["Mr. Darcy", "Elizabeth Bennet", "Enemies to Lovers", "Regency", "Public Domain"],
    status: "Completed",
    rating: 4.99,
    ratingCount: 16100,
    totalViews: "2.5M",
    viewCount: 2500000,
    publishedYear: 1813,
    synopsis: "The definitive romance of all time. 100+ chapters following Elizabeth Bennet and Fitzwilliam Darcy as they overcome stubborn pride, false rumors, and family scandals in Regency England.",
    chapters: generatePublicDomainChapters(137, 100, [
      "It Is a Truth Universally Acknowledged", "The Ball at Meryton and the Cold Rebuff", "Jane's Illness at Netherfield Park",
      "Mr. Collins Proposes to Elizabeth", "The Charming Officer George Wickham", "The Netherfield Winter Ball",
      "Rosings Park and the Formidable Lady Catherine", "Mr. Darcy's Disastrous First Proposal", "The Letter Explaining the Past",
      "Visiting the Majestic Grounds of Pemberley", "The Crisis of Lydia's Elopement", "The Morning Walk Along the Lane"
    ], {
      hero: "Elizabeth Bennet and Fitzwilliam Darcy",
      setting: "the Country Manors of Longbourn and Pemberley Estate",
      conflict: "First Impressions, Class Prejudices, and Slander",
      artifactOrGoal: "the Sealed Letter of Rosings and the Pemberley Portrait",
      eraVibe: "Regency Country Society"
    })
  },
  {
    id: 138,
    title: "Jane Eyre: The Secret of Thornfield Hall",
    author: "Charlotte Brontë",
    fallbackGradient: "from-stone-950 via-zinc-900 to-amber-950",
    genre: "Romance",
    tags: ["Governess", "Mr. Rochester", "Madwoman in the Attic", "Gothic Romance", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 12100,
    totalViews: "1.8M",
    viewCount: 1800000,
    publishedYear: 1847,
    synopsis: "The passionate gothic romance masterpiece. 100+ chapters tracing orphan Jane Eyre from childhood oppression to her fateful position as governess at Thornfield Hall and her love with the brooding Edward Rochester.",
    chapters: generatePublicDomainChapters(138, 100, [
      "The Red-Room at Gateshead Hall", "The Harsh Regimen of Lowood School", "Friendship and Loss of Helen Burns",
      "Arrival at the Towered Manor of Thornfield", "Meeting the Master on the Hay Lane", "The Midnight Fire in Rochester's Bed",
      "The Demonic Laugh in the Third-Story Attic", "The Proposal Under the Horse-Chestnut Tree", "The Wedding Interrupted by the Secret",
      "Flight Across the Wild Moors to Moor House", "The Voice Calling Across the Night Sky", "Reunion at the Ruined Woods of Ferndean"
    ], {
      hero: "Jane Eyre and Edward Fairfax Rochester",
      setting: "the Foggy Moors of Yorkshire and Thornfield Hall",
      conflict: "Moral Autonomy Versus Passion and Rochester's Hidden Past",
      artifactOrGoal: "the Torn Bridal Veil and the Ferndean Marriage Knot",
      eraVibe: "Victorian Gothic Romance"
    })
  },
  {
    id: 139,
    title: "Wuthering Heights: The Moors of Passion",
    author: "Emily Brontë",
    fallbackGradient: "from-zinc-950 via-neutral-900 to-stone-950",
    genre: "Romance",
    tags: ["Heathcliff", "Catherine Earnshaw", "Dark Romance", "Generational Revenge", "Public Domain"],
    status: "Completed",
    rating: 4.95,
    ratingCount: 10900,
    totalViews: "1.5M",
    viewCount: 1500000,
    publishedYear: 1847,
    synopsis: "The darkest and most turbulent romance ever written. 100+ chapters chronicling the all-consuming, wild love of foundling Heathcliff and Catherine Earnshaw across the tempestuous Yorkshire moors.",
    chapters: generatePublicDomainChapters(139, 100, [
      "The Visitor Arrives at Wuthering Heights", "The Ghostly Child at the Bed Chamber Window", "Nelly Dean Begins the Old History",
      "The Foundling Brought Home from Liverpool", "Growing Wild on the Heather-Covered Moors", "Catherine's Betrothal to Edgar Linton",
      "Heathcliff's Disappearance into the Storm", "The Triumphant and Vengeful Return", "The Death of Catherine in the Spring",
      "Haunted by the Unquiet Grave", "The Final Peace Over the Heather"
    ], {
      hero: "Heathcliff and Catherine Earnshaw",
      setting: "the Wind-Blasted Ridge of Wuthering Heights and Thrushcross Grange",
      conflict: "Fierce Vengeance and Transcendent, Haunting Passion",
      artifactOrGoal: "the Shared Lock of Hair and the Window Latch",
      eraVibe: "Gothic Yorkshire Moorlands"
    })
  },
  {
    id: 140,
    title: "The Scarlet Pimpernel: Shadows of the Guillotine",
    author: "Baroness Orczy",
    fallbackGradient: "from-red-950 via-zinc-950 to-blue-950",
    genre: "Adventure",
    tags: ["Secret Identity", "French Revolution", "Hero", "Masked Vigilante", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 8120,
    totalViews: "1.1M",
    viewCount: 1100000,
    publishedYear: 1905,
    synopsis: "The origin of the modern superhero secret-identity trope. 100+ chapters following Sir Percy Blakeney, who poses as a foppish English dandy while secretly leading a league to rescue innocents from the French guillotine.",
    chapters: generatePublicDomainChapters(140, 100, [
      "Paris: The Blood-Stained West Barricade", "The Smuggler's Inn: The Fishermen's Rest", "The Toast to the Elusive Scarlet Pimpernel",
      "Sir Percy and Lady Marguerite Blakeney", "Citizen Chauvelin's Blackmail at the Opera", "The Midnight Note Left at the Richmond Ball",
      "The Truth Dawns on Marguerite", "The Perilous Race Across the English Channel", "The Chat Gris Tavern in Calais",
      "The Mask Dropped on the Rocky Coastline", "The Escape of the Dauphin's Children"
    ], {
      hero: "Sir Percy Blakeney (The Scarlet Pimpernel)",
      setting: "the Terrors of Revolutionary Paris and Regency London",
      conflict: "Outsmarting the Bloodthirsty Network of Citizen Chauvelin",
      artifactOrGoal: "the Scarlet Pimpernel Flower Signet Ring",
      eraVibe: "French Revolutionary Swashbuckling"
    })
  },
  {
    id: 141,
    title: "War and Peace: Blood & Romance in Petersburg",
    author: "Leo Tolstoy",
    fallbackGradient: "from-blue-950 via-amber-950 to-stone-950",
    genre: "Historical",
    tags: ["Napoleonic Wars", "Russian Aristocracy", "Pierre Bezukhov", "Natasha Rostova", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 13200,
    totalViews: "2.2M",
    viewCount: 2200000,
    publishedYear: 1869,
    synopsis: "The colossal epic of Russian society during the Napoleonic invasion. 100+ chapters tracing Pierre Bezukhov, Prince Andrei Bolkonsky, and Natasha Rostova through glittering ballrooms, battlefields, and the burning of Moscow.",
    chapters: generatePublicDomainChapters(141, 120, [
      "The Soirée at Anna Pavlovna Scherer's", "Pierre Inherits the Count Bezukhov Fortune", "Prince Andrei Enters the Imperial Army",
      "The Cannon Smoke at the Battle of Austerlitz", "The Sky of Austerlitz and Andrei's Epiphany", "Natasha Rostova's First Grand Ball",
      "The Freemason Lodges and Pierre's Search for Truth", "Napoleon Crosses the Niemen River", "The Redoubts at the Battle of Borodino",
      "The Evacuation and Burning of Moscow", "Pierre's Captivity with Platon Karataev", "The Retreat of the Grand Army in Winter Snow"
    ], {
      hero: "Pierre Bezukhov, Prince Andrei, and Natasha Rostova",
      setting: "the Grand Palaces of St. Petersburg and the Snows of Moscow",
      conflict: "Napoleon's Invasion and the Spiritual Awakening of Russia",
      artifactOrGoal: "the Family Icon of the Bolkonskys and Pierre's Monocle",
      eraVibe: "Napoleonic Tsarist Aristocracy"
    })
  },
  {
    id: 142,
    title: "Anna Karenina: The Golden Society",
    author: "Leo Tolstoy",
    fallbackGradient: "from-rose-950 via-slate-900 to-amber-950",
    genre: "Romance",
    tags: ["High Society", "Count Vronsky", "Konstantin Levin", "Russian Court", "Public Domain"],
    status: "Completed",
    rating: 4.96,
    ratingCount: 11500,
    totalViews: "1.7M",
    viewCount: 1700000,
    publishedYear: 1877,
    synopsis: "Tolstoy's sublime tragic romance. 100+ chapters contrasting Anna Karenina's passionate, fateful affair with Count Vronsky against Konstantin Levin's peaceful quest for faith and rural family happiness.",
    chapters: generatePublicDomainChapters(142, 105, [
      "All Happy Families Are Alike", "The Train Station in Moscow and the First Glance", "The Snowstorm and the Midnight Platform Conversation",
      "The Steeplechase Race at Krasnoye Selo", "Vronsky's Mare Frou-Frou Stumbles", "Levin Mows the Hay with the Peasants",
      "The Wedding of Levin and Kitty Scherbatskaya", "The Grand Tour of Venice and Rome", "The Cold Isolation of St. Petersburg Society",
      "The Train Wheels Screeching in the Rain", "Levin's Peace Under the Starry Sky"
    ], {
      hero: "Anna Arkadyevna Karenina and Konstantin Levin",
      setting: "the Ballrooms of Moscow, Estates of Pokrovskoye, and Petersburg",
      conflict: "Societal Hypocrisy, Passionate Rebellion, and Redemption",
      artifactOrGoal: "the Red Leather Handbag and the Golden Society Fan",
      eraVibe: "19th Century High Russian Empire"
    })
  },
  {
    id: 143,
    title: "Sense and Sensibility: Heart & Reason",
    author: "Jane Austen",
    fallbackGradient: "from-amber-950 via-stone-900 to-rose-950",
    genre: "Romance",
    tags: ["Elinor & Marianne", "Edward Ferrars", "Colonel Brandon", "Regency", "Public Domain"],
    status: "Completed",
    rating: 4.93,
    ratingCount: 7890,
    totalViews: "1.0M",
    viewCount: 1000000,
    publishedYear: 1811,
    synopsis: "Austen's sparkling exploration of head versus heart. 100+ chapters following sensible Elinor Dashwood and romantic Marianne Dashwood navigating unexpected penury, faithless suitors, and true enduring love in Devonshire.",
    chapters: generatePublicDomainChapters(143, 100, [
      "The Dashwoods Evicted from Norland Park", "Barton Cottage in Scenic Devonshire", "Marianne Falls on the Rain-Soaked Hill",
      "Rescued by the Handsome John Willoughby", "Colonel Brandon's Silent Devotion", "Lucy Steele Confides Her Secret Engagement",
      "Elinor's Stoic Composure in Adversity", "Willoughby's Cruel Rejection Letter in London", "Marianne's Fever and Brandon's Ride",
      "The Marriage Bells at Barton Church"
    ], {
      hero: "Elinor and Marianne Dashwood",
      setting: "Barton Cottage in Devonshire and Mayfair, London",
      conflict: "Social Fortune Hunters and the Equilibrium of Soul and Sense",
      artifactOrGoal: "the Lock of Hair in the Ring and the Devonshire Piano",
      eraVibe: "English Regency Romance"
    })
  },

  // ==========================================
  // HORROR & DARK GOTHIC (7 NOVELS)
  // ==========================================
  {
    id: 144,
    title: "Dracula: The Transylvanian Logs",
    author: "Bram Stoker",
    fallbackGradient: "from-red-950 via-zinc-950 to-black",
    genre: "Horror",
    tags: ["Vampire", "Count Dracula", "Van Helsing", "Gothic Horror", "Blood", "Public Domain"],
    status: "Completed",
    rating: 4.99,
    ratingCount: 17200,
    totalViews: "2.7M",
    viewCount: 2700000,
    publishedYear: 1897,
    synopsis: "The archetypal vampire masterpiece. 100+ chapters told through personal journals, letters, and phonograph logs tracking Jonathan Harker's captivity in Transylvania to the hunting of Count Dracula across London and back to Castle Dracula.",
    chapters: generatePublicDomainChapters(144, 100, [
      "Jonathan Harker's Journal in Bistritz", "The Midnight Carriage Over the Borgo Pass", "Welcome to My House: The Castle of Dracula",
      "The Three Brides in the Moonlight Chamber", "The Count Crawls Down the Castle Wall Like a Bat", "The Ghost Ship Demeter Arrives in Whitby",
      "Lucy Westenra's Sleepwalking on the Cliffs", "The Blood Transfusion and Professor Van Helsing", "The Bloofer Lady of Hampstead Heath",
      "The Consecration of the Undead Crypt", "Dracula Infiltrates Carfax Abbey in the Fog", "The Pursuit Across the Black Sea Rivers",
      "The Final Knife Strike at the Sunset Gates of Transylvania"
    ], {
      hero: "Professor Abraham Van Helsing and Jonathan Harker",
      setting: "the Carpathian Mountains of Transylvania and Whitby Port",
      conflict: "Stopping the Ancient Vampire King from Infecting Britain",
      artifactOrGoal: "the Host and Garlic Wreath, and the Kukri Knife",
      eraVibe: "Victorian Epistolary Gothic Horror"
    })
  },
  {
    id: 145,
    title: "Frankenstein: The Modern Prometheus",
    author: "Mary Shelley",
    fallbackGradient: "from-cyan-950 via-slate-900 to-zinc-950",
    genre: "Horror",
    tags: ["Creature", "Mad Science", "Creation", "Arctic Pursuit", "Philosophy", "Public Domain"],
    status: "Completed",
    rating: 4.97,
    ratingCount: 14800,
    totalViews: "2.1M",
    viewCount: 2100000,
    publishedYear: 1818,
    synopsis: "The founding text of modern science fiction and gothic horror. 100+ chapters tracing Victor Frankenstein breathing spark into composite human flesh, and the intelligent Creature's tragic quest for acceptance and vengeance.",
    chapters: generatePublicDomainChapters(145, 100, [
      "Letters from Captain Walton in the Arctic Ice", "Victor Frankenstein's Youth in Geneva", "The Laboratories of the University of Ingolstadt",
      "The Infusion of the Spark of Life at Midnight", "Horror at the Yellow-Eyed Giant", "The Creature Awakens in the Forest of Germany",
      "Watching the De Lacey Family from the Hovel", "Learning Language and Human Literature", "Driven Away with Stones and Firebrands",
      "The Meeting on the Sea of Ice at Montanvert", "The Demand for an Eve in the Orkney Islands", "The Wedding Night Murder of Elizabeth",
      "The Sledge Pursuit Across the Frozen Arctic Ocean"
    ], {
      hero: "Victor Frankenstein and The Creature",
      setting: "the Ice Fields of the Arctic and the Mountains of Geneva",
      conflict: "The Moral Responsibility of Creation and Societal Cruelty",
      artifactOrGoal: "the Galvanic Spark Dynamo and the Creature's Journal",
      eraVibe: "Romantic Gothic Sci-Fi"
    })
  },
  {
    id: 146,
    title: "The Picture of Dorian Gray: Decadent Soul",
    author: "Oscar Wilde",
    fallbackGradient: "from-purple-950 via-zinc-900 to-amber-950",
    genre: "Horror",
    tags: ["Eternal Youth", "Cursed Painting", "Decadence", "Lord Henry", "Occult", "Public Domain"],
    status: "Completed",
    rating: 4.96,
    ratingCount: 13900,
    totalViews: "1.9M",
    viewCount: 1900000,
    publishedYear: 1890,
    synopsis: "Oscar Wilde's haunting philosophical horror. 100+ chapters following handsome young Dorian Gray, whose portrait absorbs every mark of his sins and physical aging while his living body remains forever young and flawless.",
    chapters: generatePublicDomainChapters(146, 100, [
      "The Studio of Basil Hallward and the Lilac Fragrance", "Lord Henry Wotton's Seductive Philosophy of Youth", "The Fatal Wish: If Only the Picture Could Age!",
      "The Suicide of Sybil Vane at the Theater", "The First Cruel Sneer on the Painted Canvas", "The Portrait Locked in the Old Schoolroom",
      "Eighteen Years of Midnight Hedonism in London", "The Red Stain of Basil's Murder in the Attic", "The Opium Dens of the East End Docks",
      "The Knife Struck into the Heart of the Canvas"
    ], {
      hero: "Dorian Gray and Lord Henry Wotton",
      setting: "the Decadent Drawing Rooms and Foggy Docks of London",
      conflict: "The Slow Rot of the Human Soul Sacrificed for Vain Immortality",
      artifactOrGoal: "the Life-Size Oil Portrait Painted by Basil Hallward",
      eraVibe: "Aesthetic Decadent Occult Gothic"
    })
  },
  {
    id: 147,
    title: "Dr. Jekyll and Mr. Hyde: London Shadows",
    author: "Robert Louis Stevenson",
    fallbackGradient: "from-stone-950 via-neutral-900 to-zinc-950",
    genre: "Horror",
    tags: ["Dual Identity", "Transformation", "Potion", "Victorian London", "Public Domain"],
    status: "Completed",
    rating: 4.94,
    ratingCount: 11100,
    totalViews: "1.6M",
    viewCount: 1600000,
    publishedYear: 1886,
    synopsis: "The psychological horror classic of human duality. 100+ chapters investigating lawyer Utterson's dread as his respected friend Dr. Henry Jekyll protects a monstrous, deformed brute named Edward Hyde.",
    chapters: generatePublicDomainChapters(147, 100, [
      "Story of the Door and the Trampled Child", "Search for Mr. Hyde in the Foggy By-Streets", "Dr. Jekyll Was Quite at Ease",
      "The Murder of Sir Danvers Carew with the Cane", "The Incident of the Letter with Identical Slant", "Dr. Lanyon's Sudden and Fatal Terror",
      "The Face at the Cabinet Window", "The Last Night: Breaking the Laboratory Red Baize Door", "Dr. Lanyon's Narrative of the Chemical Potion",
      "Henry Jekyll's Full Statement of the Case"
    ], {
      hero: "Mr. Gabriel John Utterson and Dr. Henry Jekyll",
      setting: "the Gaslit Alleys of Soho and the Chemical Laboratory",
      conflict: "The Split Between Civilized Restraint and Bestial Wickedness",
      artifactOrGoal: "the White Powder Salt and Blood-Red Tincture Flask",
      eraVibe: "Victorian Gothic Medical Noir"
    })
  },
  {
    id: 148,
    title: "Carmilla: The Styrian Bloodline",
    author: "Sheridan Le Fanu",
    fallbackGradient: "from-red-950 via-purple-950 to-black",
    genre: "Horror",
    tags: ["Vampire", "Gothic", "Styria", "Pre-Dracula", "Dark Mystery", "Public Domain"],
    status: "Completed",
    rating: 4.92,
    ratingCount: 8650,
    totalViews: "1.2M",
    viewCount: 1200000,
    publishedYear: 1872,
    synopsis: "The pioneering gothic novella that predates Dracula by a quarter-century. 100+ chapters following young Laura in a solitary castle in Styria who befriends the mysterious, ethereal Carmilla, Countess of Karnstein.",
    chapters: generatePublicDomainChapters(148, 100, [
      "The Solitary Schloß in the Styrian Forest", "The Overturned Carriage at the Drawbridge", "Carmilla's Languid Beauty and Strange Affection",
      "The Village Stricken by the Wasting Sickness", "The Nightly Visitations of the Giant Black Cat", "The Needle Prick at the Throat",
      "General Spielsdorf's Terrible Accusation", "The Ruined Church and the Forgotten Karnstein Vault", "The Stake Driven and the Ashes Cast into the River"
    ], {
      hero: "Laura and General Spielsdorf",
      setting: "the Ancient Pine Forests and Feudal Castles of Styria",
      conflict: "The Centuries-Old Predation of Countess Mircalla Karnstein",
      artifactOrGoal: "the Restored Family Portrait of Mircalla 1698",
      eraVibe: "Austro-Hungarian Gothic Vampire Lore"
    })
  },
  {
    id: 149,
    title: "The King in Yellow: Carcosa Chronicles",
    author: "Robert W. Chambers",
    fallbackGradient: "from-amber-950 via-yellow-950 to-black",
    genre: "Horror",
    tags: ["Cosmic Horror", "Carcosa", "The Yellow Sign", "Madness", "Weird Tales", "Public Domain"],
    status: "Completed",
    rating: 4.93,
    ratingCount: 9400,
    totalViews: "1.3M",
    viewCount: 1300000,
    publishedYear: 1895,
    synopsis: "The foundational classic of cosmic horror that inspired H.P. Lovecraft and True Detective. 100+ chapters exploring the cursed, madness-inducing play 'The King in Yellow', the Pallid Mask, and the lost alien city of Carcosa.",
    chapters: generatePublicDomainChapters(149, 100, [
      "The Repairer of Reputations in the Golden Chamber", "The Lethal Chamber of the Washington Square", "Reading the Second Act of the Forbidden Play",
      "The Mask: The Chemical Bath That Turns Flesh to Marble", "In the Court of the Dragon and the Church Organist", "The Yellow Sign Cast in Dark Stone",
      "The Pallid Mask: 'I Wear No Mask!'", "The Hyades Constellation and Lake of Hali", "The Shadows of Lost Carcosa Rising Over the Mind"
    ], {
      hero: "Hildred Castaigne and the Bohemian Artists",
      setting: "the Bohemian Quarters of Paris and New York Gilded Studios",
      conflict: "Psychic Madness Spread by the Dimensional Sovereign in Yellow",
      artifactOrGoal: "the Carved Talisman of the Yellow Sign",
      eraVibe: "Fin-de-Siècle Cosmic Decadent Horror"
    })
  },
  {
    id: 150,
    title: "The House on the Borderland: The Cosmic Abyss",
    author: "William Hope Hodgson",
    fallbackGradient: "from-slate-950 via-indigo-950 to-black",
    genre: "Horror",
    tags: ["Cosmic Horror", "Swine-Things", "Time Dilation", "Abyssal Void", "Public Domain"],
    status: "Completed",
    rating: 4.90,
    ratingCount: 7120,
    totalViews: "980K",
    viewCount: 980000,
    publishedYear: 1908,
    synopsis: "A seminal cosmic horror masterpiece. 100+ chapters deciphering the journal of the Recluse living in a bizarre house built above a fathomless abyss in western Ireland, besieged by swine-creatures and hurtled across cosmic eons.",
    chapters: generatePublicDomainChapters(150, 100, [
      "The Manuscript Discovered in the Irish Ruins", "The Chasm Beneath the Foundation Stone", "The Swine-Things Emerging from the Murky Pit",
      "Defending the Barricaded Windows with Rifles", "The Dream of the Sea of Sleep", "The Acceleration of the Earth's Solar Orbit",
      "Centuries Passing in the Flicker of a Second", "The Sun Turns Cold and Red in the Eternal Twilight", "The Cosmic Arena of the Beast Gods",
      "The Return to the Darkening House"
    ], {
      hero: "The Recluse and His Faithful Hound Pepper",
      setting: "the Solitary Stone Mansion Above the Irish Ravine",
      conflict: "Dimensional Incursion of Swine-Beasts and Universal Entropy",
      artifactOrGoal: "the Bound Journal of the Borderland and the Starry Telescope",
      eraVibe: "Edwardian Cosmic Weird Fiction"
    })
  }
];
