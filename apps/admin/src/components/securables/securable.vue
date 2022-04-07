<template>
  <div>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon left color="primary">fas fa-shield-halved</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`${resource}.securables.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <embedded-data-table v-bind="{ api, headers }" ref="table">
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
              <v-icon left>fa-user-plus</v-icon> {{ $t(`${resource}.securables.add`) }}
            </v-btn>
          </template>
          <v-card :loading="isLoading">
            <v-toolbar color="primary" dark flat>
              <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ $t(`${resource}.securables.${isEdit ? 'edit' : 'add'}`) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-form ref="form" @keydown.native="clearError" @submit.prevent="save">
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
                      <auto-complete
                        v-model="form.userId"
                        :error-messages="form.errors.get('userId')"
                        :label="$t('users.email')"
                        :api="`${api}/users`"
                        clearable
                        hide-no-data
                        hide-selected
                        item-text="email"
                        item-value="id"
                        name="userId"
                        prepend-icon="fas fa-users"
                        @input="form.errors.clear('userId')"
                      ></auto-complete>
                    </template>
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
      <template v-slot:[`item.securables`]="{ item }">
        {{
          item.securables
            .map(({ action }) => action)
            .sort()
            .join(' | ')
        }}
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
      </template>
    </embedded-data-table>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import debounce from 'lodash/debounce';
import { form } from '@intake24/admin/helpers';
import { AutoComplete } from '@intake24/admin/components/forms';
import { EmbeddedDataTable } from '../data-tables';

type SecurableForm = {
  userId: string | null;
  actions: string[];
};

type ResourceSecurables = {
  debouncedFetchUsers: () => void;
  $refs: {
    table: InstanceType<typeof EmbeddedDataTable>;
  };
};

export default (Vue as VueConstructor<Vue & ResourceSecurables>).extend({
  name: 'ResourceSecurables',

  props: {
    resource: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
  },

  components: { AutoComplete, EmbeddedDataTable },

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
          text: this.$t(`${this.resource}.securables.actions`),
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
      dialog: false,
      search: null,
      selected: {},
      form: form<SecurableForm>({
        userId: null,
        actions: [],
      }),
      isLoading: false,
      users: [] as any[],
    };
  },

  computed: {
    api(): string {
      const { resource, resourceId } = this;
      return `admin/${resource}/${resourceId}/securables`;
    },
    isEdit(): boolean {
      return !!Object.keys(this.selected).length;
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

  methods: {
    async add() {
      this.form.reset();
      this.selected = {};
      this.dialog = true;
    },

    async edit(item: any) {
      const { id: userId, securables } = item;
      this.form.load({ userId, actions: securables.map(({ action }: any) => action) });
      this.selected = item;
      this.dialog = true;
    },

    reset() {
      this.dialog = false;
      this.form.reset();
      this.selected = {};
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },

    async fetchUsers() {
      if (this.isLoading) return;

      this.isLoading = true;

      try {
        const { data } = await this.$http.get(`${this.api}/users`, {
          params: { search: this.search },
        });
        this.users = data;
      } finally {
        this.isLoading = false;
      }
    },

    async save() {
      await this.form.patch(`${this.api}/${this.form.userId}`);

      this.$refs.table.fetch();
      this.reset();
    },
  },
});
</script>

<style lang="scss" scoped></style>
