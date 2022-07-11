<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :disabled="isEdit"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.displayName"
                :error-messages="form.errors.get('displayName')"
                :label="$t('common.displayName')"
                hide-details="auto"
                name="displayName"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-title>{{ $t('permissions.title') }}</v-card-title>
          <v-row>
            <v-col key="global" cols="4">
              <v-card height="100%">
                <v-card-title>
                  <h6>{{ $t('permissions.groups.global') }}</h6>
                </v-card-title>
                <v-card-text>
                  <v-switch
                    v-for="perm in permissions.global"
                    :key="perm.id"
                    v-model="form.permissions"
                    :label="perm.displayName"
                    :value="perm.id"
                    :disabled="!can(perm.name)"
                  ></v-switch>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <template v-for="group in ['resources', 'surveys', 'fdbs']">
            <v-card-title cols="12" :key="`${group}-title`">
              <v-card-title>{{ $t(`permissions.groups.${group}`) }}</v-card-title>
            </v-card-title>
            <v-row :key="`${group}-content`">
              <v-col v-for="(pModule, key) in permissions[group]" :key="key" cols="4">
                <v-card height="100%">
                  <v-card-title>
                    <h6 v-if="group === 'resources'">{{ $t(`${key}.title`) }}</h6>
                    <h6 v-else>{{ $t(`${group}._`) }} {{ key }}</h6>
                  </v-card-title>
                  <v-card-text>
                    <v-switch
                      v-for="perm in pModule"
                      :key="perm.id"
                      v-model="form.permissions"
                      :label="perm.displayName"
                      :value="perm.id"
                      :disabled="!can(perm.name)"
                    ></v-switch>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import orderBy from 'lodash/orderBy';
import type { PermissionListEntry, RoleEntry, RoleRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import resources from '@intake24/admin/router/resources';

type RoleForm = {
  id: string | null;
  name: string | null;
  displayName: string | null;
  description: string | null;
  permissions: string[];
};

type PermissionGroup = Record<string, PermissionListEntry[]>;

type PermissionGroups = {
  global: PermissionListEntry[];
  resources: PermissionGroup;
  surveys: PermissionGroup;
  fdbs: PermissionGroup;
};

export default defineComponent({
  name: 'RoleForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<RoleEntry, RoleRefs>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      form: form<RoleForm>({
        id: null,
        name: null,
        displayName: null,
        description: null,
        permissions: [],
      }),
    };
  },

  computed: {
    permissions() {
      const groups: PermissionGroups = {
        global: [],
        resources: {},
        surveys: {},
        fdbs: {},
      };

      const { permissions } = this.refs;
      if (!permissions) return groups;

      const resourceNames = resources.map(({ name }) => name);

      return orderBy(permissions, 'name').reduce((acc, permission) => {
        if (permission.name.includes('|') || resourceNames.includes(permission.name)) {
          const key = permission.name.split('|')[0];
          if (!(key in acc.resources)) acc.resources[key] = [];

          acc.resources[key].push(permission);
          return acc;
        }

        if (permission.name.includes('/')) {
          const [first, second] = permission.name.split('/');
          let key;
          let section: 'surveys' | 'fdbs';

          if (permission.name.startsWith('fdbm/')) {
            key = second;
            section = 'fdbs';
          } else {
            key = first;
            section = 'surveys';
          }

          if (!(key in acc[section])) acc[section][key] = [];

          acc[section][key].push(permission);
          return acc;
        }

        acc.global.push(permission);
        return acc;
      }, groups);
    },
  },

  methods: {
    toForm(data: Partial<RoleEntry>) {
      const { permissions = [], ...rest } = data;
      const input = {
        ...rest,
        permissions: permissions.map((item) => item.id),
      };

      this.setOriginalEntry(input);
      this.form.load(input);
    },
  },
});
</script>

<style scoped></style>
