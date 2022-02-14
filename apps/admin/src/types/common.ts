import { Route } from 'vue-router';

export interface Permission {
  resource?: string;
  action?: string;
}

export type RouteLeave = {
  dialog: boolean;
  to: Route | null;
  confirmed: boolean;
};

export type RuleCallback = (value: string | null) => boolean | string;
