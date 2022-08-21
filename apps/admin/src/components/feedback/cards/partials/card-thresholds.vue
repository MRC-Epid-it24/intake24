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
              :input-value="!!item"
              :label="$t('feedback-schemes.cards.thresholds.enabled')"
              class="my-4"
              hide-details="auto"
              @change="toggleThreshold(key, $event)"
            ></v-switch>
            <template v-if="item">
              <v-slider
                v-model.number="item.threshold"
                :label="$t('feedback-schemes.cards.thresholds._')"
                class="mt-12"
                max="100"
                min="0"
                thumb-label="always"
              ></v-slider>
              <language-selector
                v-model="item.message"
                :label="$t('feedback-schemes.cards.thresholds.message').toString()"
              >
                <template v-for="lang in Object.keys(item.message)" #[`lang.${lang}`]>
                  <editor :key="lang" v-model="item.message[lang]" :init="tinymceInit" />
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
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { CustomCard } from '@intake24/common/feedback';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { tinymce } from '@intake24/admin/components/tinymce';

export default defineComponent({
  name: 'CardThresholds',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    thresholds: {
      type: Object as PropType<Pick<CustomCard, 'high' | 'low'>>,
      required: true,
    },
  },

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
      if (isEqual(val, { high, low })) return;

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
