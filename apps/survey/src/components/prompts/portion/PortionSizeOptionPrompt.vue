<template>
  <card-layout v-bind="{ food, prompt, section, isValid }" @action="action">
    <v-item-group
      v-if="availableMethods.length"
      v-model="option"
      :mandatory="optionValid"
      @change="change"
    >
      <v-container>
        <v-row>
          <v-col
            v-for="(availableMethod, index) in availableMethods"
            :key="index"
            cols="12"
            md="4"
            sm="6"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                border-color="secondary"
                class="d-flex flex-column justify-space-between"
                height="100%"
                hover
                outlined
                @click="click(toggle)"
              >
                <div
                  v-if="availableMethod.method === 'standard-portion'"
                  class="d-flex justify-center flex-grow-1"
                >
                  <v-radio-group
                    v-if="Object.keys(standardUnitRefs).length"
                    hide-details="auto"
                    :value="standardUnitSelected"
                  >
                    <v-radio v-for="unit in standardUnits.slice(0, 4)" :key="unit" :value="unit">
                      <template #label>
                        <i18n class="font-weight-medium" path="prompts.standardPortion.estimateIn">
                          <template #unit>
                            {{ translate(standardUnitRefs[unit].estimateIn) }}
                          </template>
                        </i18n>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
                <v-img v-else :aspect-ratio="3 / 2" :src="availableMethod.imageUrl">
                  <template #placeholder>
                    <image-placeholder></image-placeholder>
                  </template>
                </v-img>
                <v-card-actions
                  class="d-flex justify-end"
                  :class="{ 'grey lighten-5': !active, ternary: active }"
                >
                  <v-chip
                    class="font-weight-medium px-4"
                    :color="option === index ? 'primary' : 'ternary'"
                  >
                    {{ $t(`prompts.${type}.selections.${availableMethod.description}`) }}
                  </v-chip>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <v-alert v-else border="left" outlined type="warning">
      {{ $t('prompts.unknown.text', { food: foodName }) }}
    </v-alert>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { useI18n } from '@intake24/i18n';

import { ImagePlaceholder } from '../../elements';
import { useStandardUnits } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  components: { ImagePlaceholder },

  mixins: [createBasePortion<'portion-size-option-prompt'>()],

  props: {
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props) {
    const { translate } = useI18n();
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const standardUnits = computed(() => {
      const standardPortionMethod = props.availableMethods.find(
        ({ method }) => method === 'standard-portion'
      );

      if (!standardPortionMethod) return [];

      return Object.entries(standardPortionMethod.parameters).reduce<string[]>(
        (acc, [key, value]) => {
          if (key.endsWith('-name')) acc.push(value);
          return acc;
        },
        []
      );
    });

    const selectNextStandardUnit = () => {
      const keys = Object.keys(standardUnitRefs.value);
      if (!keys.length) {
        clearStandardUnitTimer();
        return;
      }

      const index = keys.findIndex((key) => key === standardUnitSelected.value);

      standardUnitSelected.value = index === keys.length - 1 ? keys[0] : keys[index + 1];
    };

    const standardUnitInterval = ref<undefined | number>(undefined);
    const standardUnitSelected = ref('');
    const startStandardUnitTimer = () => {
      standardUnitInterval.value = setInterval(() => {
        selectNextStandardUnit();
      }, 1500);
    };

    const clearStandardUnitTimer = () => {
      clearInterval(standardUnitInterval.value);
    };

    onMounted(async () => {
      if (!standardUnits.value.length) return;

      await fetchStandardUnits(standardUnits.value);
      selectNextStandardUnit();
      startStandardUnitTimer();
    });

    onBeforeUnmount(() => {
      clearStandardUnitTimer();
    });

    return { translate, standardUnits, standardUnitRefs, standardUnitSelected };
  },

  data() {
    return {
      option: this.value.option ?? undefined,
    };
  },

  computed: {
    optionValid() {
      return this.option !== undefined;
    },

    validConditions(): boolean[] {
      return [this.optionValid];
    },
  },

  mounted() {
    if (!this.optionValid && this.availableMethods.length === 1) {
      this.option = 0;
      this.change();
      this.action('next');
    }
  },

  methods: {
    click(toggle: () => void) {
      toggle();

      if (!this.optionValid) return;

      this.action('next');
    },

    change() {
      this.clearErrors();

      if (!this.optionValid) return;

      this.update();
    },

    update() {
      const state: PromptStates['portion-size-option-prompt'] = { option: this.option ?? null };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
