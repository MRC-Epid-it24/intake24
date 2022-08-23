<template>
  <layout
    v-if="entryLoaded && refsLoaded"
    v-bind="{ id, entry }"
    :route-leave.sync="routeLeave"
    @save="submit"
  >
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme"></preview>
    </template>
    <v-toolbar color="grey lighten-5" flat tile>
      <v-icon color="primary" left>fas fa-sort-amount-down</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.top-foods.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <select-resource resource="feedback-schemes" return-object="topFoods" @input="load">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            class="ml-3"
            color="secondary"
            fab
            small
            :title="$t(`feedback-schemes.load`)"
            v-on="on"
          >
            <v-icon>fa-download</v-icon>
          </v-btn>
        </template>
      </select-resource>
    </v-toolbar>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-toolbar color="grey lighten-2" flat tile>
              <v-icon color="primary" left>fa-palette</v-icon>
              <v-toolbar-title class="font-weight-medium">
                {{ $t('feedback-schemes.top-foods.max.title') }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model.number="form.topFoods.max"
                background-color="grey lighten-5"
                dense
                :error-messages="form.errors.get('topFoods.max')"
                hide-details
                :label="$t('feedback-schemes.top-foods.max._')"
                name="topFoods.max"
                outlined
                :rules="topFoodsMaxRules"
                single-line
                :style="{ maxWidth: '75px' }"
              ></v-text-field>
            </v-toolbar>
            <template v-if="nonInputErrors.length">
              <v-alert
                v-for="error in nonInputErrors"
                :key="error.param"
                class="my-2"
                dense
                text
                type="error"
              >
                {{ error.msg }}
              </v-alert>
            </template>
            <color-list v-model="form.topFoods.colors" :scheme-id="id"></color-list>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="12" md="6">
            <nutrient-list
              v-model="form.topFoods.nutrientTypes"
              :available-nutrient-types="refs.nutrientTypes"
              :scheme-id="id"
            ></nutrient-list>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import debounce from 'lodash/debounce';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { TopFoods } from '@intake24/common/feedback';
import type { FeedbackSchemeEntry, FeedbackSchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { ColorList, NutrientList, Preview } from '@intake24/admin/components/feedback';
import { SelectResource } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';
import { defaultTopFoods } from '@intake24/common/feedback';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeTopFoodsForm = Pick<FeedbackSchemeForm, 'topFoods'>;

export default defineComponent({
  name: 'FeedbackSchemeTopFoods',

  components: { ColorList, NutrientList, Preview, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      FeedbackSchemeEntry,
      FeedbackSchemeRefs
    >(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<FeedbackSchemeTopFoodsForm>({ topFoods: defaultTopFoods }),
      nonInputErrorKeys: ['topFoods.max', 'topFoods.colors', 'topFoods.nutrientTypes'],
    };
  },

  computed: {
    topFoodsMaxRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string => {
          return !Number.isInteger(value)
            ? this.$t('feedback-schemes.top-foods.max.required').toString()
            : true;
        },
      ];
    },
    currentFeedbackScheme(): FeedbackSchemeEntry {
      return { ...this.entry, ...this.form.getData(true) } as FeedbackSchemeEntry;
    },
  },

  watch: {
    'form.topFoods.max': {
      handler() {
        //@ts-expect-error fix debounced types
        this.debouncedUpdateColorList();
      },
    },
  },

  created() {
    this.debouncedUpdateColorList = debounce(() => {
      this.updateColorList();
    }, 300);
  },

  methods: {
    async updateColorList() {
      const size = this.form.topFoods.max + 1;

      if (size < this.form.topFoods.colors.length) {
        this.form.topFoods.colors = [...this.form.topFoods.colors.slice(0, size)];
      } else if (size > this.form.topFoods.colors.length) {
        const newColors = Array.from<string>({
          length: size - this.form.topFoods.colors.length,
        }).fill('#EF6C00');

        this.form.topFoods.colors = [...this.form.topFoods.colors, ...newColors];
      }
    },

    load(topFoods: TopFoods) {
      this.form.topFoods = { ...topFoods };
    },
  },
});
</script>

<style lang="scss" scoped></style>
