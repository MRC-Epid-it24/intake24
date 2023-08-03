<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>fas fa-sliders</v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.slider._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.slider.min')"
            name="min"
            outlined
            :rules="isNumber"
            :value="slider.min"
            @input="update('min', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.slider.max')"
            name="max"
            outlined
            :rules="isNumber"
            :value="slider.max"
            @input="update('max', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.slider.step')"
            name="step"
            outlined
            :rules="isNumber"
            :value="slider.step"
            @input="update('step', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.slider.initial')"
            name="initial"
            outlined
            :rules="isNumber"
            :value="slider.initial"
            @input="update('initial', $event)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Slider } from '@intake24/common/prompts';

export default defineComponent({
  name: 'SliderSettings',

  props: {
    slider: {
      type: Object as PropType<Slider>,
      required: true,
    },
  },

  emits: ['update:slider'],

  setup(props, { emit }) {
    const isNumber = computed(() => [
      (value: string | null): boolean | string =>
        !Number.isNaN(value) || 'Value needs to be a number.',
    ]);

    const update = (field: keyof Slider, value: boolean) => {
      emit(`update:slider`, { ...props.slider, [field]: Number(value) });
    };

    return { isNumber, update };
  },
});
</script>

<style lang="scss" scoped></style>
