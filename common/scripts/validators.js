const fs = require('fs-extra');
const execa = require('execa');

/*
 * Generate type JSON validators used in API server to validate requests
 * - generate the validator
 * - move to destination folder & rename
 * - TODO: validator still needs to be modified to fix correct path to original type since it was moved to different location
 *
 */

const validators = [
  { type: 'Meals', srcFile: 'src/types/meals.ts', destFile: 'src/validators/meals.validator.ts' },
  {
    type: 'RecallQuestions',
    srcFile: 'src/types/recall.ts',
    destFile: 'src/validators/recall-questions.validator.ts',
  },
  {
    type: 'ExportSections',
    srcFile: 'src/types/models/system/schemes.ts',
    destFile: 'src/validators/export-sections.validator.ts',
  },
  {
    type: 'PushSubscription',
    srcFile: 'src/types/models/system/user-subscriptions.ts',
    destFile: 'src/validators/push-subscription.validator.ts',
  },
];

(async () => {
  try {
    for (const validator of validators) {
      await execa.command(
        `npx typescript-json-validator ${validator.srcFile} ${validator.type} --useNamedExport --noExtraProps`
      );

      if (fs.existsSync(validator.destFile)) await fs.unlink(validator.destFile);

      await fs.move(validator.srcFile.replace('.ts', '.validator.ts'), validator.destFile);
    }
  } catch (err) {
    console.log(err);
  }
})();
