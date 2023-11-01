import type {
  PkgInheritableAttributes,
  PkgPortionSizeMethod,
} from '@intake24/cli/commands/packager/types/foods';

export interface PkgGlobalCategory {
  version: string;
  code: string;
  englishDescription: string;
  isHidden: boolean;
  attributes: PkgInheritableAttributes;
  parentCategories: string[];
}

export interface PkgLocalCategory {
  version?: string;
  code: string;
  localDescription?: string;
  portionSize: PkgPortionSizeMethod[];
}
