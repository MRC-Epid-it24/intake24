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
      <template v-if="desktopActions.length">
        <v-btn
          v-for="item in desktopActions"
          :key="item.type"
          :block="isMobile"
          class="px-5"
          :color="item.color"
          :disabled="item.type === 'next' && !isValid"
          large
          :title="
            Object.keys(item.label).length
              ? getLocaleContent(item.label)
              : getLocaleContent(item.text)
          "
          @click="item.type === 'next' ? next() : action(item.type)"
        >
          {{ getLocaleContent(item.text) }}
        </v-btn>
      </template>
      <template v-else>
        <slot name="actions">
          <next :disabled="!isValid" @click="next"></next>
        </slot>
      </template>
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
      @change="action"
    >
      <template v-if="mobileActions.length">
        <template v-for="(item, idx) in mobileActions">
          <v-btn
            :key="item.type"
            :color="item.color"
            :disabled="item.type === 'next' && !isValid"
            :title="
              Object.keys(item.label).length
                ? getLocaleContent(item.label)
                : getLocaleContent(item.text)
            "
            :value="item.type"
            @click="item.type === 'next' ? next() : undefined"
          >
            <span class="text-overline font-weight-medium">
              {{ getLocaleContent(item.text) }}
            </span>
            <v-icon v-if="item.icon" class="pb-1">{{ item.icon }}</v-icon>
          </v-btn>
          <v-divider
            v-if="idx + 1 < mobileActions.length"
            :key="`div-${item.type}`"
            vertical
          ></v-divider>
        </template>
      </template>
      <template v-else>
        <slot name="nav-actions">
          <v-btn value="addMeal">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.addMeal') }}
            </span>
            <v-icon class="pb-1">$add</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn value="review">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.review') }}
            </span>
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
              {{ $t('recall.actions.nav.next') }}
            </span>
            <v-icon class="pb-1">$next</v-icon>
          </v-btn>
        </slot>
      </template>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Dictionary, EncodedFood, PortionSizeMethodId } from '@intake24/common/types';

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
});
</script>

<style lang="scss">
.bottom-navigation .v-btn {
  max-width: unset !important;
}
</style>
