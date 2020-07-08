<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <user-list-table
      :headers="headers"
      :api="`v3/admin/surveys/${id}/respondents`"
      ref="table"
      track-by="userId"
    >
      <template v-slot:header-add>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn top right color="secondary" v-on="on">
              <v-icon class="mr-2">fa-plus</v-icon> {{ $t('surveys.respondents.add') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{
                $t(`surveys.respondents.${isCreate ? 'add' : 'edit'}`)
              }}</span>
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
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-3" text @click="reset">
                  {{ $t('common.action.cancel') }}
                </v-btn>
                <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                  {{ $t('common.action.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.action="{ item }" class="text-right">
        <v-btn color="primary" icon :title="$t('common.action.edit')" @click="edit(item)">
          <v-icon dark>$edit</v-icon>
        </v-btn>
        <v-btn color="error" icon :title="$t('common.action.delete')" @click="remove(item)">
          <v-icon dark>$delete</v-icon>
        </v-btn>
      </template>
    </user-list-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { AnyDictionary } from '@common/types/common';
import detailMixin from '@/components/entry/detailMixin';
import Form from '@/helpers/Form';
import { EntryMixin } from '@/types/vue';
import UserListTable from './UserListTable.vue';

export type RespondentsRefs = {
  $refs: {
    table: InstanceType<typeof UserListTable>;
  };
};

export default (Vue as VueConstructor<Vue & EntryMixin & RespondentsRefs>).extend({
  name: 'SurveyRespondents',

  components: { UserListTable },

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
      form: new Form({
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

    edit(item: AnyDictionary) {
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

    async save() {
      if (this.form.userId) {
        const {
          data: { userName: name },
        } = await this.form.put(`v3/admin/surveys/${this.id}/respondents/${this.form.userId}`);

        this.$toasted.success(this.$t('common.msg.updated', { name }) as string);
      } else {
        const {
          data: { userName: name },
        } = await this.form.post(`v3/admin/surveys/${this.id}/respondents`);

        this.$toasted.success(this.$t('common.msg.stored', { name }) as string);
      }

      this.$refs.table.fetch();
      this.dialog = false;
    },

    async remove({ userName: name, userId }: AnyDictionary) {
      if (!confirm(this.$t('common.action.confirm.delete', { name }) as string)) return;

      await this.$http.delete(`v3/admin/surveys/${this.id}/respondents/${userId}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name }) as string);

      this.$refs.table.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
