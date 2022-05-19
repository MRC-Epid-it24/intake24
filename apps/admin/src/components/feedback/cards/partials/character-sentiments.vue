<template>
  <v-tabs vertical>
    <v-btn class="my-4" color="primary" @click="add">
      <v-icon left>$add</v-icon>
      {{ $t(`feedback-schemes.sentiments.add`) }}
    </v-btn>
    <v-tab v-for="(sentiment, index) in sentiments" :key="index">
      <v-icon left>fas face-smile</v-icon>
      {{ `${$t(`feedback-schemes.sentiments._`)} ${index + 1}` }}
    </v-tab>
    <v-tab-item v-for="(sentiment, index) in sentiments" :key="index">
      <v-card tile>
        <v-card-title>
          <v-icon left>fas face-smile</v-icon>
          {{ `${$t(`feedback-schemes.sentiments._`)} ${index + 1}` }}
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="sentiment.sentiment"
                :items="availableSentiments"
                :label="$t('feedback-schemes.sentiments._')"
                hide-details="auto"
                multiple
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="sentiment.sentimentType"
                :items="availableCharacterSentimentTypes"
                :label="$t('feedback-schemes.characterSentimentTypes._')"
                hide-details="auto"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
              <language-selector v-model="sentiment.name" :label="$t('common.name')">
                <template v-for="lang in Object.keys(sentiment.name)" v-slot:[`lang.${lang}`]>
                  <v-text-field
                    v-model="sentiment.name[lang]"
                    :key="lang"
                    :label="$t('common.name')"
                    hide-details="auto"
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
import isEqual from 'lodash/isEqual';
import { defineComponent, PropType } from '@vue/composition-api';
import {
  Character,
  characterSentimentTypes,
  CharacterSentiment,
  sentiments,
} from '@intake24/common/feedback';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { copy } from '@intake24/common/util';

export const characterSentimentDefaults: CharacterSentiment = {
  sentiment: [],
  sentimentType: 'happy',
  name: { en: null },
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
      if (isEqual(val, this.sentiments)) return;

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
