<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen
      :subtitle="$t('common.login.subtitle').toString()"
      :title="$t('common._').toString()"
      width="30rem"
    >
      <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="login">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  autocomplete="username"
                  :error-messages="errors.get('username')"
                  hide-details="auto"
                  :label="$t('common.username')"
                  name="username"
                  outlined
                  prepend-inner-icon="fas fa-user"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                  autocomplete="current-password"
                  :error-messages="errors.get('password')"
                  hide-details="auto"
                  :label="$t('common.password')"
                  name="password"
                  outlined
                  prepend-inner-icon="fas fa-key"
                  required
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-btn block color="primary" rounded type="submit" x-large>
                  {{ $t('common.login._') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
      <template v-if="isOpenAccess">
        <v-divider class="mx-6"></v-divider>
        <v-card-title class="text-h3 font-weight-medium justify-center">
          {{ `No account?` }}
        </v-card-title>
        <v-card-subtitle class="d-flex justify-center font-weight-medium px-6 pt-4">
          {{ $t('survey.generateUser.subtitle') }}
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  block
                  color="accent"
                  outlined
                  rounded
                  :to="{ name: 'survey-generate-user', params: { surveyId } }"
                  x-large
                >
                  {{ $t('survey.generateUser._') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </template>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router/composables';

import { useAuth } from '@intake24/survey/stores';
import { AppEntryScreen } from '@intake24/ui';

import { useLogin } from './use-login';

export default defineComponent({
  name: 'SurveyLogin',

  components: { AppEntryScreen },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const {
      errors,
      fetchSurveyPublicInfo,
      isOpenAccess,
      login,
      password,
      showPassword,
      status,
      survey,
      username,
    } = useLogin(props);

    onMounted(async () => {
      await fetchSurveyPublicInfo();
      if (!survey.value) {
        await router.push({ name: 'home' });
        return;
      }

      const auth = useAuth();

      if (!auth.loggedIn) {
        try {
          await auth.refresh();
          await router.push({ name: 'survey-home', params: { surveyId: props.surveyId } });
        } catch (err) {
          // continue
        }
      }
    });

    return {
      errors,
      fetchSurveyPublicInfo,
      isOpenAccess,
      login,
      password,
      showPassword,
      status,
      survey,
      username,
    };
  },
});
</script>

<style lang="scss"></style>
