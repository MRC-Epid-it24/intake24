<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-form @keydown.native="clearError" @submit.prevent="onSubmit">
      <v-container>
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
                  type="password"
                  v-model="form.passwordConfirm"
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
                hide-details="auto"
                multiple
                name="roles"
                outlined
                @change="form.errors.clear('roles')"
              >
                <template v-slot:selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.roles.length === 1">{{ item }}</span>
                    <span v-if="form.roles.length > 1">{{ form.roles.length }} selected </span>
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
      </v-container>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue from 'vue';
import formMixin from '@/components/entry/formMixin';
import Form from '@/helpers/Form';

export default Vue.extend({
  name: 'UserForm',

  mixins: [formMixin],

  data() {
    return {
      form: new Form({
        id: null,
        name: null,
        email: null,
        phone: null,
        password: null,
        passwordConfirm: null,
        multiFactorAuthentication: false,
        emailNotifications: false,
        smsNotifications: false,
        roles: [],
      }),
    };
  },
});
</script>

<style lang="scss" scoped></style>
