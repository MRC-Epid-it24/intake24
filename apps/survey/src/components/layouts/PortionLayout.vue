<template>
  <div>
    <v-card class="mb-3" elevation="0">
      <v-container class="px-0">
        <v-row align="center" no-gutters>
          <v-col>
            <v-card-text>
              <slot name="header">
                <span class="text-subtitle-1 font-weight-medium">
                  {{ localeText }}
                </span>
              </slot>
            </v-card-text>
          </v-col>
          <v-col cols="auto">
            <v-btn class="mr-2" color="primary">{{ $t('common.help._') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <slot></slot>
    <!-- <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <slot name="actions"></slot>
        </v-col>
      </v-row>
    </v-container> -->
    <div class="pa-4 px-md-0 d-flex" :class="{ 'flex-column-reverse': isMobile }">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { LocaleTranslation, PortionSizeMethodId } from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'PortionLayout',

  mixins: [localeContent],

  props: {
    method: {
      type: String as PropType<PortionSizeMethodId | 'option'>,
      required: true,
    },
    text: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      default: null,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    localeText() {
      return this.getLocaleContent(this.text, {
        path: `portion.${this.method}.text`,
        params: { food: this.localeFoodName },
      });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.description, {
        params: { food: this.localeFoodName },
      });
    },
  },
});
</script>

<style lang="scss" scoped></style>
