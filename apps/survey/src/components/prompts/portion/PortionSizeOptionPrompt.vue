<template>
  <portion-layout :description="promptProps.description" :text="promptProps.text">
    <template #header>
      {{ $t('portion.option.label', { food: localeDescription }) }}
    </template>
    <v-sheet>
      <v-item-group v-model="currentValue">
        <v-container>
          <v-row>
            <v-col v-for="(method, index) in availableMethods" :key="index" cols="12" md="4" sm="6">
              <v-item v-slot="{ active, toggle }">
                <v-card
                  border-color="primary"
                  :elevation="active ? 12 : 0"
                  outlined
                  @click="toggle"
                >
                  <v-img :aspect-ratio="3 / 2" :src="method.imageUrl">
                    <template #placeholder>
                      <div
                        class="d-flex"
                        style="
                           {
                            width: 100%;
                            height: 100%;
                          }
                        "
                      >
                        <v-progress-circular
                          class="ma-auto"
                          color="primary"
                          indeterminate
                          :size="100"
                          :width="10"
                        ></v-progress-circular>
                      </div>
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

import type { BasePromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { basePromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from './BasePortion';

export interface PortionSizeOptionState {
  option: number | null;
}

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<BasePromptProps>,
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
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      currentValue: this.initialValue?.option ?? undefined,
    };
  },

  computed: {
    localeDescription(): string | null {
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

      this.update(val);
    },
  },

  methods: {
    update(index: number) {
      this.$emit('update', { option: index });

      this.submit();
    },

    clearErrors() {
      this.errors = [];
    },

    submit() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
