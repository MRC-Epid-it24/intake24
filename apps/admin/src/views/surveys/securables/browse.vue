<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <securables securableType="Survey" :resourceId="id"></securables>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import type { DetailMixin } from '@intake24/admin/types';
import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { Securables } from '@intake24/admin/components/securables';

export default (Vue as VueConstructor<Vue & DetailMixin<SurveyEntry>>).extend({
  name: 'SurveySecurables',

  components: { Securables },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
