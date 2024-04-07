<template>
  <v-tab-item key="thresholds">
    <v-container>
      <v-row>
        <v-col v-for="(item, key) in { low, high }" :key="key" cols="12" md="6">
          <v-card-title>
            {{ $t(`feedback-schemes.cards.thresholds.${key}`) }}
          </v-card-title>
          <v-card-text>
            <v-switch
              class="my-4"
              hide-details="auto"
              :input-value="!!item"
              :label="$t('feedback-schemes.cards.thresholds.enabled')"
              @change="toggleThreshold(key, $event)"
            />
            <template v-if="item">
              <v-slider
                v-model.number="item.threshold"
                class="mt-12"
                :label="$t('feedback-schemes.cards.thresholds._')"
                max="100"
                min="0"
                thumb-label="always"
              />
              <language-selector
                v-model="item.message"
                :label="$t('feedback-schemes.cards.thresholds.message').toString()"
              >
                <template v-for="lang in Object.keys(item.message)" #[`lang.${lang}`]>
                  <html-editor :key="lang" v-model="item.message[lang]" />
                </template>
              </language-selector>
            </template>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { CustomCard } from '@intake24/common/feedback';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';

export default defineComponent({
  name: 'CardThresholds',

  components: { HtmlEditor, LanguageSelector },

  props: {
    thresholds: {
      type: Object as PropType<Pick<CustomCard, 'high' | 'low'>>,
      required: true,
    },
  },

  emits: ['update:high', 'update:low'],

  data() {
    const { high, low } = this.thresholds;

    return {
      high: high ? { ...high } : null,
      low: low ? { ...low } : null,
    };
  },

  watch: {
    thresholds(val: Pick<CustomCard, 'high' | 'low'>) {
      const { high, low } = this;
      if (deepEqual(val, { high, low }))
        return;

      this.high = val.high === null ? null : { ...val.high };
      this.low = val.low === null ? null : { ...val.low };
    },
    high() {
      this.$emit('update:high', this.high);
    },
    low() {
      this.$emit('update:low', this.low);
    },
  },

  methods: {
    toggleThreshold(key: 'high' | 'low', value: boolean) {
      this[key] = value ? { threshold: 0, message: { en: '' } } : null;
    },
  },
});
</script>

<style lang="scss" scoped></style>
