<template>
  <v-tab-item :key="type">
    <v-container>
      <v-alert v-if="prompts.length === 0" color="secondary" text type="info">
        {{ $t(`survey-schemes.prompts.${type}.noPrompts`) }}
      </v-alert>
      <v-row v-else>
        <v-col v-for="prompt in prompts" :key="prompt.id" cols="12" md="3">
          <v-item v-slot="{ active, toggle }" :value="prompt.component">
            <v-card
              :color="active ? 'secondary' : ''"
              dark
              height="180"
              @click.stop="tryToggle(active, toggle)"
            >
              <v-card-title class="justify-center">
                {{ $t(`survey-schemes.prompts.${prompt.id}.title`) }}
              </v-card-title>
              <v-card-subtitle class="text-center">
                {{ $t(`survey-schemes.prompts.${prompt.id}.subtitle`) }}
              </v-card-subtitle>
              <v-card-text v-show="active" class="text-center">
                <v-icon x-large>$check</v-icon>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>
<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompt, PromptType } from '@intake24/common/prompts';

export default defineComponent({
  name: 'PromptTypeSelector',

  props: {
    type: {
      type: String as PropType<PromptType>,
      required: true,
    },
    prompts: {
      type: Array as PropType<Prompt[]>,
      default: () => [],
    },
  },

  methods: {
    tryToggle(active: boolean, toggle: () => void) {
      if (active) return;

      toggle();
    },
  },
});
</script>
