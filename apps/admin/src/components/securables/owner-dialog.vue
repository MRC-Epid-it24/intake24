<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn link text class="ml-3" v-bind="attrs" v-on="on">
        <v-icon class="mr-2">fas fa-user-shield</v-icon>
        {{ owner ? owner.name : $t('common.none') }}
      </v-btn>
    </template>
    <v-card :loading="isLoading">
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`${resource}.securables.owner.title`) }}
        </v-toolbar-title>
        <template v-slot:extension>
          <div class="mx-auto">
            <v-icon left>fa-search</v-icon>{{ $t(`${resource}.securables.search`) }}
          </div>
        </template>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <auto-complete
                  v-model="form.userId"
                  :error-messages="form.errors.get('userId')"
                  :label="$t('users.email')"
                  :api="`${api}/users`"
                  clearable
                  hide-no-data
                  hide-selected
                  item-text="email"
                  item-value="id"
                  name="userId"
                  prepend-icon="fas fa-user-shield"
                  :selected="owner"
                  @input="form.errors.clear('userId')"
                  @update:object="internalOwner = $event"
                ></auto-complete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
        <v-card-actions>
          <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
            <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="form.errors.any()"
            class="font-weight-bold"
            color="blue darken-3"
            text
            type="submit"
          >
            <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { UserAttributes } from '@intake24/common/types/models';
import { AutoComplete } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';
import { useEntry } from '@intake24/admin/stores';

type OwnerDialogForm = {
  userId: string | null;
};

export type Owner = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export default defineComponent({
  name: 'OwnerDialog',

  props: {
    api: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    owner: {
      type: Object as PropType<Pick<UserAttributes, 'id' | 'name' | 'email'>>,
    },
  },

  components: { AutoComplete },

  data() {
    return {
      dialog: false,
      form: form<OwnerDialogForm>({ userId: null }),
      internalOwner: this.owner ? { ...this.owner } : undefined,
      isLoading: false,
    };
  },

  watch: {
    dialog(val: boolean) {
      if (!val) return;

      this.form.userId = this.owner?.id ?? null;
    },
  },

  methods: {
    reset() {
      this.dialog = false;
    },

    async save() {
      await this.form.post(`${this.api}/owner`);

      const partialEntry = this.internalOwner
        ? { ownerId: this.internalOwner.id, owner: this.internalOwner }
        : { ownerId: null, owner: null };

      useEntry().updateEntry(partialEntry);

      this.reset();
    },
  },
});
</script>

<style lang="scss" scoped></style>
