<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <data-table
      :headers="headers"
      :api="`admin/surveys/${id}/respondents`"
      ref="table"
      track-by="userId"
    >
      <template v-slot:header-add>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="font-weight-bold" color="primary" text v-bind="attrs" v-on="on">
              <v-icon class="mr-2">fa-user-plus</v-icon> {{ $t('surveys.respondents.add') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">
                {{ $t(`surveys.respondents.${isCreate ? 'add' : 'edit'}`) }}
              </span>
            </v-card-title>
            <v-form ref="form" @keydown.native="clearError" @submit.prevent="save">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.userName"
                        :disabled="!isCreate"
                        :error-messages="form.errors.get('userName')"
                        :label="$t('users.username')"
                        hide-details="auto"
                        name="userName"
                        outlined
                        prepend-icon="fas fa-user-secret"
                      ></v-text-field>
                    </v-col>
                    <template v-if="isCreate">
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.password"
                          :error-messages="form.errors.get('password')"
                          :label="$t('users.password._')"
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
                          hide-details="auto"
                          name="passwordConfirm"
                          outlined
                          prepend-icon="fas fa-unlock"
                          type="password"
                        ></v-text-field>
                      </v-col>
                    </template>
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
            <respondents-upload></respondents-upload>
            <respondents-auth-url-export></respondents-auth-url-export>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:[`item.action`]="{ item }" class="text-right">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click.stop="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
        <confirm-dialog
          :label="$t('common.action.delete')"
          color="error"
          icon
          iconLeft="$delete"
          @confirm="remove(item)"
        >
          {{ $t('common.action.confirm.delete', { name: item.userName }) }}
        </confirm-dialog>
      </template>
    </data-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { Dictionary } from '@common/types';
import { RespondentEntry, SurveyRespondentResponse } from '@common/types/http';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import detailMixin from '@/components/entry/detailMixin';
import form from '@/helpers/Form';
import { EntryMixin } from '@/types/vue';
import DataTable from '../DataTable.vue';
import RespondentsUpload from './RespondentsUpload.vue';
import RespondentsAuthUrlExport from './RespondentsAuthUrlExport.vue';

export type RespondentsRefs = {
  $refs: {
    table: InstanceType<typeof DataTable>;
  };
};

export type SurveyRespondentsForm = {
  userId: string | null;
  userName: string | null;
  password: string | null;
  passwordConfirm: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export default (Vue as VueConstructor<Vue & EntryMixin & RespondentsRefs>).extend({
  name: 'SurveyRespondents',

  components: { ConfirmDialog, DataTable, RespondentsAuthUrlExport, RespondentsUpload },

  mixins: [detailMixin],

  data() {
    return {
      headers: [
        {
          text: this.$t('users.username'),
          sortable: true,
          value: 'userName',
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
      form: form<SurveyRespondentsForm>({
        userId: null,
        userName: null,
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
    add() {
      this.form.reset();
      this.dialog = true;
    },

    edit(item: Dictionary) {
      this.form.load(item);
      this.dialog = true;
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
        const {
          data: { userName: name },
        } = await this.form.put<SurveyRespondentResponse>(
          `admin/surveys/${this.id}/respondents/${this.form.userId}`
        );

        this.$toasted.success(this.$t('common.msg.updated', { name }) as string);
      } else {
        const {
          data: { userName: name },
        } = await this.form.post<SurveyRespondentResponse>(`admin/surveys/${this.id}/respondents`);

        this.$toasted.success(this.$t('common.msg.stored', { name }) as string);
      }

      this.dialog = false;
      await this.updateTable();
    },

    async remove({ userName: name, userId }: RespondentEntry) {
      await this.$http.delete(`admin/surveys/${this.id}/respondents/${userId}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name }) as string);

      await this.updateTable();
    },
  },
});
</script>

<style lang="scss" scoped></style>
