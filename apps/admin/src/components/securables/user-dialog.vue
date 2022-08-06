<template>
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
                :prepend-icon="form.actions.includes(action) ? `fas fa-unlock` : `fas fa-lock`"
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

<script lang="ts">
import type { PropType } from 'vue';
import pick from 'lodash/pick';
import { defineComponent } from 'vue';

import type { ValidationError } from '@intake24/common/types';
import type { UserSecurableListEntry } from '@intake24/common/types/http/admin';
import { AutoComplete } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';

export type UserDialogForm = {
  userId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  actions: string[];
};

export default defineComponent({
  name: 'UserDialog',

  props: {
    api: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    actions: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  components: { AutoComplete },

  data() {
    return {
      dialog: false,
      tab: 0,
      selected: null as UserSecurableListEntry | null,
      form: form<UserDialogForm>({
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
    isEdit(): boolean {
      return !!this.selected;
    },
    isNew(): boolean {
      return this.tab === 1;
    },
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  methods: {
    add() {
      this.form.reset();
      this.selected = null;
      this.dialog = true;
    },

    edit(item: UserSecurableListEntry) {
      const { id: userId, securables } = item;
      this.form.load({ userId, actions: securables.map(({ action }) => action) });
      this.selected = item;
      this.dialog = true;
    },

    reset() {
      this.dialog = false;
      this.form.reset();
      this.selected = null;
      this.tab = 0;
    },

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },

    async save() {
      if (this.isNew) await this.form.post(this.api);
      else await this.form.patch(`${this.api}/${this.form.userId}`);

      this.reset();
      this.$emit('update:table');
    },

    async remove(userId: string) {
      await this.$http.delete(`${this.api}/${userId}`);

      this.reset();
      this.$emit('update:table');
    },
  },
});
</script>

<style lang="scss" scoped></style>
