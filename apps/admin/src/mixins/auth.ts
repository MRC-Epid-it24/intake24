import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useUser } from '@intake24/admin/stores';

export default defineComponent({
  methods: mapActions(useUser, ['can']),
});
