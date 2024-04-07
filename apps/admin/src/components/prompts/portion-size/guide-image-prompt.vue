<template>
  <div>
    <v-tab-item key="options" value="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <v-card outlined>
            <v-toolbar color="grey lighten-4" flat>
              <v-toolbar-title class="font-weight-medium">
                {{ $t('survey-schemes.prompts.linkedQuantity.title') }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-subtitle>
              {{ $t('survey-schemes.prompts.linkedQuantity.subtitle') }}
            </v-card-subtitle>
            <category-list
              class="mb-6"
              flat
              tile
              :value="linkedQuantity.source.map((code) => ({ code, name: code }))"
              @input="updateLQSource"
            >
              <template #title>
                {{ $t('survey-schemes.prompts.linkedQuantity.source') }}
              </template>
              <template #[`item.content`]="{ item }">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('fdbs.categories._') }}: {{ item.code }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </category-list>
            <v-divider />
            <category-list
              flat
              tile
              :value="linkedQuantity.parent.map((item) => ({ name: item.code, ...item }))"
              @input="updateLQParent"
            >
              <template #title>
                {{ $t('survey-schemes.prompts.linkedQuantity.parent') }}
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
                  @input="updateLQUnit(item.code, $event)"
                >
                  <template #activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" :title="$t('standard-units.add')" v-on="on">
                      <v-icon>$standard-units</v-icon>
                    </v-btn>
                  </template>
                </select-resource>
              </template>
            </category-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <image-map-settings :image-map="imageMap" @update:imageMap="update('imageMap', $event)" />
        </v-col>
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="badges"
            :label="$t('survey-schemes.prompts.badges')"
            @change="update('badges', $event)"
          />
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

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'GuideImagePrompt',

  components: { CategoryList, ImageMapSettings, SelectResource },

  mixins: [basePrompt],

  props: {
    badges: {
      type: Boolean as PropType<Prompts['guide-image-prompt']['badges']>,
      required: true,
    },
    imageMap: {
      type: Object as PropType<Prompts['guide-image-prompt']['imageMap']>,
      required: true,
    },
    linkedQuantity: {
      type: Object as PropType<Prompts['guide-image-prompt']['linkedQuantity']>,
      required: true,
    },
  },

  methods: {
    updateLQParent(items: CategoryListItem[]) {
      const linkedQuantity = {
        ...this.linkedQuantity,
        parent: items.map(({ name }) => ({ code: name })),
      };
      this.update('linkedQuantity', linkedQuantity);
    },

    updateLQSource(items: CategoryListItem[]) {
      const linkedQuantity = {
        ...this.linkedQuantity,
        source: items.map(({ code }) => code),
      };
      this.update('linkedQuantity', linkedQuantity);
    },

    updateLQUnit(code: string, unit: string) {
      const parent = copy(this.linkedQuantity.parent);
      const idx = this.linkedQuantity.parent.findIndex(cat => cat.code === code);
      parent.splice(idx, 1, { code, unit });

      const linkedQuantity = { ...this.linkedQuantity, parent };

      this.update('linkedQuantity', linkedQuantity);
    },
  },
});
</script>

<style lang="scss" scoped></style>
