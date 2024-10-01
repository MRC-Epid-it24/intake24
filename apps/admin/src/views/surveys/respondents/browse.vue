<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table
      ref="table"
      :api-url="`admin/surveys/${id}/respondents`"
      :headers="headers"
      track-by="userId"
    >
      <template #header-add>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
          <template #activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="secondary" text v-bind="attrs" v-on="on">
              <v-icon left>
                fas fa-user-plus
              </v-icon>{{ $t('surveys.respondents.add') }}
            </v-btn>
          </template>
          <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
            <v-toolbar color="secondary" dark flat>
              <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ $t(`surveys.respondents.${isCreate ? 'add' : 'edit'}`) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-form autocomplete="off" @keydown.native="clearError" @submit.prevent="saveRespondent">
              <v-card-title>
                {{ $t('users.identifiers.title') }}
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.username"
                  autocomplete="username"
                  class="mb-4"
                  :disabled="!isCreate"
                  :error-messages="form.errors.get('username')"
                  hide-details="auto"
                  :label="$t('users.username')"
                  name="username"
                  outlined
                  prepend-inner-icon="fas fa-user-secret"
                />
                <v-text-field
                  v-model="form.password"
                  autocomplete="new-password"
                  class="mb-4"
                  :error-messages="form.errors.get('password')"
                  hide-details="auto"
                  :label="$t('common.password._')"
                  name="password"
                  outlined
                  prepend-inner-icon="fas fa-unlock"
                  type="password"
                />
                <v-text-field
                  v-model="form.passwordConfirm"
                  autocomplete="new-password"
                  :error-messages="form.errors.get('passwordConfirm')"
                  hide-details="auto"
                  :label="$t('common.password.confirm')"
                  name="passwordConfirm"
                  outlined
                  prepend-inner-icon="fas fa-unlock"
                  type="password"
                />
              </v-card-text>
              <template v-if="entry.userPersonalIdentifiers">
                <v-card-title>
                  {{ $t('users.personalIdentifiers.title') }}
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="form.name"
                    class="mb-4"
                    :error-messages="form.errors.get('name')"
                    hide-details="auto"
                    :label="$t('users.name')"
                    name="name"
                    outlined
                    prepend-inner-icon="fas fa-user"
                  />
                  <v-text-field
                    v-model="form.email"
                    class="mb-4"
                    :error-messages="form.errors.get('email')"
                    hide-details="auto"
                    :label="$t('common.email')"
                    name="email"
                    outlined
                    prepend-inner-icon="fas fa-at"
                  />
                  <v-text-field
                    v-model="form.phone"
                    :error-messages="form.errors.get('phone')"
                    hide-details="auto"
                    :label="$t('common.phone')"
                    name="phone"
                    outlined
                    prepend-inner-icon="fas fa-phone"
                  />
                </v-card-text>
              </template>
              <template v-if="entry.userCustomFields">
                <v-toolbar dense flat tile>
                  <div class="font-weight-medium">
                    {{ $t('users.customFields.title') }}
                  </div>
                  <v-spacer />
                  <v-btn color="primary" fab small :title="$t('users.customFields.add')" @click.stop="addCustomField">
                    <v-icon small>
                      $add
                    </v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <template v-for="(field, idx) in form.customFields">
                    <v-row :key="`r1-${idx}`" dense>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="field.name"
                          dense
                          :error-messages="form.errors.get(`customFields.${idx}.name`)"
                          hide-details="auto"
                          :label="$t('users.customFields.name')"
                          outlined
                        />
                      </v-col>
                      <v-col cols="12" md="8">
                        <v-text-field
                          v-model="field.value"
                          dense
                          :error-messages="form.errors.get(`customFields.${idx}.value`)"
                          hide-details="auto"
                          :label="$t('users.customFields.value')"
                          outlined
                        />
                      </v-col>
                    </v-row>
                    <v-row :key="`r2-${idx}`" dense justify="space-between">
                      <v-col cols="auto">
                        <v-checkbox v-model="field.public" class="mt-0" hide-details="auto" :label="$t('users.customFields.public')" />
                      </v-col>
                      <v-col cols="auto">
                        <v-btn color="error" text :title="$t('users.customFields.remove')" @click.stop="removeCustomField(idx)">
                          <v-icon color="error" left>
                            $delete
                          </v-icon>
                          {{ $t('common.action.remove') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-card-text>
              </template>
              <v-divider />
              <v-card-actions>
                <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                  <v-icon left>
                    $cancel
                  </v-icon>{{ $t('common.action.cancel') }}
                </v-btn>
                <v-spacer />
                <v-btn class="font-weight-bold" color="info" text type="submit">
                  <v-icon left>
                    $save
                  </v-icon>{{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-menu close-on-click close-on-content-click offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="secondary" v-bind="attrs" icon v-on="on">
              <v-icon>$options</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondents-upload :survey-id="id" />
            <respondents-auth-url-export :survey-id="id" />
          </v-list>
        </v-menu>
      </template>
      <template #[`item.surveyAuthUrl`]="{ item }">
        <v-btn :href="item.surveyAuthUrl" icon link target="_blank">
          <v-icon>fas fa-arrow-up-right-from-square</v-icon>
        </v-btn>
        <v-btn icon @click="toClipboard(item.surveyAuthUrl)">
          <v-icon>fas fa-clipboard</v-icon>
        </v-btn>
      </template>
      <template #[`item.feedbackAuthUrl`]="{ item }">
        <v-btn :href="item.feedbackAuthUrl" icon link target="_blank">
          <v-icon>fas fa-arrow-up-right-from-square</v-icon>
        </v-btn>
        <v-btn icon @click="toClipboard(item.feedbackAuthUrl)">
          <v-icon>fas fa-clipboard</v-icon>
        </v-btn>
      </template>
      <template #[`item.action`]="{ item }">
        <v-menu close-on-click close-on-content-click offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="secondary" v-bind="attrs" icon v-on="on">
              <v-icon>$options</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondent-feedback :survey-id="id" :user="item" />
          </v-list>
        </v-menu>
        <v-btn color="secondary" icon :title="$t('common.action.edit')" @click.stop="editRespondent(item)">
          <v-icon dark>
            $edit
          </v-icon>
        </v-btn>
        <confirm-dialog
          color="error"
          icon
          icon-left="$delete"
          :label="$t('common.action.delete').toString()"
          @confirm="removeRespondent(item)"
        >
          {{ $t('common.action.confirm.delete', { name: item.username }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import type { UserCustomField } from '@intake24/common/types';
import type {
  RespondentEntry,
  RespondentListEntry,
  SurveyEntry,
} from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog, useClipboard } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

import RespondentFeedback from './respondent-feedback.vue';
import RespondentsAuthUrlExport from './respondents-auth-url-export.vue';
import RespondentsUpload from './respondents-upload.vue';

export type SurveyRespondentsForm = {
  userId: string | null;
  username: string | null;
  password: string | null;
  passwordConfirm: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  customFields: UserCustomField[];
};

export default defineComponent({
  name: 'SurveyRespondents',

  components: {
    ConfirmDialog,
    EmbeddedDataTable,
    RespondentFeedback,
    RespondentsAuthUrlExport,
    RespondentsUpload,
  },

  mixins: [detailMixin],

  setup(props) {
    const dialog = ref(false);
    const loading = ref(false);

    const http = useHttp();
    const { i18n } = useI18n();
    const clipboard = useClipboard();

    async function toClipboard(data: string) {
      await clipboard.toClipboard(
        data,
        i18n.t('surveys.respondents.authUrls.copiedToClipboard').toString(),
      );
    }

    const headers = [
      {
        text: i18n.t('users.aliases.username'),
        sortable: true,
        value: 'username',
        align: 'start',
      },
      {
        text: i18n.t('users.aliases.urlAuthToken'),
        sortable: false,
        value: 'urlAuthToken',
        align: 'start',
      },
      {
        text: i18n.t('surveys.respondents.authUrls.surveyAuthUrl'),
        sortable: false,
        value: 'surveyAuthUrl',
        align: 'start',
      },
      {
        text: i18n.t('surveys.respondents.authUrls.feedbackAuthUrl'),
        sortable: false,
        value: 'feedbackAuthUrl',
        align: 'start',
      },
      {
        text: i18n.t('common.action._'),
        sortable: false,
        value: 'action',
        align: 'right',
      },
    ];

    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);

    const { form, clearError } = useForm<SurveyRespondentsForm>({
      data: {
        userId: null,
        username: null,
        password: null,
        passwordConfirm: null,
        name: null,
        email: null,
        phone: null,
        customFields: [],
      },
    });
    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    const isCreate = computed(() => !form.userId);

    function addCustomField() {
      const size = form.customFields.length + 1;
      form.customFields.push({ name: `name-${size}`, value: `value-${size}` });
    };

    function removeCustomField(index: number) {
      form.customFields.splice(index, 1);
    };

    async function fetchRespondent(username: string) {
      const { data } = await http.get<RespondentEntry>(
        `admin/surveys/${props.id}/respondents/${username}`,
      );

      return data;
    };

    function addRespondent() {
      form.reset();
      dialog.value = true;
    };

    async function editRespondent(item: RespondentListEntry) {
      loading.value = true;
      dialog.value = true;

      try {
        const user = await fetchRespondent(item.username);
        form.load(user);
      }
      finally {
        loading.value = false;
      }
    };

    function reset() {
      form.reset();
      dialog.value = false;
    };

    async function updateTable() {
      await table.value?.fetch();
    };

    async function saveRespondent() {
      if (form.userId) {
        const { username: name } = await form.patch<RespondentEntry>(
          `admin/surveys/${props.id}/respondents/${form.username}`,
        );

        useMessages().success(i18n.t('common.msg.updated', { name }).toString());
      }
      else {
        const { username: name } = await form.post<RespondentEntry>(
          `admin/surveys/${props.id}/respondents`,
        );

        useMessages().success(i18n.t('common.msg.created', { name }).toString());
      }

      dialog.value = false;
      await updateTable();
    };

    async function removeRespondent({ username: name }: RespondentListEntry) {
      await http.delete(`admin/surveys/${props.id}/respondents/${name}`);
      useMessages().success(i18n.t('common.msg.deleted', { name }).toString());

      await updateTable();
    };

    return {
      addCustomField,
      addRespondent,
      dialog,
      editRespondent,
      isCreate,
      headers,
      loading,
      entry,
      entryLoaded,
      table,
      form,
      clearError,
      removeCustomField,
      removeRespondent,
      reset,
      saveRespondent,
      toClipboard,
    };
  },
});
</script>

<style lang="scss" scoped></style>
