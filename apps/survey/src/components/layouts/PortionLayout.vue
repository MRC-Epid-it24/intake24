<template>
  <v-container px-2>
    <v-card elevation="0">
      <v-row class="mb-3">
        <v-col>
          <v-card-text>
            <slot name="headerText"></slot>
          </v-card-text>
        </v-col>
        <v-col cols="auto" class="mx-2">
          <v-btn color="primary">{{ $t('common.help') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <slot></slot>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import type { PropType } from '@vue/composition-api';
import type { LocaleTranslation } from '@intake24/common/types';
import localeContent, { LocaleContent } from '@intake24/survey/components/mixins/localeContent';

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  name: 'PortionLayout',

  mixins: [localeContent],

  props: {
    text: {
      type: Object as PropType<LocaleTranslation<string>>,
      required: true,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      default: null,
    },
  },

  computed: {
    localeText(): string {
      return this.getLocaleContent(this.text);
    },

    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
  },
});
</script>

<style lang="scss" scoped></style>
