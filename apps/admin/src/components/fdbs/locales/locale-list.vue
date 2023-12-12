<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        <slot name="title">
          {{ $t('fdbs.locales.title') }}
        </slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-locale-dialog v-if="!disabled" :current-items="items" @add="add"></add-locale-dialog>
    </v-toolbar>
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('fdbs.locales.description', { count: items.length }) }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list class="py-0" dense>
            <template v-for="(item, idx) in items">
              <v-list-item :key="item.id" link>
                <v-list-item-icon>
                  <v-icon>$locales</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.englishName }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="!disabled" class="my-0">
                  <confirm-dialog
                    color="error"
                    icon
                    icon-left="$delete"
                    :label="$t('fdbs.locales.remove').toString()"
                    small
                    @confirm="remove(item.id)"
                  >
                    {{ $t('common.action.confirm.remove', { name: item.englishName }) }}
                  </confirm-dialog>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`"></v-divider>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-messages
      v-if="errors.has('main.locales')"
      class="px-4 pb-2"
      color="error"
      :value="errors.get('main.locales')"
    ></v-messages>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { FoodsLocaleAttributes } from '@intake24/db';
import { Errors } from '@intake24/common/util';
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
      type: Object as PropType<Errors>,
      default: () => new Errors(),
    },
    value: {
      type: Array as PropType<FoodsLocaleAttributes[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const items = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit('input', val);
      },
    });

    const add = (locales: FoodsLocaleAttributes[]) => {
      items.value.push(...locales);
    };

    const remove = (id: string) => {
      items.value = items.value.filter((item) => item.id !== id);
    };

    return { add, items, remove };
  },
});
</script>
