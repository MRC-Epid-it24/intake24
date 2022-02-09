import { NotFoundError } from '@intake24/api/http/errors';
import {
  FoodsNutrientType,
  FoodsNutrientUnit,
  NutrientTypeInKcal,
  PhysicalActivityLevel,
} from '@intake24/db';
import { NutrientType } from '@intake24/common/types/http/feedback';
import { WeightTargetCoefficient, weightTargetsData } from '@intake24/common/feedback';
import { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';

const feedbackService = () => {
  const getNutrientTypes = async (): Promise<NutrientType[]> => {
    const nutrients = await FoodsNutrientType.findAll({
      include: [{ model: FoodsNutrientUnit }, { model: NutrientTypeInKcal }],
      order: [['id', 'ASC']],
    });

    return nutrients.map((nutrient) => {
      const { id, description, unit, inKcal } = nutrient;
      if (!unit) throw new NotFoundError();

      return { id, description, unit: unit.symbol, kcalPerUnit: inKcal?.kcalPerUnit ?? null };
    });
  };

  const getPhysicalActivityLevels = async (): Promise<PhysicalActivityLevelAttributes[]> =>
    PhysicalActivityLevel.findAll({ order: [['id', 'ASC']] });

  const getWeightTargets = async (): Promise<WeightTargetCoefficient[]> => weightTargetsData;

  return {
    getNutrientTypes,
    getPhysicalActivityLevels,
    getWeightTargets,
  };
};

export default feedbackService;

export type FeedbackService = ReturnType<typeof feedbackService>;
