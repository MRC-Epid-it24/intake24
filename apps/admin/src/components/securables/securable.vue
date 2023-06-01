<template>
  <div>
    <v-toolbar color="grey lighten-5" flat tile>
      <v-icon color="primary" left>fas fa-shield-halved</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`${resource}.securables.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center font-weight-medium text-button">
        {{ $t(`${resource}.securables.owner._`) }}:
        <owner-dialog v-bind="{ api, owner, resource }" ref="ownerDialog"></owner-dialog>
      </div>
    </v-toolbar>
    <embedded-data-table v-bind="{ apiUrl: api, headers }" ref="table">
      <template #header-add>
        <user-dialog
          v-bind="{ api, actions, resource }"
          ref="userDialog"
          @update:table="updateTable"
        ></user-dialog>
      </template>
      <template #[`item.securables`]="{ item }">
        {{
          item.securables
            .map(({ action }) => action)
            .sort()
            .join(' | ')
        }}
      </template>
      <template #[`item.action`]="{ item }">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="editUser(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
        <confirm-dialog
          color="error"
          icon
          icon-left="$delete"
          :label="$t('common.action.delete').toString()"
          @confirm="removeUser(item.id)"
        >
          {{ $t('common.action.confirm.delete', { name: item.name ? item.name : item.id }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { SecurableType } from '@intake24/common/security';
import type { UserSecurableListEntry } from '@intake24/common/types/http/admin';
import { securableDefs } from '@intake24/common/security';
import { getResourceFromSecurable } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import type { Owner } from './owner-dialog.vue';
import { EmbeddedDataTable } from '../data-tables';
import OwnerDialog from './owner-dialog.vue';
import UserDialog from './user-dialog.vue';

export default defineComponent({
  name: 'ResourceSecurables',

  components: { ConfirmDialog, EmbeddedDataTable, OwnerDialog, UserDialog },

  props: {
    resourceId: {
      type: String,
      required: true,
    },
    securableType: {
      type: String as PropType<SecurableType>,
      required: true,
    },
    owner: {
      type: Object as PropType<Owner>,
    },
  },

  setup() {
    const table = ref<InstanceType<typeof EmbeddedDataTable>>();
    const userDialog = ref<InstanceType<typeof UserDialog>>();

    return { table, userDialog };
  },

  data() {
    const { securableType } = this;
    const resource = getResourceFromSecurable(securableType);
    const actions = securableDefs[securableType];

    return {
      resource,
      actions,
      headers: [
        {
          text: this.$t('users.name'),
          sortable: true,
          value: 'name',
          align: 'start',
        },
        {
          text: this.$t('common.email'),
          sortable: true,
          value: 'email',
          align: 'start',
        },
        {
          text: this.$t(`${resource}.securables.actions._`),
          sortable: false,
          value: 'securables',
          align: 'start',
        },
        {
          text: this.$t('common.action._'),
          sortable: false,
          value: 'action',
          align: 'right',
        },
      ],
    };
  },

  computed: {
    api(): string {
      const { resource, resourceId } = this;
      return `admin/${resource}/${resourceId}/securables`;
    },
  },

  methods: {
    editUser(item: UserSecurableListEntry) {
      this.userDialog?.edit(item);
    },

    async removeUser(userId: string) {
      await this.userDialog?.remove(userId);
    },

    async updateTable() {
      await this.table?.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
