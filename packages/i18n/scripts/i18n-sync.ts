import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';

import { mergeTranslations } from '../src/util';

const components = ['admin', 'api', 'shared', 'survey'];

for (const component of components) {
  const langs = readdirSync(resolve('src', component));

  for (const lang of langs) {
    const langPathStats = statSync(resolve('src', component, lang));
    if (lang === 'en' || langPathStats.isFile())
      continue;

    const sections = readdirSync(resolve('src', component, lang));
    for (const section of sections) {
      const ext = extname(section);
      if (ext !== '.json')
        continue;

      const defaults = JSON.parse(readFileSync(resolve('src', component, 'en', section), 'utf8'));
      const sync = JSON.parse(readFileSync(resolve('src', component, lang, section), 'utf8'));
      const merged = mergeTranslations(defaults, sync);
      writeFileSync(resolve('src', component, lang, section), JSON.stringify(merged, null, 2), 'utf8');
    }
  }
}
