import { readFileSync } from 'fs';
import colors from 'picocolors';

const msgPath = process.argv[2];
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRE =
  /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log();

  console.error(
    `  ${colors.bgRed(colors.white(' ERROR '))} ${colors.red(`invalid commit message format.`)}
  ${colors.red(
    `Proper commit message format is required for automated changelog generation. Examples:`
  )}
  ${colors.green(`feat(api): add 'comments' option`)}
  ${colors.green(`fix(ui): handle events on blur (close #28)`)}
  ${colors.red(`See .github/commit-convention.md for more details.`)}
`
  );

  process.exit(1);
}
