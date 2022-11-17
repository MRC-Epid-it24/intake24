<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="px-4 pt-4" :class="{ 'pb-4': !hasDefaultSlot }">
        <h3>{{ localeText }}</h3>
        <div v-if="localeDescription" class="mt-4" v-html="localeDescription"></div>
      </v-sheet>
    </slot>
    <v-card-text v-if="hasDefaultSlot">
      <slot></slot>
    </v-card-text>
    <v-card-actions
      v-if="!isMobile"
      class="pa-4 d-flex"
      :class="{ 'flex-column-reverse': isMobile }"
    >
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
    </v-card-actions>
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
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'PromptLayout',

  mixins: [layoutMixin],
});
</script>

<style lang="scss">
.bottom-navigation .v-btn {
  max-width: unset !important;
}
</style>
