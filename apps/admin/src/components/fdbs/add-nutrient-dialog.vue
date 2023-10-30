<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" color="primary" fab small :title="$t('fdbs.nutrients.add')" v-on="on">
        <v-icon>$add</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('fdbs.nutrients.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedTableId"
              hide-details="auto"
              item-text="description"
              item-value="id"
              :items="nutrientTables"
              :label="$t('nutrient-tables._')"
              name="selectedTableId"
              outlined
              @change="fetch"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
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
          </v-col>
        </v-row>
        <v-alert v-if="isAlreadyIncluded" text type="error">
          {{ $t('fdbs.nutrients.alreadyIncluded', { id: selectedRecord?.id }) }}
        </v-alert>
        <template v-if="items.length">
          <v-list dense min-height="350px">
            <v-list-item-group v-model="selectedRecordId">
              <template v-for="(item, idx) in items">
                <v-list-item :key="item.id" :value="item.id">
                  <template #default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>fas fa-list</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.nutrientTableRecordId }} | {{ item.name }}
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
        <v-alert v-else color="secondary" text type="info">
          {{ $t('fdbs.nutrients.none') }}
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
          :disabled="!selectedRecordId || isAlreadyIncluded"
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

import type {
  FoodDatabaseRefs,
  NutrientTableRecordsResponse,
} from '@intake24/common/types/http/admin';
import type { NutrientTableRecordAttributes } from '@intake24/db';
import { copy } from '@intake24/common/util';

import { useFetchList } from '../lists';

export default defineComponent({
  name: 'AddNutrientDialog',

  props: {
    currentItems: {
      type: Array as PropType<NutrientTableRecordAttributes[]>,
      required: true,
    },
    nutrientTables: {
      type: Array as PropType<FoodDatabaseRefs['nutrientTables']>,
      required: true,
    },
  },

  emits: ['add'],

  setup(props) {
    const selectedRecordId = ref<string | null>(null);
    const selectedTableId = ref(props.nutrientTables.length ? props.nutrientTables[0].id : ':id');

    const { dialog, loading, page, lastPage, search, items, fetch, clear } = useFetchList<
      NutrientTableRecordsResponse['data'][number]
    >('admin/references/nutrient-tables/:id/records', selectedTableId);

    return {
      dialog,
      loading,
      items,
      page,
      lastPage,
      search,
      selectedRecordId,
      selectedTableId,
      fetch,
      clear,
    };
  },

  computed: {
    selectedRecord(): NutrientTableRecordAttributes | null {
      const { selectedRecordId } = this;
      if (!selectedRecordId) return null;

      return this.items.find((item) => item.id === selectedRecordId) ?? null;
    },
    isAlreadyIncluded(): boolean {
      if (!this.currentItems.length || !this.selectedRecordId) return false;

      return !!this.currentItems.find((item) => item.id === this.selectedRecordId);
    },
  },

  methods: {
    close() {
      this.selectedRecordId = null;
      this.dialog = false;
    },

    confirm() {
      if (!this.selectedRecord) return;

      this.$emit('add', copy(this.selectedRecord));
      this.close();
    },
  },
});
</script>
