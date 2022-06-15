<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon left color="primary">fa-seedling</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('nutrient-types.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn fab small color="secondary" :title="$t('nutrient-types.create')" @click.stop="add">
        <v-icon small>$add</v-icon>
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('feedback-schemes.top-foods.nutrientTypes.reset._')"
        @confirm="resetList"
      >
        <template v-slot:activator="{ attrs, on }">
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
      <draggable v-model="items">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(nutrientType, idx) in items"
            :key="nutrientType.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar>
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
                :label="$t('nutrient-types.remove')"
                color="error"
                icon
                icon-left="$delete"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.delete', { name: nutrientType.name.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon left dark>fa-seedling</v-icon>
          <v-toolbar-title>
            {{ $t(`nutrient-types.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-autocomplete
              v-model="dialog.item.id"
              :items="availableNutrientTypes"
              :label="$t('nutrient-types._')"
              :rules="rules"
              hide-details="auto"
              item-text="description"
              item-value="id"
              name="nutrientTypeId"
              outlined
              prepend-icon="fas fa-seedling"
              @change="updateNutrientLabel"
            >
            </v-autocomplete>
          </v-card-text>
          <language-selector
            :label="$t('nutrient-types.label')"
            v-model="dialog.item.name"
            flat
            :outlined="false"
          >
            <template v-for="lang in Object.keys(dialog.item.name)" v-slot:[`lang.${lang}`]>
              <v-text-field
                v-model="dialog.item.name[lang]"
                :key="lang"
                :label="$t('nutrient-types._')"
                hide-details="auto"
                outlined
              ></v-text-field>
            </template>
          </language-selector>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { ConfirmDialog } from '@intake24/ui';
import { LanguageSelector } from '@intake24/admin/components/forms';
import type { TopFoodNutrientType } from '@intake24/common/feedback';
import { defaultTopFoods } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import type { PropType } from '@vue/composition-api';
import { defineComponent } from '@vue/composition-api';
import type { RuleCallback } from '@intake24/admin/types';
import { useList } from '..';

export default defineComponent({
  name: 'TopFoodsNutrientTypeList',

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

  components: { ConfirmDialog, draggable, LanguageSelector },

  setup(props, context) {
    const defaultItem = () => ({
      id: props.availableNutrientTypes[0].id,
      name: { en: props.availableNutrientTypes[0].description },
    });

    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save } = useList(
      props,
      context,
      defaultItem
    );

    return { dialog, form, items, newDialog, add, edit, load, remove, reset, save };
  },

  data() {
    return {
      defaultNutrientTypes: defaultTopFoods.nutrientTypes,
    };
  },

  computed: {
    rules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string => {
          if (!value)
            return this.$t(
              'feedback-schemes.top-foods.nutrientTypes.validation.required'
            ).toString();

          const { index } = this.dialog;
          const match = this.items.find(
            (nutrientType, idx) => value === nutrientType.id && index !== idx
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
