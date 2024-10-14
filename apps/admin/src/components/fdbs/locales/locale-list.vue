<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
      <v-toolbar-title class="font-weight-medium">
        <slot name="title">
          {{ $t('fdbs.locales.title') }}
        </slot>
      </v-toolbar-title>
      <v-spacer />
      <add-locale-dialog v-if="!disabled" :current-items="items" @add="add" />
    </v-toolbar>
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-title>
          {{ $t('fdbs.locales.description', { count: items.length }) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list class="list-border py-0" density="compact">
            <v-list-item v-for="item in items" :key="item.id" link>
              <template #prepend>
                <v-icon>$locales</v-icon>
              </template>
              <v-list-item-title>{{ item.englishName }}</v-list-item-title>
              <template #append>
                <v-list-item-action v-if="!disabled" class="my-0">
                  <confirm-dialog
                    color="error"
                    icon
                    icon-left="$delete"
                    :label="$t('fdbs.locales.remove')"
                    small
                    @confirm="remove(item.id)"
                  >
                    {{ $t('common.action.confirm.remove', { name: item.englishName }) }}
                  </confirm-dialog>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-messages
      v-if="errors?.has('main.locales')"
      class="px-4 pb-2"
      color="error"
      :value="errors.get('main.locales')"
    />
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { ReturnUseErrors } from '@intake24/admin/composables/use-errors';
import type { FoodsLocaleAttributes } from '@intake24/db';
import { ConfirmDialog } from '@intake24/ui';

import AddLocaleDialog from './add-locale-dialog.vue';

export default defineComponent({
  name: 'LocaleList',

  components: { AddLocaleDialog, ConfirmDialog },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<ReturnUseErrors>,
    },
    modelValue: {
      type: Array as PropType<FoodsLocaleAttributes[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const items = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit('update:modelValue', val);
      },
    });

    const add = (locales: FoodsLocaleAttributes[]) => {
      items.value.push(...locales);
    };

    const remove = (id: string) => {
      items.value = items.value.filter(item => item.id !== id);
    };

    return { add, items, remove };
  },
});
</script>
