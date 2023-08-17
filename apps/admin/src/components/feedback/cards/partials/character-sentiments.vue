<template>
  <v-tabs vertical>
    <v-btn class="my-4" color="secondary" @click="add">
      <v-icon left>$add</v-icon>
      {{ $t(`feedback-schemes.sentiments.add`) }}
    </v-btn>
    <v-tab v-for="(sentiment, index) in sentiments" :key="index">
      <v-icon left>fas fa-face-smile</v-icon>
      {{ `${$t(`feedback-schemes.sentiments._`)} ${index + 1}` }}
    </v-tab>
    <v-tab-item v-for="(sentiment, index) in sentiments" :key="index">
      <v-card tile>
        <v-card-title>
          <v-icon left>fas fa-face-smile</v-icon>
          {{ `${$t(`feedback-schemes.sentiments._`)} ${index + 1}` }}
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="sentiment.sentiment"
                hide-details="auto"
                :items="availableSentiments"
                :label="$t('feedback-schemes.sentiments._')"
                multiple
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="sentiment.sentimentType"
                hide-details="auto"
                :items="availableCharacterSentimentTypes"
                :label="$t('feedback-schemes.characterSentimentTypes._')"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
              <language-selector v-model="sentiment.name" :label="$t('common.name').toString()">
                <template v-for="lang in Object.keys(sentiment.name)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="sentiment.name[lang]"
                    hide-details="auto"
                    :label="$t('common.name')"
                    outlined
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                color="error"
                large
                :title="$t(`feedback-schemes.sentiments.remove`)"
                @click.stop="remove"
              >
                <v-icon left>$delete</v-icon>
                {{ $t(`feedback-schemes.sentiments.remove`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { Character, CharacterSentiment } from '@intake24/common/feedback';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { characterSentimentTypes, sentiments } from '@intake24/common/feedback';
import { copy } from '@intake24/common/util';

export const characterSentimentDefaults: CharacterSentiment = {
  sentiment: [],
  sentimentType: 'happy',
  name: {},
};

export default defineComponent({
  name: 'CharacterSentiments',

  components: { LanguageSelector },

  props: {
    value: {
      type: Array as PropType<Character['sentiments']>,
      required: true,
    },
  },

  // TODO: check modelValue logic
  emits: ['update:sentiments'],

  data() {
    return {
      characterSentimentDefaults,
      sentiments: [...this.value],
      availableSentiments: sentiments.map((value) => ({
        text: this.$t(`feedback-schemes.sentiments.${value}`),
        value,
      })),
      availableCharacterSentimentTypes: characterSentimentTypes.map((value) => ({
        text: this.$t(`feedback-schemes.characterSentimentTypes.${value}`),
        value,
      })),
    };
  },

  watch: {
    value(val) {
      if (deepEqual(val, this.sentiments)) return;

      this.sentiments = [...val];
    },
    sentiments: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    add() {
      this.sentiments.push(copy(characterSentimentDefaults));
    },

    remove(index: number) {
      this.sentiments.splice(index, 1);
    },

    update() {
      this.$emit('update:sentiments', this.sentiments);
    },
  },
});
</script>

<style lang="scss" scoped></style>
