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
          :label="$t('survey-schemes.prompts.drink-scale-prompt.multiple')"
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
        <image-map-settings :image-map="imageMap" @update:image-map="update('imageMap', $event)" />
      </v-col>
    </v-row>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { counterDefaults, drinkScalePrompt, sliderDefaults } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

import { CounterSettings, ImageMapSettings, SliderSettings, useBasePrompt } from '../partials';

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
    const { i18n } = useI18n();
    const { update } = useBasePrompt(props, ctx);
    const multiDefaults = {
      counter: counterDefaults,
      slider: sliderDefaults,
    };
    const multipleTypes = [false, 'slider', 'counter'] as const;
    const multipleItems = multipleTypes.map(value => ({
      value,
      title: value ? i18n.t(`survey-schemes.prompts.${value}._`) : i18n.t('common.disabled'),
    }));

    const updateMultiple = (value: typeof multipleTypes[number] | boolean) => {
      update('multiple', typeof value === 'string' ? multiDefaults[value] : false);
    };

    return { drinkScalePrompt, multipleItems, update, updateMultiple };
  },
});
</script>

<style lang="scss" scoped></style>
