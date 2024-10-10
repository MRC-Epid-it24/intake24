<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-text-field
          :class="activatorClass"
          :clearable="clearable"
          :disabled="disabled"
          :error-messages="errorMessages"
          hide-details="auto"
          :label="label"
          :model-value="selectedItemName"
          :name="name"
          :prepend-inner-icon="itemIcon"
          readonly
          variant="outlined"
          v-bind="props"
          @click:clear="clearInput"
        />
      </slot>
    </template>
    <v-card :loading="loading" :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>
          <slot name="title">
            {{ $t(`${resource}.title`) }}
          </slot>
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
          prepend-inner-icon="$search"
          variant="outlined"
          @click:clear="clear"
        />
        <template v-if="items.length">
          <v-list v-model:selected="selectedItemId" class="list-border" density="compact" min-height="350px">
            <v-list-item v-for="item in items" :key="item[itemId]" :value="item[itemId]">
              <template #prepend="{ isActive }">
                <v-list-item-action class="mr-2">
                  <v-checkbox-btn :model-value="isActive " />
                </v-list-item-action>
                <v-icon>{{ itemIcon }}</v-icon>
              </template>
              <slot name="item" v-bind="{ item }">
                <v-list-item-title>{{ item[itemName] }}</v-list-item-title>
              </slot>
            </v-list-item>
          </v-list>
          <div class="text-center">
            <v-pagination v-model="page" :length="lastPage" rounded />
          </div>
        </template>
        <v-alert v-else color="secondary" type="info">
          {{ $t('common.search.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="close">
          <v-icon icon="$cancel" start /> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selectedItemId"
          variant="text"
          @click.stop="confirm"
        >
          <v-icon icon="$success" start /> {{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { TranslateResult } from 'vue-i18n';
import { defineComponent, ref, toRefs, watch } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import { useFetchList } from '@intake24/admin/composables';
import { getResource } from '@intake24/admin/router/resources';
import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'SelectResourceDialog',

  props: {
    activatorClass: {
      type: String,
    },
    clearable: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    errorMessages: {
      type: Array as PropType<string[]>,
    },
    initialItem: {
      type: [Object] as PropType<Dictionary | null>,
    },
    itemId: {
      type: String,
      default: 'id',
    },
    itemName: {
      type: String,
      default: 'name',
    },
    label: {
      type: String as PropType<string | TranslateResult>,
    },
    name: {
      type: String,
    },
    resource: {
      type: String,
      required: true,
    },
    returnObject: {
      type: [Boolean, String],
      default: false,
    },
    modelValue: {
      type: [Object, String] as PropType<Dictionary | string | null>,
    },
  },

  emits: ['clear', 'update:modelValue'],

  setup(props) {
    const { resource } = toRefs(props);
    const selectedItemId = ref<string[]>(
      props.initialItem ? [props.initialItem[props.itemId]] : [],
    );

    const { dialog, loading, page, lastPage, search, items, clear } = useFetchList<Dictionary>(
      `/admin/references/${resource.value}`,
    );

    if (props.initialItem)
      items.value.push(props.initialItem);

    watch(
      () => props.modelValue,
      (val) => {
        if (val === selectedItemId.value)
          return;

        selectedItemId.value = [];
      },
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
      return getResource(this.resource)?.icon ?? 'fas fa-list';
    },
    selectedItem(): Dictionary | null {
      const { selectedItemId } = this;
      if (!selectedItemId.length)
        return null;

      return this.items.find(item => item[this.itemId] === selectedItemId[0]) ?? null;
    },
    selectedItemName() {
      if (this.selectedItem)
        return this.selectedItem[this.itemName];

      if (this.initialItem)
        return this.initialItem[this.itemName];

      return this.modelValue;
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    input() {
      if (!this.selectedItem) {
        this.$emit('update:modelValue', null);
        return;
      }

      let returnValue: Dictionary | string | null = this.selectedItemId[0];
      const { returnObject } = this;

      if (typeof returnObject === 'boolean')
        returnValue = returnObject ? copy(this.selectedItem) : this.selectedItemId[0];
      else returnValue = this.selectedItem[returnObject];

      this.$emit('update:modelValue', returnValue);
    },

    clearInput() {
      this.selectedItemId = [];
      this.input();
      this.$emit('clear');
    },

    confirm() {
      this.input();
      this.close();
    },
  },
});
</script>
