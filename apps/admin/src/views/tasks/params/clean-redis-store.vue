<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-row class="mx-0">
      <v-col cols="12" md="6">
        <v-select
          :value="store"
          :items="stores"
          :label="$t('tasks.stores._')"
          name="store"
          outlined
          @change="$emit('update:store', $event)"
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import type { TaskRefs } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'CleanRedisStore',

  props: {
    store: {
      type: String,
      required: true,
    },
    refs: {
      type: Object as PropType<TaskRefs>,
      required: true,
    },
  },

  data() {
    return {
      stores: [
        { value: 'cache', text: this.$t('tasks.stores.cache') },
        { value: 'session', text: this.$t('tasks.stores.session') },
      ],
    };
  },
});
</script>

<style scoped></style>
