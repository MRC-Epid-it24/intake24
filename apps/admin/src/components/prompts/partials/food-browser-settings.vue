<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
      <v-icon end icon="$search" />
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.foodBrowser._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-label>{{ $t('survey-schemes.prompts.foodBrowser.categoriesFirst._') }}</v-label>
      <v-switch
        hide-details="auto"
        :label="$t('survey-schemes.prompts.foodBrowser.categoriesFirst.browse')"
        :model-value="categoriesFirst.browse"
        @update:model-value="update('browse', $event)"
      />
      <v-switch
        hide-details="auto"
        :label="$t('survey-schemes.prompts.foodBrowser.categoriesFirst.search')"
        :model-value="categoriesFirst.search"
        @update:model-value="update('search', $event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodBrowser } from '@intake24/common/prompts';

export default defineComponent({
  name: 'FoodBrowserSettings',

  props: {
    categoriesFirst: {
      type: Object as PropType<FoodBrowser['categoriesFirst']>,
      required: true,
    },
  },

  emits: ['update:categoriesFirst'],

  methods: {
    update(field: keyof FoodBrowser['categoriesFirst'], value: boolean) {
      this.$emit(`update:categoriesFirst`, { ...this.categoriesFirst, [field]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
