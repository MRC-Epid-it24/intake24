<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>
        $search
      </v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.foodBrowser._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-label>{{ $t('survey-schemes.prompts.foodBrowser.categoriesFirst._') }}</v-label>
      <v-switch
        hide-details="auto"
        :input-value="categoriesFirst.browse"
        :label="$t('survey-schemes.prompts.foodBrowser.categoriesFirst.browse')"
        @change="update('browse', $event)"
      />
      <v-switch
        hide-details="auto"
        :input-value="categoriesFirst.search"
        :label="$t('survey-schemes.prompts.foodBrowser.categoriesFirst.search')"
        @change="update('search', $event)"
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
