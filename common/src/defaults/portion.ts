import { AsServedPromptProps } from '../types';

export const asServedPromptDefaultProps: AsServedPromptProps = {
  text: { en: null },
  description: { en: null },
  localDescription: { en: null },
  selectionImageUrl: '',
  servingImageSet: {
    id: '',
    description: '',
    selectionImageId: 0,
  },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const asServedLeftoverPromptDefaultProps: AsServedPromptProps = {
  text: { en: null },
  description: { en: null },
  localDescription: { en: null },
  selectionImageUrl: '',
  servingImageSet: {
    id: '',
    description: '',
    selectionImageId: 0,
  },
  validation: {
    required: false,
    message: { en: null },
  },
};
