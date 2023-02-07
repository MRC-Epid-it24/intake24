<template>
  <div>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="leftovers"
            :label="$t('survey-schemes.questions.leftovers')"
            @change="update('leftovers', $event)"
          >
          </v-switch>
        </v-col>
        <v-col cols="12" md="6">
          <category-list
            class="mb-6"
            :value="linkedQuantityCategories.map((code) => ({ code, name: code }))"
            @input="updateLinkedQuantityCategories"
          >
            <template #title>
              {{ $t('survey-schemes.prompts.as-served-prompt.linkedQuantityCategories') }}
            </template>
          </category-list>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CategoryListItem } from '@intake24/admin/components/fdbs';
import type { Prompts } from '@intake24/common/prompts';
import { CategoryList } from '@intake24/admin/components/fdbs';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AsServedPrompt',

  components: { CategoryList },

  mixins: [basePrompt],

  props: {
    leftovers: {
      type: Boolean as PropType<Prompts['as-served-prompt']['leftovers']>,
      required: true,
    },
    linkedQuantityCategories: {
      type: Array as PropType<Prompts['as-served-prompt']['linkedQuantityCategories']>,
      default: () => [],
    },
  },

  methods: {
    updateLinkedQuantityCategories(items: CategoryListItem[]) {
      this.update(
        'linkedQuantityCategories',
        items.map((item) => item.code)
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
