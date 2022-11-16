<template>
  <v-bottom-sheet v-model="showMenu" persistent>
    <v-sheet class="text-center pa-3" height="20rem">
      <v-btn class="mt-6 mb-3" color="red" text @click="onClose">{{
        $t('recall.contextMenu.close')
      }}</v-btn>
      <v-btn block class="mb-3" large @click="onSelect">
        {{
          confirmed
            ? $t('recall.contextMenu.select', { name: safeName() })
            : $t('recall.contextMenu.confirm', { name: safeName() })
        }}
      </v-btn>
      <v-btn v-if="confirmed" block class="mb-3" large @click="action('editFoods')">
        {{ $t('recall.contextMenu.editFoods', { name: safeName() }) }}
      </v-btn>
      <v-btn v-if="confirmed" block class="mb-8" large @click="action('mealTime')">
        {{ $t('recall.contextMenu.changeTime', { name: safeName() }) }}
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('recall.contextMenu.delete', { name: safeName() })"
        @confirm="onDelete"
      >
        <template #activator="{ on, attrs }">
          <v-btn block class="px-5" color="error" large v-bind="attrs" v-on="on">
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
import { getMealIndex } from '@intake24/survey/stores/meal-food-utils';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'MealMobileContextMenu',

  components: { ConfirmDialog },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
    mealId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      cachedName: '',
    };
  },

  computed: {
    ...mapState(useSurvey, ['meals', 'localeId']),

    showMenu(): boolean {
      return this.show;
    },

    name(): string | undefined {
      const mealIndex = getMealIndex(this.meals, this.mealId);

      if (mealIndex !== undefined) {
        const localName = this.meals[mealIndex].name;
        return localName[this.localeId] ?? localName['en'];
      }

      return undefined;
    },

    confirmed(): boolean {
      const mealIndex = getMealIndex(this.meals, this.mealId);

      if (mealIndex !== undefined) {
        return this.meals[mealIndex].time !== undefined;
      }

      return false;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['deleteMeal', 'setSelection']),

    safeName(): string {
      const unsafeName = this.name;

      if (unsafeName) {
        this.cachedName = unsafeName;
      }

      return this.cachedName;
    },

    onClose() {
      this.$emit('close');
    },

    action(type: string) {
      this.$emit('meal-action', { mealId: this.mealId, type });
      this.$emit('close');
    },

    onDelete() {
      this.deleteMeal(this.mealId);
      this.$emit('close');
    },

    onSelect() {
      this.setSelection({ element: { type: 'meal', mealId: this.mealId }, mode: 'manual' });
      this.$emit('continue');
    },
  },
});
</script>
<style lang="scss" scoped></style>
