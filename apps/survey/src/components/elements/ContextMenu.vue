<template>
  <v-menu :close-on-click="true" :close-on-content-click="true" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon x-small>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group color="primary">
        <v-list-item v-for="item in menu" :key="item.name" @click="action(item.action)">
          <v-list-item-content v-if="!item.dialog">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title>
              <confirm-dialog
                color="warning"
                :label="$t('prompts.editMeal.delete._', { item: entityName }).toString()"
                @confirm="action(item.action)"
              >
                <template #activator="{ on, attrs }">
                  <v-btn color="red" v-bind="attrs" small text v-on="on">
                    {{ $t('prompts.editMeal.delete._', { item: entityName }) }}
                  </v-btn>
                </template>
                {{ $t('prompts.editMeal.delete.confirm', { item: entityName }) }}
              </confirm-dialog>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { ConfirmDialog } from '@intake24/ui';

export type MenuItem = {
  name: string;
  action: string;
  dialog?: boolean;
};

export default defineComponent({
  name: 'ContextMenu',

  components: { ConfirmDialog },

  props: {
    icon: {
      type: String,
      required: true,
    },
    menu: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    entityName: {
      type: String,
      default: '',
    },
  },

  methods: {
    action(type: string) {
      this.$emit('action', type);
    },
  },
});
</script>
