import { NutrientTypeIdEnum } from '@intake24/common/feedback';
import { round } from '@intake24/common/util';

export default class AggregateFoodStats {
  readonly name: string;

  private readonly averageIntake: Map<string, number>;

  constructor(name: string, averageIntake: Map<string, number>) {
    this.name = name;
    this.averageIntake = averageIntake;
  }

  clone(): AggregateFoodStats {
    return new AggregateFoodStats(this.name, new Map(this.averageIntake));
  }

  getAverageIntake(nutrientTypeId: string): number {
    return round(this.averageIntake.get(nutrientTypeId) || 0);
  }

  getGroupAverageIntake(nutrientTypeId: string[]): number {
    const intake = nutrientTypeId.reduce((acc, cur) => acc + (this.averageIntake.get(cur) ?? 0), 0);

    return round(intake);
  }

  getAverageEnergyIntake(): number {
    return this.getAverageIntake(NutrientTypeIdEnum.Energy);
  }
}
