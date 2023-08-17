<template>
  <v-btn
    color="secondary"
    :href="`${app.api}/${route}/${item.id}`"
    icon
    target="_blank"
    :title="internalTitle"
  >
    <v-icon dark>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useApp } from '@intake24/admin/stores';

import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'DownloadAction',

  mixins: [ActionMixin],

  computed: mapState(useApp, ['app']),
});
</script>

<style lang="scss" scoped></style>
