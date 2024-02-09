<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ i18n.name }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat :tile="isMobile">
        <slot name="prompt-description">
          <div
            v-if="i18n.description"
            :class="{ 'pb-4': !hasDefaultSlot }"
            v-html="i18n.description"
          ></div>
        </slot>
        <slot></slot>
        <v-card-actions
          v-if="isInMultiPrompt || !isMobile || prompt.actions?.both"
          id="actions"
          class="pa-0 d-flex flex-column-reverse flex-md-row align-stretch ga-3"
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
              <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
              {{ translate(item.text) }}
            </v-btn>
          </template>
          <template v-else>
            <slot name="actions"></slot>
          </template>
        </v-card-actions>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'PanelLayout',

  mixins: [layoutMixin],
});
</script>

<style lang="scss"></style>
