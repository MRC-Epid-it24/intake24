<template>
  <div>
    <h2 class="mb-4">
      {{ $t('user.profile') }}
    </h2>
    <v-card :flat="isMobile" :outlined="!isMobile" :tile="isMobile">
      <v-toolbar flat>
        <v-toolbar-title class="font-weight-medium text-h6">
          <slot name="title">
            {{ $t('user.personalAccessTokens.title') }}
          </slot>
        </v-toolbar-title>
        <v-spacer />
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template #activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              color="primary"
              fab
              small
              :title="$t('user.personalAccessTokens.issue')"
              v-on="on"
            >
              <v-icon>$add</v-icon>
            </v-btn>
          </template>
          <v-card :loading="false" :tile="$vuetify.breakpoint.smAndDown">
            <v-toolbar color="secondary" dark flat>
              <v-btn dark icon :title="$t('common.action.close')" @click.stop="close">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>{{ $t('user.personalAccessTokens.issue') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-6">
              <template v-if="jwt">
                <v-alert type="warning">
                  {{ $t('user.personalAccessTokens.save') }}
                </v-alert>
                <v-textarea
                  auto-grow
                  class="mb-4"
                  hide-details
                  name="jwt"
                  outlined
                  readonly
                  :value="jwt"
                />
                <v-btn block color="info" large @click="toClipboard(jwt)">
                  <v-icon left>
                    fas fa-clipboard
                  </v-icon>
                  {{ $t('common.clipboard._') }}
                </v-btn>
              </template>
              <v-form v-else @keydown.native="clearError" @submit.prevent="submit">
                <v-text-field
                  v-model="form.name"
                  class="mb-4"
                  :error-messages="form.errors.get('name')"
                  hide-details="auto"
                  :label="$t('common.name')"
                  name="name"
                  outlined
                />
                <v-text-field
                  append-icon="fas fa-calendar-alt"
                  class="mb-4"
                  :error-messages="form.errors.get('expiresAt')"
                  hide-details="auto"
                  :label="$t('common.expiresAt')"
                  name="name"
                  outlined
                  readonly
                  :value="formatDate(form.expiresAt, 'dd/MM/yyyy')"
                  @click:append="datePicker = !datePicker"
                  @focusin="datePicker = true"
                />
                <v-expand-transition>
                  <v-date-picker
                    v-show="datePicker"
                    v-model="form.expiresAt"
                    :error-messages="form.errors.get('expiresAt')"
                    hide-details="auto"
                    name="expiresAt"
                    scrollable
                    width="auto"
                    @input="datePicker = false"
                  />
                </v-expand-transition>
                <v-btn
                  block
                  color="primary"
                  large
                  :title="$t('user.personalAccessTokens.issue')"
                  type="submit"
                >
                  {{ $t('user.personalAccessTokens.issue') }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-list two-line>
        <v-list-item
          v-for="(token, idx) in tokens"
          :key="token.id"
          class="list-item-border"
          :disabled="token.revoked"
          link
        >
          <v-list-item-avatar>
            <v-icon class="secondary" dark>
              fas fa-key
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ token.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="token.revoked">
              {{ $t('user.personalAccessTokens.revoked') }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-else>
              {{ $t('common.expiresAt') }}: {{ formatDate(token.expiresAt, 'dd/MM/yyyy') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon
              v-if="token.revoked"
              color="secondary"
              :title="$t('user.personalAccessTokens.revoked').toString()"
            >
              fas fa-ban
            </v-icon>
            <confirm-dialog
              v-else
              color="error"
              icon
              icon-left="$delete"
              :label="$t('user.personalAccessTokens.revoke').toString()"
              @confirm="revoke(idx)"
            >
              {{ $t('common.action.confirm.revoke', { name: token.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import { addYears } from 'date-fns';
import { defineComponent, onMounted, ref, watch } from 'vue';

import type {
  PersonalAccessTokenResponse,
  PersonalAccessTokensResponse,
} from '@intake24/common/types/http/admin';
import { useDateTime, useForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import { useMessages } from '@intake24/admin/stores';
import { useI18n } from '@intake24/i18n/index';
import { ConfirmDialog } from '@intake24/ui/components';
import { useClipboard } from '@intake24/ui/composables';

export default defineComponent({
  name: 'PersonalAccessTokens',

  components: { ConfirmDialog },

  setup() {
    const { i18n } = useI18n();

    const http = useHttp();
    const { formatDate } = useDateTime();
    const { toClipboard } = useClipboard();

    const jwt = ref('');
    const tokens = ref<PersonalAccessTokenResponse[]>([]);
    const dialog = ref(false);
    const datePicker = ref(false);

    const { form, clearError } = useForm({
      data: { name: '', expiresAt: addYears(new Date(), 1).toISOString().slice(0, 10) },
    });

    const close = () => {
      dialog.value = false;
    };

    const submit = async () => {
      const data = await form.post<{ jwt: string; token: PersonalAccessTokenResponse }>(
        'admin/user/personal-access-tokens',
      );
      jwt.value = data.jwt;
      tokens.value.unshift(data.token);
    };

    const revoke = async (idx: number) => {
      const { id, name } = tokens.value[idx];

      await http.delete(`admin/user/personal-access-tokens/${id}`);
      tokens.value[idx].revoked = true;

      useMessages().success(i18n.t('common.msg.revoked', { name }).toString());
    };

    const getTokens = async () => {
      const {
        data: { data },
      } = await http.get<PersonalAccessTokensResponse>('admin/user/personal-access-tokens');
      tokens.value = data;
    };

    watch(dialog, () => {
      form.reset();
      jwt.value = '';
    });

    onMounted(async () => {
      await getTokens();
    });

    return {
      clearError,
      close,
      datePicker,
      dialog,
      form,
      formatDate,
      jwt,
      revoke,
      submit,
      tokens,
      toClipboard,
    };
  },
});
</script>
