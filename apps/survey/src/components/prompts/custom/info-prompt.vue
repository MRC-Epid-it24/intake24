<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="updateAndAction"
  >
    <template #actions>
      <next v-if="isValid" @click="updateAndAction('next')" />
    </template>
    <template #nav-actions>
      <next-mobile v-if="isValid" @click="updateAndAction('next')" />
    </template>
    <v-carousel
      v-if="prompt.carousel"
      v-model="carousel"
      class="py-4 carousel"
      :continuous="false"
      height="100%"
      hide-delimiters
    >
      <template #prev="{ props }">
        <v-btn
          class="opacity-80"
          :color="prompt.carousel.color"
          :icon="props.icon"
          variant="flat"
          @click="props.onClick"
        />
      </template>
      <template #next="{ props }">
        <v-btn
          class="opacity-80"
          :color="prompt.carousel.color"
          :icon="props.icon"
          variant="flat"
          @click="props.onClick"
        />
      </template>
      <v-carousel-item v-for="(item, idx) in prompt.carousel.slides" :key="idx" class="px-6" eager>
        <v-card
          border
          class="border-xl rounded-lg"
          :class="`border-${prompt.carousel.color}`"
          flat
        >
          <v-card
            class="px-6 py-4"
            :color="prompt.carousel.color"
            flat
            tile
            :variant="prompt.carousel.variant"
          >
            <div v-html="item.text.en" />
          </v-card>
          <v-img
            v-if="item.image[$vuetify.display.mobile ? 'mobile' : 'desktop']"
            class="mx-auto rounded-lg"
            eager
            :min-width="$vuetify.display.mobile ? '100%' : '350px'"
            :src="item.image[$vuetify.display.mobile ? 'mobile' : 'desktop'] ?? ''"
            width="auto"
          />
        </v-card>
      </v-carousel-item>
    </v-carousel>
    <div v-if="prompt.video" class="pa-4">
      <div class="iframe-container">
        <div ref="video" />
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';
import { useCarousel, useYoutubeVideo } from '../partials';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [createBasePrompt<'info-prompt'>()],

  props: {
    modelValue: {
      type: String,
      default: 'next',
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    const updateAndAction = (type: string, ...args: [id?: string, params?: object]) => {
      state.value = type;
      action(type, ...args);
    };

    const { video, watched: videoWatched } = useYoutubeVideo(props.prompt, updateAndAction);
    const { carousel, watched: carouselWatched } = useCarousel(props.prompt);

    const isVideoValid = computed(() => !props.prompt.video?.required || videoWatched.value);
    const isCarouselValid = computed(() => !props.prompt.carousel?.required || carouselWatched.value);

    const isValid = computed(() => isVideoValid.value && isCarouselValid.value);

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    return {
      customPromptLayout,
      isValid,
      state,
      updateAndAction,
      video,
      carousel,
    };
  },
});
</script>

<style lang="scss">
.carousel {
  .v-window__controls {
    padding: 0 4px !important;
  }
}
</style>
