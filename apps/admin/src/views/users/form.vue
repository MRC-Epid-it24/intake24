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
                :label="$t('users.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                :error-messages="form.errors.get('email')"
                :label="$t('users.email')"
                hide-details="auto"
                name="email"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                :error-messages="form.errors.get('phone')"
                :label="$t('users.phone')"
                hide-details="auto"
                name="phone"
                outlined
              ></v-text-field>
            </v-col>
            <template v-if="isCreate">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  type="password"
                  :error-messages="form.errors.get('password')"
                  :label="$t('users.password._')"
                  hide-details="auto"
                  name="password"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.passwordConfirm"
                  type="password"
                  :error-messages="form.errors.get('passwordConfirm')"
                  :label="$t('users.password.confirm')"
                  hide-details="auto"
                  name="passwordConfirm"
                  outlined
                ></v-text-field>
              </v-col>
            </template>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.roles"
                :items="refs.roles"
                :label="$t('users.roles')"
                :error-messages="form.errors.get('roles')"
                item-value="id"
                item-text="displayName"
                hide-details="auto"
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
                :items="refs.permissions"
                :label="$t('users.permissions._')"
                :messages="$t('users.permissions.hint')"
                :error-messages="form.errors.get('permissions')"
                item-value="id"
                item-text="displayName"
                hide-details="auto"
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
                :label="$t('users.mfa._')"
                hide-details="auto"
                name="multiFactorAuthentication"
                @change="form.errors.clear('multiFactorAuthentication')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.emailNotifications"
                :error-messages="form.errors.get('emailNotifications')"
                :label="$t('users.notifications.email')"
                hide-details="auto"
                name="emailNotifications"
                @change="form.errors.clear('emailNotifications')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.smsNotifications"
                :error-messages="form.errors.get('smsNotifications')"
                :label="$t('users.notifications.sms')"
                hide-details="auto"
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
