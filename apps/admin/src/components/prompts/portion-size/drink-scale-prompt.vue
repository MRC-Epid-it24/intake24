<template>
  <v-tabs-window-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :label="$t('survey-schemes.prompts.badges')"
          :model-value="badges"
          @update:model-value="update('badges', $event)"
        />
        <v-switch
          class="mt-4"
          hide-details="auto"
          :label="$t('survey-schemes.prompts.leftovers')"
          :model-value="leftovers"
          @update:model-value="update('leftovers', $event)"
        />
        <v-select
          class="mt-4"
          hide-details="auto"
          :items="multipleItems"
          :label="$t('survey-schemes.prompts.multiple._')"
          :model-value="typeof multiple === 'boolean' ? false : multiple.type"
          variant="outlined"
          @update:model-value="updateMultiple($event)"
        />
        <component
          :is="multiple.type"
          v-if="multiple"
          class="mt-4"
          :model-value="multiple"
          @update:model-value="update('multiple', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <image-map-settings
          :model-value="imageMap"
          @update:model-value="update('imageMap', $event)"
        />
      </v-col>
    </v-row>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Prompts } from '@intake24/common/prompts';
import { CounterSettings, ImageMapSettings, SliderSettings, useBasePrompt, useMultiple } from '../partials';

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: {
    Counter: CounterSettings,
    ImageMapSettings,
    Slider: SliderSettings,
  },

  props: {
    badges: {
      type: Boolean as PropType<Prompts['drink-scale-prompt']['badges']>,
      required: true,
    },
    imageMap: {
      type: Object as PropType<Prompts['drink-scale-prompt']['imageMap']>,
      required: true,
    },
    leftovers: {
      type: Boolean as PropType<Prompts['drink-scale-prompt']['leftovers']>,
      required: true,
    },
    multiple: {
      type: [Boolean, Object] as PropType<Prompts['drink-scale-prompt']['multiple']>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { update } = useBasePrompt(props, ctx);
    const { multipleItems, updateMultiple } = useMultiple(props, ctx);

    return { multipleItems, update, updateMultiple };
  },
});
</script>

<style lang="scss" scoped></style>
