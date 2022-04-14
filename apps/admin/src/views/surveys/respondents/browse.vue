<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <embedded-data-table
      :headers="headers"
      :api="`admin/surveys/${id}/respondents`"
      ref="table"
      track-by="userId"
    >
      <template v-slot:header-add>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="primary" text v-bind="attrs" v-on="on">
              <v-icon left>fa-user-plus</v-icon> {{ $t('surveys.respondents.add') }}
            </v-btn>
          </template>
          <v-card :loading="loading">
            <v-toolbar color="primary" dark flat>
              <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
                <v-icon>$cancel</v-icon>
              </v-btn>
              <v-toolbar-title>
                {{ $t(`surveys.respondents.${isCreate ? 'add' : 'edit'}`) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-form
              ref="form"
              autocomplete="off"
              @keydown.native="clearError"
              @submit.prevent="save"
            >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.username"
                        :disabled="!isCreate"
                        :error-messages="form.errors.get('username')"
                        :label="$t('users.username')"
                        hide-details="auto"
                        name="username"
                        outlined
                        prepend-icon="fas fa-user-secret"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.password"
                        :error-messages="form.errors.get('password')"
                        :label="$t('users.password._')"
                        autocomplete="new-password"
                        hide-details="auto"
                        name="password"
                        outlined
                        prepend-icon="fas fa-unlock"
                        type="password"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.passwordConfirm"
                        :error-messages="form.errors.get('passwordConfirm')"
                        :label="$t('users.password.confirm')"
                        autocomplete="new-password"
                        hide-details="auto"
                        name="passwordConfirm"
                        outlined
                        prepend-icon="fas fa-unlock"
                        type="password"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.name"
                        :error-messages="form.errors.get('name')"
                        :label="$t('users.name')"
                        hide-details="auto"
                        name="name"
                        outlined
                        prepend-icon="fas fa-user"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.email"
                        :error-messages="form.errors.get('email')"
                        :label="$t('users.email')"
                        hide-details="auto"
                        name="email"
                        outlined
                        prepend-icon="fas fa-at"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.phone"
                        :error-messages="form.errors.get('phone')"
                        :label="$t('users.phone')"
                        hide-details="auto"
                        name="phone"
                        outlined
                        prepend-icon="fas fa-phone"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                  <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                  <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-menu :close-on-content-click="true" :close-on-click="true" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="font-weight-bold" color="primary" v-bind="attrs" v-on="on" icon>
              <v-icon>fa-ellipsis-v</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondents-upload :surveyId="id"></respondents-upload>
            <respondents-auth-url-export :surveyId="id"></respondents-auth-url-export>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-menu close-on-content-click close-on-click offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="font-weight-bold" color="primary" v-bind="attrs" v-on="on" icon>
              <v-icon>fa-ellipsis-v</v-icon>
            </v-btn>
          </template>
          <v-list>
            <respondent-feedback :surveyId="id" :user="item"></respondent-feedback>
          </v-list>
        </v-menu>
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
        <confirm-dialog
          :label="$t('common.action.delete')"
          color="error"
          icon
          icon-left="$delete"
          @confirm="remove(item)"
        >
          {{ $t('common.action.confirm.delete', { name: item.username }) }}
        </confirm-dialog>
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import {
  SurveyRespondentEntry,
  SurveyRespondentListEntry,
} from '@intake24/common/types/http/admin';
import { ConfirmDialog } from '@intake24/ui';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import { form } from '@intake24/admin/helpers';
import { EntryMixin } from '@intake24/admin/types';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import RespondentFeedback from './respondent-feedback.vue';
import RespondentsUpload from './respondents-upload.vue';
import RespondentsAuthUrlExport from './respondents-auth-url-export.vue';

export type RespondentsRefs = {
  $refs: {
    table: InstanceType<typeof EmbeddedDataTable>;
  };
};

export type SurveyRespondentsForm = {
  userId: string | null;
  username: string | null;
  password: string | null;
  passwordConfirm: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export default (Vue as VueConstructor<Vue & EntryMixin & RespondentsRefs>).extend({
  name: 'SurveyRespondents',

  components: {
    ConfirmDialog,
    EmbeddedDataTable,
    RespondentFeedback,
    RespondentsAuthUrlExport,
    RespondentsUpload,
  },

  mixins: [detailMixin],

  data() {
    return {
      headers: [
        {
          text: this.$t('users.id'),
          sortable: true,
          value: 'userId',
          align: 'start',
        },
        {
          text: this.$t('users.aliases.username'),
          sortable: true,
          value: 'username',
          align: 'start',
        },
        {
          text: this.$t('users.aliases.urlAuthToken'),
          sortable: true,
          value: 'urlAuthToken',
          align: 'start',
        },
        {
          text: this.$t('common.action._'),
          sortable: false,
          value: 'action',
          align: 'right',
        },
      ],
      dialog: false,
      loading: false,
      form: form<SurveyRespondentsForm>({
        userId: null,
        username: null,
        password: null,
        passwordConfirm: null,
        name: null,
        email: null,
        phone: null,
      }),
    };
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

    clearError(event: KeyboardEvent) {
      const { name } = event.target as HTMLInputElement;

      if (name) this.form.errors.clear(name);
    },

    async updateTable() {
      await this.$refs.table.fetch();
    },

    async save() {
      if (this.form.userId) {
        const { username: name } = await this.form.patch<SurveyRespondentEntry>(
          `admin/surveys/${this.id}/respondents/${this.form.userId}`
        );

        this.$toasted.success(this.$t('common.msg.updated', { name }).toString());
      } else {
        const { username: name } = await this.form.post<SurveyRespondentEntry>(
          `admin/surveys/${this.id}/respondents`
        );

        this.$toasted.success(this.$t('common.msg.stored', { name }).toString());
      }

      this.dialog = false;
      await this.updateTable();
    },

    async remove({ username: name, userId }: SurveyRespondentListEntry) {
      await this.$http.delete(`admin/surveys/${this.id}/respondents/${userId}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name }).toString());

      await this.updateTable();
    },
  },
});
</script>

<style lang="scss" scoped></style>
