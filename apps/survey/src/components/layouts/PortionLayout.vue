<template>
  <v-container>
    <v-row>
      <v-col>
        {{ $t('portion.common.backStep') }}
      </v-col>
    </v-row>
    <v-card>
      <v-card>
        <v-row>
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
    </v-card>
    <slot></slot>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { LocaleTranslation } from '@common/types';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  name: 'PortionLayout',

  mixins: [localeContent],

  props: {
    text: {
      type: Object as () => LocaleTranslation<string>,
      required: true,
    },
    description: {
      type: Object as () => LocaleTranslation,
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
