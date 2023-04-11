<template>
  <div>
    <v-menu :close-delay="250" close-on-click close-on-content-click offset-y open-on-hover>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click.stop>
          <v-icon small>{{ icon }}</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <template v-for="(item, idx) in menu">
          <v-list-item
            :key="item.name"
            @click="item.dialog ? openDialog(item.action) : action(item.action)"
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="idx + 1 < menu.length" :key="`div-${item.name}`"></v-divider>
        </template>
      </v-list>
    </v-menu>
    <confirm-dialog
      external
      :label="$t('prompts.editMeal.delete._', { item: entityName }).toString()"
      :value="dialogs.deleteMeal"
      @confirm="action('deleteMeal')"
    >
      {{ $t('prompts.editMeal.delete.confirm', { item: entityName }) }}
    </confirm-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealActionType } from '@intake24/common/prompts';
import { ConfirmDialog } from '@intake24/ui';

export type MenuItem = {
  name: string;
  action: MealActionType;
  dialog?: boolean;
  icon?: string;
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

  emits: ['action'],

  data() {
    return {
      dialogs: {
        deleteMeal: false,
      },
    };
  },

  methods: {
    action(type: MealActionType) {
      this.$emit('action', type);
    },

    openDialog(type: MealActionType) {
      if (type !== 'deleteMeal') return;

      this.dialogs[type] = true;
    },
  },
});
</script>
