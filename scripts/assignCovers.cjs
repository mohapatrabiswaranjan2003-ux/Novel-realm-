const fs = require('fs');
const path = require('path');

// 1. Update src/data/novelsData.ts
const novelsDataPath = path.join(__dirname, '../src/data/novelsData.ts');
let novelsDataContent = fs.readFileSync(novelsDataPath, 'utf8');

const baseMappings = [
  { id: 5, cover: '/covers/clockwork_alchemist.jpg' },
  { id: 6, cover: '/covers/glitched_sovereign.jpg' },
  { id: 7, cover: '/covers/moonlit_duchess.jpg' },
  { id: 8, cover: '/covers/whispering_archives.jpg' },
  { id: 9, cover: '/covers/blade_autumn_mist.jpg' },
  { id: 10, cover: '/covers/infinite_dungeon.jpg' },
  { id: 11, cover: '/covers/abyssal_sovereign.jpg' },
];

baseMappings.forEach(({ id, cover }) => {
  const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?coverImage:\\s*)undefined`, 'm');
  novelsDataContent = novelsDataContent.replace(regex, `$1'${cover}'`);
});
fs.writeFileSync(novelsDataPath, novelsDataContent);
console.log('Updated novelsData.ts');

// 2. Update src/data/extendedNovelsData.ts
const extendedPath = path.join(__dirname, '../src/data/extendedNovelsData.ts');
let extendedContent = fs.readFileSync(extendedPath, 'utf8');

const extendedMappings = [
  { id: 12, cover: '/covers/wandering_blacksmith.jpg' },
  { id: 13, cover: '/covers/herbalist_moon.jpg' },
  { id: 14, cover: '/covers/zero_mana_climber.jpg' },
  { id: 15, cover: '/covers/apocalypse_forge.jpg' },
  { id: 16, cover: '/covers/bone_carver.jpg' },
  { id: 17, cover: '/covers/sunken_citadel.jpg' },
  { id: 18, cover: '/covers/silicon_heartbeat.jpg' },
  { id: 19, cover: '/covers/europa_colony.jpg' },
  { id: 20, cover: '/covers/airship_odyssey.jpg' },
  { id: 21, cover: '/covers/raven_duke.jpg' },
  { id: 22, cover: '/covers/witch_northern_knight.jpg' },
  { id: 23, cover: '/covers/foggy_docks.jpg' },
  { id: 24, cover: '/covers/midnight_pawn.jpg' },
  { id: 25, cover: '/covers/drunken_sword.jpg' },
  { id: 26, cover: '/covers/iron_flute.jpg' },
  { id: 27, cover: '/covers/spatial_mage.jpg' },
  { id: 28, cover: '/covers/tower_babel_99.jpg' },
  { id: 29, cover: '/covers/whitechapel_alch.jpg' },
  { id: 30, cover: '/covers/neon_samurai.jpg' },
  { id: 31, cover: '/covers/necromancer_tea.jpg' }
];

extendedMappings.forEach(({ id, cover }) => {
  const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?coverImage:\\s*)undefined`, 'm');
  extendedContent = extendedContent.replace(regex, `$1'${cover}'`);
});
fs.writeFileSync(extendedPath, extendedContent);
console.log('Updated extendedNovelsData.ts');

// 3. Update src/data/publicDomainNovelsData.ts
const pdPath = path.join(__dirname, '../src/data/publicDomainNovelsData.ts');
let pdContent = fs.readFileSync(pdPath, 'utf8');

const pdMappings = [
  { id: 101, cover: '/covers/journey_west.jpg' },
  { id: 102, cover: '/covers/three_kingdoms.jpg' },
  { id: 103, cover: '/covers/water_margin.jpg' },
  { id: 104, cover: '/covers/investiture_gods.jpg' },
  { id: 105, cover: '/covers/strange_tales.jpg' },
  { id: 106, cover: '/covers/mountains_seas.jpg' },
  { id: 107, cover: '/covers/tale_of_genji.jpg' },
  { id: 108, cover: '/covers/eastern_zhou.jpg' },
  { id: 109, cover: '/covers/sworn_blades.jpg' },
  { id: 110, cover: '/covers/red_chamber.jpg' },
  { id: 111, cover: '/covers/monte_cristo.jpg' },
  { id: 112, cover: '/covers/don_quixote.jpg' },
  { id: 113, cover: '/covers/three_musketeers.jpg' },
  { id: 114, cover: '/covers/morte_darthur.jpg' },
  { id: 115, cover: '/covers/princess_of_mars.jpg' },
  { id: 117, cover: '/covers/time_machine.jpg' }
];

pdMappings.forEach(({ id, cover }) => {
  const regex = new RegExp(`(id:\\s*${id},[\\s\\S]*?coverImage:\\s*)undefined`, 'm');
  pdContent = pdContent.replace(regex, `$1'${cover}'`);
});
fs.writeFileSync(pdPath, pdContent);
console.log('Updated publicDomainNovelsData.ts');
console.log('All novel covers linked successfully!');
