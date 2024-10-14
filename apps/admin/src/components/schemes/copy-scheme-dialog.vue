<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-btn
        class="ml-3"
        color="secondary"
        :title="$t(`${resource}.copy._`)"
        v-bind="props"
      >
        <v-icon icon="fas fa-copy" start />{{ $t(`${resource}.copy._`) }}
      </v-btn>
    </template>
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>
          {{ $t(`${resource}.copy.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="data.name"
              :error-messages="errors.get('name')"
              hide-details="auto"
              :label="$t(`${resource}.copy.name`)"
              name="name"
              variant="outlined"
            />
          </v-col>
          <!-- <v-col cols="12">
            <v-checkbox-btn v-model="redirect" :label="$t('common.redirect')"></v-checkbox-btn>
          </v-col> -->
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="close">
          <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="errors.any.value"
          variant="text"
          @click.stop="confirm"
        >
          <v-icon icon="$success" start />{{ $t(`${resource}.copy._`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

export type CopySchemeForm = {
  name: string | null;
};

export default defineComponent({
  name: 'CopySchemeDialog',

  props: {
    resource: {
      type: String as () => 'survey-schemes' | 'feedback-schemes',
      required: true,
    },
    schemeId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { i18n } = useI18n();
    const router = useRouter();
    const route = useRoute();

    const { data, errors, post } = useForm<CopySchemeForm>({ data: { name: null } });
    const dialog = ref(false);
    const redirect = ref(true);

    const close = () => {
      dialog.value = false;
    };

    const confirm = async () => {
      const { resource, schemeId } = props;
      const { name } = route;
      const { id } = await post<SurveySchemeEntry>(`admin/${resource}/${schemeId}/copy`);

      close();
      useMessages().success(i18n.t('common.msg.created', { name }));

      if (redirect.value)
        await router.push({ name: name ?? `${resource}-read`, params: { id } });
    };

    return {
      close,
      confirm,
      data,
      dialog,
      errors,
      redirect,
    };
  },
});
</script>
