<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-sheet>
      <v-item-group v-model="option">
        <v-container>
          <v-row>
            <v-col
              v-for="(availableMethod, index) in availableMethods"
              :key="index"
              cols="12"
              md="4"
              sm="6"
            >
              <v-item v-slot="{ toggle }">
                <v-card border-color="primary" hover outlined @click="toggle">
                  <v-img :aspect-ratio="3 / 2" :src="availableMethod.imageUrl">
                    <template #placeholder>
                      <image-placeholder></image-placeholder>
                    </template>
                  </v-img>
                  <v-card-actions class="d-flex justify-end">
                    <v-chip class="font-weight-medium px-4" rounded>
                      {{ $t(`portion.${method}.description.${availableMethod.description}`) }}
                    </v-chip>
                  </v-card-actions>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-sheet>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PortionSizeOptionPromptProps } from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';

import { ImagePlaceholder } from '../../elements';
import createBasePortion from './createBasePortion';

export interface PortionSizeOptionState {
  option: number | null;
}

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  components: { ImagePlaceholder },

  mixins: [createBasePortion<PortionSizeOptionPromptProps, PortionSizeOptionState>()],

  props: {
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
    promptProps: {
      type: Object as PropType<PortionSizeOptionPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      method: 'option',
      option: this.initialState?.option ?? undefined,
    };
  },

  computed: {
    isValid(): boolean {
      return this.option !== null;
    },
  },

  watch: {
    option(val) {
      this.clearErrors();

      if (val === undefined) return;

      this.update();
      this.submit();
    },
  },

  mounted() {
    if (this.option === undefined && this.availableMethods.length === 1) this.option = 0;
  },

  methods: {
    update() {
      const state: PortionSizeOptionState = { option: this.option };

      this.$emit('update', { state, valid: this.isValid });
    },

    submit() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
