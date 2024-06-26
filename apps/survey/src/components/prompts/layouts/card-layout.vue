<template>
  <div>
    <v-card class="mb-4" :tile="isMobile">
      <breadcrumbs v-bind="{ food, meal, promptName: i18n.name }" />
      <slot name="prompt-text">
        <v-card-text v-if="i18n.text" class="pt-0">
          <v-divider class="mb-2" />
          <h3>{{ i18n.text }}</h3>
        </v-card-text>
      </slot>
    </v-card>
    <v-card :tile="isMobile">
      <slot name="prompt-description">
        <div
          v-if="i18n.description"
          class="px-4 pt-4"
          :class="{ 'pb-4': !hasDefaultSlot }"
          v-html="i18n.description"
        />
      </slot>
      <slot />
      <v-card-actions
        v-if="!isMobile || prompt.actions?.both"
        id="actions"
        class="px-4 pt-0 pb-4 d-flex flex-column-reverse flex-md-row align-stretch ga-3"
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
            @click="action(item.type, foodOrMealId, item.params)"
          >
            <v-icon v-if="item.icon" left>
              {{ item.icon }}
            </v-icon>
            {{ translate(item.text) }}
          </v-btn>
        </template>
        <template v-else>
          <slot name="actions" />
        </template>
      </v-card-actions>
      <div v-if="!isInMultiPrompt && isMobile" id="actions" class="bottom-navigation">
        <div v-if="showSummary" class="bottom-navigation__summary">
          <meal-list-mobile v-bind="{ meals }" @action="action" />
        </div>
        <div v-if="mobileActions.length || hasNavActionsSlot" class="bottom-navigation__actions">
          <template v-if="mobileActions.length">
            <template v-for="(item, idx) in mobileActions">
              <v-btn
                :key="item.type"
                :color="item.color"
                :disabled="item.type === 'next' && !isValid"
                :text="['outlined', 'text'].includes(item.variant)"
                :title="
                  Object.keys(item.label).length ? translate(item.label) : translate(item.text)
                "
                :value="item.type"
                @click="action(item.type, foodOrMealId, item.params)"
              >
                <span class="text-overline font-weight-medium">
                  {{ translate(item.text) }}
                </span>
                <v-icon v-if="item.icon" class="pb-1">
                  {{ item.icon }}
                </v-icon>
              </v-btn>
              <v-divider
                v-if="idx + 1 < mobileActions.length"
                :key="`div-${item.type}`"
                vertical
              />
            </template>
          </template>
          <template v-else>
            <slot name="nav-actions" />
          </template>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { MealListMobile } from '@intake24/survey/components/layouts/meal-list';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'CardLayout',

  components: { MealListMobile },

  mixins: [layoutMixin],
});
</script>

<style lang="scss"></style>
