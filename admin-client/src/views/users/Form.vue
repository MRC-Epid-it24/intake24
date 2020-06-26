<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
    <v-form @submit.prevent="onSubmit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('users.name')"
                hide-details="auto"
                outlined
                @input="form.errors.clear('name')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.simpleName"
                :error-messages="form.errors.get('simpleName')"
                :label="$t('users.simpleName')"
                hide-details="auto"
                outlined
                @input="form.errors.clear('simpleName')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                :error-messages="form.errors.get('email')"
                :label="$t('users.email')"
                hide-details="auto"
                outlined
                @input="form.errors.clear('email')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                :error-messages="form.errors.get('phone')"
                :label="$t('users.phone')"
                hide-details="auto"
                outlined
                @input="form.errors.clear('phone')"
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
                  outlined
                  @input="form.errors.clear('password')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  type="password"
                  v-model="form.passwordConfirm"
                  :error-messages="form.errors.get('passwordConfirm')"
                  :label="$t('users.password.confirmation')"
                  hide-details="auto"
                  outlined
                  @input="form.errors.clear('passwordConfirm')"
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
                hide-details="auto"
                :label="$t('users.mfa._')"
                @change="form.errors.clear('multiFactorAuthentication')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.emailNotifications"
                :error-messages="form.errors.get('emailNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.email')"
                @change="form.errors.clear('emailNotifications')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="form.smsNotifications"
                :error-messages="form.errors.get('smsNotifications')"
                hide-details="auto"
                :label="$t('users.notifications.sms')"
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
        simpleName: null,
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
