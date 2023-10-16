import type { PkgImageMapObject } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { CreateLocaleRequest, ImageMapEntryObject } from '@intake24/common/types/http/admin';

function fromPackageImageMapObjects(
  objects: Record<string, PkgImageMapObject>
): ImageMapEntryObject[] {
  return Object.entries(objects).map(([objId, obj]) => ({
    id: objId,
    description: obj.description,
    navigationIndex: obj.navigationIndex,
    outlineCoordinates: obj.outlineCoordinates,
    label: { en: obj.description },
  }));
}

function fromPackageLocale(locale: PkgLocale): CreateLocaleRequest {
  return {
    code: locale.id,
    localName: locale.localName,
    englishName: locale.englishName,
    adminLanguageId: locale.adminLanguage,
    prototypeLocaleId: locale.prototypeLocale,
    countryFlagCode: locale.flagCode,
    foodIndexLanguageBackendId: 'en',
    respondentLanguageId: locale.respondentLanguage,
    textDirection: locale.textDirection,
  };
}

export default {
  fromPackageImageMapObjects,
  fromPackageLocale,
};
