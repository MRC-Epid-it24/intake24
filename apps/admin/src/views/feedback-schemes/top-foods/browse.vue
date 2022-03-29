<template>
  <layout
    v-bind="{ id, entry }"
    :routeLeave.sync="routeLeave"
    v-if="entryLoaded & refsLoaded"
    @save="submit"
  >
    <template v-slot:actions>
      <preview :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon class="mr-3" color="primary">fas fa-sort-amount-down</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.top-foods.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <load-section-dialog
        :schemeId="id"
        schemeType="feedback"
        section="topFoods"
        @load="loadFromScheme"
      ></load-section-dialog>
    </v-toolbar>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-toolbar flat tile color="grey lighten-2">
              <v-icon class="mr-3" color="primary">fa-palette</v-icon>
              <v-toolbar-title class="font-weight-medium">
                {{ $t('feedback-schemes.top-foods.max.title') }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model.number="form.topFoods.max"
                :error-messages="form.errors.get('topFoods.max')"
                :label="$t('feedback-schemes.top-foods.max._')"
                :rules="topFoodsMaxRules"
                background-color="grey lighten-5"
                dense
                hide-details
                name="topFoods.max"
                outlined
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
              :scheme-id="id"
              :available-nutrient-types="refs.nutrientTypes"
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
import Vue, { VueConstructor } from 'vue';
import debounce from 'lodash/debounce';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { defaultTopFoods, TopFoods } from '@intake24/common/feedback';
import { FormMixin, RuleCallback } from '@intake24/admin/types';
import { ColorList, NutrientList, Preview } from '@intake24/admin/components/feedback';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';
import { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { FeedbackSchemeForm } from '../form.vue';

type FeedbackSchemeTopFoods = {
  debouncedUpdateColorList: () => void;
};

export default (
  Vue as VueConstructor<Vue & FeedbackSchemeTopFoods & FormMixin<FeedbackSchemeEntry>>
).extend({
  name: 'FeedbackSchemeTopFoods',

  components: { ColorList, NutrientList, LoadSectionDialog, Preview },

  mixins: [formMixin],

  data() {
    return {
      form: form<FeedbackSchemeForm>({
        id: null,
        name: null,
        type: 'default',
        topFoods: defaultTopFoods,
        cards: [],
        demographicGroups: [],
        henryCoefficients: [],
      }),
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

    loadFromScheme(topFoods: TopFoods) {
      this.form.topFoods = { ...topFoods };
    },
  },
});
</script>

<style lang="scss" scoped></style>
