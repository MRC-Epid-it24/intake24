<template>
  <v-btn
    color="primary"
    icon
    :href="`${url.api}/${route}/${item.id}`"
    target="_blank"
    :title="$t('common.action.read')"
  >
    <v-icon dark v-text="icon"></v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'DownloadAction',

  mixins: [ActionMixin],

  computed: mapGetters(['url']),
});
</script>

<style lang="scss" scoped></style>
