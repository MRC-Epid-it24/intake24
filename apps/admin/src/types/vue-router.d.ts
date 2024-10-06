import 'vue-router';

export {};

declare module 'vue-router' {
  interface RouteMeta {
    module: { current: string; parent?: string };
    public?: boolean;
    title?: string;
    perm?: string;
    action?: string;
  }
}
