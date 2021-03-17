import { LocaleMessage } from 'vue-i18n';

const portion: LocaleMessage = {
  common: {
    backStep: 'Go back to previous step',
    lessButton: 'I had less',
    moreButton: 'I had more',
    // Maybe don't need both of these as semanitcally very similar
    confirmButtonMany: 'I had that much',
    confirmButton: 'I had that many',
    quantityAnd: 'and', // E.g 1 and 3/4 bananas
  },
  option: {
    // Implementation of this needs looking at for RTL, as localDescription appears at end of line for label
    label: 'How would you like to estimate the portion size of your',
    validation: {
      required: 'Please select how the portion will be measured.',
    },
    imageInvalid: 'Image loading',
  },
  asServed: {
    label: 'Using these pictures, please chose how much you had',
  },
  asServedLeftover: {
    label: 'Using these pictures, please choose how much you left',
    question: 'Did you leave some of your?',
  },
  guideImage: {
    label: 'Please select the item you had or the closest match.',
    quantity: 'Please chose how many of those you had.',
    validation: {
      required: 'Please select the item you had or the closest match from the image.',
    },
  },
  drinkScale: {
    label: 'Please select the cup or glass that looks most like the one you used for your',
    sliderLabel:
      'Please use the slider on the right or click on the cup or glass to indicate how full your cup or glass was.',
    leftoverLabel: 'Please use the slider on the right to choose how much you had left',
    lessFullButton: 'It was less full',
    moreFullButton: 'It was more full',
    confirmFullButton: 'It was that full',
  },
  standardPortion: {
    portionMethodLabel: 'How would you like to estimate your portion size?',
    label: 'How many did you have?',
  },
  cereal: {
    label: 'Please select the bowl that looks most like the one you used.',
  },
  milkCereal: {
    label: 'Please choose the level your milk came up to (without cereal).',
  },
  pizza: {
    label: 'Please select the pizza that is closest to the size you had.',
    thicknessLabel: 'How thick was your pizza?',
    sizeLabel: 'What size slice(s) did you have?',
    wholePizzaButton: 'I had the whole pizza',
    slicesLabel: 'How many of these slices did you have?',
  },
  milkHotDrink: {
    label: 'How much skimmed milk did you have in your tea or coffee?',
  },
  directWeight: {
    label: 'Please enter how much you had.',
  },
};

export default portion;
