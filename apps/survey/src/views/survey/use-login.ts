import axios, { HttpStatusCode } from 'axios';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { surveyService } from '@intake24/survey/services';
import { useAuth, useMessages } from '@intake24/survey/stores';

export type UseLoginProps = {
  surveyId: string;
};

export const useLogin = (props: UseLoginProps) => {
  const auth = useAuth();
  const { i18n } = useI18n();
  const router = useRouter();

  const username = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const status = ref<number | null>(null);
  const survey = ref<PublicSurveyEntry | null>(null);
  const errors = ref(new Errors());

  const isOpenAccess = computed(() => !!survey.value?.openAccess);

  const fetchSurveyPublicInfo = async () => {
    try {
      survey.value = await surveyService.surveyPublicInfo(props.surveyId);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === HttpStatusCode.NotFound) {
        status.value = err.response?.status;
        return;
      }

      throw err;
    }
  };

  const login = async () => {
    try {
      await auth.login({
        username: username.value,
        password: password.value,
        survey: props.surveyId,
      });
      username.value = '';
      password.value = '';
      await router.push({ name: 'survey-home', params: { survey: props.surveyId } });
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        [HttpStatusCode.BadRequest, HttpStatusCode.Unauthorized].includes(err.response?.status ?? 0)
      ) {
        const { response: { status: statusCode = 0, data = {} } = {} } = err;

        status.value = statusCode;

        if (statusCode === HttpStatusCode.BadRequest && 'errors' in data)
          errors.value.record(data.errors);

        if (statusCode === HttpStatusCode.Unauthorized)
          useMessages().error(i18n.t('common.login.err.invalidCredentials').toString());

        return;
      }

      throw err;
    }
  };

  return {
    username,
    password,
    showPassword,
    status,
    survey,
    errors,
    isOpenAccess,
    fetchSurveyPublicInfo,
    login,
  };
};
