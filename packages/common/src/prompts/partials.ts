import type { Counter, Slider, YoutubeVideo } from './prompts';

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

export const ytVideoDefaults: YoutubeVideo = {
  type: 'youtube',
  videoId: 't0ac25uWrxY',
  height: 720,
  width: 1280,
  autoContinue: false,
  autoplay: false,
  required: false,
};
