import 'vue-router';

export {};

declare module 'vue-router' {
  interface RouteMeta {
    module: string;
    title?: string;
  }
}
