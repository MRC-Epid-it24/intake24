<template>
  <v-btn
    color="primary"
    icon
    :to="{ name: `${route}-edit`, params: { id: item.id } }"
    :title="$t('common.action.edit')"
  >
    <v-icon dark v-text="icon"></v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMixin from './ActionMixin';

export default Vue.extend({
  name: 'EditAction',

  mixins: [ActionMixin],
});
</script>

<style lang="scss" scoped></style>
