const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/data/extendedNovelsData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace top import
content = content.replace(
  "import { Novel, Chapter } from '../types/novel';",
  "import { Novel, Chapter } from '../types/novel';\nimport { generateUniqueChapterTitle } from '../utils/narrativeGenerator';"
);

// Replace generateNovelChapters function
const oldFuncRegex = /function generateNovelChapters\([\s\S]*?return chapters;\s*\}/;

const newFunc = `function generateNovelChapters(
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
      contentSnippet = \`
        <p>The dawn wind carried the familiar scent of \${themeKeywords.setting}, cold and sharp against \${themeKeywords.hero}'s worn mantle. Each step along the winding perimeter revealed traces of ancient power long thought lost to history.</p>
        <p>"Do you believe the records?" asked the companion, eyes scanning the mist-covered ridge where \${themeKeywords.antagonist} was said to have first mobilized.</p>
        <p>\${themeKeywords.hero} adjusted the grip on \${themeKeywords.artifact}. "Records can be burned or forged by victors. But the stone remembers, and the resonance in this ground does not lie."</p>
        <p>Deep within the shadows, an ancient mechanism shuddered into life. Chapter \${i} of their journey had begun, and turning back was no longer an option.</p>
      \`;
    } else if (arc === 'mid') {
      contentSnippet = \`
        <p>The confrontation in the heart of \${themeKeywords.setting} had left deep scars in the surrounding terrain. \${themeKeywords.hero} knelt to examine the fracture line where energy from \${themeKeywords.artifact} had collided with the void.</p>
        <p>"The threshold is unstable," the scout warned, hands trembling upon the perimeter ward. "If the seals break before midnight, \${themeKeywords.antagonist} will break through the third barrier without opposition."</p>
        <p>"Then we do not wait for midnight," \${themeKeywords.hero} replied steadily. "Circulate the inner energy. Every breath taken here must be counted toward the final breakthrough."</p>
        <p>A wave of concentrated power washed through the corridor, illuminating forgotten sigils that glowed in unison with their synchronized pulse.</p>
      \`;
    } else {
      contentSnippet = \`
        <p>Silence hung heavy over the ruins of \${themeKeywords.setting}. In the distance, the grand apex loomed against a sky sheared in half by celestial energy. This was the pinnacle of \${themeKeywords.hero}'s long crusade.</p>
        <p>Before them stood \${themeKeywords.antagonist}, surrounded by an aura of primordial authority that distorted the very air. "You have climbed far from humble beginnings," the adversary intoned, voice resonating like tolling bronze.</p>
        <p>\${themeKeywords.hero} raised \${themeKeywords.artifact}, its crystalline facets shining with the gathered willpower of a hundred trials. "I did not climb to take your throne. I climbed to ensure no master ever stands upon this realm again."</p>
        <p>With a thunderous clash that split the firmament, the final trial of Chapter \${i} commenced.</p>
      \`;
    }

    chapters.push({
      id: novelId * 1000 + i,
      novelId,
      chapterNumber: i,
      title,
      wordCount,
      estimatedReadMinutes: readMinutes,
      releaseDate: \`2026-03-\${((i % 28) + 1).toString().padStart(2, '0')}\`,
      authorNote: isLockedMilestone
        ? \`Chapter \${i}: VIP serialization milestone (Unlock with Daily Free Pass or VIP Pass)\`
        : undefined,
      content: contentSnippet.trim(),
    });
  }

  return chapters;
}`;

content = content.replace(oldFuncRegex, newFunc);
fs.writeFileSync(targetFile, content);
console.log('Successfully upgraded extendedNovelsData.ts with 250 chapters per novel!');
