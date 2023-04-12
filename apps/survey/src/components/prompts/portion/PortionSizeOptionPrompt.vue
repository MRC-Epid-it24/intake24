<template>
  <card-layout v-bind="{ food, prompt, isValid }" @action="action">
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
                border-color="primary"
                :color="active ? 'orange lighten-5' : ''"
                hover
                outlined
                @click="click(toggle)"
              >
                <v-img :aspect-ratio="3 / 2" :src="availableMethod.imageUrl">
                  <template #placeholder>
                    <image-placeholder></image-placeholder>
                  </template>
                </v-img>
                <v-card-actions class="d-flex justify-end">
                  <v-chip
                    class="font-weight-medium px-4"
                    :color="option === index ? 'secondary' : 'orange lighten-5'"
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
    <template v-if="!optionValid" #actions>
      <div></div>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';

import { ImagePlaceholder } from '../../elements';
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

  emits: ['update'],

  data() {
    return {
      option: this.initialState.option ?? undefined,
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

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
