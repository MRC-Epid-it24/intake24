<template>
  <div>
    <v-menu :close-delay="250" close-on-click close-on-content-click offset-x open-on-hover>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click.stop>
          <v-icon small>$edit</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <template v-for="(item, idx) in menu">
          <v-list-item
            :key="item.name"
            :disabled="item.action === 'editFood' && isFood && food?.type === 'free-text'"
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
      v-model="dialog"
      external
      :label="$t(`recall.menu.${isMeal ? 'meal' : 'food'}.delete`).toString()"
      @confirm="action(isMeal ? 'deleteMeal' : 'deleteFood')"
    >
      {{ $t('recall.menu.confirmDelete', { item: entityName }) }}
    </confirm-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState, MealState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';

import type { MenuItem } from '../use-food-item';
import { useContextMenu } from '../use-context-menu';

export default defineComponent({
  name: 'ContextMenu',

  components: { ConfirmDialog },

  props: {
    food: {
      type: Object as PropType<FoodState>,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    menu: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { action, dialog, entity, entityName, isFood, isMeal, openDialog } = useContextMenu(
      props,
      ctx
    );

    return {
      action,
      dialog,
      entity,
      entityName,
      isFood,
      isMeal,
      openDialog,
    };
  },
});
</script>
