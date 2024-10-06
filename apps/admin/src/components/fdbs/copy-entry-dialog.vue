<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-btn
        class="ml-3"
        color="secondary"
        :title="$t(`fdbs.${type}.copy`)"
        variant="outlined"
        v-bind="props"
      >
        <v-icon icon="fas fa-copy" start />{{ $t(`fdbs.${type}.copy`) }}
      </v-btn>
    </template>
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>
          {{ $t(`fdbs.${type}.copy`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown="clearError" @submit.prevent="confirm">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.code"
                :error-messages="form.errors.get('code')"
                hide-details="auto"
                :label="$t(`fdbs.${type}.global.code`)"
                name="code"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t(`fdbs.${type}.global.name`)"
                name="name"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="close">
          <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="form.errors.any()"
          variant="text"
          @click.stop="confirm"
        >
          <v-icon icon="$success" start />{{ $t('common.action.confirm._') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { FoodLocalCopyInput, SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

export type CopyEntityForm = FoodLocalCopyInput;

export default defineComponent({
  name: 'CopyEntryDialog',

  props: {
    type: {
      type: String as () => 'categories' | 'foods',
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    entryId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { i18n } = useI18n();
    const router = useRouter();

    const { clearError, form } = useForm<CopyEntityForm>({
      data: { code: '', name: '' },
    });

    const dialog = ref(false);

    const close = () => {
      dialog.value = false;
    };

    const confirm = async () => {
      const { type, localeId, entryId } = props;
      const { name } = form;
      const { id } = await form.post<SurveySchemeEntry>(
        `admin/fdbs/${localeId}/${type}/${entryId}/copy`,
      );

      close();
      useMessages().success(i18n.t('common.msg.created', { name }));
      await router.push({ name: `fdbs-${type}`, params: { id: localeId, entryId: id } });
    };

    return { clearError, close, confirm, form, dialog };
  },
});
</script>
