<template>
  <div>
    <v-toolbar color="grey lighten-5" flat tile>
      <v-icon color="primary" left>fas fa-table-list</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.meals.table') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        fab
        small
        :title="$t('feedback-schemes.meals.fields.create')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('feedback-schemes.meals.fields.reset._').toString()"
        @confirm="resetList"
      >
        <template #activator="{ attrs, on }">
          <v-btn
            class="ml-3"
            color="error"
            fab
            small
            :title="$t('feedback-schemes.meals.fields.reset._')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>fa-sync</v-icon>
          </v-btn>
        </template>
        {{ $t('feedback-schemes.meals.fields.reset.text') }}
      </confirm-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(item, index) in items"
            :key="item.fieldId"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ item.header.en }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.meals.fields.edit')"
                @click.stop="edit(index, item)"
              >
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('feedback-schemes.meals.fields.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: item.header.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar color="primary" dark>
          <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            <v-icon dark left>fas fa-table-list</v-icon>
            {{ $t(`feedback-schemes.meals.fields.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="dialog.item.type"
                    hide-details="auto"
                    :items="tableFieldTypes"
                    :label="$t('feedback-schemes.meals.fields.types._')"
                    name="type"
                    outlined
                    @change="updateProps"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <template v-if="dialog.item.type === 'nutrient'">
                    <v-autocomplete
                      v-model="dialog.item.types"
                      hide-details="auto"
                      item-text="description"
                      item-value="id"
                      :items="nutrientTypes"
                      :label="$t('nutrient-types.title')"
                      multiple
                      name="nutrientTypeId"
                      outlined
                      prepend-inner-icon="$nutrient-types"
                      :rules="nutrientRules"
                      @change="updateNutrientFields"
                    >
                    </v-autocomplete>
                  </template>
                  <v-select
                    v-if="dialog.item.type === 'standard'"
                    v-model="dialog.item.fieldId"
                    hide-details="auto"
                    :items="tableFieldStandardIds"
                    :label="$t('feedback-schemes.meals.fields.id')"
                    name="fieldId"
                    outlined
                    :rules="fieldIdRules"
                  >
                  </v-select>
                  <v-text-field
                    v-else
                    v-model="dialog.item.fieldId"
                    :disabled="dialog.item.type === 'nutrient'"
                    hide-details="auto"
                    :label="$t('feedback-schemes.meals.fields.id')"
                    outlined
                    :rules="fieldIdRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card outlined>
                    <language-selector
                      v-model="dialog.item.header"
                      flat
                      :label="$t('feedback-schemes.meals.fields.header').toString()"
                      :outlined="false"
                      required
                    >
                      <template v-for="lang in Object.keys(dialog.item.header)" #[`lang.${lang}`]>
                        <v-text-field
                          :key="lang"
                          v-model="dialog.item.header[lang]"
                          hide-details="auto"
                          :label="$t('feedback-schemes.meals.fields.header')"
                          outlined
                        ></v-text-field>
                      </template>
                    </language-selector>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card outlined>
                    <language-selector
                      v-model="dialog.item.value"
                      flat
                      :label="$t('feedback-schemes.meals.fields.value').toString()"
                      :outlined="false"
                      required
                    >
                      <template v-for="lang in Object.keys(dialog.item.value)" #[`lang.${lang}`]>
                        <v-text-field
                          :key="lang"
                          v-model="dialog.item.value[lang]"
                          hide-details="auto"
                          :label="$t('feedback-schemes.meals.fields.value')"
                          outlined
                        ></v-text-field>
                      </template>
                    </language-selector>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="font-weight-bold" color="info" text type="submit">
                <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { MealTableField } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { mealTableFieldStandardIds, mealTableFieldTypes } from '@intake24/common/feedback';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

import { getTableFieldDefaults } from './table-field';

export default defineComponent({
  name: 'TableFieldList',

  components: { ConfirmDialog, draggable, LanguageSelector },

  props: {
    nutrientTypes: {
      type: Array as PropType<NutrientTypeEntry[]>,
      default: () => [],
    },
    defaults: {
      type: Array as PropType<MealTableField[]>,
      default: () => [],
    },
    value: {
      type: Array as PropType<MealTableField[]>,
      required: true,
    },
  },

  setup(props, context) {
    const i18n = useI18n();

    const {
      dialog,
      form,
      items,
      newDialog,
      add,
      edit,
      load,
      remove,
      reset,
      resetList,
      save,
      update,
    } = useListWithDialog(props, context, () => getTableFieldDefaults('standard'));

    const tab = ref(0);

    const tableFieldTypes = mealTableFieldTypes.map((value) => ({
      text: i18n.t(`feedback-schemes.meals.fields.types.${value}`),
      value,
    }));

    const tableFieldStandardIds = mealTableFieldStandardIds.map((value) => ({
      text: i18n.t(`feedback-schemes.meals.fields.types.${value}`),
      value,
    }));

    const fieldIdRules = computed(() => [
      (value: string | null): boolean | string => {
        if (!value) return i18n.t('feedback-schemes.meals.fields.validation.required').toString();

        const {
          index,
          item: { type, fieldId },
        } = dialog.value;
        const match = items.value.find(
          (item, idx) => item.type === type && item.fieldId === fieldId && index !== idx
        );

        return match ? i18n.t('feedback-schemes.meals.fields.validation.unique').toString() : true;
      },
    ]);

    const nutrientRules = computed(() => [
      (value: string[]): boolean | string => {
        if (!value.length) return i18n.t('nutrient-types.validation.required').toString();

        const { index } = dialog.value;
        const match = items.value.find(
          (item, idx) =>
            item.type === 'nutrient' &&
            [...value].sort().join(':') === [...item.types].sort().join(':') &&
            index !== idx
        );

        return match ? i18n.t('nutrient-types.validation.unique').toString() : true;
      },
    ]);

    const updateNutrientFieldId = (nutrientTypeId: string[]) => {
      if (!nutrientTypeId.length || dialog.value.item.type !== 'nutrient') return;

      dialog.value.item.fieldId = `nutrient-${dialog.value.item.types.sort().join(':')}`;
    };

    const updateNutrientLabel = (nutrientTypeId: string[]) => {
      if (!nutrientTypeId.length || dialog.value.item.type !== 'nutrient') return;

      const match = props.nutrientTypes.find((nutrient) => nutrient.id === nutrientTypeId[0]);
      if (!match) return;

      dialog.value.item.header.en = match.description;
    };

    const updateNutrientFields = (nutrientTypeId: string[]) => {
      updateNutrientFieldId(nutrientTypeId);
      updateNutrientLabel(nutrientTypeId);
    };

    const updateProps = () => {
      const {
        show,
        index,
        item: { type },
      } = dialog.value;

      dialog.value = { show, index, item: getTableFieldDefaults(type) };
    };

    return {
      dialog,
      form,
      items,
      tab,
      add,
      newDialog,
      edit,
      load,
      remove,
      reset,
      resetList,
      save,
      update,
      tableFieldTypes,
      tableFieldStandardIds,
      fieldIdRules,
      nutrientRules,
      updateNutrientFields,
      updateProps,
    };
  },
});
</script>

<style lang="scss" scoped></style>
