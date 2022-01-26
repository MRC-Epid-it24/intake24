import { NotFoundError } from '@intake24/api/http/errors';
import {
  DemographicGroup,
  DemographicGroupScaleSector,
  FiveADayFeedback,
  FoodGroupFeedback,
  FoodGroupFeedbackNutrient,
  FoodsNutrientType,
  FoodsNutrientUnit,
  NutrientTypeInKcal,
  PhysicalActivityLevel,
} from '@intake24/db';
import {
  DemographicGroup as FeedbackDemographicGroups,
  FiveADayFeedback as FiveADayFeedbackResponse,
  FoodGroupFeedback as FoodGroupFeedbackResponse,
  NutrientType,
} from '@intake24/common/types/http/feedback';
import {
  HenryCoefficient,
  defaultHenryCoefficients,
  WeightTargetCoefficient,
  weightTargetsData,
} from '@intake24/common/feedback';
import { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';

const feedbackService = () => {
  const getDemographicGroups = async (): Promise<FeedbackDemographicGroups[]> => {
    const groups = await DemographicGroup.findAll({
      include: [{ model: DemographicGroupScaleSector }, { model: NutrientTypeInKcal }],
      order: [['id', 'ASC']],
    });

    return groups.map((group) => ({
      ...group.get(),
      scaleSectors: group.scaleSectors ?? [],
    }));
  };

  const getFiveADay = async (): Promise<FiveADayFeedbackResponse> => {
    const data = await FiveADayFeedback.findAll();

    return data[0];
  };

  const getFoodGroups = async (): Promise<FoodGroupFeedbackResponse[]> => {
    const groups = await FoodGroupFeedback.findAll({
      include: [{ model: FoodGroupFeedbackNutrient }],
    });

    return groups.map((group) => ({
      ...group.get(),
      nutrients: group.nutrients?.map(({ nutrientId }) => nutrientId) ?? [],
    }));
  };

  const getHenryCoefficients = async (): Promise<HenryCoefficient[]> => defaultHenryCoefficients;

  const getNutrientTypes = async (): Promise<NutrientType[]> => {
    const nutrients = await FoodsNutrientType.findAll({
      include: [{ model: FoodsNutrientUnit, required: true }],
      order: [['id', 'ASC']],
    });

    return nutrients.map((nutrient) => {
      const { id, description, unit } = nutrient;
      if (!unit) throw new NotFoundError();

      return { id, description, unit: unit.description };
    });
  };

  const getPhysicalActivityLevels = async (): Promise<PhysicalActivityLevelAttributes[]> =>
    PhysicalActivityLevel.findAll({ order: [['id', 'ASC']] });

  const getWeightTargets = async (): Promise<WeightTargetCoefficient[]> => weightTargetsData;

  return {
    getDemographicGroups,
    getFiveADay,
    getFoodGroups,
    getHenryCoefficients,
    getNutrientTypes,
    getPhysicalActivityLevels,
    getWeightTargets,
  };
};

export default feedbackService;

export type FeedbackService = ReturnType<typeof feedbackService>;
