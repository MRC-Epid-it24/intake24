import { VueConstructor } from 'vue';

export interface Resource {
  group: string;
  name: string;
  api: string;
  icon: string;
  title?: string;
  generateRoutes: boolean;
  routes: string[];
}

export type Views = Record<string, VueConstructor>;
export type ViewsCollection = Record<string, VueConstructor | Views>;
