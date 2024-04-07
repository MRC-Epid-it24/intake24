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
                :elevation="active ? '4' : undefined"
                height="100%"
                hover
                outlined
                @click="click(toggle)"
              >
                <component :is="availableMethod.method" :method="availableMethod" />
                <v-card-actions
                  class="d-flex justify-end"
                  :class="{ 'grey lighten-4': !active, 'ternary': active }"
                >
                  <v-chip
                    class="font-weight-medium px-4"
                    :color="option === index ? 'info' : 'primary'"
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
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';

import createBasePortion from './createBasePortion';
import options from './options';

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  components: { ...options },

  mixins: [createBasePortion<'portion-size-option-prompt'>()],

  props: {
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
  },

  emits: ['input'],

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

      if (!this.optionValid)
        return;

      this.action('next');
    },

    change() {
      this.clearErrors();

      if (!this.optionValid)
        return;

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
