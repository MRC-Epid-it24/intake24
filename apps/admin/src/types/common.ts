import { Route } from 'vue-router';

export type RouteLeave = {
  dialog: boolean;
  to: Route | null;
  confirmed: boolean;
};

export type ValidationError = {
  location: string;
  msg: string;
  param: string;
  value: string;
};

export type ValidationErrors = Record<string, ValidationError>;
