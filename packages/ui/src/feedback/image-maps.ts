import type { CharacterType } from '@intake24/common/feedback';

import beef from '../assets/feedback/characters/beef.jpg';
// import sausage from '../assets/feedback/characters/vitamin_a.jpg';
import milk from '../assets/feedback/characters/calcium.jpg';
import bread from '../assets/feedback/characters/carbs.jpg';
import co2 from '../assets/feedback/characters/co2.jpg';
import battery from '../assets/feedback/characters/energy.jpg';
import fries from '../assets/feedback/characters/fat.jpg';
import apple from '../assets/feedback/characters/fibre.jpg';
import folate from '../assets/feedback/characters/folate.jpg';
import fruitVeg from '../assets/feedback/characters/fruit_veg.jpg';
import iron from '../assets/feedback/characters/iron.jpg';
import egg from '../assets/feedback/characters/protein.jpg';
import burger from '../assets/feedback/characters/sat_fat.jpg';
import candy from '../assets/feedback/characters/sugar.jpg';
import salmon from '../assets/feedback/characters/vitamin_a.jpg';
import strawberry from '../assets/feedback/characters/vitamin_c.jpg';

export const characterImageMap: Record<CharacterType, any> = {
  battery,
  beef,
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
  fruitVeg,
};
