<template>
  <div>
    <v-card class="px-5 py-4 mb-4" :flat="isMobile" :tile="isMobile">
      <h3>
        <slot name="prompt-text">{{ localeText }}</slot>
      </h3>
      <slot name="prompt-description">
        <div v-if="localeDescription" class="mt-4" v-html="localeDescription"></div>
      </slot>
    </v-card>
    <slot></slot>
    <div
      v-if="!isMobile || prompt.actions?.both"
      id="actions"
      class="pa-5 px-md-0 d-flex"
      :class="{ 'flex-column-reverse': isMobile }"
    >
      <template v-if="desktopActions.length">
        <v-btn
          v-for="item in desktopActions"
          :key="item.type"
          :block="isMobile"
          class="px-4"
          :color="item.color"
          :disabled="item.type === 'next' && !isValid"
          large
          :title="
            Object.keys(item.label).length
              ? getLocaleContent(item.label)
              : getLocaleContent(item.text)
          "
          @click="item.type === 'next' ? next() : action(item.type, foodOrMealId)"
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
      id="actions"
      app
      class="bottom-navigation"
      color="secondary"
      fixed
      grow
      :value="navTab"
    >
      <template v-if="mobileActions.length">
        <template v-for="(item, idx) in mobileActions">
          <v-btn
            :key="item.type"
            :color="item.type === 'next' ? 'secondary' : undefined"
            :disabled="item.type === 'next' && !isValid"
            :title="
              Object.keys(item.label).length
                ? getLocaleContent(item.label)
                : getLocaleContent(item.text)
            "
            :value="item.type"
            @click="item.type === 'next' ? next() : action(item.type, foodOrMealId)"
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
          <v-btn value="addMeal" @click.stop="action('addMeal')">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.addMeal') }}
            </span>
            <v-icon class="pb-1">$add</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn value="review" @click.stop="action('review')">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.review') }}
            </span>
            <v-icon class="pb-1">$survey</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            :color="isValid ? 'secondary' : 'primary'"
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

import type { EncodedFood, MissingFood } from '@intake24/common/types';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'BaseLayout',

  mixins: [layoutMixin],

  props: {
    food: {
      type: Object as PropType<EncodedFood | MissingFood>,
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
