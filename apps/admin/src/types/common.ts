import { Route } from 'vue-router';

export type RouteLeave = {
  dialog: boolean;
  to: Route | null;
  confirmed: boolean;
};
