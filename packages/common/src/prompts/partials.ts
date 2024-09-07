import type { Counter, Slider } from './prompts';

export const counterDefaults: Counter = {
  type: 'counter',
  min: 0.25,
  max: 30,
  current: 1,
  confirm: false,
  whole: true,
  fraction: true,
};

export const sliderDefaults: Slider = {
  type: 'slider',
  min: { value: 1, label: false },
  max: { value: 10, label: false },
  current: { value: 1, label: false, size: 50 },
  step: 1,
  confirm: false,
};
