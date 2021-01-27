<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('schemes.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('schemes.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="types"
                :error-messages="form.errors.get('type')"
                :label="$t('schemes.types._')"
                hide-details="auto"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider></v-divider>
      <meals v-if="form.type === 'data-driven'" v-model="form.meals" :defaults="refs.meals"></meals>
      <submit-footer :disabled="form.errors.any()"></submit-footer>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';
import { FormMixin } from '@/types/vue';
import Meals from './Meals.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeForm',

  components: { Meals },

  mixins: [formMixin],

  data() {
    return {
      form: new Form({
        id: null,
        name: null,
        type: 'data-driven',
        questions: {},
        meals: [],
        export: [],
      }),
      types: [{ value: 'data-driven', text: this.$t('schemes.types.data-driven') }],
    };
  },

  methods: {
    resetMeals() {
      this.form.meals = this.refs.meals;
    },
  },
});
</script>

<style lang="scss" scoped></style>
