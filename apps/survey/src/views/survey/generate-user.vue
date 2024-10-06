<template>
  <v-container :class="{ 'pa-0': $vuetify.display.mobile }">
    <app-entry-screen :title="$t('common._')">
      <v-form @keydown="errors.clear($event.target.name)" @submit.prevent="login('alias')">
        <v-card-text class="pa-6">
          <p>{{ $t('survey.generateUser.info1') }}</p>
          <p>{{ $t('survey.generateUser.info2') }}</p>
          <v-btn v-if="!status" block class="my-5" color="primary" rounded size="x-large" @click="submit">
            {{ $t('survey.generateUser._') }}
          </v-btn>
          <template v-if="status">
            <v-card v-if="status === 200" border class="pa-5 my-5" flat>
              <v-text-field
                autocomplete="username"
                :error-messages="errors.get('username')"
                hide-details="auto"
                :label="$t('common.username')"
                :model-value="username"
                name="username"
                prepend-inner-icon="fas fa-user"
                readonly
                required
                variant="outlined"
              />
              <v-text-field
                autocomplete="current-password"
                class="mt-4"
                :error-messages="errors.get('password')"
                hide-details="auto"
                :label="$t('common.password')"
                :model-value="password"
                name="password"
                prepend-inner-icon="fas fa-key"
                readonly
                required
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="showPassword = !showPassword">
                    {{ showPassword ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-card>
            <v-alert v-else type="error">
              {{ $t(`survey.generateUser.${status}`, { surveyId: survey?.name ?? surveyId }) }}
            </v-alert>
          </template>
          <i18n-t keypath="survey.generateUser.info3" tag="p">
            <template #action>
              <router-link :to="{ name: 'survey-login', params: { surveyId } }">
                {{ $t('survey.generateUser.link') }}
              </router-link>
            </template>
          </i18n-t>
        </v-card-text>
        <v-card-text class="px-6 pb-6">
          <v-btn block color="primary" :disabled="!canContinue" rounded size="x-large" type="submit">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-card-text>
      </v-form>
      <captcha ref="captchaEl" @expired="expired" @verified="verified" />
      <v-card-actions>
        <v-btn color="info" exact :to="{ name: 'survey-login', params: { surveyId } }" variant="text">
          <v-icon start>
            fas fa-angles-left
          </v-icon>
          {{ $t('common.login.back') }}
        </v-btn>
      </v-card-actions>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { surveyService } from '@intake24/survey/services';
import { AppEntryScreen, Captcha } from '@intake24/ui';

import { useLogin } from './use-login';

defineOptions({ name: 'GenerateUser' });

const props = defineProps({
  surveyId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const {
  captchaEl,
  captchaToken,
  errors,
  fetchSurveyPublicInfo,
  login,
  password,
  resetCaptcha,
  showPassword,
  status,
  survey,
  username,
} = useLogin(props);

showPassword.value = true;

const loading = ref(false);

const canContinue = computed(() => status.value === 200);

async function generateUser() {
  loading.value = true;

  try {
    const data = await surveyService.generateUser(props.surveyId, {
      captcha: captchaToken.value,
    });

    status.value = 200;
    username.value = data.username;
    password.value = data.password;
  }
  catch (err) {
    if (axios.isAxiosError(err))
      status.value = err.response?.status ?? 0;
  }
  finally {
    loading.value = false;

    resetCaptcha();
  }
}

async function verified(token?: string) {
  captchaToken.value = token;
  await generateUser();
}

function expired() {
  resetCaptcha();
}

async function submit() {
  if (captchaEl.value) {
    captchaEl.value.executeIfCan();
    return;
  }

  await generateUser();
}

onMounted(async () => {
  await fetchSurveyPublicInfo();
  if (survey.value?.openAccess !== true)
    await router.push({ name: 'home' });
});
</script>

<style lang="scss"></style>
