<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
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
                          :items="availableUsers"
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
                <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                  <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                  <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.permissions`]="{ item }" class="text-right">
        {{
          item.permissions.map((permission) => permission.name.replace(`${id}/`, '')).join(' | ')
        }}
      </template>
      <template v-slot:[`item.action`]="{ item }" class="text-right">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
      </template>
    </data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { SurveyMgmtAvailableResponse, UserMgmtListEntry } from '@common/types/http/admin';
import detailMixin from '@/components/entry/detailMixin';
import form from '@/helpers/Form';
import { EntryMixin } from '@/types';
import DataTable from '../data-table.vue';

type SurveyMgmtRefs = {
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

type SurveyMgmtForm = {
  id: number | null;
  permissions: number[];
};

interface AvailableOptions extends SurveyMgmtAvailableResponse {
  isLoading: boolean;
}

type OptionList = {
  id: number;
  name: string;
};

export default (Vue as VueConstructor<Vue & EntryMixin & SurveyMgmtRefs>).extend({
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
          text: this.$t('permissions.title'),
          sortable: false,
          value: 'permissions',
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
      form: form<SurveyMgmtForm>({
        id: null,
        permissions: [],
      }),
      options: {
        isLoading: false,
        users: [],
        permissions: [],
      } as AvailableOptions,
    };
  },

  computed: {
    availableUsers(): OptionList[] {
      return this.options.users.map(({ id, name, email }) => {
        const [first, second] = [name, email, id].filter((item) => item) as (string | number)[];
        return {
          id,
          name: second ? `${first} (${second})` : `${first}`,
        };
      });
    },
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

    async edit(item: UserMgmtListEntry) {
      const { id, permissions } = item;
      this.form.load({ id, permissions: permissions.map((permission) => permission.id) });
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
          data: { users, permissions },
        } = await this.$http.get<SurveyMgmtAvailableResponse>(
          `admin/surveys/${this.id}/mgmt/available`
        );
        this.options.users = users;
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
      await this.clearOptions();
    },

    async clearOptions() {
      this.options = {
        isLoading: false,
        users: [],
        permissions: [],
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
