<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mt-10" outlined raised max-width="30rem" :loading="loading">
          <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
            <v-card-title>
              <h2>{{ $t('login.title') }}</h2>
            </v-card-title>
          </v-sheet>
          <v-card-text class="pa-6">
            <p>Thank you for choosing to take part in this study!</p>
            <p>Please click on the 'Generate access' button generate new credetials for you.</p>
            <p>
              This survey will take approximately 30 minutes to complete. If you would like to be
              able to stop filling out the survey and resume at a later time, please write down
              generated credentials.
            </p>
            <v-btn
              v-if="!status"
              block
              class="my-5"
              color="deep-orange"
              dark
              x-large
              @click="generateUser"
            >
              Generate access
            </v-btn>
            <v-sheet v-if="status === 200" class="pa-5 my-5" color="deep-orange lighten-5">
              <h4 class="my-2">{{ $t('common.username') }}: {{ userName }}</h4>
              <h4 class="my-2">{{ $t('common.password') }}: {{ password }}</h4>
            </v-sheet>
            <v-alert v-if="status === 403" border="left" color="error" dark>
              {{ `Survey '${surveyId}' doesn't allow user generation.` }}
            </v-alert>
            <v-alert v-if="status === 404" border="left" color="error" dark>
              {{ `Survey '${surveyId}' hasn't been recognised.` }}
            </v-alert>
            <p>
              If you close your browser window you can get back to your survey using the following
              <a :href="`/${surveyId}`">link</a>.
            </p>
            <p>
              If you think you will be able to complete the survey in one sitting, please ignore
              this and continue.
            </p>
            <v-card-actions class="px-0">
              <v-btn block color="secondary" xLarge :disabled="!canContinue" @click="onLogin">
                {{ $t('common.continue') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import surveySvc from '@/services/survey.service';

export default Vue.extend({
  name: 'GenerateUser',

  data() {
    const { surveyId } = this.$route.params;

    return {
      loading: false,
      status: null as number | null,
      userName: '',
      password: '',
      surveyId,
    };
  },

  computed: {
    canContinue(): boolean {
      return this.status === 200;
    },
  },

  methods: {
    ...mapActions('auth', ['login']),

    async generateUser() {
      this.loading = true;

      try {
        const { userName, password } = await surveySvc.generateUser(this.surveyId);
        this.status = 200;
        this.userName = userName;
        this.password = password;
      } catch (err) {
        this.status = err.response?.status;
      } finally {
        this.loading = false;
      }
    },

    async onLogin() {
      const { userName, password, surveyId } = this;
      try {
        await this.login({ userName, password, surveyId });
        this.userName = '';
        this.password = '';
        await this.$router.push({ name: 'recall', params: { surveyId } });
      } catch (err) {
        if (err.response?.status === 401)
          this.$toasted.error(this.$t('login.err.invalidCredentials') as string);
      }
    },
  },
});
</script>

<style lang="scss"></style>
