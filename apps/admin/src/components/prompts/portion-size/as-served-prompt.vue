<template>
  <div>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="badges"
            :label="$t('survey-schemes.prompts.badges')"
            @change="update('badges', $event)"
          >
          </v-switch>
          <v-switch
            hide-details="auto"
            :input-value="leftovers"
            :label="$t('survey-schemes.prompts.leftovers')"
            @change="update('leftovers', $event)"
          >
          </v-switch>
        </v-col>
        <v-col cols="12" md="6">
          <category-list
            class="mb-6"
            :value="linkedQuantityCategories.map((item) => ({ name: item.code, ...item }))"
            @input="updateLinkedQuantityCategories"
          >
            <template #title>
              {{ $t('survey-schemes.prompts.as-served-prompt.linkedQuantityCategories') }}
            </template>
            <template #[`item.content`]="{ item }">
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('fdbs.categories._') }}: {{ item.code }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('standard-units._') }}: {{ item.unit ?? $t('common.not.assigned') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <template #[`item.action`]="{ item }">
              <select-resource
                v-if="!item.unit"
                item-name="id"
                resource="standard-units"
                @input="updateUnit(item.code, $event)"
              >
                <template #activator="{ attrs, on }">
                  <v-btn icon v-bind="attrs" :title="$t('standard-units.add')" v-on="on">
                    <v-icon>$standard-units</v-icon>
                  </v-btn>
                </template>
              </select-resource>
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
import { SelectResource } from '@intake24/admin/components/dialogs';
import { CategoryList } from '@intake24/admin/components/fdbs';
import { copy } from '@intake24/common/util';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AsServedPrompt',

  components: { CategoryList, SelectResource },

  mixins: [basePrompt],

  props: {
    badges: {
      type: Boolean as PropType<Prompts['as-served-prompt']['badges']>,
      required: true,
    },
    leftovers: {
      type: Boolean as PropType<Prompts['as-served-prompt']['leftovers']>,
      required: true,
    },
    linkedQuantityCategories: {
      type: Array as PropType<Prompts['as-served-prompt']['linkedQuantityCategories']>,
      required: true,
    },
  },

  methods: {
    updateLinkedQuantityCategories(items: CategoryListItem[]) {
      this.update(
        'linkedQuantityCategories',
        items.map(({ code, unit }) => ({ code, unit }))
      );
    },

    updateUnit(code: string, unit: string) {
      const items = copy(this.linkedQuantityCategories);
      const idx = this.linkedQuantityCategories.findIndex((cat) => cat.code === code);
      items.splice(idx, 1, { code, unit });

      this.update('linkedQuantityCategories', items);
    },
  },
});
</script>

<style lang="scss" scoped></style>
