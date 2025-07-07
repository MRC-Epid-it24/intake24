import type { LocalCategoryData, LocalFoodData } from '@intake24/api/food-index/workers/food-data';
import type Logger from '@intake24/common-backend/services/logger/logger';

interface TransitiveParentCategory {
  transitiveLevel: number;
  categoryData: LocalCategoryData;
}

export class ParentCategoryIndex {
  private readonly logger: typeof Logger;
  private readonly foodParentCategories: Map<string, Map<string, LocalCategoryData>>;
  private readonly categoryParentCategories: Map<string, Map<string, LocalCategoryData>>;
  private readonly categoryData: Map<string, LocalCategoryData>;
  private readonly foodTransitiveParentCategories: Map<string, Map<string, TransitiveParentCategory>>;
  private readonly categoryTransitiveParentCategories: Map<string, Map<string, TransitiveParentCategory>>;
  private readonly siblingCategories: Map<string, Map<string, LocalCategoryData>>;

  public readonly nonEmptyCategories: Set<string>;

  private addTransitiveParentCategories(categories: Map<string, LocalCategoryData>): Map<string, TransitiveParentCategory> {
    const transitiveParentCategories = new Map<string, TransitiveParentCategory>();

    let currentSet = categories;
    let transitiveLevel = 0;

    while (currentSet.size > 0) {
      for (const [code, categoryData] of currentSet)
        transitiveParentCategories.set(code, { transitiveLevel, categoryData });

      const nextSet = new Map<string, LocalCategoryData>();

      for (const code of currentSet.keys()) {
        const parentCategories = this.categoryParentCategories.get(code);
        if (parentCategories === undefined) {
          this.logger.warn(`Category ${code} is used as a parent, but has no local data`);
        }
        else {
          for (const [parentCode, parentData] of parentCategories)
            nextSet.set(parentCode, parentData);
        }
      }

      currentSet = nextSet;
      ++transitiveLevel;
    }

    return transitiveParentCategories;
  }

  private attachCategoryData(categories: Set<string>): Map<string, LocalCategoryData> {
    const result = new Map<string, LocalCategoryData>();

    for (const categoryCode of categories) {
      const data = this.categoryData.get(categoryCode);
      if (data === undefined)
        this.logger.warn(`Category ${categoryCode} is used as a parent, but has no local data`);
      else
        result.set(categoryCode, data);
    }

    return result;
  }

  public isFoodInCategory(foodCode: string, categoryCode: string): boolean {
    const parentCategories = this.foodTransitiveParentCategories.get(foodCode);

    if (parentCategories === undefined)
      return false;

    return parentCategories.has(categoryCode);
  }

  public isSubCategory(categoryCode: string, parentCategoryCode: string): boolean {
    const parentCategories = this.categoryTransitiveParentCategories.get(categoryCode);

    if (parentCategories === undefined)
      return false;

    return parentCategories.has(parentCategoryCode);
  }

  public getFoodTransitiveParentCategories(foodCode: string): Map<string, TransitiveParentCategory> {
    return this.foodTransitiveParentCategories.get(foodCode) ?? new Map();
  }

  public getSiblingCategories(categoryCode: string): Map<string, LocalCategoryData> {
    return this.siblingCategories.get(categoryCode) ?? new Map();
  }

  // Some categories can have a local record (that is, a row in category_locals) but no local foods
  // having that category as parent, directly or transitively.
  //
  // Such categories must be omitted from search results.
  private findNonEmptyCategories(localFoods: LocalFoodData[]): Set<string> {
    const nonEmptyCategories = new Set<string>();

    for (const food of localFoods) {
      const parentCategories = this.foodTransitiveParentCategories.get(food.code);

      if (parentCategories !== undefined) {
        for (const parentCategoryCode of parentCategories.keys())
          nonEmptyCategories.add(parentCategoryCode);
      }
    }

    return nonEmptyCategories;
  }

  private buildSiblingCategoriesMap(): Map<string, Map<string, LocalCategoryData>> {
    const subcategories: Map<string, Set<string>> = new Map();
    const siblingCategories: Map<string, Set<string>> = new Map();

    for (const [categoryCode, { parentCategories }] of this.categoryData.entries()) {
      for (const parentCode of parentCategories) {
        let subcategorySet = subcategories.get(parentCode);

        if (subcategorySet === undefined) {
          subcategorySet = new Set<string>();
          subcategories.set(parentCode, subcategorySet);
        }

        subcategorySet.add(categoryCode);
      }
    }

    for (const [categoryCode, { parentCategories }] of this.categoryData.entries()) {
      const siblingSet = new Set<string>();
      for (const parentCode of parentCategories) {
        const children = subcategories.get(parentCode);

        if (children !== undefined) {
          for (const siblingCode of children) {
            if (siblingCode !== categoryCode)
              siblingSet.add(siblingCode);
          }
        }
      }

      siblingCategories.set(categoryCode, siblingSet);
    }

    return new Map([...siblingCategories.entries()].map(([categoryCode, siblingCategoryCodes]) => [categoryCode, this.attachCategoryData(siblingCategoryCodes)]));
  }

  public isCategoryHidden(categoryCode: string): boolean {
    const categoryData = this.categoryData.get(categoryCode);
    if (categoryData === undefined) {
      this.logger.error(`No category data for ${categoryCode}!`);
      return false;
    }
    return categoryData.isHidden;
  }

  public isFoodHidden(foodCode: string): boolean {
    const parentCategories = this.foodParentCategories.get(foodCode);

    if (parentCategories === undefined) {
      this.logger.error(`No parent category data for ${foodCode}!`);
      return false;
    }

    if (parentCategories.size === 0) {
      this.logger.warn(`${foodCode} is not assigned to any category`);
      return false;
    }

    for (const categoryCode of parentCategories.keys()) {
      if (!this.isCategoryHidden(categoryCode))
        return false;
    }

    return true;
  }

  constructor(foods: LocalFoodData[], categories: LocalCategoryData[], logger: typeof Logger) {
    this.logger = logger;
    this.categoryData = new Map(categories.map(data => [data.code, data]));
    this.foodParentCategories = new Map(foods.map(food => [food.code, this.attachCategoryData(food.parentCategories)]));
    this.categoryParentCategories = new Map(categories.map(category => [category.code, this.attachCategoryData(category.parentCategories)]));
    this.foodTransitiveParentCategories = new Map(foods.map(food => [food.code, this.addTransitiveParentCategories(this.foodParentCategories.get(food.code)!)]));
    this.categoryTransitiveParentCategories = new Map(categories.map(category => [category.code, this.addTransitiveParentCategories(this.categoryParentCategories.get(category.code)!)]));
    this.nonEmptyCategories = this.findNonEmptyCategories(foods);
    this.siblingCategories = this.buildSiblingCategoriesMap();
  }
}
