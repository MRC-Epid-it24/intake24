import { CharacterType } from '@intake24/common/feedback';

import battery from '../assets/feedback/characters/energy.jpg';
import bread from '../assets/feedback/characters/carbs.jpg';
import egg from '../assets/feedback/characters/protein.jpg';
import apple from '../assets/feedback/characters/fibre.jpg';
import salmon from '../assets/feedback/characters/vitamin_a.jpg';
// import sausage from '../assets/feedback/characters/vitamin_a.jpg';
import milk from '../assets/feedback/characters/calcium.jpg';
import candy from '../assets/feedback/characters/sugar.jpg';
import strawberry from '../assets/feedback/characters/vitamin_c.jpg';
import burger from '../assets/feedback/characters/sat_fat.jpg';
import fries from '../assets/feedback/characters/fat.jpg';
import co2 from '../assets/feedback/characters/co2.jpg';
import iron from '../assets/feedback/characters/iron.jpg';
import folate from '../assets/feedback/characters/folate.jpg';

import fruit_veg from '../assets/feedback/five-a-day/fruit_veg.jpg';
import beef from '../assets/feedback/food-groups/beef.jpg';

export const characterImageMap: Record<CharacterType, any> = {
  battery,
  bread,
  egg,
  apple,
  salmon,
  // sausage,
  milk,
  candy,
  strawberry,
  burger,
  fries,
  co2,
  iron,
  folate,
};

export const fiveADayImageMap: Record<string, any> = {
  fruit_veg,
};

export const nutrientGroupImageMap: Record<string, any> = {
  '266': beef,
};
