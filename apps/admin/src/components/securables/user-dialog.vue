<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-btn
        class="font-weight-bold"
        color="secondary"
        variant="outlined"

        v-bind="props"
        @click.stop="add"
      >
        <v-icon icon="fas fa-user-plus" start />{{ $t('securables.add') }}
      </v-btn>
    </template>
    <v-card :loading="isLoading" :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="reset" />
        <v-toolbar-title>
          {{ $t(`securables.${isEdit ? 'edit' : 'add'}`) }}
        </v-toolbar-title>
        <template v-if="!isEdit" #extension>
          <v-tabs v-model="tab" grow>
            <v-tab key="search">
              <v-icon icon="$search" start />
              {{ $t('securables.search') }}
            </v-tab>
            <v-tab key="create">
              <v-icon icon="fas fa-user-plus" start />
              {{ $t('securables.create') }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-form @keydown="clearError" @submit.prevent="save">
        <v-tabs-window v-model="tab">
          <v-tabs-window-item key="search">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <template v-if="isEdit && selected">
                    <v-text-field
                      disabled
                      :error-messages="form.errors.get('userId')"
                      hide-details="auto"
                      :label="$t('common.email')"
                      :model-value="`${selected.email} / ${selected.name}`"
                      name="userId"
                      prepend-inner-icon="fas fa-user"
                      variant="outlined"
                    />
                  </template>
                  <template v-else>
                    <auto-complete
                      v-model="form.userId"
                      :api="`${api}/users`"
                      clearable
                      :error-messages="form.errors.get('userId')"
                      hide-no-data
                      hide-selected
                      item-title="email"
                      item-value="id"
                      :label="$t('common.email')"
                      name="userId"
                      prepend-inner-icon="fas fa-users"
                      @update:model-value="form.errors.clear('userId')"
                    />
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
          </v-tabs-window-item>
          <v-tabs-window-item key="create">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.email"
                      :error-messages="form.errors.get('email')"
                      hide-details="auto"
                      :label="$t('common.email')"
                      name="email"
                      prepend-inner-icon="fas fa-at"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.name"
                      :error-messages="form.errors.get('name')"
                      hide-details="auto"
                      :label="$t('users.name')"
                      name="name"
                      prepend-inner-icon="fas fa-user"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.phone"
                      :error-messages="form.errors.get('phone')"
                      hide-details="auto"
                      :label="$t('common.phone')"
                      name="phone"
                      prepend-inner-icon="fas fa-phone"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
        <v-card-title>{{ $t('securables.actions.title') }}</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col v-for="action in actions" :key="action" cols="12" sm="6">
              <v-checkbox-btn
                v-model="form.actions"
                hide-details="auto"
                :label="$t(`securables.actions.${action}`)"
                :prepend-inner-icon="
                  form.actions.includes(action) ? `fas fa-unlock` : `fas fa-lock`
                "
                :value="action"
                @update:model-value="form.errors.clear('actions')"
              />
            </v-col>
          </v-row>
          <error-list :errors="nonInputErrors" />
        </v-card-text>
        <v-card-actions>
          <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="reset">
            <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
          </v-btn>
          <v-spacer />
          <v-btn
            class="font-weight-bold"
            color="info"
            :disabled="form.errors.any()"
            type="submit"
            variant="text"
          >
            <v-icon icon="$save" start />{{ $t('common.action.save') }}
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

import type { UserSecurableListEntry } from '@intake24/common/types/http/admin';
import type { ValidationError } from '@intake24/common/util';
import { AutoComplete, ErrorList } from '@intake24/admin/components/forms';
import { createForm } from '@intake24/admin/util';

export type UserDialogForm = {
  userId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  actions: string[];
};

export default defineComponent({
  name: 'UserDialog',

  components: { AutoComplete, ErrorList },

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

  emits: ['update:table'],

  data() {
    return {
      dialog: false,
      tab: 0,
      selected: null as UserSecurableListEntry | null,
      form: createForm<UserDialogForm>({
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

      if (name)
        this.form.errors.clear(name);
    },

    async save() {
      if (this.isNew)
        await this.form.post(this.api);
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
