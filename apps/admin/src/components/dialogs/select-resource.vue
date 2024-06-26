<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          :class="activatorClass"
          :clearable="clearable"
          :disabled="disabled"
          :error-messages="errorMessages"
          hide-details="auto"
          :label="label"
          :name="name"
          outlined
          :prepend-inner-icon="itemIcon"
          readonly
          :value="selectedItemName"
          v-on="on"
          @click:clear="clearInput"
        />
      </slot>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
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
          outlined
          prepend-inner-icon="$search"
          @click:clear="clear"
        />
        <template v-if="items.length">
          <v-list dense min-height="350px">
            <v-list-item-group v-model="selectedItemId">
              <template v-for="(item, idx) in items">
                <v-list-item :key="item[itemId]" :value="item[itemId]">
                  <template #default="{ active }">
                    <v-list-item-action class="mr-2">
                      <v-checkbox :input-value="active" />
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>{{ itemIcon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <slot name="item" v-bind="{ item }">
                        <v-list-item-title>{{ item[itemName] }}</v-list-item-title>
                      </slot>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider v-if="idx + 1 < items.length" :key="`div-${item[itemId]}`" />
              </template>
            </v-list-item-group>
          </v-list>
          <div class="text-center">
            <v-pagination v-model="page" circle :length="lastPage" />
          </div>
        </template>
        <v-alert v-else color="secondary" text type="info">
          {{ $t('common.search.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="close">
          <v-icon left>
            $cancel
          </v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selectedItemId"
          text
          @click.stop="confirm"
        >
          <v-icon left>
            $success
          </v-icon>{{ $t('common.action.ok') }}
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
    value: {
      type: [Object, String] as PropType<Dictionary | string | null>,
    },
  },

  emits: ['clear', 'input'],

  setup(props) {
    const { resource } = toRefs(props);
    const selectedItemId = ref<string | null>(
      props.initialItem ? props.initialItem[props.itemId] : null,
    );

    const { dialog, loading, page, lastPage, search, items, clear } = useFetchList<Dictionary>(
      `/admin/references/${resource.value}`,
    );

    if (props.initialItem)
      items.value.push(props.initialItem);

    watch(
      () => props.value,
      (val) => {
        if (val === selectedItemId.value)
          return;

        selectedItemId.value = null;
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
      if (!selectedItemId)
        return null;

      return this.items.find(item => item[this.itemId] === selectedItemId) ?? null;
    },
    selectedItemName() {
      if (this.selectedItem)
        return this.selectedItem[this.itemName];

      if (this.initialItem)
        return this.initialItem[this.itemName];

      return this.value;
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    input() {
      if (!this.selectedItem) {
        this.$emit('input', null);
        return;
      }

      let returnValue: Dictionary | string | null = this.selectedItemId;
      const { returnObject } = this;

      if (typeof returnObject === 'boolean')
        returnValue = returnObject ? copy(this.selectedItem) : this.selectedItemId;
      else returnValue = this.selectedItem[returnObject];

      this.$emit('input', returnValue);
    },

    clearInput() {
      this.selectedItemId = null;
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
