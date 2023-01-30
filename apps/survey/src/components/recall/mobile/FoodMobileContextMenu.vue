<template>
  <v-bottom-sheet v-model="showMenu" persistent>
    <v-sheet class="text-center pa-3" height="20rem">
      <v-btn class="mt-6 mb-3" color="red" text @click="onClose"
        >{{ $t('recall.contextMenu.close') }}
      </v-btn>
      <v-btn block class="mb-3" large @click="onSelect">
        {{ $t('recall.contextMenu.select', { name: safeName() }) }}
      </v-btn>
      <confirm-dialog
        :label="$t('recall.contextMenu.delete', { name: safeName() }).toString()"
        @confirm="onDelete"
      >
        <template #activator="{ on, attrs }">
          <v-btn block class="px-5" color="secondary" large text v-bind="attrs" v-on="on">
            {{ $t('recall.contextMenu.delete', { name: safeName() }) }}
          </v-btn>
        </template>
        {{ $t('recall.contextMenu.confirmDeletion', { name: safeName() }) }}
      </confirm-dialog>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndex } from '@intake24/survey/stores/meal-food-utils';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'FoodMobileContextMenu',

  components: { ConfirmDialog },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    foodId: {
      type: Number,
      required: true,
    },
  },

  emits: ['close', 'continue'],

  data() {
    return {
      cachedName: '',
    };
  },

  computed: {
    ...mapState(useSurvey, ['meals']),

    showMenu(): boolean {
      return this.show;
    },

    name(): string | undefined {
      const foodIndex = getFoodIndex(this.meals, this.foodId);

      if (foodIndex !== undefined) {
        let food = this.meals[foodIndex.mealIndex].foods[foodIndex.foodIndex];

        if (foodIndex.linkedFoodIndex) food = food.linkedFoods[foodIndex.linkedFoodIndex];

        switch (food.type) {
          case 'free-text':
            return food.description;

          case 'encoded-food':
            return food.data.localName;
        }
      }

      return undefined;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['deleteFood', 'setSelection']),

    safeName(): string {
      const unsafeName = this.name;

      if (unsafeName) {
        this.cachedName = unsafeName;
      }

      return this.cachedName;
    },

    onSelect() {
      this.setSelection({
        element: {
          type: 'food',
          foodId: this.foodId,
        },
        mode: 'manual',
      });
      this.$emit('continue');
    },

    onDelete() {
      this.deleteFood(this.foodId);
      this.$emit('close');
    },

    onClose() {
      this.$emit('close');
    },
  },
});
</script>
<style lang="scss" scoped></style>
