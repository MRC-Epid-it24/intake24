<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-form ref="form" @submit.prevent="action('next')">
      <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <i18n-t :keypath="`prompts.${type}.source`" tag="span">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <template #actions>
              <expansion-panel-actions :valid="homemadeValid" />
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex flex-column gr-4">
              <yes-no-toggle v-model="homemadePrompt" class="align-self-start" mandatory />
              <div v-if="homemadePrompt === true">
                <i18n-t class="mb-2" :keypath="`prompts.${type}.homemade`" tag="div">
                  <template #food>
                    <span class="font-weight-medium">{{ foodName }}</span>
                  </template>
                </i18n-t>
                <v-textarea
                  v-model="info.description"
                  hide-details="auto"
                  name="description"
                  :rules="textFieldRules"
                  @update:model-value="update"
                />
              </div>
              <div v-if="homemadePrompt === false">
                <i18n-t class="mb-2" :keypath="`prompts.${type}.purchased`" tag="div">
                  <template #food>
                    <span class="font-weight-medium">{{ foodName }}</span>
                  </template>
                </i18n-t>
                <v-text-field
                  v-model="info.brand"
                  class="mb-4"
                  hide-details="auto"
                  name="brand"
                  :rules="textFieldRules"
                  @update:model-value="update"
                />
                <i18n-t class="mb-2" :keypath="`prompts.${type}.barcode`" tag="div">
                  <template #food>
                    <span class="font-weight-medium">{{ foodName }}</span>
                  </template>
                </i18n-t>
                <component
                  :is="`${prompt.barcode.type}-input`"
                  v-model:model-value="info.barcode"
                  hide-details="auto"
                  name="barcode"
                  :options="prompt.barcode"
                  outlined
                  :rules="barcodeRules"
                />
              </div>
              <v-btn
                v-if="homemadePrompt !== undefined"
                :class="$vuetify.display.mobile ? 'align-self-stretch' : 'align-self-start'"
                color="primary"
                :disabled="!homemadeValid"
                @click="confirm"
              >
                {{ $t('common.action.continue') }}
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <i18n-t :keypath="`prompts.${type}.portionSize`" tag="span">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <template #actions>
              <expansion-panel-actions :valid="!!info.portionSize" />
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-textarea
              v-model="info.portionSize"
              class="mb-4"
              hide-details="auto"
              name="portionSize"
              :rules="textFieldRules"
              @update:model-value="update"
            />
            <v-btn
              :block="$vuetify.display.mobile"
              color="primary"
              :disabled="!portionSizeValid"
              @click="confirm"
            >
              {{ $t('common.action.continue') }}
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { MissingFood } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { barcodes } from '@intake24/ui';

import { useForm } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'MissingFoodPrompt',

  components: { ...barcodes, YesNoToggle },

  mixins: [createBasePortion<'missing-food-prompt', MissingFood>()],

  emits: ['update:modelValue'],

  setup() {
    const { form, inputTooLog } = useForm();

    const formErrors = computed(() => form.value?.errors ?? []);
    const barcodeRules = computed(() => [inputTooLog(128)]);
    const textFieldRules = computed(() => [inputTooLog(1024)]);

    return {
      form,
      formErrors,
      barcodeRules,
      textFieldRules,
    };
  },

  data() {
    return {
      ...copy({
        ...this.modelValue,
        homemadePrompt:
          !this.modelValue.info.description && !this.modelValue.info.brand
            ? undefined
            : !!this.modelValue.info.description,
      }),
    };
  },

  computed: {
    homemadeValid() {
      return (
        this.formErrors.every(error => typeof error !== 'string' && !['description', 'brand', 'barcode'].includes(error.id.toString()))
        && ((this.homemadePrompt === true && !!this.info.description)
          || (this.homemadePrompt === false && !!this.info.brand))
      );
    },
    portionSizeValid() {
      return !!this.info.portionSize
        && this.formErrors.every(error => typeof error !== 'string' && !['portionSize'].includes(error.id.toString()));
    },
    validConditions(): boolean[] {
      return [!!this.form?.isValid, this.homemadeValid, this.portionSizeValid];
    },
  },

  methods: {
    confirm() {
      this.updatePanel();
    },

    update() {
      const state: PromptStates['missing-food-prompt'] = {
        info: this.info,
        panel: this.panel,
        homemadePrompt: this.homemadePrompt,
      };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
