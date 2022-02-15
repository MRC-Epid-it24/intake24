<template>
  <v-btn
    color="primary"
    icon
    :href="`${app.api}/${route}/${item.id}`"
    target="_blank"
    :title="$t('common.action.read')"
  >
    <v-icon dark v-text="icon"></v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useApp } from '@intake24/admin/stores';
import ActionMixin from './action-mixin';

export default defineComponent({
  name: 'DownloadAction',

  mixins: [ActionMixin],

  computed: mapState(useApp, ['app']),
});
</script>

<style lang="scss" scoped></style>
