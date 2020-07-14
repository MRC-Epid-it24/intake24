import { PromptQuestion } from '@common/types/prompts';

const promptQuestionTypes: PromptQuestion[] = [
  {
    component: 'info-prompt',
    id: 'info-prompt',
    name: 'Info / confirmation prompt',
    props: {
      text: '',
      description: '',
    },
  },
  {
    component: 'submit-prompt',
    id: 'submit-prompt',
    name: 'Submit prompt',
    props: {
      text: '',
      description: '',
    },
  },
  {
    component: 'date-picker-prompt',
    id: 'date-picker-prompt',
    name: 'Date picker prompt',
    props: {
      text: '',
      description: '',
      validation: {
        required: true,
        message: 'Date selection is required',
      },
    },
  },
  {
    component: 'time-picker-prompt',
    id: 'time-picker-prompt',
    name: 'Time picker prompt',
    props: {
      text: '',
      description: '',
      validation: {
        required: true,
        message: 'Time selection is required',
      },
    },
  },
  {
    component: 'checkbox-list-prompt',
    id: 'checkbox-list-prompt',
    name: 'Checkbox List Prompt',
    props: {
      text: '',
      description: '',
      label: 'Select options:',
      options: [],
      other: true,
      validation: {
        required: true,
        message: 'At least one option has to be selected',
      },
    },
  },
  {
    component: 'radio-list-prompt',
    id: 'radio-list-prompt',
    name: 'Radio List Prompt',
    props: {
      text: '',
      description: '',
      label: 'Select one option:',
      options: [],
      orientation: 'column',
      other: true,
      validation: {
        required: true,
        message: 'One option has to be selected',
      },
    },
  },
  {
    component: 'textarea-prompt',
    id: 'textarea-prompt',
    name: 'Textarea prompt',
    props: {
      text: '',
      description: '',
      label: '',
      hint: null,
      validation: {
        required: true,
        message: '',
      },
    },
  },
];

export default promptQuestionTypes;
