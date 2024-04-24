<template>
  <v-sheet>
    <h2 class="text-h2 font-weight-medium text-center mb-4">
      {{ $t(`${type}.rating.title`) }}
    </h2>
    <div class="d-flex flex-column justify-center">
      <v-rating
        v-model="form.rating"
        class="text-center my-4"
        color="primary"
        hover
        length="5"
        :readonly="sent"
        :size="$vuetify.breakpoint.smAndDown ? 32 : 48"
        @input="dialog = true"
      />
    </div>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px"
      transition="dialog-bottom-transition"
    >
      <v-card :tile="isMobile">
        <v-toolbar color="secondary" dark>
          <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t(`${type}.rating._`) }}</v-toolbar-title>
        </v-toolbar>
        <h3 class="text-h3 font-weight-medium text-center mt-3">
          {{ $t(`${type}.rating.title`) }}
        </h3>
        <v-form @keydown.native="errors.clear()" @submit.prevent="rate">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-rating
                    v-model="form.rating"
                    class="text-center my-4"
                    color="primary"
                    hover
                    length="5"
                    :size="$vuetify.breakpoint.smAndDown ? 32 : 48"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.comment"
                    :counter="500"
                    :error-messages="errors.get('comment')"
                    hide-details="auto"
                    :label="$t(`${type}.rating.comment`)"
                    name="comment"
                    outlined
                    prepend-inner-icon="fas fa-message"
                  />
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" md="8">
                  <v-btn
                    block
                    color="primary"
                    :disabled="errors.any()"
                    outlined
                    rounded
                    :title="$t(`${type}.rating.send`)"
                    type="submit"
                    x-large
                  >
                    {{ $t(`${type}.rating.send`) }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import axios, { HttpStatusCode } from 'axios';
import { defineComponent, ref, watch } from 'vue';

import type { SurveyRating } from '@intake24/common/surveys';
import type { SurveyRatingRequest } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import { surveyService } from '../services';
import { useLoading, useMessages } from '../stores';

export default defineComponent({
  name: 'SurveyRating',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    submissionId: {
      type: String,
    },
    type: {
      type: String as PropType<SurveyRating>,
      required: true,
    },
  },

  setup(props) {
    const { i18n } = useI18n();

    const dialog = ref(false);
    const errors = ref(new Errors());
    const sent = ref(false);

    const createForm = (): SurveyRatingRequest => ({
      type: props.type,
      submissionId: props.submissionId,
      rating: 0,
      comment: null,
    });

    const form = ref(createForm());

    const reset = () => {
      form.value = createForm();
    };

    const close = () => {
      dialog.value = false;
    };

    const rate = async () => {
      const loading = useLoading();
      loading.addItem(`${props.type}-rating`);

      try {
        await surveyService.storeRating(props.surveyId, form.value);
        useMessages().info(i18n.t(`${props.type}.rating.sent`).toString());
        sent.value = true;
        close();
      }
      catch (err) {
        if (
          axios.isAxiosError(err)
          && err.response?.status === HttpStatusCode.BadRequest
          && 'errors' in err.response.data
        ) {
          errors.value.record(err.response.data.errors);
          return;
        }

        throw err;
      }
      finally {
        loading.removeItem(`${props.type}-rating`);
      }
    };

    watch(dialog, (value) => {
      if (!value && !sent.value)
        reset();
    });

    return {
      dialog,
      createForm,
      form,
      errors,
      close,
      rate,
      reset,
      sent,
    };
  },
});
</script>
