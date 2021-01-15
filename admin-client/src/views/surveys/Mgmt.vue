<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <data-table :headers="headers" :api="`admin/surveys/${id}/mgmt`" ref="table">
      <template v-slot:header-add>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="font-weight-bold"
              color="primary"
              text
              v-bind="attrs"
              v-on="on"
              @click.stop="add"
            >
              <v-icon class="mr-2">fa-user-plus</v-icon> {{ $t('surveys.mgmt.add') }}
            </v-btn>
          </template>
          <v-card :loading="options.isLoading">
            <v-card-title>
              <span class="text-h5">{{ $t(`surveys.mgmt.${isCreate ? 'add' : 'edit'}`) }}</span>
            </v-card-title>
            <v-form ref="form" @keydown.native="clearError" @submit.prevent="save">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <template v-if="isCreate">
                        <v-autocomplete
                          v-model="form.id"
                          :error-messages="form.errors.get('userId')"
                          :items="options.users"
                          :label="$t('users.name')"
                          :loading="options.isLoading"
                          hide-no-data
                          hide-selected
                          item-text="name"
                          item-value="id"
                          name="userId"
                          outlined
                          prepend-icon="fas fa-users"
                          @input="form.errors.clear('userId')"
                        ></v-autocomplete>
                      </template>
                      <template v-else>
                        <v-text-field
                          :error-messages="form.errors.get('userId')"
                          :label="$t('users.username')"
                          :value="selected.name"
                          name="userId"
                          disabled
                          hide-details="auto"
                          outlined
                          prepend-icon="fas fa-user"
                        ></v-text-field>
                      </template>
                    </v-col>
                    <v-col
                      v-for="permission in options.permissions"
                      :key="permission.id"
                      cols="12"
                      sm="6"
                    >
                      <v-checkbox
                        v-model="form.permissions"
                        :label="permission.name"
                        :value="permission.id"
                        prepend-icon="fas fa-user-nurse"
                      >
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="reset">
                  {{ $t('common.action.cancel') }}
                </v-btn>
                <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                  {{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.action="{ item }" class="text-right">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
      </template>
    </data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { Dictionary } from '@common/types';
import detailMixin from '@/components/entry/detailMixin';
import Form from '@/helpers/Form';
import { EntryMixin } from '@/types/vue';
import DataTable from './DataTable.vue';

export type MgmtRefs = {
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

export default (Vue as VueConstructor<Vue & EntryMixin & MgmtRefs>).extend({
  name: 'SurveyMgmt',

  components: { DataTable },

  mixins: [detailMixin],

  data() {
    return {
      headers: [
        {
          text: this.$t('users.name'),
          sortable: true,
          value: 'name',
          align: 'start',
        },
        {
          text: this.$t('users.email'),
          sortable: true,
          value: 'email',
          align: 'start',
        },
        {
          text: this.$t('common.action._'),
          sortable: false,
          value: 'action',
          align: 'right',
        },
      ],
      dialog: false,
      selected: {},
      form: new Form({
        id: null,
        permissions: [],
      }),
      options: {
        isLoading: false,
        users: [],
        permissions: [],
      },
    };
  },

  computed: {
    isCreate(): boolean {
      return !Object.keys(this.selected).length;
    },
  },

  methods: {
    async add() {
      this.form.reset();
      this.selected = {};
      this.dialog = true;
      await this.fetchOptions();
    },

    async edit(item: Dictionary) {
      const { permissions, ...rest } = item;
      this.form.load({ ...rest, permissions: permissions.map((permission: any) => permission.id) });
      this.selected = item;
      this.dialog = true;
      await this.fetchOptions();
    },

    reset() {
      this.form.reset();
      this.selected = {};
      this.dialog = false;
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },

    async fetchOptions() {
      if (this.options.permissions.length > 0) return;

      if (this.options.isLoading) return;

      this.options.isLoading = true;

      try {
        const {
          data: { data, permissions },
        } = await this.$http.get(`admin/surveys/${this.id}/mgmt/available`);
        this.options.users = data;
        this.options.permissions = permissions;
      } catch {
        // continue
      } finally {
        this.options.isLoading = false;
      }
    },

    async save() {
      await this.form.put(`admin/surveys/${this.id}/mgmt/${this.form.id}`);
      // this.$toasted.success(this.$t('common.msg.updated', { name }) as string);

      this.$refs.table.fetch();
      this.dialog = false;
    },
  },
});
</script>

<style lang="scss" scoped></style>
