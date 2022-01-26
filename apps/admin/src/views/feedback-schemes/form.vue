<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <!-- <copy-scheme-dialog
        v-if="isEdit && can('feedback-schemes|edit')"
        :schemeId="id"
      ></copy-scheme-dialog> -->
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('feedback-schemes.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="feedbackTypes"
                :error-messages="form.errors.get('type')"
                :label="$t('feedback-schemes.types._')"
                hide-details="auto"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import {
  defaultTopFoods,
  FeedbackType,
  feedbackTypes,
  FoodGroup,
  TopFoods,
} from '@intake24/common/feedback';
// import CopySchemeDialog from './copy-scheme-dialog.vue';

export type FeedbackSchemeForm = {
  id: string | null;
  name: string | null;
  type: FeedbackType;
  topFoods: TopFoods;
  foodGroups: FoodGroup[];
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeForm',

  // components: { CopySchemeDialog },

  mixins: [formMixin],

  data() {
    return {
      form: form<FeedbackSchemeForm>({
        id: null,
        name: null,
        type: 'default',
        topFoods: defaultTopFoods,
        foodGroups: [],
      }),
      feedbackTypes: feedbackTypes.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.types.${value}`),
      })),
    };
  },
});
</script>

<style lang="scss" scoped></style>
