<template>
  <v-card flat tile>
    <v-toolbar color="grey lighten-2" flat tile>
      <v-icon color="primary" left>fa-seedling</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('nutrient-types.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="secondary" fab small :title="$t('nutrient-types.create')" @click.stop="add">
        <v-icon small>$add</v-icon>
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('feedback-schemes.top-foods.nutrientTypes.reset._').toString()"
        @confirm="resetList"
      >
        <template #activator="{ attrs, on }">
          <v-btn
            class="ml-3"
            color="error"
            fab
            small
            :title="$t('feedback-schemes.top-foods.nutrientTypes.reset._')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>fa-sync</v-icon>
          </v-btn>
        </template>
        {{ $t('feedback-schemes.top-foods.nutrientTypes.reset.text') }}
      </confirm-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(nutrientType, idx) in items"
            :key="nutrientType.id.join(':')"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ nutrientType.name.en }} </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('nutrient-types.edit')" @click.stop="edit(idx, nutrientType)">
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('nutrient-types.remove').toString()"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.delete', { name: nutrientType.name.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px"
      persistent
    >
      <v-card :tile="$vuetify.breakpoint.smAndDown">
        <v-toolbar color="primary" dark flat>
          <v-icon dark left>fa-seedling</v-icon>
          <v-toolbar-title>
            {{ $t(`nutrient-types.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-autocomplete
              v-model="dialog.item.id"
              hide-details="auto"
              item-text="description"
              item-value="id"
              :items="availableNutrientTypes"
              :label="$t('nutrient-types._')"
              multiple
              name="nutrientTypeId"
              outlined
              prepend-inner-icon="fas fa-seedling"
              :rules="rules"
              @change="updateNutrientLabel"
            >
            </v-autocomplete>
          </v-card-text>
          <language-selector
            v-model="dialog.item.name"
            flat
            :label="$t('nutrient-types.label').toString()"
            :outlined="false"
            required
          >
            <template v-for="lang in Object.keys(dialog.item.name)" #[`lang.${lang}`]>
              <v-text-field
                :key="lang"
                v-model="dialog.item.name[lang]"
                hide-details="auto"
                :label="$t('nutrient-types._')"
                outlined
              ></v-text-field>
            </template>
          </language-selector>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="info" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { TopFoodNutrientType } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { defaultTopFoods } from '@intake24/common/feedback';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'TopFoodsNutrientTypeList',

  components: { ConfirmDialog, draggable, LanguageSelector },

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    availableNutrientTypes: {
      type: Array as PropType<NutrientTypeEntry[]>,
      required: true,
    },
    value: {
      type: Array as PropType<TopFoodNutrientType[]>,
      required: true,
    },
  },

  setup(props, context) {
    const defaultItem = () => ({
      id: [props.availableNutrientTypes[0].id],
      name: { en: props.availableNutrientTypes[0].description },
    });

    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save, update } =
      useListWithDialog(props, context, defaultItem);

    return {
      defaultNutrientTypes: defaultTopFoods.nutrientTypes,
      dialog,
      form,
      items,
      newDialog,
      add,
      edit,
      load,
      remove,
      reset,
      save,
      update,
    };
  },

  computed: {
    rules() {
      return [
        (value: string[]): boolean | string => {
          if (!value.length)
            return this.$t(
              'feedback-schemes.top-foods.nutrientTypes.validation.required'
            ).toString();

          const { index } = this.dialog;
          const match = this.items.find(
            (nutrientType, idx) =>
              [...value].sort().join(':') === [...nutrientType.id].sort().join(':') && index !== idx
          );

          return match
            ? this.$t('feedback-schemes.top-foods.nutrientTypes.validation.unique').toString()
            : true;
        },
      ];
    },
  },

  methods: {
    resetList() {
      this.items = [...this.defaultNutrientTypes];
      this.update();
    },

    updateNutrientLabel(nutrientTypeId: string) {
      const match = this.availableNutrientTypes.find((nutrient) => nutrient.id === nutrientTypeId);
      if (!match) return;

      this.dialog.item.name.en = match.description;
    },
  },
});
</script>

<style lang="scss" scoped></style>
