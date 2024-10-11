<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-btn color="primary" icon="$add" size="small" :title="$t('fdbs.nutrients.add')" v-bind="props" />
    </template>
    <v-card :loading="loading" :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
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
              item-title="description"
              item-value="id"
              :items="nutrientTables"
              :label="$t('nutrient-tables._')"
              name="selectedTableId"
              variant="outlined"
              @update:model-value="fetch"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              class="mb-4"
              clearable
              hide-details="auto"
              :label="$t('common.search._')"
              :loading="loading"
              prepend-inner-icon="$search"
              variant="outlined"
              @click:clear="clear"
            />
          </v-col>
        </v-row>
        <v-alert v-if="isAlreadyIncluded" type="error">
          {{ $t('fdbs.nutrients.alreadyIncluded', { id: selectedRecord?.id }) }}
        </v-alert>
        <template v-if="items.length">
          <v-list v-model:selected="selectedRecordId" density="compact" min-height="350px">
            <template v-for="(item, idx) in items" :key="item.id">
              <v-list-item :value="item.id">
                <template #prepend="{ isActive }">
                  <v-list-item-action class="mr-2">
                    <v-checkbox-btn :model-value="isActive " />
                  </v-list-item-action>
                  <v-icon>fas fa-list</v-icon>
                </template>
                <v-list-item-title>
                  {{ item.nutrientTableRecordId }} | {{ item.name }}
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`" />
            </template>
          </v-list>
          <div class="text-center">
            <v-pagination v-model="page" :length="lastPage" rounded />
          </div>
        </template>
        <v-alert v-else color="secondary" type="info">
          {{ $t('fdbs.nutrients.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="close">
          <v-icon $cancel start />{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selectedRecordId || isAlreadyIncluded"
          variant="text"
          @click.stop="confirm"
        >
          <v-icon $success start />{{ $t('common.action.ok') }}
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
import { useFetchList } from '@intake24/admin/composables';
import { copy } from '@intake24/common/util';

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
      if (!selectedRecordId)
        return null;

      return this.items.find(item => item.id === selectedRecordId) ?? null;
    },
    isAlreadyIncluded(): boolean {
      if (!this.currentItems.length || !this.selectedRecordId)
        return false;

      return !!this.currentItems.find(item => item.id === this.selectedRecordId);
    },
  },

  methods: {
    close() {
      this.selectedRecordId = null;
      this.dialog = false;
    },

    confirm() {
      if (!this.selectedRecord)
        return;

      this.$emit('add', copy(this.selectedRecord));
      this.close();
    },
  },
});
</script>
