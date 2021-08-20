<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
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
          <h4 class="my-3" for="permissions">{{ $t('permissions.title') }}</h4>
          <v-row>
            <v-col v-for="(pModule, key) in permissions" :key="key" cols="4">
              <v-card height="100%">
                <v-card-title>
                  <h6>{{ key === 'general' ? $t('common.misc') : $t(`${key}.title`) }}</h6>
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
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import groupBy from 'lodash/groupBy';
import Vue, { VueConstructor } from 'vue';
import { RoleEntry } from '@common/types/http/admin';
import { FormMixin } from '@/types';
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';

type RoleForm = {
  id: string | null;
  name: string | null;
  displayName: string | null;
  description: string | null;
  permissions: string[];
};

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
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
      return groupBy(this.refs.permissions, (item) => {
        if (item.name.match(/[a-zA-Z0-9]+-[a-zA-Z0-9]+/g)) return item.name.split('-')[0];

        if (item.name.match(/[a-zA-Z0-9]+\/[a-zA-Z0-9]+/g)) return item.name.split('/')[0];

        return 'general';
        // const chunks = item.name.split('-');
        // return chunks.length === 1 ? 'general' : chunks[0];
      });
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
