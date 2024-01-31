<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>fas fa-sliders</v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.slider._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col class="pa-0 pr-1" cols="12" md="6">
          <v-card flat>
            <v-tabs v-model="tab" grow>
              <v-tab
                v-for="item in tabs"
                :key="item"
                :tab-value="item"
                :title="$t(`survey-schemes.prompts.slider.${item}.value`)"
              >
                {{ $t(`survey-schemes.prompts.slider.${item}.value`) }}
              </v-tab>
            </v-tabs>
            <v-card-text>
              <v-tabs-items v-model="tab" class="pt-1">
                <v-tab-item v-for="item in tabs" :key="item" :value="item">
                  <v-text-field
                    hide-details="auto"
                    :label="$t(`survey-schemes.prompts.slider.${item}.value`)"
                    :name="item"
                    outlined
                    :value="slider[item].value"
                    @input="
                      slider[item].value = Number.isNaN(parseFloat($event))
                        ? null
                        : parseFloat($event)
                    "
                  ></v-text-field>
                  <v-switch
                    class="mb-4"
                    hide-details="auto"
                    :input-value="slider[item].label"
                    :label="$t(`survey-schemes.prompts.slider.${item}.label`)"
                    @change="updateLabel(item, $event)"
                  >
                  </v-switch>
                  <language-selector
                    v-if="slider[item].label"
                    v-model="slider[item].label"
                    flat
                    :label="$t(`survey-schemes.prompts.slider.${tab}.label`).toString()"
                  >
                    <template v-for="lang in Object.keys(slider[item].label)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="slider[item].label[lang]"
                        hide-details="auto"
                        :label="$t(`survey-schemes.prompts.slider.${item}.label`)"
                        :name="`${item}.${lang}`"
                        outlined
                      ></v-text-field>
                    </template>
                  </language-selector>
                  <v-text-field
                    v-if="item === 'current'"
                    v-model.number="slider[item].size"
                    hide-details="auto"
                    :label="$t(`survey-schemes.prompts.slider.${item}.size`)"
                    name="current"
                    outlined
                    :rules="isNumber"
                  ></v-text-field>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="6">
          <v-card-text>
            <v-text-field
              v-model.number="slider.step"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.slider.step')"
              name="step"
              outlined
              :rules="isNumber"
            ></v-text-field>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { Slider } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';

export default defineComponent({
  name: 'SliderSettings',

  components: { LanguageSelector },

  props: {
    modelValue: {
      type: Object as PropType<Slider>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const tabs = ['current', 'min', 'max'] as const;
    const tab = ref(tabs[0]);
    const isNumber = computed(() => [
      (value: string | null): boolean | string =>
        !Number.isNaN(value) || 'Value needs to be a number.',
    ]);

    const slider = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const updateLabel = (key: keyof Pick<Slider, 'current' | 'min' | 'max'>, value: boolean) => {
      slider.value[key].label = value ? { en: '' } : false;
    };

    return { isNumber, slider, updateLabel, tab, tabs };
  },
});
</script>

<style lang="scss" scoped></style>
