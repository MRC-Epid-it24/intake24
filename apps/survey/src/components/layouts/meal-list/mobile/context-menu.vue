<template>
  <v-expand-transition>
    <v-sheet v-show="contextId === entity?.id" class="meal-list-mobile__context" color="ternary">
      <div class="d-flex flex-row justify-center pa-4 gap-4">
        <v-card
          v-for="(item, idx) in menu"
          :key="idx"
          class="rounded-xl"
          link
          tile
          @click="item.dialog ? openDialog(item.action) : action(item.action)"
        >
          <v-card-text class="d-flex flex-column justify-center align-center gap-2">
            <v-icon large>{{ item.icon }}</v-icon>
            <span class="text-center font-weight-medium">{{ item.name }}</span>
          </v-card-text>
        </v-card>
      </div>
      <confirm-dialog
        v-model="dialog"
        external
        :label="$t(`recall.menu.${isMeal ? 'meal' : 'food'}.delete`).toString()"
        @confirm="action(isMeal ? 'deleteMeal' : 'deleteFood')"
      >
        {{ $t('recall.menu.confirmDelete', { item: entityName }) }}
      </confirm-dialog>
    </v-sheet>
  </v-expand-transition>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';

import type { MenuItem } from '../use-food-item';

export default defineComponent({
  name: 'ContextMenu',

  components: { ConfirmDialog },

  props: {
    contextId: {
      type: String,
    },
    entity: {
      type: Object as PropType<FoodState | MealState>,
    },
    entityName: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '$edit',
    },
    menu: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const dialog = ref(false);

    const isMeal = computed(() => props.entity && 'foods' in props.entity);

    const action = (type: FoodActionType | MealActionType) => {
      emit('action', type, props.entity?.id);
    };

    const openDialog = (type: FoodActionType | MealActionType) => {
      if (!['deleteFood', 'deleteMeal'].includes(type)) return;

      dialog.value = true;
    };

    return {
      action,
      dialog,
      isMeal,
      openDialog,
    };
  },
});
</script>
