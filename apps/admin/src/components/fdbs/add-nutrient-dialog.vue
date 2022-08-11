<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="secondary" fab small :title="$t('fdbs.nutrients.add')">
        <v-icon>$add</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
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
              :items="nutrientTables"
              :label="$t('feedback-schemes.characterTypes._')"
              hide-details="auto"
              item-value="id"
              item-text="description"
              name="selectedTableId"
              outlined
              @change="fetch"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              :label="$t('common.search._')"
              :loading="loading"
              append-icon="fas fa-search"
              class="mb-4"
              clearable
              hide-details="auto"
              outlined
              @click:clear="clear"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-alert v-if="isAlreadyIncluded" text type="error">
          {{ $t('fdbs.nutrients.alreadyIncluded', { id: selectedRecord?.id }) }}
        </v-alert>
        <template v-if="items.length">
          <v-list min-height="350px" dense>
            <v-list-item-group v-model="selectedRecordId">
              <template v-for="(item, idx) in items">
                <v-list-item :key="item.id" :value="item.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>fa-list</v-icon>
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
            <v-pagination v-model="page" :length="lastPage" circle></v-pagination>
          </div>
        </template>
        <v-alert v-else color="primary" text type="info">
          {{ $t('fdbs.nutrients.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="blue darken-3"
          :disabled="!selectedRecordId || isAlreadyIncluded"
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
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type {
  FoodDatabaseRefs,
  NutrientTableRecordsResponse,
} from '@intake24/common/types/http/admin';
import type { NutrientTableRecordAttributes } from '@intake24/common/types/models';
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

  setup(props) {
    const selectedTableId = ref<string>(
      props.nutrientTables.length ? props.nutrientTables[0].id : ':id'
    );
    const selectedRecordId = ref<string | null>(null);

    const { dialog, loading, page, lastPage, search, items, fetch, clear } = useFetchList<
      NutrientTableRecordsResponse['data'][number]
    >('admin/nutrient-tables/:id/records', selectedTableId);

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

    cancel() {
      this.close();
    },

    confirm() {
      if (!this.selectedRecord) return;

      this.$emit('add', copy(this.selectedRecord));
      this.close();
    },
  },
});
</script>
