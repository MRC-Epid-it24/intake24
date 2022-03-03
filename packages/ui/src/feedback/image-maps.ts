/* eslint-disable global-require */
import { CharacterType } from '@intake24/common/feedback';

export const characterImageMap: Record<CharacterType, any> = {
  battery: require(`@intake24/ui/assets/feedback/characters/energy.jpg`),
  bread: require(`@intake24/ui/assets/feedback/characters/carbs.jpg`),
  egg: require(`@intake24/ui/assets/feedback/characters/protein.jpg`),
  apple: require(`@intake24/ui/assets/feedback/characters/fibre.jpg`),
  salmon: require(`@intake24/ui/assets/feedback/characters/vitamin_a.jpg`),
  // sausage: require(`@intake24/ui/assets/feedback/characters/vitamin_a.jpg`),
  milk: require(`@intake24/ui/assets/feedback/characters/calcium.jpg`),
  candy: require(`@intake24/ui/assets/feedback/characters/sugar.jpg`),
  strawberry: require(`@intake24/ui/assets/feedback/characters/vitamin_c.jpg`),
  burger: require(`@intake24/ui/assets/feedback/characters/sat_fat.jpg`),
  fries: require(`@intake24/ui/assets/feedback/characters/fat.jpg`),
  co2: require(`@intake24/ui/assets/feedback/characters/co2.jpg`),
  iron: require(`@intake24/ui/assets/feedback/characters/iron.jpg`),
  folate: require(`@intake24/ui/assets/feedback/characters/folate.jpg`),
};

export const fiveADayImageMap: Record<string, any> = {
  fruit_veg: require(`@intake24/ui/assets/feedback/five-a-day/fruit_veg.jpg`),
};

export const nutrientGroupImageMap: Record<string, any> = {
  '266': require(`@intake24/ui/assets/feedback/food-groups/beef.jpg`),
};
