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
              outlined
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
              <template v-slot:extension v-if="!isEdit">
                <v-tabs v-model="tab" grow>
                  <v-tab key="search">
                    <v-icon left>fa-search</v-icon>
                    {{ $t(`${resource}.securables.search`) }}
                  </v-tab>
                  <v-tab key="create">
                    <v-icon left>fa-user-plus</v-icon>
                    {{ $t(`${resource}.securables.create`) }}
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
                <v-card-title>{{ $t(`${resource}.securables.actions.title`) }}</v-card-title>
                <v-row no-gutters>
                  <v-col v-for="action in actions" :key="action" cols="12" sm="6">
                    <v-checkbox
                      v-model="form.actions"
                      :label="$t(`${resource}.securables.actions.${action}`)"
                      :value="action"
                      dense
                      :prepend-icon="
                        form.actions.includes(action) ? `fas fa-unlock` : `fas fa-lock`
                      "
                      @change="form.errors.clear('actions')"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
                <template v-if="nonInputErrors.length">
                  <v-alert
                    v-for="error in nonInputErrors"
                    :key="error.param"
                    class="my-2"
                    dense
                    text
                    type="error"
                  >
                    {{ error.msg }}
                  </v-alert>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                  <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="form.errors.any()"
                  class="font-weight-bold"
                  color="blue darken-3"
                  text
                  type="submit"
                >
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
        <confirm-dialog
          :label="$t('common.action.delete')"
          color="error"
          icon
          icon-left="$delete"
          @confirm="remove(item.id)"
        >
          {{ $t('common.action.confirm.delete', { name: item.name ? item.name : item.id }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
  </div>
</template>

<script lang="ts">
import pick from 'lodash/pick';
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ConfirmDialog } from '@intake24/ui';
import { form } from '@intake24/admin/helpers';
import { AutoComplete } from '@intake24/admin/components/forms';
import { securableToResource } from '@intake24/common/util';
import { securableDefs, SecurableType } from '@intake24/common/security';
import type { ValidationError } from '@intake24/common/types';
import type { UserSecurableListEntry } from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '../data-tables';

type SecurableForm = {
  userId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  actions: string[];
};

export default defineComponent({
  name: 'ResourceSecurables',

  props: {
    securableType: {
      type: String as PropType<SecurableType>,
      required: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
  },

  components: { AutoComplete, ConfirmDialog, EmbeddedDataTable },

  setup() {
    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    return { table };
  },

  data() {
    const { securableType } = this;
    const resource = securableToResource(securableType);
    const actions = securableDefs[securableType];

    return {
      resource,
      actions,
      securableDefs,
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
      dialog: false,
      tab: 0,
      selected: {},
      form: form<SecurableForm>({
        userId: null,
        email: null,
        name: null,
        phone: null,
        actions: [],
      }),
      nonInputErrorKeys: ['actions'],
      isLoading: false,
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
    isNew(): boolean {
      return this.tab === 1;
    },
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  methods: {
    async add() {
      this.form.reset();
      this.selected = {};
      this.dialog = true;
    },

    async edit(item: UserSecurableListEntry) {
      const { id: userId, securables } = item;
      this.form.load({ userId, actions: securables.map(({ action }) => action) });
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

    async save() {
      if (this.isNew) await this.form.post(this.api);
      else await this.form.patch(`${this.api}/${this.form.userId}`);

      this.table?.fetch();
      this.reset();
    },

    async remove(userId: string) {
      await this.$http.delete(`${this.api}/${userId}`);

      this.table?.fetch();
      this.reset();
    },
  },
});
</script>

<style lang="scss" scoped></style>
