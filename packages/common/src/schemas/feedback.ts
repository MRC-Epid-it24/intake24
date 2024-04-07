import { z } from 'zod';

import {
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections,
  feedbackTypes,
  henryCoefficient,
  topFoods,
} from '../feedback';

export const feedbackSchemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(feedbackTypes),
  sections: z.enum(feedbackSections).array(),
  outputs: z.enum(feedbackOutputs).array(),
  physicalDataFields: z.enum(feedbackPhysicalDataFields).array(),
  visibility: z.string(),
  topFoods,
  meals: z.object({}),
  cards: z.array(z.object({})),
  demographicGroups: z.array(z.object({})),
  henryCoefficients: henryCoefficient.array(),
});
