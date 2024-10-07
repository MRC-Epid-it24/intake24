<template>
  <v-tabs-window-item key="options" value="options">
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.timePicker.allowedMinutes._') }}
          </v-card-title>
          <v-select
            :items="[1, 5, 10, 15, 20, 30]"
            :model-value="allowedMinutes"
            prepend-inner-icon="fas fa-stopwatch"
            variant="outlined"
            @update:model-value="update('allowedMinutes', $event)"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <v-list-item-title>
                  <i18n-t keypath="survey-schemes.prompts.timePicker.allowedMinutes.item">
                    <template #item>
                      <v-chip class="mx-1">
                        <span>{{ item.raw }}</span>
                      </v-chip>
                    </template>
                  </i18n-t>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <i18n-t keypath="survey-schemes.prompts.timePicker.allowedMinutes.item">
                <template #item>
                  <v-chip class="mx-1">
                    <span>{{ item.raw }}</span>
                  </v-chip>
                </template>
              </i18n-t>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" lg="4" md="6">
          <v-card-title>
            {{ $t('survey-schemes.prompts.timePicker.format._') }}
          </v-card-title>
          <v-btn-toggle
            class="d-flex"
            color="primary"
            mandatory
            :model-value="format"
            @update:model-value="update('format', $event)"
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
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [basePrompt],

  props: {
    allowedMinutes: {
      type: Number as PropType<Prompts['meal-time-prompt']['allowedMinutes']>,
      required: true,
    },
    format: {
      type: String as PropType<Prompts['meal-time-prompt']['format']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
