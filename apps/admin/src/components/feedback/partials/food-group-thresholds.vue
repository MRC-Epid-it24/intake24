<template>
  <v-tab-item key="thresholds">
    <v-container>
      <v-row>
        <v-col v-for="(item, key) in { low, high }" cols="12" md="6" :key="key">
          <v-card-title>
            {{ $t(`feedback-schemes.food-groups.thresholds.${key}`) }}
          </v-card-title>
          <v-card-text>
            <v-switch
              :input-value="!!item"
              :label="$t('feedback-schemes.food-groups.thresholds.enabled')"
              class="my-4"
              hide-details="auto"
              @change="toggleThreshold(key, $event)"
            ></v-switch>
            <template v-if="item">
              <v-slider
                :label="$t('feedback-schemes.food-groups.thresholds._')"
                class="mt-12"
                max="100"
                min="0"
                thumb-label="always"
                v-model.number="item.threshold"
              ></v-slider>
              <language-selector
                :label="$t('feedback-schemes.food-groups.thresholds.message')"
                v-model="item.message"
              >
                <template v-for="lang in Object.keys(item.message)" v-slot:[`lang.${lang}`]>
                  <editor :init="tinymceInit" :key="lang" v-model="item.message[lang]" />
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
import isEqual from 'lodash/isEqual';
import { defineComponent, PropType } from '@vue/composition-api';
import tinymce from '@intake24/admin/components/tinymce/tinymce';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { FoodGroup } from '@intake24/common/feedback';

export default defineComponent({
  name: 'FoodGroupThresholds',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    thresholds: {
      type: Object as PropType<Pick<FoodGroup, 'high' | 'low'>>,
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
    thresholds(val: Pick<FoodGroup, 'high' | 'low'>) {
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
      this[key] = value ? { threshold: 0, message: { en: null } } : null;
    },
  },
});
</script>

<style lang="scss" scoped></style>
