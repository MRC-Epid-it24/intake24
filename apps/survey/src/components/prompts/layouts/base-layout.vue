<template>
  <div>
    <v-card class="mb-4" :tile="isMobile">
      <breadcrumbs v-bind="{ food, meal, promptName: i18n.name }"></breadcrumbs>
      <slot name="prompt-text">
        <v-card-text v-if="i18n.text" class="pt-0">
          <v-divider class="mb-2"></v-divider>
          <h3>{{ i18n.text }}</h3>
        </v-card-text>
      </slot>
    </v-card>
    <slot name="prompt-description">
      <v-card v-if="i18n.description" class="mb-4" :tile="isMobile">
        <div class="pa-4" v-html="i18n.description"></div>
      </v-card>
    </slot>
    <slot></slot>
    <div
      v-if="!isMobile || prompt.actions?.both"
      id="actions"
      class="pa-5 px-md-0 d-flex flex-column-reverse flex-md-row align-stretch gap-3"
    >
      <template v-if="desktopActions.length">
        <v-btn
          v-for="item in desktopActions"
          :key="item.type"
          class="px-4"
          :color="item.color"
          :disabled="item.type === 'next' && !isValid"
          large
          :outlined="item.variant === 'outlined'"
          :text="item.variant === 'text'"
          :title="Object.keys(item.label).length ? translate(item.label) : translate(item.text)"
          @click="item.type === 'next' ? next() : action(item.type, foodOrMealId, item.params)"
        >
          {{ translate(item.text) }}
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
      color="primary"
      fixed
      :value="navTab"
    >
      <meal-list-mobile v-if="showSummary" v-bind="{ meals }" @action="action"></meal-list-mobile>
      <template v-if="mobileActions.length">
        <template v-for="(item, idx) in mobileActions">
          <v-btn
            :key="item.type"
            :color="item.type === 'next' ? 'primary' : undefined"
            :disabled="item.type === 'next' && !isValid"
            :outlined="item.variant === 'outlined'"
            :text="item.variant === 'text'"
            :title="Object.keys(item.label).length ? translate(item.label) : translate(item.text)"
            :value="item.type"
            @click="item.type === 'next' ? next() : action(item.type, foodOrMealId, item.params)"
          >
            <span class="text-overline font-weight-medium">
              {{ translate(item.text) }}
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
          <v-btn
            :color="isValid ? 'primary' : 'secondary'"
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
import { MealListMobile } from '@intake24/survey/components/layouts/meal-list';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'BaseLayout',

  components: { MealListMobile },

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
