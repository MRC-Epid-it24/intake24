<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <card-list v-model="form.cards"></card-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import { defaultTopFoods } from '@intake24/common/feedback';
import { CardList } from '@intake24/admin/components/feedback';
import { FeedbackSchemeForm } from '../form.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'FeedbackSchemeFoodGroups',

  components: { CardList },

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
    };
  },
});
</script>

<style lang="scss" scoped></style>
