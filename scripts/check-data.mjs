// Fails if data/picks.json is out of step with js/picks.mjs, e.g. a pick
// was added or edited without re-running `node scripts/locate.mjs`.

import { readFile } from 'node:fs/promises';
import { PICKS, WALKS } from '../js/picks.mjs';

const { picks, walks } = JSON.parse(await readFile(new URL('../data/picks.json', import.meta.url), 'utf8'));
const problems = [];

const built = new Map(picks.map(p => [p.id, p]));
for (const p of PICKS) {
    const b = built.get(p.id);
    if (!b) { problems.push(`${p.id}: missing from data/picks.json`); continue; }
    for (const key of ['name', 'why', 'tip', 'caution', 'confidence', 'address']) {
        if ((b[key] ?? null) !== (p[key] ?? null)) problems.push(`${p.id}: "${key}" differs`);
    }
    if (JSON.stringify(b.evidence) !== JSON.stringify(p.evidence)) problems.push(`${p.id}: evidence differs`);
}
for (const id of built.keys()) if (!PICKS.some(p => p.id === id)) problems.push(`${id}: no longer in js/picks.mjs`);

const builtWalks = new Map(walks.map(w => [w.id, w]));
for (const w of WALKS) {
    const b = builtWalks.get(w.id);
    if (!b) { problems.push(`${w.id}: missing`); continue; }
    if (b.pitch !== w.pitch || b.when !== w.when || b.name !== w.name || (b.effort ?? null) !== (w.effort ?? null)) problems.push(`${w.id}: text differs`);
    if (JSON.stringify([...b.stops, ...b.missing].sort()) !== JSON.stringify([...w.stops].sort())) problems.push(`${w.id}: stops differ`);
}

if (problems.length) {
    console.error('data/ is stale. Run `node scripts/locate.mjs` and commit data/.\n  ' + problems.join('\n  '));
    process.exit(1);
}
console.log(`data/ matches the guide: ${picks.length} picks, ${walks.length} walks`);
