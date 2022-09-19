<template>
  <v-row justify="center" :no-gutters="isMobile">
    <v-col cols="12" sm="auto">
      <v-card
        :class="{ 'mt-10': !isMobile }"
        :flat="isMobile"
        :tile="isMobile"
        :width="!isMobile ? width : undefined"
      >
        <div class="d-flex justify-center align-center py-4">
          <slot name="logo">
            <v-avatar>
              <img alt="logo" :src="logo" />
            </v-avatar>
          </slot>
          <slot name="title">
            <v-card-title class="text-h2 font-weight-medium justify-center">
              {{ title }}
            </v-card-title>
          </slot>
        </div>
        <slot name="subtitle">
          <v-card-subtitle class="text-center font-weight-medium px-6 py-0">
            {{ subtitle }}
          </v-card-subtitle>
        </slot>
        <slot></slot>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EntryScreen',

  props: {
    logo: {
      type: String,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    width: {
      type: String,
    },
  },
});
</script>

<style lang="scss"></style>
