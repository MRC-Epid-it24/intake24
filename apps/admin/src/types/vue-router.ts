export interface Resource {
  group: string;
  name: string;
  path?: string;
  api: string;
  icon: string;
  title?: string;
  securable?: boolean;
  generateRoutes: boolean;
  routes: string[];
}
