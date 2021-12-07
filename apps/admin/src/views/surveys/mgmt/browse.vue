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
          <v-card :loading="isLoading">
            <v-toolbar dark color="primary" flat>
              <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ $t(`surveys.mgmt.${isEdit ? 'edit' : 'add'}`) }}
              </v-toolbar-title>
              <template v-slot:extension v-if="!isEdit">
                <v-tabs v-model="tab" grow>
                  <v-tab key="search">
                    <v-icon left>fa-search</v-icon>
                    {{ $t(`surveys.mgmt.search`) }}
                  </v-tab>
                  <v-tab key="create">
                    <v-icon left>fa-user-plus</v-icon>
                    {{ $t(`surveys.mgmt.create`) }}
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-form ref="form" @keydown.native="clearError" @submit.prevent="save">
              <v-tabs-items v-model="tab">
                <v-tab-item key="search">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <template v-if="isEdit">
                          <v-text-field
                            :error-messages="form.errors.get('userId')"
                            :label="$t('users.email')"
                            :value="`${selected.email} / ${selected.name}`"
                            name="userId"
                            disabled
                            hide-details="auto"
                            outlined
                            prepend-icon="fas fa-user"
                          ></v-text-field>
                        </template>
                        <template v-else>
                          <v-autocomplete
                            v-model="form.userId"
                            :error-messages="form.errors.get('userId')"
                            :items="users"
                            :label="$t('users.email')"
                            :loading="isLoading"
                            :search-input.sync="search"
                            clearable
                            hide-no-data
                            hide-selected
                            item-text="email"
                            item-value="id"
                            name="userId"
                            outlined
                            prepend-icon="fas fa-users"
                            @input="form.errors.clear('userId')"
                          ></v-autocomplete>
                        </template>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-tab-item>
                <v-tab-item key="create">
                  <v-card flat>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.email"
                            :error-messages="form.errors.get('email')"
                            :label="$t('users.email')"
                            hide-details="auto"
                            name="email"
                            outlined
                            prepend-icon="fa-at"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.name"
                            :error-messages="form.errors.get('name')"
                            :label="$t('users.name')"
                            hide-details="auto"
                            name="name"
                            outlined
                            prepend-icon="fa-user"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.phone"
                            :error-messages="form.errors.get('phone')"
                            :label="$t('users.phone')"
                            hide-details="auto"
                            name="phone"
                            outlined
                            prepend-icon="fa-phone"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
              <v-card-text>
                <v-row no-gutters>
                  <v-col v-for="permission in permissions" :key="permission.id" cols="12" sm="6">
                    <v-checkbox
                      v-model="form.permissions"
                      :label="permission.displayName"
                      :value="permission.id"
                      dense
                      :prepend-icon="
                        form.permissions.includes(permission.id) ? `fas fa-unlock` : `fas fa-lock`
                      "
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
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
      <template v-slot:[`item.permissions`]="{ item }">
        {{
          item.permissions
            .map((permission) => permission.name.replace(`${id}/`, '').replace(`surveys-`, ''))
            .sort()
            .join(' | ')
        }}
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
      </template>
    </data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import debounce from 'lodash/debounce';
import {
  SurveyMgmtAvailablePermissionsResponse,
  SurveyMgmtAvailableUsersResponse,
  UserMgmtListEntry,
} from '@common/types/http/admin';
import detailMixin from '@/components/entry/detailMixin';
import form from '@/helpers/Form';
import { EntryMixin } from '@/types';
import DataTable from '../data-table.vue';

type SurveyMgmtForm = {
  userId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  permissions: string[];
};

type SurveyMgmt = {
  debouncedFetchUsers: () => void;
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

export default (Vue as VueConstructor<Vue & EntryMixin & SurveyMgmt>).extend({
  name: 'SurveyMgmt',

  components: { DataTable },

  mixins: [detailMixin],

  data() {
    return {
      headers: [
        {
          text: this.$t('users.email'),
          sortable: true,
          value: 'email',
          align: 'start',
        },
        {
          text: this.$t('users.name'),
          sortable: true,
          value: 'name',
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
      search: null,
      tab: 0,
      selected: {},
      form: form<SurveyMgmtForm>({
        userId: null,
        email: null,
        name: null,
        phone: null,
        permissions: [],
      }),
      isLoading: false,
      users: [] as SurveyMgmtAvailableUsersResponse,
      permissions: [] as SurveyMgmtAvailablePermissionsResponse,
    };
  },

  computed: {
    isEdit(): boolean {
      return !!Object.keys(this.selected).length;
    },
    isNew(): boolean {
      return this.tab === 1;
    },
  },

  watch: {
    search() {
      this.debouncedFetchUsers();
    },
  },

  created() {
    this.debouncedFetchUsers = debounce(() => {
      this.fetchUsers();
    }, 500);
  },

  async mounted() {
    if (this.permissions.length > 0) return;

    const { data } = await this.$http.get<SurveyMgmtAvailablePermissionsResponse>(
      `admin/surveys/${this.id}/mgmt/permissions`
    );

    this.permissions = data;
  },

  methods: {
    async add() {
      this.form.reset();
      this.selected = {};
      this.dialog = true;
    },

    async edit(item: UserMgmtListEntry) {
      const { id: userId, permissions } = item;
      this.form.load({ userId, permissions: permissions.map(({ id }) => id) });
      this.selected = item;
      this.dialog = true;
    },

    reset() {
      this.dialog = false;
      this.form.reset();
      this.selected = {};
      this.tab = 0;
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },

    async fetchUsers() {
      if (this.isLoading) return;

      this.isLoading = true;

      try {
        const { data } = await this.$http.get<SurveyMgmtAvailableUsersResponse>(
          `admin/surveys/${this.id}/mgmt/users`,
          { params: { search: this.search } }
        );
        this.users = data;
      } finally {
        this.isLoading = false;
      }
    },

    async save() {
      if (this.isNew) await this.form.post(`admin/surveys/${this.id}/mgmt`);
      else await this.form.patch(`admin/surveys/${this.id}/mgmt/${this.form.userId}`);
      // this.$toasted.success(this.$t('common.msg.updated', { name }).toString());

      this.$refs.table.fetch();
      this.reset();
    },
  },
});
</script>

<style lang="scss" scoped></style>
