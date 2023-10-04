import type { PkgImageMapObject } from '@intake24/cli/commands/packager/types/image-map';
import type { ImageMapEntryObject } from '@intake24/common/types/http/admin';

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

export default {
  fromPackageImageMapObjects,
};
