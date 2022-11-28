<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
    ></prompt-content>
    <prompt-actions :actions="actions" @update:actions="update('actions', $event)"></prompt-actions>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="leftovers"
            :label="$t('survey-schemes.questions.leftovers')"
            @change="update('leftovers', $event)"
          >
          </v-switch>
        </v-col>
        <v-col cols="12" md="6">
          <image-map-settings :image-map="imageMap" @update:imageMap="update('imageMap', $event)">
          </image-map-settings>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CerealPromptProps } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'CerealPrompt',

  components: { ImageMapSettings },

  mixins: [basePrompt],

  props: {
    imageMap: {
      type: Object as PropType<CerealPromptProps['imageMap']>,
      required: true,
    },
    leftovers: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
