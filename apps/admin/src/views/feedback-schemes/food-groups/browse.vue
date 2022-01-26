<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-card-title>{{ $t('feedback-schemes.food-groups.title') }}</v-card-title>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import { defaultTopFoods } from '@intake24/common/feedback';
import { FeedbackSchemeForm } from '../form.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'FeedbackSchemeFoodGroups',

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
    };
  },
});
</script>

<style lang="scss" scoped></style>
