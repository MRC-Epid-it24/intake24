<template>
  <v-tab-item key="options">
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.timePicker.allowedMinutes._') }}
          </v-card-title>
          <v-select
            :items="[1, 5, 10, 15, 20, 30]"
            outlined
            prepend-inner-icon="fas fa-stopwatch"
            :value="allowedMinutes"
            @input="update('allowedMinutes', $event)"
          >
            <template #item="{ item }">
              <i18n path="survey-schemes.prompts.timePicker.allowedMinutes.item">
                <template #item>
                  <v-chip>
                    <span>{{ item }}</span>
                  </v-chip>
                </template>
              </i18n>
            </template>
            <template #selection="{ item }">
              <i18n path="survey-schemes.prompts.timePicker.allowedMinutes.item">
                <template #item>
                  <v-chip>
                    <span>{{ item }}</span>
                  </v-chip>
                </template>
              </i18n>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" lg="4" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.timePicker.format._') }}
          </v-card-title>
          <v-btn-toggle
            class="d-flex"
            color="secondary"
            mandatory
            :value="format"
            @change="update('format', $event)"
          >
            <v-btn
              class="px-10 flex-grow-1 flex-md-grow-0"
              :title="$t('survey-schemes.prompts.timePicker.format.24hr')"
              value="24hr"
            >
              {{ $t('survey-schemes.prompts.timePicker.format.24hr') }}
            </v-btn>
            <v-btn
              class="px-10 flex-grow-1 flex-md-grow-0"
              :title="$t('survey-schemes.prompts.timePicker.format.ampm')"
              value="ampm"
            >
              {{ $t('survey-schemes.prompts.timePicker.format.ampm') }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'TimePickerPrompt',

  mixins: [basePrompt],

  props: {
    allowedMinutes: {
      type: Number as PropType<Prompts['time-picker-prompt']['allowedMinutes']>,
      required: true,
    },
    format: {
      type: String as PropType<Prompts['time-picker-prompt']['format']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
