<template>
  <div>
    <v-card class="mb-3" flat :tile="isMobile">
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
    <div v-if="!isMobile" class="pa-4 px-md-0 d-flex" :class="{ 'flex-column-reverse': isMobile }">
      <slot name="actions"></slot>
    </div>
    <v-bottom-navigation
      v-if="isMobile"
      app
      background-color="secondary"
      class="bottom-navigation"
      dark
      fixed
      grow
      :value="navTab"
      @change="navAction"
    >
      <slot name="nav-actions">
        <v-btn value="add-meal">
          <span class="text-overline font-weight-medium" color="primary">
            {{ $t('prompts.addMeal.yes') }}
          </span>
          <v-icon class="pb-1">$plus</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn value="review">
          <span class="text-overline font-weight-medium">Review</span>
          <v-icon class="pb-1">$survey</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :color="isValid ? 'success' : 'primary'"
          :disabled="!isValid"
          value="next"
          @click="next"
        >
          <span class="text-overline font-weight-medium">
            {{ $t('common.action.continue') }}
          </span>
          <v-icon class="pb-1">$next</v-icon>
        </v-btn>
      </slot>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  Dictionary,
  EncodedFood,
  LocaleTranslation,
  PortionSizeMethodId,
} from '@intake24/common/types';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'PortionLayout',

  mixins: [layoutMixin],

  props: {
    food: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
    method: {
      type: String as PropType<PortionSizeMethodId | 'option'>,
      required: true,
    },
  },

  computed: {
    localeText() {
      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName } = this;
      if (localeFoodName) params.food = localeFoodName;
      if (localeMealName) params.meal = localeMealName;

      return this.getLocaleContent(this.text, { path: `portion.${this.method}.text`, params });
    },
  },

  methods: {
    update(action: string) {
      this.$emit('update:navAction', action);
    },

    navAction(action: string) {
      if (action === 'next') return;

      this.update(action);
      this.$emit('nav-action', action);
    },

    next() {
      this.update('next');
      this.$emit('nav-action', 'next');
    },
  },
});
</script>

<style lang="scss">
.bottom-navigation .v-btn {
  max-width: unset !important;
}
</style>
