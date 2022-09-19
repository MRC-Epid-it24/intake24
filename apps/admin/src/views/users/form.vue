<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('users.name')"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                :error-messages="form.errors.get('email')"
                hide-details="auto"
                :label="$t('common.email')"
                name="email"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                :error-messages="form.errors.get('phone')"
                hide-details="auto"
                :label="$t('common.phone')"
                name="phone"
                outlined
              ></v-text-field>
            </v-col>
            <template v-if="isCreate">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  :error-messages="form.errors.get('password')"
                  hide-details="auto"
                  :label="$t('common.password._')"
                  name="password"
                  outlined
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.passwordConfirm"
                  :error-messages="form.errors.get('passwordConfirm')"
                  hide-details="auto"
                  :label="$t('common.password.confirm')"
                  name="passwordConfirm"
                  outlined
                  type="password"
                ></v-text-field>
              </v-col>
            </template>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.roles"
                :error-messages="form.errors.get('roles')"
                hide-details="auto"
                item-text="displayName"
                item-value="id"
                :items="refs.roles"
                :label="$t('users.roles')"
                multiple
                name="roles"
                outlined
                @change="form.errors.clear('roles')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.roles.length === 1">{{ item.displayName }}</span>
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
                item-text="displayName"
                item-value="id"
                :items="refs.permissions"
                :label="$t('users.permissions._')"
                :messages="$t('users.permissions.hint')"
                multiple
                name="permissions"
                outlined
                @change="form.errors.clear('permissions')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.permissions.length === 1">{{ item.displayName }}</span>
                    <span v-if="form.permissions.length > 1"
                      >{{ form.permissions.length }} selected
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
                @change="form.errors.clear('multiFactorAuthentication')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.emailNotifications"
                :error-messages="form.errors.get('emailNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.email')"
                name="emailNotifications"
                @change="form.errors.clear('emailNotifications')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.smsNotifications"
                :error-messages="form.errors.get('smsNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.sms')"
                name="smsNotifications"
                @change="form.errors.clear('smsNotifications')"
              ></v-switch>
            </v-col>
          </v-row>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { CustomField } from '@intake24/common/types';
import type { UserEntry, UserRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';

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
  customFields: CustomField[];
  permissions: string[];
  roles: string[];
};

export default defineComponent({
  name: 'UserForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<UserEntry, UserRefs>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    return {
      form: form<UserForm>({
        id: null,
        name: null,
        email: null,
        phone: null,
        password: null,
        passwordConfirm: null,
        multiFactorAuthentication: false,
        emailNotifications: true,
        smsNotifications: true,
        customFields: [],
        permissions: [],
        roles: [],
      }),
    };
  },

  methods: {
    toForm(data: Partial<UserEntry>) {
      const { customFields = [], permissions = [], roles = [], ...rest } = data;
      const input = {
        ...rest,
        permissions: permissions.map((item) => item.id),
        roles: roles.map((item) => item.id),
        customFields: customFields.map(({ name, value }) => ({ name, value })),
      };

      this.setOriginalEntry(input);
      this.form.load(input);
    },
  },
});
</script>

<style lang="scss" scoped></style>
