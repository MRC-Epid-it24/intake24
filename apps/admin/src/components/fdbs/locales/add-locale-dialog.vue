<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" color="primary" fab small :title="$t('fdbs.categories.add')" v-on="on">
        <v-icon>$add</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('fdbs.categories.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-text-field
          v-model="search"
          class="mb-4"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          :loading="loading"
          outlined
          prepend-inner-icon="$search"
          @click:clear="clear"
        >
        </v-text-field>
        <v-alert v-if="isAlreadyIncluded" text type="error">
          {{ $t('fdbs.categories.alreadyIncluded', { code: selectedItems[0].code }) }}
        </v-alert>
        <template v-if="items.length">
          <v-list dense min-height="350px">
            <v-list-item-group v-model="selected" multiple>
              <template v-for="(item, idx) in items">
                <v-list-item :key="item.id" :value="item.id">
                  <template #default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>$locales</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ item.code }} | {{ item.englishName }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
          <div class="text-center">
            <v-pagination v-model="page" circle :length="lastPage"></v-pagination>
          </div>
        </template>
        <v-alert v-else color="secondary" text type="info">
          {{ $t('fdbs.categories.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="close">
          <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selected.length || isAlreadyIncluded"
          text
          @click.stop="confirm"
        >
          <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { SystemLocaleReferences } from '@intake24/common/types/http/admin';
import type { FoodsLocaleAttributes } from '@intake24/db';
import { useFetchList } from '@intake24/admin/composables';

export default defineComponent({
  name: 'AddLocaleDialog',

  props: {
    currentItems: {
      type: Array as PropType<FoodsLocaleAttributes[]>,
      required: true,
    },
  },

  emits: ['add'],

  setup() {
    const selected = ref<string[]>([]);

    const { dialog, loading, page, lastPage, search, items, clear } = useFetchList<
      SystemLocaleReferences['data'][number]
    >('admin/references/locales');

    return { dialog, loading, items, page, lastPage, search, selected, clear };
  },

  computed: {
    selectedItems() {
      const { selected } = this;
      if (!selected.length) return [];

      return this.items.filter((item) => selected.includes(item.id));
    },
    isAlreadyIncluded() {
      if (!this.currentItems.length || !this.selectedItems.length) return false;
      const codes = this.currentItems.map(({ id }) => id);

      return this.selectedItems.some((item) => codes.includes(item.code));
    },
  },

  methods: {
    close() {
      this.selected = [];
      this.dialog = false;
    },

    confirm() {
      if (!this.selectedItems.length) return;

      this.$emit(
        'add',
        this.selectedItems.map(({ id, code, ...rest }) => ({ id: code, ...rest }))
      );
      this.close();
    },
  },
});
</script>
