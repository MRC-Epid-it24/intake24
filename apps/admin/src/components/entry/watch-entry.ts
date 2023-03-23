import type { NavigationGuardNext, Route } from 'vue-router';
import { defineComponent } from 'vue';

import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'WatchEntry',

  beforeRouteUpdate(to, from, next) {
    this.beforeRouteCheck(to, from, next);
  },

  beforeRouteLeave(to, from, next) {
    this.beforeRouteCheck(to, from, next);
  },

  data() {
    return {
      originalEntry: {} as object,
      routeLeave: {
        dialog: false,
        to: null as Route | null,
        confirmed: false,
      },
    };
  },

  computed: {
    /*
     * Override and implement logic in component
     */
    entryChanged(): boolean {
      return false;
    },
  },

  methods: {
    setOriginalEntry(data: object) {
      this.originalEntry = copy(data);
    },

    beforeRouteCheck(to: Route, from: Route, next: NavigationGuardNext) {
      if (this.routeLeave.confirmed) {
        this.routeLeave = { dialog: false, to: null, confirmed: false };
        next();
        return;
      }

      if (this.entryChanged) {
        this.routeLeave = { dialog: true, to, confirmed: false };
        return;
      }

      next();
    },
  },
});
