import type { Route } from 'vue-router';

export type RouteLeave = {
  dialog: boolean;
  to: Route | null;
  confirmed: boolean;
};

export type RuleCallback = (value: string | null) => boolean | string;
