import type Router from 'vue-router';

import { useAuth, useResource, useUser } from '../stores';
import resources from './resources';

export default (router: Router): void => {
  router.beforeEach(async (to, from, next) => {
    const { meta: { perm, public: unrestricted } = {} } = to;

    const auth = useAuth();

    // Login page
    if (unrestricted) {
      if (auth.loggedIn) next({ name: 'dashboard' });
      else next();
      return;
    }

    // Get logged-in user information if not yet loaded
    if (!auth.loggedIn) await auth.refresh(false);

    // Any other page (requires to be logged in)
    if (!auth.loggedIn) {
      next({ name: 'login' });
      return;
    }

    // Check correct permissions if any
    if (perm && !useUser().can(perm)) {
      next({ name: 'dashboard' });
      return;
    }

    next();
  });

  router.afterEach(async (to) => {
    const { meta: { module } = {} } = to;

    // Update module/resource name
    const name = module.parent ?? module.current;
    const resource = resources.find((item) => item.name === name);

    const resourceStore = useResource();

    if (!resourceStore.name !== name)
      resourceStore.update({ name, api: resource?.api ?? `admin/${name}` });
  });
};
