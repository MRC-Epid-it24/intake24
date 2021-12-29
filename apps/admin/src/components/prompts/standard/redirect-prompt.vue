<template>
  <div>
    <prompt-content
      :text="text"
      :description="description"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <v-card-title>{{ $t('schemes.redirect.url.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('schemes.redirect.url.subtitle') }}</v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :value="url"
              :label="$t('schemes.redirect.url._')"
              :hint="$t('schemes.redirect.url.hint')"
              persistent-hint
              hide-details="auto"
              name="url"
              outlined
              @input="update('url', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :value="identifier"
              :items="identifiers"
              :label="$t('schemes.redirect.identifier._')"
              hide-details="auto"
              outlined
              @change="update('identifier', $event)"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>{{ $t('schemes.redirect.timer.title') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :value="timer"
              :label="$t('schemes.redirect.timer._')"
              :rules="timerRules"
              hide-details="auto"
              name="timer"
              outlined
              @input="updateTimerValue"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import isInteger from 'lodash/isInteger';
import basePrompt from '../partials/base-prompt';

type Mixins = InstanceType<typeof basePrompt>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'RedirectPrompt',

  mixins: [basePrompt],

  props: {
    url: {
      type: String,
      default: null,
    },
    identifier: {
      type: String,
      default: 'username',
    },
    timer: {
      type: Number,
      default: null,
    },
  },

  computed: {
    timerRules() {
      return [
        (value: string): boolean | string =>
          isInteger(value) || 'Timer value needs to be a number.',
      ];
    },
  },

  data() {
    return {
      identifiers: ['userId', 'username', 'token', 'custom'].map((value) => ({
        text: this.$t(`schemes.redirect.identifier.options.${value}`),
        value,
      })),
    };
  },

  methods: {
    updateTimerValue(value: any) {
      const timerValue = parseInt(value, 10);
      this.update('timer', Number.isNaN(timerValue) ? 0 : timerValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
