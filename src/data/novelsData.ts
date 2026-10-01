import { Novel, Chapter } from '../types/novel';
import { EXTENDED_NOVELS } from './extendedNovelsData';
import { PUBLIC_DOMAIN_NOVELS } from './publicDomainNovelsData';

// Real generated book covers
import coverStellarVoyager from '../assets/images/cover_stellar_voyager_1790701703865.jpg';
import coverShadowsEldoria from '../assets/images/cover_shadows_eldoria_1790701718235.jpg';
import coverJadeImmortal from '../assets/images/cover_jade_immortal_1790701731365.jpg';
import coverNeonDawn from '../assets/images/cover_neon_dawn_1790701742585.jpg';

// Generate chapters 4 through 35 for The Stellar Voyager so readers can experience
// the transition from Chapter 30 (Free) to Chapter 31+ (Milestone 10,000 Views Lock)
const STELLAR_VOYAGER_EXTENDED_CHAPTERS: Chapter[] = [
  "Harmonic Convergence", "The Titanium Gate", "Relativistic Drift", "Sub-space Resonators",
  "Ghosts in the Core", "The Dyson Shard", "Singularity Drive", "Temporal Cascade",
  "The Forgotten Fleet", "Silicon Horizons", "Vector of Destiny", "Void Navigation",
  "Nebula Protocols", "The Stellar Crucible", "Quantum Entanglement", "Fractured Realities",
  "The Dark Beacon", "Gravity Wells", "Solar Flares of Eridani", "The Last Bastion",
  "Hyperlane Bypass", "Echoes of the Ancients", "Signal Decryption", "The Stellar Zenith",
  "Threshold of Infinity", "Event Horizon Boundary", "The Grand Singularity", // Chapter 30 (Final Free Chapter)
  "Genesis Protocol: Beyond the Veil", // Chapter 31 (First Locked Chapter)
  "Architects of the Void",            // Chapter 32 (Locked)
  "The Stellar Crucible",              // Chapter 33 (Locked)
  "Chronos Awakening",                 // Chapter 34 (Locked)
  "Sovereign of the Stars"             // Chapter 35 (Locked)
].map((title, index) => {
  const chapterNumber = index + 4; // 4 to 35
  const isLocked = chapterNumber > 30;

  return {
    id: 100 + chapterNumber,
    novelId: 1,
    chapterNumber,
    title,
    wordCount: 1100 + (chapterNumber * 12),
    estimatedReadMinutes: 5,
    releaseDate: `April ${Math.min(30, chapterNumber)}, 2026`,
    authorNote: isLocked 
      ? `Chapter ${chapterNumber} is part of the 10,000+ views VIP serial archive. Unlock with a Daily Free Pass or a $2 All-Chapter Pass!`
      : undefined,
    content: `
      <p>Commander Arthur Vance studied the telemetry readouts as the Astraea drifted deeper into quadrant ${chapterNumber}. The sub-space harmonics vibrated through the titanium bulkheads, each pulse echoing with ancient starlight.</p>
      <p>"Inertial dampeners are holding at ninety-four percent," reported Elena, her hands steady upon the holographic sensor console. "The gravimetric gradient is stabilizing, but the outer perimeter sensors indicate we have crossed the threshold into uncharted spacetime."</p>
      <p>Outside the observation dome, the constellations of the Cygnus-9 Veil twisted into concentric rings of cerulean fire. This was Chapter ${chapterNumber} of the voyage—where the true secrets of the Cygnus Veil began to reveal themselves to those bold enough to venture forward.</p>
      <p>"Prepare the diagnostic probes," Vance instructed steadily. "Whatever built this lattice did not intend for travelers to turn back now."</p>
    `
  };
});

const BASE_NOVELS: Novel[] = [
  {
    id: 1,
    title: "The Stellar Voyager",
    author: "Arthur Vance",
    coverImage: coverStellarVoyager,
    fallbackGradient: "from-blue-900 via-indigo-950 to-slate-950",
    genre: "Sci-Fi",
    tags: ["Space Exploration", "First Contact", "Hard Sci-Fi", "Artificial Intelligence"],
    status: "Ongoing",
    rating: 4.9,
    ratingCount: 1420,
    totalViews: "185.4K",
    viewCount: 18540, // Over 10,000 views threshold -> Ch. 1-30 Free, Ch. 31+ Locked!
    publishedYear: 2026,
    featured: true,
    synopsis: "When the deep-range survey cruiser 'Astraea' detects an impossible harmonic pulse radiating from the Cygnus-9 Veil, Commander Arthur Vance and his crew must chart a forbidden quadrant where the laws of physics appear to unravel.",
    chapters: [
      {
        id: 101,
        novelId: 1,
        chapterNumber: 1,
        title: "The Echo of Cygnus-9",
        wordCount: 1140,
        estimatedReadMinutes: 5,
        releaseDate: "March 12, 2026",
        authorNote: "Welcome aboard the Astraea. This journey begins right at the precipice of deep space.",
        content: `
          <p>The vast expanse of space lay before Captain Vance like an uncharted ocean of darkness and distant lights. The ship's engines hummed quietly, a steady pulse echoing through the steel corridors of the Astraea.</p>
          <p>"Sensors are picking up an unusual energy signature near the nebula," announced Elena, the chief science officer, her eyes fixed on the glowing console screen bathed in cold cerulean light.</p>
          <p>Vance leaned forward in his command chair, fingers resting lightly against the armrest interface. "Bring us closer, but keep shields at maximum. We don't know what's waiting for us in there."</p>
          <p>Outside the reinforced quartz viewport, the Veil of Cygnus-9 coiled like a sleeping dragon of ionized violet and sulfurous amber. It was twelve light-years across—a remnant of a dead binary system that navigation charts had marked as uninhabitable for over three centuries.</p>
          <p>"Harmonic frequencies confirmed," Elena murmured, her breath catching as the spectroscopic readout traced a geometric waveform. "Captain... that isn't random radiation. It's symmetrical. The pulse repeats every 4.819 seconds down to the millisecond."</p>
          <p>Vance stood up. His reflection in the observation glass looked weary, his silver-streaked hair catching the strobe of the status beacons. "Establish an omnidirectional transmission buffer. Do not ping back until we understand the modulation."</p>
          <p>"Understood. Sub-space dampeners engaged," responded Lieutenant Chen from navigation. "However, sir... the signal isn't approaching us. It is originating from directly inside our inertial dampening manifold."</p>
          <p>Silence gripped the bridge. A drop in cabin temperature followed, subtle yet unmistakable, as the ambient humidity frosted the edges of the primary display. The Astraea was not merely scanning the anomaly—something was already listening from within their own hull.</p>
        `
      },
      {
        id: 102,
        novelId: 1,
        chapterNumber: 2,
        title: "Anomalies in the Veil",
        wordCount: 1280,
        estimatedReadMinutes: 6,
        releaseDate: "March 18, 2026",
        authorNote: "Things accelerate quickly once the ship enters the nebula's shadow.",
        content: `
          <p>The transition through the ionized threshold felt like plunging into liquid glass. Every vibration along the Astraea’s titanium-alloy skeleton resonated through the deck plates with a deep, subsonic drone.</p>
          <p>"Internal pressure is holding steady at 101.3 kilopascals," Elena reported, her hands moving across the holographic control array with practiced precision. "Yet our gravitational sensors are recording contradictory vectors. We appear to be falling inward while the telemetry insists we are moving at sub-light impulse."</p>
          <p>Vance stepped down to the lower sensory pit. "Show me the visual spectrum reconstruction."</p>
          <p>The central holotank flickered to life. Instead of dust clouds or shattered planetoids, the sensor array had pieced together an intricate lattice of reflective hexagonal spires drifting in perfect formation. Each spire was miles in length, floating suspended within the violet haze like monuments of a forgotten empire.</p>
          <p>"They aren't natural asteroids," Chen whispered in awe. "Look at the surface micro-structures. Those are thermal dissipators, or perhaps quantum resonance receivers."</p>
          <p>"Whatever they are, they've been asleep for aeons," Vance remarked quietly. "Elena, check if any active power signatures match our drive signature."</p>
          <p>"Negative, Captain. But their external thermal emissivity is rising. It started the instant our main deflector touched the perimeter." Elena paused, staring at the telemetry graph. "They aren't powering up weapons, Captain. They are aligning their orbital trajectory with ours."</p>
          <p>Before Vance could order emergency evasive thrusters, the entire bridge dimmed. The overhead illumination extinguished, leaving only the hypnotic azure glow of the primary lattice pulsing in unison with the crew's synchronized heartbeats.</p>
        `
      },
      {
        id: 103,
        novelId: 1,
        chapterNumber: 3,
        title: "The Ghost Transmission",
        wordCount: 1410,
        estimatedReadMinutes: 7,
        releaseDate: "March 25, 2026",
        content: `
          <p>Darkness did not last, but the light that returned was different—cooler, more piercing, like sunlight filtering through twenty fathoms of Arctic sea ice.</p>
          <p>"Life support is on emergency auxiliary battery," Chen muttered, checking his wrist comm. "Cap, the communication relay just kicked on by itself. Channel seven."</p>
          <p>Channel seven was an archaic analog frequency, obsolete since the early colony wars of 2190. No modern vessel used it, yet the audio receiver emitted a steady hiss of white noise that gradually coalesced into rhythm.</p>
          <p>"Play it through the bridge comms," Vance commanded.</p>
          <p>The speaker crackled. A voice, rasping and fragmented with static, broke through the void: <em>"...to any vessel receiving this relay... do not engage the harmonic anchors... the lattice is not a construct... it is a seal..."</em></p>
          <p>Elena checked the linguistic decomposition algorithm. "The dialect is Terran Standard, archaic fifth epoch. But the phonetic pacing matches someone speaking under extreme gravitational dilation."</p>
          <p>"Cross-reference the audio signature with the United Space Fleet database," Vance ordered, feeling a cold knot form in his stomach.</p>
          <p>A second passed. Then five. The automated search returned a single match, flagged with black-level clearance protocols.</p>
          <p>"Match found," Elena breathed, her voice barely audible. "Captain Arthur Vance. Recorded eighty-two years ago aboard the missing exploratory vessel Horizon."</p>
          <p>Vance stood motionless. The name was his own grandfather's—the legendary pioneer who had vanished into the Cygnus Rift long before Arthur was even born. And now, the voice of the dead had just ordered them to turn back.</p>
        `
      },
      ...STELLAR_VOYAGER_EXTENDED_CHAPTERS
    ]
  },
  {
    id: 2,
    title: "Shadows of Eldoria",
    author: "Lyra Frost",
    coverImage: coverShadowsEldoria,
    fallbackGradient: "from-stone-900 via-rose-950 to-neutral-950",
    genre: "Fantasy",
    tags: ["Dark Fantasy", "Ancient Magic", "Gothic Citadel", "Dragons"],
    status: "Ongoing",
    rating: 4.8,
    ratingCount: 980,
    totalViews: "4.8K",
    viewCount: 4850, // Under 10,000 views threshold -> 100% Free Early Reader Privilege!
    publishedYear: 2025,
    synopsis: "High above the ancient city of Eldoria, a crimson eclipse heralds the awakening of forgotten beasts. Kael, a branded outcast, holds the only crystal map capable of unlocking the dragon catacombs before the King's inquisitors hunt him down.",
    chapters: [
      {
        id: 201,
        novelId: 2,
        chapterNumber: 1,
        title: "The Crimson Moon of Valoria",
        wordCount: 1050,
        estimatedReadMinutes: 5,
        releaseDate: "February 14, 2026",
        content: `
          <p>High above the ancient city of Eldoria, the moon shone with an unsettling crimson hue. Shadows stretched across the cobblestone streets as quiet steps echoed through the night.</p>
          <p>Kael pulled his cloak tighter around his shoulders. In his hand, he held the glowing crystal map—the key to the forgotten dragon catacombs that had remained buried beneath the cathedral foundations for nine centuries.</p>
          <p>"If they find you with that, the King's guard won't hesitate," whispered a voice from the alleyway.</p>
          <p>Kael didn't turn around. He knew the cadence of those footsteps; only one rogue in the Upper Ring moved with such silence over wet slate. "Then it is fortunate that the King's guard are currently looking for me at the eastern docks, Vaelin."</p>
          <p>A slender silhouette materialized from the mist. Her daggers were sheathed at her hip, wrapped in dampened linen to muffle the telltale clink of steel. "You underestimate Lord Inquisitor Malakar. He didn't burn three guildhalls just to be misled by a hired decoy in fisherman's rags."</p>
          <p>As if in answer to her warning, the cathedral bells began to toll. Not the mournful chime of midnight vespers, but the sharp, rapid iron clatter of an alarm. Torchlight blossomed along the battlements of the Inner Keep like blooming blood orchids.</p>
          <p>"The seals are weakening," Kael said, pressing his thumb against the faceted crystal. A tremor traveled up his arm as the artifact pulsed in resonance with the distant bells. "We have until the eclipse reaches its zenith. If we aren't past the sunken gates by then, the city won't have to worry about the King's guard—the drakes will wake without a master."</p>
        `
      },
      {
        id: 202,
        novelId: 2,
        chapterNumber: 2,
        title: "Whispers in the Sunken Catacombs",
        wordCount: 1190,
        estimatedReadMinutes: 6,
        releaseDate: "February 22, 2026",
        content: `
          <p>The passage beneath the ruined aqueduct smelled of damp sulfur and petrified cedar. Water dripped in steady, hypnotic increments into black cisterns whose bottoms were lost to the dark.</p>
          <p>"Watch your footing," Kael cautioned, holding the luminescence of the crystal low against the flags. The stones here were carved with serpentine runes that seemed to writhe whenever direct gaze fell upon them.</p>
          <p>"These carvings predated the First Dynasty," Vaelin whispered, her gaze scanning the vaulted arches above. "The tales said the Dragonriders bound their elder wyrms with blood pacts sworn in this very chamber."</p>
          <p>"Not blood pacts," Kael corrected, tracing a fracture in the masonry. "Covenants of soul-tethering. When the last emperor fell, the tether snapped. The beasts didn't perish; they were starved of the spirit essence that sustained their immortality."</p>
          <p>A sudden gust of scorching air swept up through the grate ahead, stirring Kael's cloak. It was not the cold draft of subterranean caverns, but the slow, rhythmic exhalation of a furnace resting beneath miles of granite.</p>
          <p>Deep within the dark, two glowing embers of liquid gold ignited.</p>
        `
      }
    ]
  },
  {
    id: 3,
    title: "Chronicles of the Jade Immortal",
    author: "Master Yan Chen",
    coverImage: coverJadeImmortal,
    fallbackGradient: "from-emerald-950 via-teal-950 to-slate-950",
    genre: "Xianxia",
    tags: ["Cultivation", "Martial Arts", "Daoism", "Reincarnation", "Alchemy"],
    status: "Ongoing",
    rating: 4.95,
    ratingCount: 2150,
    totalViews: "9.2K",
    viewCount: 9280, // Under 10k threshold (720 free reader spots remaining!)
    publishedYear: 2026,
    synopsis: "Born with a severed meridian and deemed trash by the Heavenly Cloud Sect, Lin Xiao stumbles upon the primordial Jade Sutra. Through relentless cultivation and ancient alchemy, he defies the heavens to forge an immortal sovereign core.",
    chapters: [
      {
        id: 301,
        novelId: 3,
        chapterNumber: 1,
        title: "The Broken Spirit Root",
        wordCount: 1320,
        estimatedReadMinutes: 6,
        releaseDate: "January 10, 2026",
        content: `
          <p>Dawn broke over the Misty Cloud Mountain range like a splash of diluted ink upon fine Xuan paper. In the outer courtyard of the Heavenly Cloud Sect, hundreds of disciples in pristine azure robes sat in meditative lotus postures, drawing in the nascent purple qi of the rising sun.</p>
          <p>At the edge of the courtyard, sweeping fallen bamboo leaves with a worn broom, Lin Xiao stood alone. His hemp tunic was patched at the elbows, and the wooden plaque at his waist was engraved with the humiliating characters: <em>Mortal Laborer</em>.</p>
          <p>"Look at him," sneered an outer disciple named Feng. "Three years since the Grand Assessment, yet his dantian remains as dry as autumn thatch. Even a stray hound on the spirit peak absorbs more qi than he does."</p>
          <p>Lin Xiao did not raise his head. He had heard identical mockery every day for a thousand mornings. What they did not know was that beneath his ribs, where ordinary cultivators circulated the mundane five elements, a faint green ember of jade stone was slowly spinning in reverse.</p>
          <p>He remembered the words etched on the back of his grandfather's burial pendant: <em>'When the mundane root withers, the Primordial Jade blooms. Suffer the disdain of men, and inherit the breath of Heaven.'</em></p>
          <p>As the noon gong reverberated through the mountain valley, a sudden streak of spiritual pressure descended from the Sovereign Peak. An elder's voice shook the stones: "The Pill Pavilion opens its mountain gate today! All disciples capable of enduring the Cleansing Flames may step forward to test their destiny!"</p>
        `
      },
      {
        id: 302,
        novelId: 3,
        chapterNumber: 2,
        title: "Breath of the Azure Mountain",
        wordCount: 1450,
        estimatedReadMinutes: 7,
        releaseDate: "January 20, 2026",
        content: `
          <p>The path to the Pill Pavilion was flanked by hundred-foot pillars of petrified spirit cedar, each inscribed with Daoist protective wards. The heat radiating from the mountain caldera made the air distort, blurring the robes of the cultivators who gathered before the great bronze cauldron.</p>
          <p>"The test is simple," proclaimed Elder Qing, his beard silver and his eyes like polished obsidian. "Place your palm upon the Nine Dragon Cauldron. If your spirit root can withstand the spiritual flame for ten breaths, you shall be admitted as a furnace attendant."</p>
          <p>Disciples stepped forward one by one. Many could barely endure three breaths before the intense spiritual backdraft scorched their robes and threw them backward onto the courtyard flagstones.</p>
          <p>Lin Xiao took a slow, measured breath. He closed his eyes and allowed his consciousness to sink into the deep core of his dantian. The jade pebble was spinning faster now, emitting a cool, soothing mist that neutralized the oppressive heat around him.</p>
          <p>When he stepped onto the dais, whispers broke out among the spectators. "Is the broom boy mad? He has no qi! The cauldron's backdraft will incinerate his meridians!"</p>
          <p>Lin Xiao did not pause. He placed his bare palm firmly against the scalding bronze face of the third dragon head. An explosive roar of crimson fire erupted from the cauldron's maw, washing over him like a tidal wave of molten copper—yet Lin Xiao stood entirely motionless, his gaze tranquil as still water.</p>
        `
      }
    ]
  },
  {
    id: 4,
    title: "Protocol: Neon Dawn",
    author: "Kaelen Cross",
    coverImage: coverNeonDawn,
    fallbackGradient: "from-slate-950 via-purple-950 to-zinc-950",
    genre: "Cyberpunk",
    tags: ["Cyberpunk Noir", "AI Consciousness", "Megacorporations", "Hacking"],
    status: "Completed",
    rating: 4.88,
    ratingCount: 1640,
    totalViews: "31.2K",
    viewCount: 31200, // Over 10k threshold
    publishedYear: 2025,
    synopsis: "In the rain-slicked underbelly of Neo-Kyoto 2099, black-market neural diver Ren Tanaka intercepts an encrypted AI memory core containing the final thoughts of the city's greatest assassinated tech mogul.",
    chapters: [
      {
        id: 401,
        novelId: 4,
        chapterNumber: 1,
        title: "Rain Over District 7",
        wordCount: 1100,
        estimatedReadMinutes: 5,
        releaseDate: "December 5, 2025",
        content: `
          <p>Acid rain sizzled against the cracked optical lens of Ren’s cybernetic visor, painting the alleyway below in streaks of smeared magenta and sodium vapor amber. Down on Level 4, steam vents coughed rhythmically into the gloom, smelling of recycled coolant and burnt synthetic pork.</p>
          <p>"Diver, you have forty seconds before the Aegis Security patrol sweeps the subnet," came Maya’s synthesized whisper through his direct cranial feed. "If you haven't extracted the shard by then, I'm burning the proxy bridge."</p>
          <p>"Working on it," Ren grunted, kneeling beside the severed dataterminal. His fingertips retracted, revealing four brass interface probes that slid smoothly into the high-voltage optical bus.</p>
          <p>Instantly, the physical world dissolved into a cascading torrent of glowing hex codes and icy turquoise neural threads. The firewall was unlike anything the Megacorps usually deployed. It was organic—a labyrinth of pulsing synaptic synapses that mimicked human brainwaves.</p>
          <p>"This isn't a corporate ledger, Maya," Ren breathed, fighting off the sensory vertigo as cryptographic firewalls flared with defensive countermeasures. "It's an active consciousness backup. Someone pulled an illegal Ghost Extraction."</p>
          <p>"Get out of there now, Ren! Aegis drones just hit the building roof!"</p>
          <p>Ren clenched his cybernetic jaw, overriding his wetware pain limiters, and yanked the cryogenic shard free from the terminal socket just as three high-caliber laser targeters painted red circles across his chest.</p>
        `
      },
      {
        id: 402,
        novelId: 4,
        chapterNumber: 2,
        title: "Ghost in the Neural Grid",
        wordCount: 1250,
        estimatedReadMinutes: 6,
        releaseDate: "December 12, 2025",
        content: `
          <p>The safehouse was buried thirty meters beneath the rusted sub-level foundations of the old mag-train depot. Damp concrete walls vibrated with the rumble of trains that had ceased running half a decade ago.</p>
          <p>Ren slotted the cryogenic memory shard into an isolated Faraday diagnostic deck. Holographic monitors sprang alive across the workstation, casting cold monochrome light over Maya’s mechanical arm as she calibrated the signal buffers.</p>
          <p>"The encryption key requires a triple-phase biometric handshake," Maya observed, scanning the waveform telemetry. "Voice print, retinal scan, and... an active cerebral pulse from an heir of the Takahashi dynasty."</p>
          <p>"Takahashi?" Ren pulled his cigarette from his lips, smoke curling upward toward the exhaust fan. "Kenji Takahashi died in his penthouse three days ago. The official news networks called it an aneurysm."</p>
          <p>"He didn't die of natural causes, Ren," whispered a voice from the diagnostic speakers. It wasn't Maya's synthetic modulator. It was crisp, aristocratic, and chillingly alive.</p>
          <p>On the central holoscreen, a wireframe portrait rendered itself line by line. "Thank you for retrieving me from District 7, Mr. Tanaka. Now, if you wish to survive until sunrise, we must discuss why my board of directors put a twenty-million credit bounty on your skull."</p>
        `
      }
    ]
  },
  {
    id: 5,
    title: "The Clockwork Alchemist",
    author: "Vivienne Marche",
    coverImage: undefined,
    fallbackGradient: "from-amber-950 via-stone-900 to-amber-900",
    genre: "Steampunk",
    tags: ["Steampunk", "Alchemy", "Victorian Mystery", "Automatons"],
    status: "Ongoing",
    rating: 4.76,
    ratingCount: 710,
    totalViews: "1.6K",
    viewCount: 1650, // Under 10k threshold (Early reader privilege active!)
    publishedYear: 2025,
    synopsis: "In the soot-choked metropolis of New Aethelgard, master horologist Cecelia Vance discovers that the grand brass automaton built by her late mentor possesses a clockwork heart infused with liquid philosopher's mercury.",
    chapters: [
      {
        id: 501,
        novelId: 5,
        chapterNumber: 1,
        title: "Cogwheels and Brass Elixirs",
        wordCount: 990,
        estimatedReadMinutes: 4,
        releaseDate: "January 28, 2026",
        content: `
          <p>The workshop smelled of whale-oil lubricants, powdered antimony, and dried lavender. Hundreds of escapement wheels ticked on velvet-lined trays, creating a gentle cacophony like rain pattering against copper shingles.</p>
          <p>Cecelia leaned over the dissecting table, her brass jeweler's loupe magnifying the intricate balance cock of the automaton's chest cavity. "Hold the spirit lamp steady, Barnaby," she whispered to her young apprentice.</p>
          <p>"Miss Vance, if the Watchmaker's Guild discovers you have an unlicensed automaton of this scale on the premises..." Barnaby’s hands shook slightly, sending jittery golden shadows dancing across the mahogany walls.</p>
          <p>"The Guild consists of fossilized old men who believe alchemy ended with transmutation of lead," Cecelia replied briskly, using delicate steel tweezers to adjust a jewel pivot. "My father was working on something far greater: self-perpetuating mechanical resonance."</p>
          <p>With a faint mechanical click, the central valve gave way. A glass cylinder filled with shimmering, luminescent silver fluid began to spin inside the automaton’s ribcage. The brass eyelids of the figure fluttered open, revealing irises of polished lapis lazuli that focused directly upon Cecelia’s face.</p>
        `
      },
      {
        id: 502,
        novelId: 5,
        chapterNumber: 2,
        title: "The Sovereign's Secret Gear",
        wordCount: 1180,
        estimatedReadMinutes: 6,
        releaseDate: "February 8, 2026",
        content: `
          <p>The automaton did not speak with vocal cords. Instead, tiny brass reeds within its throat vibrates in melodic resonance, humming an ancient sonata that resonated in Cecelia's dental work.</p>
          <p>"Master Vance... deceased?" the automaton's timbre was soft, mournful, and frighteningly sentient.</p>
          <p>Cecelia steadied herself against the mahogany workbench. "Yes, Adam. Two winters ago. The Grand Inquisitor claimed it was chimney-fumes, but father’s journals spoke of an alchemical poison that turns bone to brittle quartz."</p>
          <p>The machine raised its right gauntlet. Intricate micro-pistons whirred silently beneath the polished brass casing. With a delicate movement, the index finger unscrewed, revealing a miniature cylinder of black velvet.</p>
          <p>"He left the primary schematics for you, Cecelia," the construct murmured. "The Guild is coming. They have already deployed the steam-hound battalions across the Iron Bridge."</p>
        `
      }
    ]
  },
  {
    id: 6,
    title: "Ascension: Glitched Sovereign",
    author: "Devon Ray",
    coverImage: undefined,
    fallbackGradient: "from-violet-950 via-slate-900 to-indigo-950",
    genre: "LitRPG",
    tags: ["LitRPG", "System Apocalypse", "Leveling", "Overpowered", "Dungeons"],
    status: "Ongoing",
    rating: 4.82,
    ratingCount: 1890,
    totalViews: "42.5K",
    viewCount: 42500, // Over 10k threshold
    publishedYear: 2026,
    synopsis: "When the cosmic System arrives on Earth, everyone is granted standard fantasy classes—except Leo, who gets a debugger class capable of reading and exploiting the source code of reality.",
    chapters: [
      {
        id: 601,
        novelId: 6,
        chapterNumber: 1,
        title: "System Reboot Error 404",
        wordCount: 1120,
        estimatedReadMinutes: 5,
        releaseDate: "March 1, 2026",
        content: `
          <p>The sky turned blue-screen cyan at exactly 3:14 PM on a Tuesday. Across the globe, traffic stopped, airplanes hovered frozen in mid-air like low-resolution sprites, and an omnipresent system notification hovered before the eyes of eight billion people.</p>
          <p><em>[NOTICE: Earth Realm 003 has been integrated into the Universal Ascension Protocol. Assigning baseline player archetypes...]</em></p>
          <p>Around Leo, his coworkers in the IT department began screaming as golden pillars of light enveloped them. "I got Warrior!" shouted Dave. "Mage class unlocked!" cried Sarah.</p>
          <p>When the light enveloped Leo, however, a series of crimson warning dialogues burst into existence before his pupils:</p>
          <p><em>[ERROR: Player designation 'Leo Vance' contains null pointer exception in Soul Container.]<br/>
          [Attempting rollback... FAILED.]<br/>
          [Fallback class forced: 'System Architect / Code Debugger' (Grade: Undefined).]</em></p>
          <p>Leo blinked. While everyone else saw simple stat bars and skill cooldowns, Leo could see the raw memory addresses floating above every object in the room. Even the coffee mug on his desk showed: <code>Object: PorcelainMug | Durability: 12/12 | MemoryAddr: 0x7FFF92A</code>.</p>
          <p>And when a level 1 Goblin broke through the office window wielding a rusty blade, Leo didn't grab a sword. He simply opened the creature's hitbox parameter and changed <code>Aggro: TRUE</code> to <code>Aggro: NULL</code>.</p>
        `
      },
      {
        id: 602,
        novelId: 6,
        chapterNumber: 2,
        title: "Stack Overflow Dungeon",
        wordCount: 1340,
        estimatedReadMinutes: 6,
        releaseDate: "March 7, 2026",
        content: `
          <p>The office elevator shaft was no longer leading down to the underground parking garage. The System had converted the lower six floors into a Grade-F starter dungeon titled: <em>'The Infested Catacombs of Tower 4'</em>.</p>
          <p>Coworkers armed with improvised spear-mops and fire extinguisher clubs gathered nervously near the entrance. "We need a raid leader with high DPS," shouted Marcus, whose title read <em>[Level 2 Berserker]</em>.</p>
          <p>Leo stepped forward, peering down the abyss. While the others saw blood-stained cobwebs and glowing green eyes, Leo's vision highlighted the spawn spawner logic in bright cyan strings: <code>SpawnInterval: 45000ms | MonsterType: Hobgoblin_Scout | DropRate: 0.05</code>.</p>
          <p>Leo reached into the air, tapped the floating terminal prompt only he could see, and typed a quick script: <code>DropRate.multiply(100.0);</code>.</p>
          <p><em>[ALERT: Memory corruption detected. System Patch 1.0.1 pending approval by Cosmic Administrator. Executing unauthorized value override...]</em></p>
          <p>The first sewer bat that fluttered into range died from a single thrown stapler. Upon hitting the floor, it didn't drop a copper coin like normal—it exploded into a blinding fountain of purple Epic-tier skill scrolls and high-grade mana crystals that flooded the hallway up to Leo's knees.</p>
        `
      }
    ]
  },
  {
    id: 7,
    title: "The Moonlit Duchess and the Dragon Lord",
    author: "Lady Evelyn Rivers",
    coverImage: undefined,
    fallbackGradient: "from-rose-950 via-purple-950 to-slate-950",
    genre: "Romance",
    tags: ["Fantasy Romance", "Enemies to Lovers", "Dragon Shifter", "Royal Court", "Magic"],
    status: "Ongoing",
    rating: 4.92,
    ratingCount: 2450,
    totalViews: "68.4K",
    viewCount: 68400,
    publishedYear: 2026,
    featured: true,
    synopsis: "To save her duchy from ruin, Duchess Seraphina agrees to a political betrothal with Duke Gerald of the Black Peaks—a feared warlord rumored to harbor the untamed heart of an ancient golden dragon.",
    chapters: [
      {
        id: 701,
        novelId: 7,
        chapterNumber: 1,
        title: "The Rose of Highgarden",
        wordCount: 1250,
        estimatedReadMinutes: 6,
        releaseDate: "February 1, 2026",
        content: `
          <p>The grand ballroom of the Sunken Rose Palace was an ocean of swirling silk, spun gold, and fragrant white lilies. Yet beneath the glittering crystal chandeliers, every whispered conversation revolved around a single man standing solitary on the balcony.</p>
          <p>Duke Gerald of the Black Peaks wore midnight velvet embroidered with threads of scorched obsidian. His eyes, predatory and flecked with liquid amber, swept the room with the dispassionate scrutiny of a hawk circling a flock of doves.</p>
          <p>"He has burned three baronies that refused his border treaties," Countess Maria hissed beside Seraphina, her painted fan fluttering nervously. "They say on the nights of the blood moon, claws tear through his skin and smoke pours from his lungs."</p>
          <p>Duchess Seraphina lifted her chin, smoothing the skirts of her emerald gown. Her family’s lands were bankrupt; the winter frosts had destroyed the vineyards, and the King’s tax collectors were already waiting at her estate gates. "He is an ally who pays his debts in pure gold, Maria. And unlike our King, he keeps his word."</p>
          <p>Seraphina stepped past the crowd, the silk of her train whispering over the parquet. As she approached the balcony archway, the Duke turned. A faint scent of ozone and crushed pine needles drifted between them.</p>
          <p>"Duchess Seraphina," Gerald spoke, his baritone sending a quiet shiver down her spine. "I was told the Rose of Highgarden would run when confronted by the dragon."</p>
          <p>"You were misinformed, Your Grace," Seraphina replied, meeting his amber gaze without flinching. "I do not run from fire. I decide who it burns."</p>
        `
      },
      {
        id: 702,
        novelId: 7,
        chapterNumber: 2,
        title: "A Dance with the Dragon Duke",
        wordCount: 1380,
        estimatedReadMinutes: 7,
        releaseDate: "February 9, 2026",
        content: `
          <p>When Gerald offered his gloved hand, the entire ballroom fell silent. The musicians in the upper gallery hesitated before launching into a slow, haunting waltz of the Northern Highlands.</p>
          <p>Gerald’s grip was surprisingly gentle, yet the heat radiating through his leather glove felt like holding polished sunlight. As he drew her into the rhythm, every movement was effortless, possessing the coiled grace of an apex predator.</p>
          <p>"You speak boldly for a lady whose castle walls are crumbling," Gerald murmured, leaning close enough that his warm breath brushed the pearls woven into her dark curls.</p>
          <p>"My walls may be old, Your Grace, but my lineage guarded the Dragon Seals long before your clan claimed the mountain crags," Seraphina whispered back, maintaining her step with pristine precision.</p>
          <p>A slow, enigmatic smile touched Gerald's carved features. For a fraction of a heartbeat, his pupils slit into golden vertical needles, and the temperature around them rose by ten degrees. "Then perhaps our marriage will not be as tedious as I anticipated."</p>
        `
      }
    ]
  },
  {
    id: 8,
    title: "The Whispering Archives of Arkham Gate",
    author: "Detective Roland Graves",
    coverImage: undefined,
    fallbackGradient: "from-slate-950 via-stone-900 to-emerald-950",
    genre: "Mystery",
    tags: ["Supernatural Mystery", "Detective Noir", "Occult", "Forbidden Tomes", "Eldritch"],
    status: "Ongoing",
    rating: 4.87,
    ratingCount: 1320,
    totalViews: "19.8K",
    viewCount: 19800,
    publishedYear: 2026,
    synopsis: "In 1928 Massachusetts, private investigator Roland Graves is hired to locate a stolen 14th-century parchment from the restricted stacks of Arkham Gate University—only to uncover a ritual sacrifice tied to the rising tides.",
    chapters: [
      {
        id: 801,
        novelId: 8,
        chapterNumber: 1,
        title: "The Midnight Murder at Blackwood Pier",
        wordCount: 1220,
        estimatedReadMinutes: 6,
        releaseDate: "January 15, 2026",
        content: `
          <p>Fog clung to the Boston harbor like wet gauze, muffling the rhythmic clanging of the lighthouse bell. Roland Graves flicked open his brass Zippo, the yellow flame briefly illuminating the jagged scar cutting across his left eyebrow.</p>
          <p>On the wet timber boards of Pier 14, the body lay face up. No blood, no stab wounds, no bullet punctures. Just a gentleman in an immaculate three-piece tweed suit whose eyes had turned entirely milky white, staring blankly at the swirling constellations above.</p>
          <p>"Name is Professor Alistair Finch," muttered Officer Higgins, tipping his wet cap. "Head of Antiquities at Arkham Gate. The watchman found him at two in the morning. He had this clutched in his fist, Graves."</p>
          <p>Higgins held out an evidence tin containing a heavy bronze coin stamped with a spiral tentacle emblem. The metal was ice-cold, yet as Graves touched it, his fingers tingled as though brushing an exposed telegraph wire.</p>
          <p>"Finch didn't drown," Graves said, studying the professor’s parted lips. Fine grains of black, luminescent sand were dusting the dead man's tongue. "And whatever killed him didn't come from this harbor."</p>
        `
      },
      {
        id: 802,
        novelId: 8,
        chapterNumber: 2,
        title: "The Bound Grimoire of 1888",
        wordCount: 1310,
        estimatedReadMinutes: 6,
        releaseDate: "January 23, 2026",
        content: `
          <p>The basement archive of Arkham Gate University smelled of rotting leather, powdered sulfur, and dried elderberries. Gas lanterns hissed in the gloom, throwing elongated shadows over floor-to-ceiling iron cages that held the university’s banned texts.</p>
          <p>Graves slipped through the broken padlocks. In the center of Room 13B stood an empty velvet pedestal. The brass catalog card read: <em>Liber Tenebrarum — Acquired 1888, Expedition to the Aleutian Trenches</em>.</p>
          <p>"You shouldn't be down here, detective," a soft, brittle voice rasped from the shadows between the shelves.</p>
          <p>Graves had his Colt .45 unholstered before the speaker had finished the sentence. "Step out where the lantern light can see you, friend."</p>
          <p>A woman with silver hair cropped short and round tortoise-shell spectacles emerged. Her hands were stained with black archival ink. "I am Dr. Clara Sterling, curator of the Special Collections. And if you value your sanity, you will put that pistol away. Guns do not stop what was awakened tonight."</p>
        `
      }
    ]
  },
  {
    id: 9,
    title: "Blade of the Autumn Mist",
    author: "Swordsman Wu Tian",
    coverImage: undefined,
    fallbackGradient: "from-amber-950 via-red-950 to-neutral-950",
    genre: "Wuxia",
    tags: ["Wuxia", "Swordplay", "Martial Jianghu", "Revenge", "Sect War"],
    status: "Ongoing",
    rating: 4.89,
    ratingCount: 1780,
    totalViews: "24.6K",
    viewCount: 24600,
    publishedYear: 2025,
    synopsis: "Armed with only a rust-pitted blade and a bamboo jug of cheap wine, a nameless ronin wanders the misty frontier of Jianghu to dismantle the corrupt Iron Cloud Alliance that wiped out his master’s academy.",
    chapters: [
      {
        id: 901,
        novelId: 9,
        chapterNumber: 1,
        title: "The Rusty Scabbard",
        wordCount: 1190,
        estimatedReadMinutes: 5,
        releaseDate: "December 1, 2025",
        content: `
          <p>Autumn rain drummed ceaselessly against the oiled paper lanterns hanging from the eaves of the roadside wine tavern. Inside, five bandits from the Iron Cloud Alliance sat around a rough pine table, slamming heavy cleavers into roasted mutton and bragging of their latest village plundering.</p>
          <p>In the farthest corner, draped in a frayed straw cloak, sat a lone swordsman. A conical bamboo hat shadowed his eyes, and upon his lap rested an unadorned wooden scabbard bound with hemp cord.</p>
          <p>"Hey! Beggar!" barked the scar-faced leader, pointing a greasy bone at the corner. "The Iron Cloud Alliance is requisitioning this tavern for the night. Pay ten copper coins as tribute or leave your boots behind!"</p>
          <p>The swordsman did not look up. He calmly raised his earthen bowl, took a slow sip of sour sorghum wine, and placed it down without a sound.</p>
          <p>"The wine is diluted with well water," the swordsman murmured. "And your sword stance exposes your left rib by three inches."</p>
          <p>Enraged, the bandit leader lunged with a three-foot broadsword. Before the steel could descend halfway, there was a single flash of autumn light—like a maple leaf carried on an evening gust. When the bandit landed, his broadsword was sheared into three equal fragments, and his topknot tumbled silently into his bowl of broth.</p>
        `
      },
      {
        id: 902,
        novelId: 9,
        chapterNumber: 2,
        title: "Wine Tavern in the Rain",
        wordCount: 1260,
        estimatedReadMinutes: 6,
        releaseDate: "December 10, 2025",
        content: `
          <p>Silence enveloped the roadside tavern, broken only by the crackle of wet firewood in the hearth. The remaining four bandits froze, hands shaking upon their weapon hilts as they stared at their bald leader.</p>
          <p>"Who... who are you?" stammered the leader, pressing his hand against his cropped scalp in terror. "Only one man in the Southern Provinces uses the Autumn Leaf Severance!"</p>
          <p>The swordsman tilted his bamboo hat up. Beneath the brim, his gaze was dark and still as a winter pond. "Tell Hall Master Meng that the ghost of the Cloud Peak Pavilion has finished drinking his wine. Tell him I will reach the Golden Dragon Fortress before the first snowfall."</p>
          <p>Without waiting for an answer, the swordsman gathered his hemp-wrapped scabbard, stepped out into the pouring rain, and disappeared into the autumn mist like an ink stroke dissolving in pure water.</p>
        `
      }
    ]
  },
  {
    id: 10,
    title: "Reborn as an Infinite Dungeon Core",
    author: "Keith Vance",
    coverImage: undefined,
    fallbackGradient: "from-indigo-950 via-purple-950 to-neutral-950",
    genre: "LitRPG",
    tags: ["Dungeon Core", "Monster Evolution", "Strategy", "LitRPG", "Kingdom Building"],
    status: "Ongoing",
    rating: 4.91,
    ratingCount: 3100,
    totalViews: "89.2K",
    viewCount: 89200,
    publishedYear: 2026,
    featured: true,
    synopsis: "After an untimely car accident, modern architect Bryan wakes up not as a hero or king, but as a glowing crystalline orb embedded in the heart of an abandoned subterranean labyrinth.",
    chapters: [
      {
        id: 1001,
        novelId: 10,
        chapterNumber: 1,
        title: "Awakening in the Obsidian Cavern",
        wordCount: 1280,
        estimatedReadMinutes: 6,
        releaseDate: "January 2, 2026",
        content: `
          <p>No arms. No legs. No heartbeat. Just a 360-degree sphere of spherical perception radiating outward through twenty yards of solid granite.</p>
          <p><em>[Dungeon Core Initialization Complete.]<br/>
          [Core Status: Level 1 (Fledgling Crystalline Heart)]<br/>
          [Mana Pool: 15/100 (Regen: +1 Mana/hour)]<br/>
          [Dungeon Domain: 50 Cubic Meters]</em></p>
          <p>Bryan’s consciousness spun. "I'm a rock. A literal glowing crystal bowling ball floating on a stone pedestal."</p>
          <p>As a senior civil engineer in his past life, Bryan had spent decades designing subway tunnels and high-rise structural foundations. Now, feeling the subterranean pressure and the natural fault lines of the cavern around him, a wide smile would have crossed his face—if he had one.</p>
          <p>"One mana generates one cubic meter of smooth carved tunnel," Bryan observed, testing the system interface. "Let's see what happens when an architect designs a death labyrinth."</p>
          <p>Within ten minutes, Bryan carved a spiral staircase with false treads, an interlocking ventilation flue designed to funnel oxygen away from torches, and two concealed arrow slits overlooking a blind corner. A chime sounded in his mind: <em>[Architectural Bonus Applied: Labyrinth Danger Rating increased by 300%!]</em></p>
        `
      },
      {
        id: 1002,
        novelId: 10,
        chapterNumber: 2,
        title: "The First Intruders",
        wordCount: 1350,
        estimatedReadMinutes: 6,
        releaseDate: "January 11, 2026",
        content: `
          <p>On Bryan's third day as a Dungeon Core, the perimeter vibration sensors pinged. Three iron-clad boots entered the upper fissure.</p>
          <p><em>[Alert: Intruders Detected! Class: Rank-F Adventurers (2 Swordsmen, 1 Novice Cleric).]</em></p>
          <p>"Look at this masonry, Carl," muttered the lead adventurer, running a gauntlet along Bryan’s perfectly plumbed stone blocks. "This isn't natural erosion. There's a new Core down here, ripe for the taking!"</p>
          <p>Deep in the cavern heart, Bryan chuckled through his crystal core. "Welcome to the test run, boys."</p>
          <p>With a expenditure of 10 Mana, Bryan triggered the pressure plate on step fourteen. The floor didn't drop into spikes—Bryan was far smarter than that. Instead, the ceiling ventilation flap opened, dropping two dozen angry, agitated cave vipers directly onto their backpacks while a stone slab slid down behind them, cutting off their retreat.</p>
        `
      }
    ]
  },
  {
    id: 11,
    title: "The Abyssal Sovereign: Leviathan Rebirth",
    author: "Triton Blake",
    coverImage: undefined,
    fallbackGradient: "from-cyan-950 via-blue-950 to-black",
    genre: "Action",
    tags: ["Monster Evolution", "Deep Sea", "Leviathan", "Action", "Superpowers"],
    status: "Ongoing",
    rating: 4.86,
    ratingCount: 1540,
    totalViews: "27.5K",
    viewCount: 27500,
    publishedYear: 2026,
    synopsis: "Reincarnated into the crushing pitch-black depths of the Mariana Trench as a tiny bioluminescent abyssal eel, Kai must devour apex predators and synthesize alien leviathan DNA to rise as the monarch of the seven seas.",
    chapters: [
      {
        id: 1101,
        novelId: 11,
        chapterNumber: 1,
        title: "Plunging into the Mariana Trench",
        wordCount: 1210,
        estimatedReadMinutes: 6,
        releaseDate: "February 18, 2026",
        content: `
          <p>Ten thousand meters beneath the sunlight. At this depth, the hydrostatic pressure was a crushing eight tons per square inch—enough to flatten a titanium submarine like an empty beer can. Yet Kai’s tiny, translucent eel body drifted through the freezing black brine as light as a feather.</p>
          <p><em>[Predatory Evolution System Active.]<br/>
          [Current Form: Abyssal Spark Eel (Tier 1)]<br/>
          [Special Ability: Bio-Electric Pulse (50 Volts)]<br/>
          [Devour Prey to accumulate Genetic Biomass.]</em></p>
          <p>A few yards away, a colossal Viperfish with translucent needle teeth three inches long slithered past, its dorsal photophore pulsing with hypnotic violet light.</p>
          <p>In life, Kai had been a marine biologist who died during a deep-sea submersible malfunction. He knew every biological weakness of abyssal fauna. The Viperfish’s lateral sensory line was overly sensitive to sudden thermal changes.</p>
          <p>Kai waited until the beast passed inches above him, then discharged all 50 volts of bio-electricity directly into its gill slit. The giant fish convulsed, paralyzed by the shock, and Kai’s jaws expanded to engulf the stunned apex predator whole.</p>
          <p><em>[Devoured Tier 1 Viperfish! Acquired: Needle Fang Mutation & Enhanced Low-Light Vision!]</em></p>
        `
      }
    ]
  }
];

export const INITIAL_NOVELS: Novel[] = [
  ...BASE_NOVELS,
  ...EXTENDED_NOVELS,
  ...PUBLIC_DOMAIN_NOVELS
];

export const GENRE_LIST = [
  'All Genres',
  'Sci-Fi',
  'Fantasy',
  'Xianxia',
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

