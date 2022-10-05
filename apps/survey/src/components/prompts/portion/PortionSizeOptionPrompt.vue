<template>
  <portion-layout v-bind="{ description, text }">
    <template #header>
      {{ $t('portion.option.label', { food: localeFoodName }) }}
    </template>
    <v-sheet>
      <v-item-group v-model="currentValue">
        <v-container>
          <v-row>
            <v-col v-for="(method, index) in availableMethods" :key="index" cols="12" md="4" sm="6">
              <v-item v-slot="{ toggle }">
                <v-card border-color="primary" hover outlined @click="toggle">
                  <v-img :aspect-ratio="3 / 2" :src="method.imageUrl">
                    <template #placeholder>
                      <image-placeholder></image-placeholder>
                    </template>
                  </v-img>
                  <v-card-actions class="d-flex justify-end">
                    <v-chip class="font-weight-medium px-4" rounded>
                      {{ $t(`portion.option.description.${method.description}`) }}
                    </v-chip>
                  </v-card-actions>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
      <v-row>
        <v-col>
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
        </v-col>
      </v-row>
    </v-sheet>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PortionSizeOptionPromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { portionSizeOptionPromptDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import { ImagePlaceholder } from '../../elements';
import BasePortion from './BasePortion';

export interface PortionSizeOptionState {
  option: number | null;
}

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  components: { ImagePlaceholder },

  mixins: [BasePortion],

  props: {
    promptProps: {
      type: Object as PropType<PortionSizeOptionPromptProps>,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
    initialValue: {
      type: Object as PropType<PortionSizeOptionState>,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      ...merge(portionSizeOptionPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      currentValue: this.initialValue?.option ?? undefined,
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    hasErrors(): boolean {
      return !!this.errors.length;
    },

    isValid() {
      return this.currentValue !== undefined;
    },
  },

  watch: {
    currentValue(val) {
      this.clearErrors();

      if (val === undefined) return;

      this.update();
      this.submit();
    },
  },

  async mounted() {
    if (this.currentValue === undefined && this.availableMethods.length === 1)
      this.currentValue = 0;
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    update() {
      this.$emit('update', { option: this.currentValue });
    },

    submit() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
