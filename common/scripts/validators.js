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
  {
    type: 'Meals',
    srcFile: 'src/types/meals.ts',
    destFile: 'src/validators/meals.validator.ts',
    params: '--useNamedExport',
  },
  {
    type: 'RecallQuestions',
    srcFile: 'src/types/recall.ts',
    destFile: 'src/validators/recall-questions.validator.ts',
    params: '--useNamedExport',
  },
  {
    type: 'ExportSections',
    srcFile: 'src/types/models/system/schemes.ts',
    destFile: 'src/validators/export-sections.validator.ts',
    params: '--useNamedExport --noExtraProps',
  },
  {
    type: 'PushSubscription',
    srcFile: 'src/types/models/system/user-subscriptions.ts',
    destFile: 'src/validators/push-subscription.validator.ts',
    params: '--useNamedExport --noExtraProps',
  },
  {
    type: 'GuideImageInputObjects',
    srcFile: 'src/types/http/admin/guide-images.ts',
    destFile: 'src/validators/guide-image-objects.validator.ts',
    params: '--useNamedExport',
  },
  {
    type: 'ImageMapInputObjects',
    srcFile: 'src/types/http/admin/image-maps.ts',
    destFile: 'src/validators/image-map-objects.validator.ts',
    params: '--useNamedExport',
  },
];

(async () => {
  try {
    for (const validator of validators) {
      await execa.command(
        `npx typescript-json-validator ${validator.srcFile} ${validator.type} ${validator.params}`
      );

      if (fs.existsSync(validator.destFile)) await fs.unlink(validator.destFile);

      await fs.move(validator.srcFile.replace('.ts', '.validator.ts'), validator.destFile);
    }
  } catch (err) {
    console.log(err);
  }
})();
