<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-btn class="ml-3" link text v-bind="attrs" v-on="on">
        <v-icon class="mr-2">fas fa-user-shield</v-icon>
        {{ owner ? owner.name : $t('common.none') }}
      </v-btn>
    </template>
    <v-card :loading="isLoading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('securables.owner.title') }}
        </v-toolbar-title>
        <template #extension>
          <div class="mx-auto"><v-icon left>$search</v-icon>{{ $t('securables.search') }}</div>
        </template>
      </v-toolbar>
      <v-form @submit.prevent="save">
        <v-container>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <auto-complete
                  v-model="form.userId"
                  :api="`${api}/users`"
                  clearable
                  :error-messages="form.errors.get('userId')"
                  hide-no-data
                  hide-selected
                  item-text="email"
                  item-value="id"
                  :label="$t('common.email').toString()"
                  name="userId"
                  prepend-inner-icon="fas fa-user-shield"
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
            <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="font-weight-bold"
            color="info"
            :disabled="form.errors.any()"
            text
            type="submit"
          >
            <v-icon left>$save</v-icon>{{ $t('common.action.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { UserAttributes } from '@intake24/db';
import { AutoComplete } from '@intake24/admin/components/forms';
import { useEntry } from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';

type OwnerDialogForm = {
  userId: string | null;
};

export type Owner = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export default defineComponent({
  name: 'OwnerDialog',

  components: { AutoComplete },

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
      type: Object as PropType<Owner>,
    },
  },

  data() {
    return {
      dialog: false,
      form: createForm<OwnerDialogForm>({ userId: null }),
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
