<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('users.name')"
                name="name"
                prepend-inner-icon="fas fa-signature"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                autocomplete="email"
                :error-messages="form.errors.get('email')"
                hide-details="auto"
                :label="$t('common.email')"
                name="email"
                prepend-inner-icon="fas fa-envelope"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
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
            <template v-if="isCreate">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  autocomplete="new-password"
                  :error-messages="form.errors.get('password')"
                  hide-details="auto"
                  :label="$t('common.password._')"
                  name="password"
                  prepend-inner-icon="fas fa-key"
                  type="password"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.passwordConfirm"
                  autocomplete="new-password"
                  :error-messages="form.errors.get('passwordConfirm')"
                  hide-details="auto"
                  :label="$t('common.password.confirm')"
                  name="passwordConfirm"
                  prepend-inner-icon="fas fa-key"
                  type="password"
                  variant="outlined"
                />
              </v-col>
            </template>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.roles"
                :error-messages="form.errors.get('roles')"
                hide-details="auto"
                item-title="displayName"
                item-value="id"
                :items="refs.roles"
                :label="$t('users.roles._')"
                multiple
                name="roles"
                prepend-inner-icon="$roles"
                variant="outlined"
                @update:model-value="form.errors.clear('roles')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.roles.length === 1">{{ item.raw.displayName }}</span>
                    <span v-if="form.roles.length > 1">{{ form.roles.length }} selected </span>
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.permissions"
                :error-messages="form.errors.get('permissions')"
                hide-details="auto"
                item-title="displayName"
                item-value="id"
                :items="refs.permissions"
                :label="$t('users.permissions._')"
                :messages="$t('users.permissions.hint')"
                multiple
                name="permissions"
                prepend-inner-icon="$permissions"
                variant="outlined"
                @update:model-value="form.errors.clear('permissions')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.permissions.length === 1">{{ item.raw.displayName }}</span>
                    <span v-if="form.permissions.length > 1">{{ form.permissions.length }} selected
                    </span>
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.multiFactorAuthentication"
                :error-messages="form.errors.get('multiFactorAuthentication')"
                hide-details="auto"
                :label="$t('users.mfa._')"
                name="multiFactorAuthentication"
                @update:model-value="form.errors.clear('multiFactorAuthentication')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="toggles.verifiedAt"
                :error-messages="form.errors.get('verifiedAt')"
                hide-details="auto"
                :label="$t('users.verified')"
                name="verifiedAt"
                @update:model-value="toggle('verifiedAt')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="toggles.disabledAt"
                :error-messages="form.errors.get('disabledAt')"
                hide-details="auto"
                :label="$t('users.disabled')"
                name="disabledAt"
                @update:model-value="toggle('disabledAt')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.emailNotifications"
                :error-messages="form.errors.get('emailNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.email')"
                name="emailNotifications"
                @update:model-value="form.errors.clear('emailNotifications')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.smsNotifications"
                :error-messages="form.errors.get('smsNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.sms')"
                name="smsNotifications"
                @update:model-value="form.errors.clear('smsNotifications')"
              />
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { CustomField } from '@intake24/common/types';
import type { UserEntry, UserRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

type UserForm = {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  password: string | null;
  passwordConfirm: string | null;
  multiFactorAuthentication: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  verifiedAt: Date | null;
  disabledAt: Date | null;
  customFields: CustomField[];
  permissions: string[];
  roles: string[];
};

export default defineComponent({
  name: 'UserForm',

  mixins: [formMixin],

  setup(props) {
    const toggles = ref({ disabledAt: false, verifiedAt: false });

    const loadCallback = (data: Partial<UserEntry>) => {
      toggles.value.disabledAt = !!data.disabledAt;
      toggles.value.verifiedAt = !!data.verifiedAt;

      const { customFields = [], permissions = [], roles = [], ...rest } = data;
      return {
        ...rest,
        permissions: permissions.map(item => item.id),
        roles: roles.map(item => item.id),
        customFields: customFields.map(({ name, value }) => ({ name, value })),
      };
    };

    const { entry, entryLoaded, isCreate, refs, refsLoaded } = useEntry<UserEntry, UserRefs>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<UserForm, UserEntry>(props, {
      data: {
        id: null,
        name: null,
        email: null,
        phone: null,
        password: null,
        passwordConfirm: null,
        multiFactorAuthentication: false,
        emailNotifications: true,
        smsNotifications: true,
        verifiedAt: null,
        disabledAt: null,
        customFields: [],
        permissions: [],
        roles: [],
      },
      loadCallback,
    });

    const toggle = (field: 'verifiedAt' | 'disabledAt') => {
      form[field] = toggles.value[field] ? new Date() : null;
      form.errors.clear(field);
    };

    return {
      toggles,
      toggle,
      entry,
      entryLoaded,
      isCreate,
      refs,
      refsLoaded,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  methods: {},
});
</script>

<style lang="scss" scoped></style>
