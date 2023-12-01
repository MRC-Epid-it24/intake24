import type { Route } from 'vue-router';

export interface Resource {
  group: string;
  name: string;
  module?: string;
  path?: string;
  api: string;
  icon: string;
  title?: string;
  securable?: boolean;
  generateRoutes: boolean;
  routes: string[];
  refs?: boolean;
}

export type RouteLeave = {
  dialog: boolean;
  to: Route | null;
  confirmed: boolean;
};

export type RuleCallback = (value: string | null) => boolean | string;
