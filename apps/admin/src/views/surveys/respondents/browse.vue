<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table
      ref="table"
      :api="`admin/surveys/${id}/respondents`"
      :headers="headers"
      track-by="userId"
    >
      <template #header-add>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
          <template #activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="primary" text v-bind="attrs" v-on="on">
              <v-icon left>fa-user-plus</v-icon> {{ $t('surveys.respondents.add') }}
            </v-btn>
          </template>
          <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
            <v-toolbar color="primary" dark flat>
              <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ $t(`surveys.respondents.${isCreate ? 'add' : 'edit'}`) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-form autocomplete="off" @keydown.native="clearError" @submit.prevent="save">
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.username"
                        autocomplete="username"
                        :disabled="!isCreate"
                        :error-messages="form.errors.get('username')"
                        hide-details="auto"
                        :label="$t('users.username')"
                        name="username"
                        outlined
                        prepend-inner-icon="fas fa-user-secret"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.password"
                        autocomplete="new-password"
                        :error-messages="form.errors.get('password')"
                        hide-details="auto"
                        :label="$t('common.password._')"
                        name="password"
                        outlined
                        prepend-inner-icon="fas fa-unlock"
                        type="password"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
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
                      ></v-text-field>
                    </v-col>
                    <template v-if="entry.userPersonalIdentifiers">
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.name"
                          :error-messages="form.errors.get('name')"
                          hide-details="auto"
                          :label="$t('users.name')"
                          name="name"
                          outlined
                          prepend-inner-icon="fas fa-user"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.email"
                          :error-messages="form.errors.get('email')"
                          hide-details="auto"
                          :label="$t('common.email')"
                          name="email"
                          outlined
                          prepend-inner-icon="fas fa-at"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.phone"
                          :error-messages="form.errors.get('phone')"
                          hide-details="auto"
                          :label="$t('common.phone')"
                          name="phone"
                          outlined
                          prepend-inner-icon="fas fa-phone"
                        ></v-text-field>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                  <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="info" text type="submit">
                  <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-menu close-on-click close-on-content-click offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="primary" v-bind="attrs" icon v-on="on">
              <v-icon>fa-ellipsis-v</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondents-upload :survey-id="id"></respondents-upload>
            <respondents-auth-url-export :survey-id="id"></respondents-auth-url-export>
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
            <v-btn class="font-weight-bold" color="primary" v-bind="attrs" icon v-on="on">
              <v-icon>fa-ellipsis-v</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondent-feedback :survey-id="id" :user="item"></respondent-feedback>
          </v-list>
        </v-menu>
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
        <confirm-dialog
          color="error"
          icon
          icon-left="$delete"
          :label="$t('common.action.delete').toString()"
          @confirm="remove(item)"
        >
          {{ $t('common.action.confirm.delete', { name: item.username }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type {
  SurveyEntry,
  SurveyRespondentEntry,
  SurveyRespondentListEntry,
} from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';
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

    const i18n = useI18n();

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
      },
    });
    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    return { dialog, headers, loading, entry, entryLoaded, table, form, clearError };
  },

  computed: {
    isCreate(): boolean {
      return !this.form.userId;
    },
  },

  methods: {
    async fetchUser(userId: string) {
      const { data } = await this.$http.get<SurveyRespondentEntry>(
        `admin/surveys/${this.id}/respondents/${userId}`
      );

      return data;
    },

    add() {
      this.form.reset();
      this.dialog = true;
    },

    async edit(item: SurveyRespondentListEntry) {
      this.loading = true;
      this.dialog = true;

      try {
        const user = await this.fetchUser(item.userId);
        this.form.load(user);
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.form.reset();
      this.dialog = false;
    },

    async updateTable() {
      await this.table?.fetch();
    },

    async save() {
      if (this.form.userId) {
        const { username: name } = await this.form.patch<SurveyRespondentEntry>(
          `admin/surveys/${this.id}/respondents/${this.form.userId}`
        );

        useMessages().success(this.$t('common.msg.updated', { name }).toString());
      } else {
        const { username: name } = await this.form.post<SurveyRespondentEntry>(
          `admin/surveys/${this.id}/respondents`
        );

        useMessages().success(this.$t('common.msg.created', { name }).toString());
      }

      this.dialog = false;
      await this.updateTable();
    },

    async remove({ username: name, userId }: SurveyRespondentListEntry) {
      await this.$http.delete(`admin/surveys/${this.id}/respondents/${userId}`);
      useMessages().success(this.$t('common.msg.deleted', { name }).toString());

      await this.updateTable();
    },

    async toClipboard(data: string) {
      await navigator.clipboard.writeText(data);
      useMessages().info(this.$t('surveys.respondents.authUrls.copiedToClipboard').toString());
    },
  },
});
</script>

<style lang="scss" scoped></style>
