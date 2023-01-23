<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }"></slot>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`${resource}.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-text-field
          v-model="search"
          append-icon="$search"
          class="mb-4"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          :loading="loading"
          outlined
          @click:clear="clear"
        >
        </v-text-field>
        <template v-if="items.length">
          <v-list dense min-height="350px">
            <v-list-item-group v-model="selectedItemId">
              <template v-for="(item, idx) in items">
                <v-list-item :key="item[itemId]" :value="item[itemId]">
                  <template #default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>{{ itemIcon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        <slot name="item" v-bind="{ item }">{{ item[itemName] }}</slot>
                      </v-list-item-title>
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
        <v-alert v-else color="primary" text type="info">
          {{ $t('common.search.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="close">
          <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selectedItemId"
          text
          @click.stop="confirm"
        >
          <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import { getResource } from '@intake24/admin/router/resources';
import { copy } from '@intake24/common/util';

import { useFetchList } from '../lists';

export default defineComponent({
  name: 'SelectResourceDialog',

  props: {
    itemId: {
      type: String,
      default: 'id',
    },
    itemName: {
      type: String,
      default: 'name',
    },
    resource: {
      type: String,
      required: true,
    },
    returnObject: {
      type: [Boolean, String],
      default: false,
    },
    value: {
      type: String,
    },
  },

  emits: ['input'],

  setup(props) {
    const selectedItemId = ref<string | null>(null);

    const { dialog, loading, page, lastPage, search, items, clear } = useFetchList<Dictionary>(
      `/admin/references/${props.resource}`
    );

    return {
      dialog,
      loading,
      items,
      page,
      lastPage,
      search,
      selectedItemId,
      clear,
    };
  },

  computed: {
    itemIcon() {
      return getResource(this.resource)?.icon ?? 'fa-list';
    },
    selectedItem(): Dictionary | null {
      const { selectedItemId } = this;
      if (!selectedItemId) return null;

      return this.items.find((item) => item.id === selectedItemId) ?? null;
    },
  },

  methods: {
    close() {
      this.selectedItemId = null;
      this.dialog = false;
    },

    confirm() {
      if (!this.selectedItem) return;

      const { returnObject } = this;

      let returnValue: Dictionary | string | null = this.selectedItemId;

      if (typeof returnObject === 'boolean')
        returnValue = returnObject ? copy(this.selectedItem) : this.selectedItemId;
      else returnValue = this.selectedItem[returnObject];

      this.$emit('input', returnValue);
      this.close();
    },
  },
});
</script>
