<template>
  <div>
    <v-menu :close-delay="250" close-on-click close-on-content-click offset-x open-on-hover>
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
import { computed, defineComponent, ref } from 'vue';

import type { FoodActionType, MealActionType } from '@intake24/common/prompts';
import type { FoodState, MealState } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';

import type { MenuItem } from '../use-food-item';

export default defineComponent({
  name: 'ContextMenu',

  components: { ConfirmDialog },

  props: {
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
