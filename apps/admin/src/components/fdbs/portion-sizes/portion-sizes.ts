import type {
  FoodPortionSizeMethodCreationAttributes,
  FoodPortionSizeMethodParameterCreationAttributes,
} from '@intake24/db';
import { useI18n } from '@intake24/i18n';

export type PortionSizeMethodParameterItem = FoodPortionSizeMethodParameterCreationAttributes;

export interface PortionSizeMethodItem extends FoodPortionSizeMethodCreationAttributes {
  parameters: PortionSizeMethodParameterItem[];
}

export interface InternalPortionSizeMethodItem extends PortionSizeMethodItem {
  _id: string;
}

export type PortionSizeMethodEvent = {
  index: number;
  item: InternalPortionSizeMethodItem;
};

export type PortionSizeMethodDialog = {
  show: boolean;
  index: number;
  item: InternalPortionSizeMethodItem;
};

export const psmDefaultAttributes: Omit<PortionSizeMethodItem, 'id' | 'method'> = {
  description: '',
  imageUrl: '',
  useForRecipes: false,
  conversionFactor: 1,
  orderBy: '0',
  parameters: [],
};

export const portionSizeSelectionImages = {
  grated: 'portion/cheg3.jpg',
  in_a_bag: 'portion/Gcri.jpg',
  in_a_bottle: 'portion/Gwatbottle.jpg',
  in_a_bowl: 'portion/CanFt4.jpg',
  in_a_can: 'portion/Galccans.jpg',
  in_a_carton: 'portion/Gpopcarton.jpg',
  in_a_glass: 'portion/gsoftdrnk.jpg',
  in_a_mug: 'portion/mugs.jpg',
  in_a_pot: 'portion/Gyog.jpg',
  in_a_takeaway_cup: 'portion/hotdrinks.jpg',
  in_baby_carrots: 'portion/carb5.jpg',
  in_bars: 'portion/Gwcho.jpg',
  in_batons: 'portion/baton3.jpg',
  in_berries: 'portion/blkb24.jpg',
  in_burgers: 'portion/Gbur.jpg',
  in_chopped_fruit: 'portion/apps4.jpg',
  in_crinkle_cut_chips: 'portion/chipcr2.jpg',
  in_cubes: 'portion/chec3.jpg',
  in_curly_fries: 'portion/curf2.jpg',
  in_dollops: 'portion/421.jpg',
  in_french_fries: 'portion/fren2.jpg',
  in_individual_cakes: 'portion/Gcake.jpg',
  in_individual_packs: 'portion/Gchse.jpg',
  in_individual_puddings: 'portion/Gyor.jpg',
  in_individual_sweets: 'Gswt2.jpg',
  in_spoonfuls: 'Gspn.jpg',
  in_slices: 'portion/chesl3.jpg',
  in_straight_cut_chips: 'portion/chipst2.jpg',
  in_thick_cut_chips: 'portion/chipth2.jpg',
  in_unwrapped_bars: 'portion/Gcdmc.jpg',
  in_whole_fruit_vegetables: 'portion/Gapl.jpg',
  in_wrapped_bars: 'portion/Gcdmb.jpg',
  on_a_knife: 'portion/butk4.jpg',
  on_a_plate: 'portion/m332.jpg',
  slice_from_a_large_cake: 'portion/m216.jpg',
  slice_from_a_large_pudding: 'portion/yorp4.jpg',
  spread_on_a_cracker: 'portion/butc4.jpg',
  spread_on_a_scone: 'portion/butsc4.jpg',
  spread_on_bread: 'portion/Gcsp04.jpg',
  use_a_standard_measure: 'portion/standard-portion.jpg',
  use_a_standard_portion: 'portion/standard-portion.jpg',
  use_an_image: 'portion/potatoes_boiled.jpg',
  use_these_crisps_in_a_bag: 'portion/Gskps.jpg',
  use_tortilla_chips_in_a_bowl: 'portion/tort4.jpg',
  weight: 'portion/weight.png',
};

export const psmDefaults: PortionSizeMethodItem[] = [
  {
    method: 'as-served',
    ...psmDefaultAttributes,
    description: 'use_an_image',
    imageUrl: portionSizeSelectionImages.use_an_image,
  },
  {
    method: 'cereal',
    ...psmDefaultAttributes,
    description: 'use_an_image',
    imageUrl: portionSizeSelectionImages.use_an_image,
  },
  {
    method: 'drink-scale',
    ...psmDefaultAttributes,
    description: 'in_a_mug',
    imageUrl: portionSizeSelectionImages.in_a_mug,
  },
  {
    method: 'guide-image',
    ...psmDefaultAttributes,
    description: 'in_a_can',
    imageUrl: portionSizeSelectionImages.in_a_can,
  },
  {
    method: 'milk-in-a-hot-drink',
    ...psmDefaultAttributes,
    description: 'use_a_standard_portion',
    imageUrl: portionSizeSelectionImages.use_a_standard_portion,
  },
  {
    method: 'milk-on-cereal',
    ...psmDefaultAttributes,
    description: 'in_a_bowl',
    imageUrl: portionSizeSelectionImages.in_a_bowl,
  },
  {
    method: 'standard-portion',
    ...psmDefaultAttributes,
    description: 'use_a_standard_portion',
    imageUrl: portionSizeSelectionImages.use_a_standard_portion,
  },
  {
    method: 'parent-food-portion',
    ...psmDefaultAttributes,
    description: 'use_a_standard_portion',
    imageUrl: portionSizeSelectionImages.use_a_standard_portion,
  },
  {
    method: 'pizza',
    ...psmDefaultAttributes,
    description: 'use_an_image',
    imageUrl: portionSizeSelectionImages.use_an_image,
  },
  {
    method: 'weight',
    ...psmDefaultAttributes,
    description: 'weight',
    imageUrl: portionSizeSelectionImages.weight,
  },
];

export const usePortionSizeMethods = () => {
  const i18n = useI18n();

  const estimationMethods = psmDefaults.map(({ method: value }) => ({
    value,
    text: i18n.t(`fdbs.portionSizes.methods.${value}._`).toString(),
  }));

  const selections = Object.keys(portionSizeSelectionImages)
    .map((value) => ({
      value,
      text: i18n.t(`prompts.portionSizeOption.selections.${value}`).toString(),
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

  return { estimationMethods, selections };
};
