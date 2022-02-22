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
import Vue, { VueConstructor } from 'vue';
import { PermissionListEntry, RoleEntry, RoleRefs } from '@intake24/common/types/http/admin';
import { FormMixin } from '@intake24/admin/types';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';

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

export default (Vue as VueConstructor<Vue & FormMixin<RoleEntry, RoleRefs>>).extend({
  name: 'RoleForm',

  mixins: [formMixin],

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

      if (!this.refs.permissions) return groups;

      this.refs.permissions.forEach((permission) => {
        if (permission.name.includes('|')) {
          const key = permission.name.split('|')[0];
          if (!(key in groups.resources)) groups.resources[key] = [];

          groups.resources[key].push(permission);
          return;
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

          if (!(key in groups[section])) groups[section][key] = [];

          groups[section][key].push(permission);
          return;
        }

        groups.global.push(permission);
      });

      return groups;
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
