<template>
  <v-card border class="w-100" flat>
    <v-toolbar color="grey-lighten-4">
      <v-icon color="secondary" end icon="fas fa-list" />
      <div class="d-flex flex-column">
        <v-toolbar-title class="font-weight-medium">
          {{ $t(`${i18nPrefix}.title`) }}
        </v-toolbar-title>
      </div>
    </v-toolbar>
    <v-card-text class="d-flex flex-column gr-4">
      <v-select
        v-model="items"
        hide-details="auto"
        :items="standardItems"
        :label="$t(`${i18nPrefix}.standard`)"
        multiple
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="item.raw">
            <template #prepend="{ isActive }">
              <v-list-item-action class="mr-2">
                <v-checkbox-btn :model-value="isActive " />
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
        <template #selection="{ item, index }">
          <template v-if="index === 0">
            <span v-if="selectedStandardItems.length === 1">
              {{ item.raw }}
            </span>
            <span v-if="selectedStandardItems.length > 1">
              {{ $t('common.selected', { count: selectedStandardItems.length }) }}
            </span>
          </template>
        </template>
      </v-select>
      <v-form ref="form" validate-on="submit" @submit.prevent="add">
        <v-text-field
          v-model="custom"
          hide-details="auto"
          :label="$t(`${i18nPrefix}.custom`)"
          outlined
          :rules="rules"
        />
      </v-form>
    </v-card-text>
    <v-list class="list-border">
      <vue-draggable
        v-model="items"
        :animation="300"
        handle=".drag-and-drop__handle"
      >
        <v-list-item v-for="(item, index) in items" :key="item">
          <template #prepend>
            <v-avatar class="drag-and-drop__handle" icon="$handle" />
          </template>
          <v-chip color="info">
            {{ item }}
          </v-chip>
          <template #append>
            <v-list-item-action v-if="!standardItems.includes(item)">
              <v-btn icon="$edit" :title="$t(`${i18nPrefix}.edit`)" @click.stop="edit(index)" />
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t(`${i18nPrefix}.remove`)"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: item }) }}
              </confirm-dialog>
            </v-list-item-action>
          </template>
        </v-list-item>
      </vue-draggable>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';

import { computed, ref, useTemplateRef } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

defineOptions({ name: 'CustomList' });

const props = defineProps({
  i18nPrefix: {
    type: String,
    required: true,
  },
  standardItems: {
    type: Array as PropType<readonly string[]>,
    default: () => [],
  },
  modelValue: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const { i18n: { t } } = useI18n();

const form = useTemplateRef('form');

const items = useVModel(props, 'modelValue', emit, { passive: true, deep: true });
const selectedStandardItems = computed(() => items.value.filter(item => props.standardItems.includes(item)));
const custom = ref('');

const rules = [
  (value: string | null): boolean | string => {
    if (!value)
      return t('survey-schemes.meals.validation.required');

    const match = items.value.includes(value) || props.standardItems.includes(value);

    return match ? t('survey-schemes.meals.validation.unique') : true;
  },
];

async function add() {
  const { valid } = await form.value?.validate() ?? {};
  if (!valid)
    return;

  items.value.push(custom.value);
  custom.value = '';
  form.value?.reset();
};

function remove(index: number) {
  return items.value.splice(index, 1).at(0);
};

function edit(index: number) {
  custom.value = remove(index) ?? '';
};
</script>

<style lang="scss" scoped>
</style>
