const fs = require('fs');
const path = require('path');

// 1. Update src/data/extendedNovelsData.ts
const extendedPath = path.join(__dirname, '../src/data/extendedNovelsData.ts');
let extendedContent = fs.readFileSync(extendedPath, 'utf8');

const extendedCovers = {
  12: '/covers/wandering_blacksmith.jpg',
  13: '/covers/herbalist_moon.jpg',
  14: '/covers/zero_mana_climber.jpg',
  15: '/covers/apocalypse_forge.jpg',
  16: '/covers/bone_carver.jpg',
  17: '/covers/sunken_citadel.jpg',
  18: '/covers/silicon_heartbeat.jpg',
  19: '/covers/europa_colony.jpg',
  20: '/covers/airship_odyssey.jpg',
  21: '/covers/raven_duke.jpg',
  22: '/covers/witch_northern_knight.jpg',
  23: '/covers/foggy_docks.jpg',
  24: '/covers/midnight_pawn.jpg',
  25: '/covers/drunken_sword.jpg',
  26: '/covers/iron_flute.jpg',
  27: '/covers/spatial_mage.jpg',
  28: '/covers/tower_babel_99.jpg',
  29: '/covers/whitechapel_alch.jpg',
  30: '/covers/neon_samurai.jpg',
  31: '/covers/necromancer_tea.jpg'
};

for (const [id, cover] of Object.entries(extendedCovers)) {
  const target = new RegExp(`(id:\\s*${id},\\s*[\\r\\n]+\\s*title:[^\\r\\n]+[\\r\\n]+\\s*author:[^\\r\\n]+)`, 'g');
  extendedContent = extendedContent.replace(target, `$1\n    coverImage: '${cover}',`);
}
fs.writeFileSync(extendedPath, extendedContent);
console.log('Inserted covers in extendedNovelsData.ts');

// 2. Update src/data/publicDomainNovelsData.ts
const pdPath = path.join(__dirname, '../src/data/publicDomainNovelsData.ts');
let pdContent = fs.readFileSync(pdPath, 'utf8');

const pdCovers = {
  101: '/covers/journey_west.jpg',
  102: '/covers/three_kingdoms.jpg',
  103: '/covers/water_margin.jpg',
  104: '/covers/investiture_gods.jpg',
  105: '/covers/strange_tales.jpg',
  106: '/covers/mountains_seas.jpg',
  107: '/covers/tale_of_genji.jpg',
  108: '/covers/eastern_zhou.jpg',
  109: '/covers/sworn_blades.jpg',
  110: '/covers/red_chamber.jpg',
  111: '/covers/monte_cristo.jpg',
  112: '/covers/don_quixote.jpg',
  113: '/covers/three_musketeers.jpg',
  114: '/covers/morte_darthur.jpg',
  115: '/covers/princess_of_mars.jpg',
  117: '/covers/time_machine.jpg'
};

for (const [id, cover] of Object.entries(pdCovers)) {
  const target = new RegExp(`(id:\\s*${id},\\s*[\\r\\n]+\\s*title:[^\\r\\n]+[\\r\\n]+\\s*author:[^\\r\\n]+)`, 'g');
  pdContent = pdContent.replace(target, `$1\n    coverImage: '${cover}',`);
}
fs.writeFileSync(pdPath, pdContent);
console.log('Inserted covers in publicDomainNovelsData.ts');
