<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-sheet>
      <v-item-group v-if="availableMethods.length" v-model="option">
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
                      {{ $t(`prompts.${type}.description.${availableMethod.description}`) }}
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
    </v-sheet>
    <template #actions>
      <!-- Should not have actions -> only click & select -->
      <div></div>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';

import { ImagePlaceholder } from '../../elements';
import createBasePortion from './createBasePortion';

export interface PortionSizeOptionState {
  option: number | null;
}

export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  components: { ImagePlaceholder },

  mixins: [createBasePortion<'portion-size-option-prompt', PortionSizeOptionState>()],

  props: {
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
  },

  data() {
    return {
      option: this.initialState?.option ?? undefined,
    };
  },

  computed: {
    validConditions(): boolean[] {
      return [false];
    },
  },

  watch: {
    option(val) {
      this.clearErrors();

      if (val === undefined) return;

      this.update();
      this.action('next');
    },
  },

  mounted() {
    if (this.option === undefined && this.availableMethods.length === 1) this.option = 0;
  },

  methods: {
    update() {
      const state: PortionSizeOptionState = { option: this.option ?? null };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
