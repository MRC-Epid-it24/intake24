<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table :api-url="`admin/users/${id}/roles`" v-bind="{ headers }">
      <template #[`item.action`]="{ item }">
        <component
          :is="action"
          v-for="action in actions"
          :key="action"
          v-bind="{ action, item }"
          :to="{ name: `roles-${action}`, params: { id: item.id } }"
        />
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { UserEntry } from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { Edit, Read } from '@intake24/admin/components/data-tables/action-bar';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';
import { useUser } from '@intake24/admin/stores';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'UsersRoles',

  components: { EmbeddedDataTable, Edit, Read },

  mixins: [detailMixin],

  setup(props) {
    const { i18n } = useI18n();
    const user = useUser();

    const actions = ['read', 'edit'].filter(action => user.can(`roles|${action}`));

    const headers = [
      { text: i18n.t('common.name'), sortable: true, value: 'name' },
      { text: i18n.t('common.displayName'), sortable: true, value: 'displayName' },
      { text: i18n.t('common.action._'), sortable: false, value: 'action', align: 'right' },
    ];

    const { entry, entryLoaded } = useEntry<UserEntry>(props);
    useEntryFetch(props);

    return { actions, entry, entryLoaded, headers };
  },
});
</script>

<style lang="scss" scoped></style>
