<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <securables securableType="FeedbackScheme" :resourceId="id"></securables>
  </layout>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import type { DetailMixin } from '@intake24/admin/types';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { Securables } from '@intake24/admin/components/securables';

export default (Vue as VueConstructor<Vue & DetailMixin<FeedbackSchemeEntry>>).extend({
  name: 'FeedbackSchemeSecurables',

  components: { Securables },

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
