import { Novel, Chapter } from '../types/novel';
import { generateUniqueChapterTitle } from '../utils/narrativeGenerator';

// Helper to generate chapters with varied story progression for a novel
function generateNovelChapters(
  novelId: number,
  baseChapterCount: number,
  chapterTitles: string[],
  themeKeywords: { hero: string; setting: string; antagonist: string; artifact: string }
): Chapter[] {
  const chapters: Chapter[] = [];
  const targetCount = 250; // Each novel now has 250 serialized chapters

  for (let i = 1; i <= targetCount; i++) {
    const customTitle = chapterTitles[i - 1];
    const title = customTitle || generateUniqueChapterTitle(i, themeKeywords.hero, 'general_xianxia');
    const wordCount = 1150 + ((i * 29) % 650);
    const readMinutes = Math.max(5, Math.round(wordCount / 220));
    const isLockedMilestone = i > 30;

    let arc = 'early';
    if (i > 180) arc = 'climax';
    else if (i > 90) arc = 'mid';

    let contentSnippet = '';
    if (arc === 'early') {
      contentSnippet = `
        <p>The dawn wind carried the familiar scent of ${themeKeywords.setting}, cold and sharp against ${themeKeywords.hero}'s worn mantle. Each step along the winding perimeter revealed traces of ancient power long thought lost to history.</p>
        <p>"Do you believe the records?" asked the companion, eyes scanning the mist-covered ridge where ${themeKeywords.antagonist} was said to have first mobilized.</p>
        <p>${themeKeywords.hero} adjusted the grip on ${themeKeywords.artifact}. "Records can be burned or forged by victors. But the stone remembers, and the resonance in this ground does not lie."</p>
        <p>Deep within the shadows, an ancient mechanism shuddered into life. Chapter ${i} of their journey had begun, and turning back was no longer an option.</p>
      `;
    } else if (arc === 'mid') {
      contentSnippet = `
        <p>The confrontation in the heart of ${themeKeywords.setting} had left deep scars in the surrounding terrain. ${themeKeywords.hero} knelt to examine the fracture line where energy from ${themeKeywords.artifact} had collided with the void.</p>
        <p>"The threshold is unstable," the scout warned, hands trembling upon the perimeter ward. "If the seals break before midnight, ${themeKeywords.antagonist} will break through the third barrier without opposition."</p>
        <p>"Then we do not wait for midnight," ${themeKeywords.hero} replied steadily. "Circulate the inner energy. Every breath taken here must be counted toward the final breakthrough."</p>
        <p>A wave of concentrated power washed through the corridor, illuminating forgotten sigils that glowed in unison with their synchronized pulse.</p>
      `;
    } else {
      contentSnippet = `
        <p>Silence hung heavy over the ruins of ${themeKeywords.setting}. In the distance, the grand apex loomed against a sky sheared in half by celestial energy. This was the pinnacle of ${themeKeywords.hero}'s long crusade.</p>
        <p>Before them stood ${themeKeywords.antagonist}, surrounded by an aura of primordial authority that distorted the very air. "You have climbed far from humble beginnings," the adversary intoned, voice resonating like tolling bronze.</p>
        <p>${themeKeywords.hero} raised ${themeKeywords.artifact}, its crystalline facets shining with the gathered willpower of a hundred trials. "I did not climb to take your throne. I climbed to ensure no master ever stands upon this realm again."</p>
        <p>With a thunderous clash that split the firmament, the final trial of Chapter ${i} commenced.</p>
      `;
    }

    chapters.push({
      id: novelId * 1000 + i,
      novelId,
      chapterNumber: i,
      title,
      wordCount,
      estimatedReadMinutes: readMinutes,
      releaseDate: `2026-03-${((i % 28) + 1).toString().padStart(2, '0')}`,
      authorNote: isLockedMilestone
        ? `Chapter ${i}: VIP serialization milestone (Unlock with Daily Free Pass or VIP Pass)`
        : undefined,
      content: contentSnippet.trim(),
    });
  }

  return chapters;
}

export const EXTENDED_NOVELS: Novel[] = [
  // 1. Xianxia: Dao of the Wandering Blacksmith
  {
    id: 12,
    title: "Dao of the Wandering Blacksmith",
    author: "Master Mo Ironheart",
    coverImage: '/covers/wandering_blacksmith.jpg',
    fallbackGradient: "from-amber-950 via-orange-950 to-stone-950",
    genre: "Xianxia",
    tags: ["Crafting", "Immortal Forging", "Daoist Philosophy", "Slow Burn", "Artifact Spirit"],
    status: "Ongoing",
    rating: 4.88,
    ratingCount: 1640,
    totalViews: "48.2K",
    viewCount: 48200,
    publishedYear: 2026,
    synopsis: "While other cultivators chase flying swords and immortality pills, Mo Han travels the mortal realm with a portable anvil, hammering the laws of heaven directly into common steel and mortal farming hoes.",
    chapters: generateNovelChapters(
      12,
      50,
      [
        "The Bellows of Autumn", "Tempering Cold River Iron", "The First Spirit Spark", "A Hoe for the Emperor",
        "Striking the Anvil of Fate", "Echoes of the Charcoal Furnace", "Quenching in Dragon Vein Water",
        "The Wandering Apprentice", "Five Element Smelting", "The Blade That Refused Blood",
        "Mortal Hands, Immortal Will", "Sect Elder at the Forge", "The Cracking Crucible",
        "Resonance of Pure Steel", "The Seven Harmonious Strikes", "Sparks in the Rain",
        "Hammering the Cloud Meridian", "The Blacksmith's Wine", "A Scythe to Harvest Stars",
        "The Silent Bell of Wudang", "Smelting Netherite Ore", "The Apprentice's Test",
        "Taming the Earth Fire", "A Pin of Celestial Jade", "Dao in the Flaking Rust",
        "Tribulation Lightning at the Forge", "The Broken Masterpiece", "Soul of the Charcoal Hearth",
        "The King's Commission", "Threshold of the Divine Smith", // Ch 30
        "The Forging of Sky Cleaver", "Anvil of Nine Heavens", "Quenched in Starlight",
        "The Immortal's Broken Spear", "Refining Chaos Essence", "Song of the Heavy Hammer",
        "The Furnace Dragon Awakens", "Iron Flowers in Winter", "The Sovereign Seal",
        "A Blade for the Commoner", "Striking the Void", "Purity Beyond Gold",
        "The Forge on the Cloud Peak", "Heart of the Black Iron", "Spirit Vessel Awakening",
        "The Final Tempering", "A World Inside an Ingot", "Echo of the Primordial Flame",
        "Master of the Earth Core", "Dao Without Form"
      ],
      {
        hero: "Blacksmith Mo",
        setting: "the Mist-Crest Mountain Forge",
        antagonist: "the Corrupt Sect Elder",
        artifact: "the Meteorite Iron Hammer"
      }
    )
  },

  // 2. Xianxia: The Herbalist Who Plucked the Moon
  {
    id: 13,
    title: "The Herbalist Who Plucked the Moon",
    author: "Apothecary Bai",
    coverImage: '/covers/herbalist_moon.jpg',
    fallbackGradient: "from-teal-950 via-emerald-950 to-slate-950",
    genre: "Xianxia",
    tags: ["Herbalism", "Spirit Beasts", "Alchemy", "Quiet Progression", "Misty Peaks"],
    status: "Ongoing",
    rating: 4.91,
    ratingCount: 1220,
    totalViews: "29.4K",
    viewCount: 29400,
    publishedYear: 2026,
    synopsis: "In a mountain hollow where moonlight condenses into dew, young apothecary Bai Shen cultivates forgotten spirit herbs that can cure the severed destinies of fallen immortals.",
    chapters: generateNovelChapters(
      13,
      50,
      [
        "Dew on the Silver Grass", "The Blind Deer of Jade Hollow", "Mortar and Pestle", "Cold Spring Elixir",
        "The Seven Root Orchid", "Whispers of the Wild Ginseng", "Gathering Moonlight", "The Sect's Discarded Cauldron",
        "Fragrance in the Wind", "Pill of Thousand Seasons", "A Cured Raven", "The Wounded Sword Immortal",
        "Preserving Spirit Petals", "The Mountain God's Garden", "Licorice of Longevity", "Blood Essence Poultice",
        "Rain on the Drying Trays", "The Bitter Taste of Truth", "Awakening the Green Lotus", "Pestle of Ancient Pear Wood",
        "Roots in the Abyss", "The Poison Sovereign's Visit", "Healing the Soul Meridian", "The Moonflower Blooms",
        "Steeping the Astral Tea", "Herbs of the Void Cavern", "A Salve for Broken Dantian", "Wild Honey and Jade Dew",
        "The Master's Worn Notebook", "Threshold of the Divine Herbalist", // Ch 30
        "Plucking the Lunar Stamen", "The Herb Cauldron Sings", "Resurrecting Dead Seedlings", "The Dragon Vein Ginseng",
        "Pill of Eternal Clarity", "The Sovereign's Secret Affliction", "Mist Over the Medicine Garden", "Petals of the Nine Phoenixes",
        "A Breath of Pure Wood Qi", "The Mountain Apothecary's Oath", "Cauldron of the Four Seasons", "The Spirit Deer's Gift",
        "Taming the Venomous Orchid", "The Alchemical Concoction", "Essence of the Frost Lily", "The Broken Immortal Restored",
        "Medicine of No Shadow", "The Jade Mortar Awoken", "Gardener of the Heavens", "Immortal Harmony"
      ],
      {
        hero: "Bai Shen",
        setting: "the Jade Moon Valley",
        antagonist: "the Pill Pavilion Inquisitor",
        artifact: "the Primordial Jade Mortar"
      }
    )
  },

  // 3. LitRPG: The Zero-Mana Climber
  {
    id: 14,
    title: "The Zero-Mana Climber",
    author: "Vance Croft",
    coverImage: '/covers/zero_mana_climber.jpg',
    fallbackGradient: "from-blue-950 via-slate-950 to-indigo-950",
    genre: "LitRPG",
    tags: ["Tower Climbing", "Zero Magic", "Kinetic Build", "Grit", "System Mechanics"],
    status: "Ongoing",
    rating: 4.86,
    ratingCount: 2890,
    totalViews: "84.1K",
    viewCount: 84100,
    publishedYear: 2026,
    synopsis: "Assigned an absolute Mana capacity of 0 in a world where magic rules the Spire, Ethan exploits momentum, gravity, and kinetic levers to smash past spellcasters on Floor 50.",
    chapters: generateNovelChapters(
      14,
      60,
      [
        "Floor 1: Static Friction", "Zero Mana, Infinite Momentum", "The Lever of Archimedes", "Kinetic Conversion Boots",
        "The Mage's Condescension", "Smashing the Fireball", "Floor 10 Boss: Iron Golem", "The Pulley System Hack",
        "Gravity Slingshot", "Calculated Trajectory", "Floor 15: The Ice Caverns", "Frictionless Velocity",
        "The High Mage's Duel", "Shock Absorption Matrix", "Defying the Arcane Lattice", "Floor 20: The Chasm",
        "Kinetic Storage Ring", "The Speed of Falling Steel", "Floor 25: Hall of Mirrors", "Shattering the Illusion with Mass",
        "Momentum Stacking", "Floor 30: The Dragon of Lightning", // Ch 30
        "The Lightning Grounding Wire", "Floor 35: High Gravity Chamber", "Mass as a Weapon", "The System's Glitch Warning",
        "Velocity Breakthrough", "Floor 40: The Arcane Council", "Physics Against Sorcery", "Floor 45: The Void Elevator",
        "Supersonic Impact", "Floor 50: The Mana Core", "Smashing the Spell Matrix", "Kinetic Sovereign Awakening",
        "Floor 55: The Apex Spire", "Absolute Momentum", "The Final Lever", "The Spire Shudders", "Zero to Infinite", "Apex Climber"
      ],
      {
        hero: "Ethan",
        setting: "Floor 42 of the Babel Spire",
        antagonist: "Arch-Mage Vaelor",
        artifact: "the Kinetic Vector Harness"
      }
    )
  },

  // 4. LitRPG: Blacksmithing in the Apocalypse
  {
    id: 15,
    title: "Blacksmithing in the Apocalypse",
    author: "Garrett Stone",
    coverImage: '/covers/apocalypse_forge.jpg',
    fallbackGradient: "from-red-950 via-zinc-950 to-stone-900",
    genre: "LitRPG",
    tags: ["Base Building", "Crafting", "Apocalypse", "Armorer", "Zombies & Mutants"],
    status: "Ongoing",
    rating: 4.84,
    ratingCount: 1530,
    totalViews: "41.6K",
    viewCount: 41600,
    publishedYear: 2026,
    synopsis: "When mutants overrun Denver, retired armorer Garrett refuses to flee. With a portable induction furnace and alien scrap titanium, he equips the survivor enclave with legendary power armor.",
    chapters: generateNovelChapters(
      15,
      50,
      [
        "Day 1: Scrap Titanium", "The First Reinforced Barricade", "Induction Furnace Modding", "Mutant Carapace Armor",
        "Crafting Grade-D Machetes", "The Steel Enclave", "Upgrading the Blast Doors", "Pneumatic Spear Forge",
        "The Hive Swarm Attack", "Tempered Tungsten Tips", "Power Armor Blueprint Found", "Hydraulic Exoskeleton Mk 1",
        "The Heavy Walker Tank", "Alloy of the Alien Shard", "Fortifying the Refinery", "The Iron Barricade Stands",
        "Automated Turret Mounts", "Plasma Arc Welding", "The Sovereign Armorer Class", "Threshold of the Bastion", // Ch 30
        "Exoskeleton Mk 2: Behemoth", "Smelting the Mutated Titan", "Armor of the City Guard", "The Siege of South Bridge",
        "Tungsten Core Ballistics", "The Walking Fortress", "Armoring the Survivor Fleet", "Legendary Forge Master"
      ],
      {
        hero: "Garrett",
        setting: "the Fortified Denver Scrapworks",
        antagonist: "the Hive Patriarch",
        artifact: "the Hydraulic Plasma Hammer"
      }
    )
  },

  // 5. Dark Fantasy: The Bone Carver of Winterfall
  {
    id: 16,
    title: "The Bone Carver of Winterfall",
    author: "Kaelen Ward",
    coverImage: '/covers/bone_carver.jpg',
    fallbackGradient: "from-slate-900 via-zinc-950 to-neutral-900",
    genre: "Fantasy",
    tags: ["Dark Fantasy", "Bone Magic", "Northern Waste", "Grimdark", "Runes"],
    status: "Ongoing",
    rating: 4.89,
    ratingCount: 1740,
    totalViews: "52.8K",
    viewCount: 52800,
    publishedYear: 2025,
    synopsis: "In the endless blizzard of the Frost Wastes, Kael carves protective runes into mammoths' tusks and dragon ribs. When the Frozen Sovereign marches, only ancient ossuary magic can hold the gate.",
    chapters: generateNovelChapters(
      16,
      50,
      [
        "Ivory and Ash", "The Whale Bone Rune", "Frost on the Citadel Walls", "The Shivering Watch",
        "Whispers of the Mammoth Grave", "Carving the Shield Ward", "The First Blight Beast", "Bone Needles in the Dark",
        "The Chieftain's Scepter", "Frostbite and Blood", "The Drake's Vertebra", "Winter That Never Ends",
        "Runes of the Deep Chill", "The Carved Horn Sounds", "Night of the White Wolves", "Ossuary of the Ancients",
        "The Bone Flute of the Valkyrie", "Frozen Marrow Elixir", "The Wall of Skulls", "The Frost King Awakes", // Ch 30
        "The Skeletal Wyrm Carving", "Battle of the Frozen Fjords", "Runes of Eternal White", "The Sovereign Bone Wand",
        "Marrow of the First Dragon", "The Blizzard Breaker", "King of the Silent Snow"
      ],
      {
        hero: "Kael the Carver",
        setting: "the Frost-Bitten Bastion of Winterfall",
        antagonist: "the Frost King Malgath",
        artifact: "the Dragon Rib Chisel"
      }
    )
  },

  // 6. Fantasy: Echoes of the Sunken Citadel
  {
    id: 17,
    title: "Echoes of the Sunken Citadel",
    author: "Aria Swift",
    coverImage: '/covers/sunken_citadel.jpg',
    fallbackGradient: "from-blue-950 via-teal-950 to-stone-950",
    genre: "Fantasy",
    tags: ["Ancient Civilizations", "Submerged Ruins", "Tide Magic", "Exploration", "Lost Relics"],
    status: "Ongoing",
    rating: 4.85,
    ratingCount: 980,
    totalViews: "22.1K",
    viewCount: 22100,
    publishedYear: 2026,
    synopsis: "Once every century, the Great Coral Bay recedes for seven tides. Diver Aria ventures into the dripping spires of the Sunken Citadel before the waters return to claim all invaders.",
    chapters: generateNovelChapters(
      17,
      50,
      [
        "The First Ebb Tide", "The Coral Gate Unsealed", "Dripping Vaults of Atlantis", "The Pearl of Memory",
        "Phosphorescent Corridors", "The Drowned King's Throne", "Tidal Bell Tolls", "Secrets in the Kelp",
        "The Second Ebb", "Carved Manta Guardians", "The Submerged Library", "Scrolls of Liquid Gold",
        "The Pressure Ward", "Water Breathing Sigils", "The Abyssal Trench Beckons", "Sovereign of the Depths"
      ],
      {
        hero: "Diver Aria",
        setting: "the Sunken Spires of Atlantis",
        antagonist: "the Abyssal Kraken",
        artifact: "the Coral Heart Compass"
      }
    )
  },

  // 7. Cyberpunk: Silicon Heartbeat: 2088
  {
    id: 18,
    title: "Silicon Heartbeat: 2088",
    author: "Cipher Reed",
    coverImage: '/covers/silicon_heartbeat.jpg',
    fallbackGradient: "from-purple-950 via-zinc-950 to-slate-950",
    genre: "Cyberpunk",
    tags: ["Cyber Noir", "Synthetic Life", "Megacity", "Hackers", "Bioluminescent"],
    status: "Ongoing",
    rating: 4.87,
    ratingCount: 1490,
    totalViews: "38.7K",
    viewCount: 38700,
    publishedYear: 2026,
    synopsis: "In Neo-Chicago's sub-level 14, an underground cyber-surgeon accidentally implants an experimental android emotional core into a dying street courier.",
    chapters: generateNovelChapters(
      18,
      50,
      [
        "Level 14 Neon Drizzle", "The Faulty Pacemaker", "The Synthetic Pulse", "Aegis Corporation Patrol",
        "Data Leak in Sector 9", "The Cyber-Doc's Clinic", "Adrenaline and Chrome", "Hacking the Surveillance Eye",
        "The Memory Partition", "Ghosts of the First Android", "Underground Metro Chase", "The EMP Trap",
        "Overclocked Synapses", "The Corporate Cleaners", "Synthesized Empathy", "Heart of Pure Silicon"
      ],
      {
        hero: "Courier Jax",
        setting: "the Neon Rain Underbelly of Neo-Chicago",
        antagonist: "Director Vance of Aegis Biotech",
        artifact: "the Neural Emotion Core"
      }
    )
  },

  // 8. Sci-Fi: The Last Colony on Europa
  {
    id: 19,
    title: "The Last Colony on Europa",
    author: "Dr. Isaac Cole",
    coverImage: '/covers/europa_colony.jpg',
    fallbackGradient: "from-cyan-950 via-slate-950 to-black",
    genre: "Sci-Fi",
    tags: ["Hard Sci-Fi", "Alien Ocean", "Sub-Surface Base", "Isolation", "First Contact"],
    status: "Ongoing",
    rating: 4.93,
    ratingCount: 1820,
    totalViews: "54.6K",
    viewCount: 54600,
    publishedYear: 2025,
    synopsis: "Bored twenty kilometers beneath Europa's thick ice crust, geothermal drilling station Triton discovers a warm alien hydrothermal vent pulsing with structured mathematical light signals.",
    chapters: generateNovelChapters(
      19,
      50,
      [
        "Twenty Kilometers of Ice", "The Geothermal Rig", "Sonar Anomalies", "The Black Chimney Vent",
        "Bioluminescent Geometry", "Radio Silence from Earth", "The Submersible Dive", "Liquid Helium Seals",
        "The Ice Creaks", "Signals in the Saline Core", "Organisms of Pure Sulfur", "The Sub-Surface Awakening"
      ],
      {
        hero: "Dr. Isaac Cole",
        setting: "the Sub-Glacial Ocean Station Triton",
        antagonist: "the Crushing Hydrostatic Void",
        artifact: "the Cryogenic Acoustic Probe"
      }
    )
  },

  // 9. Steampunk: Aether & Brass: The Airship Odyssey
  {
    id: 20,
    title: "Aether & Brass: The Airship Odyssey",
    author: "Captain Thorne",
    coverImage: '/covers/airship_odyssey.jpg',
    fallbackGradient: "from-amber-900 via-stone-900 to-amber-950",
    genre: "Steampunk",
    tags: ["Airships", "Aether Propellers", "Sky Pirates", "Victorian Engineering", "Grand Adventure"],
    status: "Ongoing",
    rating: 4.83,
    ratingCount: 1110,
    totalViews: "26.4K",
    viewCount: 26400,
    publishedYear: 2026,
    synopsis: "Aboard the twin-keeled dirigible 'The Zephyr', a disgraced royal navigator charts the forbidden Storm Belt in search of the floating brass continent of Hyperion.",
    chapters: generateNovelChapters(
      20,
      50,
      [
        "Cast Off from Port Victoria", "The Aether Pressure Valve", "Pirate Zeppelins on the Horizon", "Boiler Room Mutiny",
        "The Great Vortex", "Gears of the Cloud Compass", "Cannonade in the Fog", "The Floating Isle Sighted"
      ],
      {
        hero: "Captain Thorne",
        setting: "the High Atmosphere Storm Belt",
        antagonist: "Commodore Blackwood",
        artifact: "the Gyroscopic Aether Compass"
      }
    )
  },

  // 10. Romance: The Contract of the Raven Duke
  {
    id: 21,
    title: "The Contract of the Raven Duke",
    author: "Lady Corinna",
    coverImage: '/covers/raven_duke.jpg',
    fallbackGradient: "from-purple-950 via-slate-900 to-rose-950",
    genre: "Romance",
    tags: ["Enemies to Lovers", "Aristocratic Intrigue", "Arranged Marriage", "Gothic Romance", "Magic Seals"],
    status: "Ongoing",
    rating: 4.94,
    ratingCount: 3410,
    totalViews: "96.5K",
    viewCount: 96500,
    publishedYear: 2026,
    featured: true,
    synopsis: "To protect her younger siblings from the debtor's prison, scholar Clara signs a one-year marriage contract with the taciturn Raven Duke, who hides dark feathered wings beneath his embroidered coat.",
    chapters: generateNovelChapters(
      21,
      50,
      [
        "The Black Carriage Arrives", "The Marriage Pact of Ravenwood", "Feathers on the Balcony", "The Cold Dinner Table",
        "A Library of Forbidden Curses", "A Waltz in the Shadows", "The Duke's Blood Curse", "Whispers at the Royal Ball",
        "The Wing Unfurled", "Trust in the Winter Night", "The Poisoned Goblet", "Breaking the Raven's Chain"
      ],
      {
        hero: "Lady Clara",
        setting: "the Gothic Manors of Ravenwood",
        antagonist: "Archduke Malgath",
        artifact: "the Silver Quill of the Covenant"
      }
    )
  },

  // 11. Romance: The Witch and the Northern Knight
  {
    id: 22,
    title: "The Witch and the Northern Knight",
    author: "Elspeth Vale",
    coverImage: '/covers/witch_northern_knight.jpg',
    fallbackGradient: "from-rose-950 via-indigo-950 to-neutral-900",
    genre: "Romance",
    tags: ["Forbidden Love", "Winter Romance", "Hedge Witch", "Honorable Knight", "Cozy Magic"],
    status: "Ongoing",
    rating: 4.89,
    ratingCount: 2180,
    totalViews: "63.2K",
    viewCount: 63200,
    publishedYear: 2026,
    synopsis: "A wounded commander of the Royal Paladins is found half-frozen in the snow by the very herbal witch he was sent north to execute.",
    chapters: generateNovelChapters(
      22,
      50,
      [
        "Blood on the Snowdrift", "The Witch's Hearth", "Chamomile and Wolfsbane", "The Paladin's Vow",
        "Fevered Dreams of Fire", "The King's Inquisitors Approach", "Mending the Broken Armor", "The Pine Needle Spell"
      ],
      {
        hero: "Elspeth the Witch",
        setting: "the Pine Forest Cabin of the North",
        antagonist: "Grand Inquisitor Torvald",
        artifact: "the Moon-Drop Amulet"
      }
    )
  },

  // 12. Mystery: The Bloodhound of Foggy Docks
  {
    id: 23,
    title: "The Bloodhound of Foggy Docks",
    author: "Inspector Gideon Vance",
    coverImage: '/covers/foggy_docks.jpg',
    fallbackGradient: "from-stone-900 via-slate-900 to-amber-950",
    genre: "Mystery",
    tags: ["Victorian Detective", "Serial Murders", "Foggy London", "Forensics", "Clever Protagonist"],
    status: "Ongoing",
    rating: 4.86,
    ratingCount: 1470,
    totalViews: "33.9K",
    viewCount: 33900,
    publishedYear: 2025,
    synopsis: "When wealthy tea merchants are found dead inside locked bank vaults with no signs of poison or injury, Inspector Gideon follows the scent of an ancient opium ring to the Thames docks.",
    chapters: generateNovelChapters(
      23,
      50,
      [
        "The Vault at Lloyds", "Footprints of Blue Chalk", "The Pipe Smoker in Alley 4", "Autopsy by Gaslight",
        "The Tea Merchant's Will", "The Scent of Bitter Almond", "Under the Timber Wharf", "The Final Deduction"
      ],
      {
        hero: "Inspector Gideon",
        setting: "the Gaslit Cobblestones of Thames Dock",
        antagonist: "The Blue Chalk Phantom",
        artifact: "the Brass Magnifying Monocle"
      }
    )
  },

  // 13. Mystery: The Midnight Pawn Shop
  {
    id: 24,
    title: "The Midnight Pawn Shop",
    author: "Mr. Orpheus",
    coverImage: '/covers/midnight_pawn.jpg',
    fallbackGradient: "from-zinc-950 via-stone-900 to-purple-950",
    genre: "Mystery",
    tags: ["Urban Mystery", "Cursed Items", "Soul Barter", "Episodic", "Supernatural"],
    status: "Ongoing",
    rating: 4.92,
    ratingCount: 1890,
    totalViews: "45.7K",
    viewCount: 45700,
    publishedYear: 2026,
    synopsis: "Open only from 12:00 AM to 1:00 AM in an alley that appears on no map, the Midnight Pawn Shop trades supernatural artifacts not for money, but for memories and secrets.",
    chapters: generateNovelChapters(
      24,
      50,
      [
        "Item 001: The Pocketwatch That Runs Backward", "A Memory of First Love as Payment", "Item 002: The Mirror Without Reflection",
        "The Gambler's Lucky Finger", "Item 003: The Music Box of Regret", "A Detective's Lost Case", "The Ledger of Souls"
      ],
      {
        hero: "Shopkeeper Orpheus",
        setting: "the Midnight Alley between 4th and 5th Street",
        antagonist: "The Collector of Lost Years",
        artifact: "the Brass Weighing Scales"
      }
    )
  },

  // 14. Wuxia: Drunken Sword of the Western Pass
  {
    id: 25,
    title: "Drunken Sword of the Western Pass",
    author: "Li Baiyun",
    coverImage: '/covers/drunken_sword.jpg',
    fallbackGradient: "from-red-950 via-amber-950 to-neutral-900",
    genre: "Wuxia",
    tags: ["Drunken Fist", "Desert Pass", "Sword Intent", "Brotherhood", "Traditional Jianghu"],
    status: "Ongoing",
    rating: 4.88,
    ratingCount: 1390,
    totalViews: "31.5K",
    viewCount: 31500,
    publishedYear: 2026,
    synopsis: "At the dusty border tavern of Yumen Pass, an exiled swordsman drinks wine from a gourde while protecting a caravan of orphan disciples from the Golden Sabre Bureau.",
    chapters: generateNovelChapters(
      25,
      50,
      [
        "Gourd of Yellow Rice Wine", "The Sandstorm at Sunset", "Three Swords in the Gutter", "The Golden Sabre Ambush",
        "The Drunken Stumble Stance", "Wine on the Blade", "The Tavern Keeper's Secret", "Sword Intent Across the Dunes"
      ],
      {
        hero: "Swordsman Li",
        setting: "the Sand-Winds of Yumen Border Pass",
        antagonist: "Commander Han of Golden Sabre",
        artifact: "the Iron-Bark Wine Gourd"
      }
    )
  },

  // 15. Wuxia: The Iron Flute Scholar
  {
    id: 26,
    title: "The Iron Flute Scholar",
    author: "Master Shen",
    coverImage: '/covers/iron_flute.jpg',
    fallbackGradient: "from-emerald-950 via-neutral-950 to-stone-900",
    genre: "Wuxia",
    tags: ["Sound Attacks", "Scholar Swordsman", "Bamboo Grove", "Righteousness", "Jianghu"],
    status: "Ongoing",
    rating: 4.85,
    ratingCount: 1150,
    totalViews: "24.8K",
    viewCount: 24800,
    publishedYear: 2026,
    synopsis: "Failing the imperial examinations for refusing to take a bribe, scholar Shen takes up an iron flute that can shatter armor with sonic qi melodies.",
    chapters: generateNovelChapters(
      26,
      50,
      [
        "The Rejected Examination Paper", "Song of the Falling Willow", "Shattering the Bandit's Dagger", "The River Ferry Stroll",
        "Melody of the Nine Ghosts", "Duel in the Bamboo Mist", "The Corrupt Governor's Banquet", "The Sound of Righteousness"
      ],
      {
        hero: "Scholar Shen",
        setting: "the Bamboo Groves of Hangzhou",
        antagonist: "Magistrate Cao",
        artifact: "the Seven-Hole Heavy Iron Flute"
      }
    )
  },

  // 16. Action: Night Hunter: Seoul Protocol
  {
    id: 27,
    title: "Night Hunter: Seoul Protocol",
    author: "Jin-Woo Park",
    coverImage: '/covers/spatial_mage.jpg',
    fallbackGradient: "from-blue-950 via-purple-950 to-black",
    genre: "Action",
    tags: ["Urban Fantasy", "Dungeon Gates", "Shadow Assassins", "Seoul Underworld", "Overpowered"],
    status: "Ongoing",
    rating: 4.93,
    ratingCount: 3820,
    totalViews: "112.4K",
    viewCount: 112400,
    publishedYear: 2026,
    featured: true,
    synopsis: "When black-grade monster gates open across the Gangnam subway line, an E-rank scout awakens an ancient shadow phantom monarch contract.",
    chapters: generateNovelChapters(
      27,
      50,
      [
        "Station 2: The Red Siren", "The E-Rank Sacrificial Pawn", "The Shadow Monolith", "Shadow Extraction: Hobgoblin King",
        "Level Up in the Sub-Basement", "The Raid Team Betrayal", "Solitary Boss Cleared", "The Shadow Legion Rises"
      ],
      {
        hero: "Jin-Woo",
        setting: "the Neon Underground of Seoul Subway Gate",
        antagonist: "The Crimson Lich Lord",
        artifact: "the Shadow Monarch Dagger"
      }
    )
  },

  // 17. Horror / Dark Thriller: The Whisperers in the Birch Forest
  {
    id: 28,
    title: "The Whisperers in the Birch Forest",
    author: "Silas Crowley",
    coverImage: '/covers/tower_babel_99.jpg',
    fallbackGradient: "from-zinc-950 via-stone-900 to-black",
    genre: "Mystery",
    tags: ["Psychological Horror", "Folk Horror", "Dark Folklore", "Supernatural", "Eerie Atmosphere"],
    status: "Ongoing",
    rating: 4.87,
    ratingCount: 1650,
    totalViews: "37.2K",
    viewCount: 37200,
    publishedYear: 2026,
    synopsis: "Assigned as the winter park ranger in an isolated Scandinavian birch forest, Daniel notices that the white tree bark bears the silhouettes of villagers who disappeared fifty years ago.",
    chapters: generateNovelChapters(
      28,
      50,
      [
        "Day 1: The White Trunks", "The Radio That Plays Static", "Faces in the Bark", "The Empty Ranger Station",
        "Footprints That Walk Backward", "The Whispering Stove", "Night of the Wooden Horn", "The Birch King's Call"
      ],
      {
        hero: "Ranger Daniel",
        setting: "the Deep Scandinavian Birch Forest",
        antagonist: "The Birch Sovereign",
        artifact: "the Kerosene Searchlight"
      }
    )
  },

  // 18. Historical Adventure: The Silk Road Corsair
  {
    id: 29,
    title: "The Silk Road Corsair",
    author: "Tariq Ibn Malik",
    coverImage: '/covers/whitechapel_alch.jpg',
    fallbackGradient: "from-amber-950 via-orange-950 to-stone-900",
    genre: "Action",
    tags: ["Historical Adventure", "Caravans", "Silk Road", "Desert Combat", "Lost Treasure"],
    status: "Ongoing",
    rating: 4.84,
    ratingCount: 1190,
    totalViews: "28.6K",
    viewCount: 28600,
    publishedYear: 2025,
    synopsis: "Guiding camel caravans across the treacherous Taklamakan desert, desert scout Tariq defends Persian silk convoys and uncovers a map to the buried city of Loulan.",
    chapters: generateNovelChapters(
      29,
      50,
      [
        "The Oasis of Dunhuang", "Scimitar in the Sand", "The Silk Merchant's Daughter", "The Black Flag Raiders",
        "The Salt Flat Ambush", "Water in the Golden Flagon", "The Buried Pillars of Loulan", "The Desert Treasure"
      ],
      {
        hero: "Scout Tariq",
        setting: "the Shifting Sands of the Taklamakan Desert",
        antagonist: "Bandit Chief Murad",
        artifact: "the Damascus Steel Scimitar"
      }
    )
  },

  // 19. Slice of Life: The Tea Master on the Astral Border
  {
    id: 30,
    title: "The Tea Master on the Astral Border",
    author: "Master Oakhaven",
    coverImage: '/covers/neon_samurai.jpg',
    fallbackGradient: "from-emerald-950 via-teal-950 to-amber-950",
    genre: "Fantasy",
    tags: ["Cozy Fantasy", "Tea Brewing", "Dimensional Travellers", "Wholesome", "Healing"],
    status: "Ongoing",
    rating: 4.96,
    ratingCount: 2100,
    totalViews: "58.4K",
    viewCount: 58400,
    publishedYear: 2026,
    synopsis: "At the crossroads where three dimensions converge, retired war hero Corin opens a tranquil tea house where demons, angels, and spacefarers sit together for a soothing brew.",
    chapters: generateNovelChapters(
      30,
      50,
      [
        "Steeping Starlight Leaves", "A Demon King Who Orders Jasmine", "The Weary Angel's Scone", "Rain on the Border Terrace",
        "The Interstellar Courier's Chai", "The Kettle That Never Cools", "A Conversation Across Dimensions", "Peace in the Porcelain Cup"
      ],
      {
        hero: "Master Corin",
        setting: "the Astral Border Teahouse",
        antagonist: "The Stress of the Multiverse",
        artifact: "the Celadon Clay Teapot"
      }
    )
  },

  // 20. Progression Fantasy: The Runecrafter's Foundry
  {
    id: 31,
    title: "The Runecrafter's Foundry",
    author: "Dennis Miller",
    coverImage: '/covers/necromancer_tea.jpg',
    fallbackGradient: "from-indigo-950 via-slate-900 to-cyan-950",
    genre: "Fantasy",
    tags: ["Rune Magic", "Magic Engineering", "Progression", "Apprenticeship", "Academy"],
    status: "Ongoing",
    rating: 4.87,
    ratingCount: 1680,
    totalViews: "44.9K",
    viewCount: 44900,
    publishedYear: 2026,
    synopsis: "In an academy where nobles cast flashly elemental spells, commoner Dennis discovers that inscribing circuit runes into granite bricks produces indestructible siege barriers.",
    chapters: generateNovelChapters(
      31,
      50,
      [
        "The Chipped Inscription Chisel", "The First Gravity Rune", "Noble Mockery at the Exam", "The Granite Brick Test",
        "Circuitry of Ancient Earth", "The Siege Defense Demonstration", "Runic Power Matrix", "Master of the Foundry"
      ],
      {
        hero: "Dennis",
        setting: "the Imperial Runecraft Academy",
        antagonist: "Lord Julian of House Solaris",
        artifact: "the Diamond-Tipped Inscription Stylus"
      }
    )
  }
];
