<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.associatedFoods.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!disabled"
        color="secondary"
        fab
        small
        :title="$t('fdbs.associatedFoods.add')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(item, index) in items"
            :key="item._id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ translate(item.genericName) }}</v-list-item-title>
              <v-list-item-subtitle>{{ translate(item.text.en) }} </v-list-item-subtitle>
              <v-messages
                v-if="errors.has('associatedFoods', index)"
                color="error"
                :value="errors.get('associatedFoods', index)"
              ></v-messages>
            </v-list-item-content>
            <v-list-item-action v-if="!disabled">
              <v-btn icon :title="$t('fdbs.associatedFoods.edit')" @click.stop="edit(index, item)">
                <v-icon color="primary lighten-1">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action v-if="!disabled">
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('fdbs.associatedFoods.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: item.genericName }) }}
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
            {{ $t(`fdbs.associatedFoods.${dialog.index === -1 ? 'add' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
              <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-card-title>{{ $t('common.options._') }}</v-card-title>
                <v-switch
                  v-model="dialog.item.linkAsMain"
                  hide-details="auto"
                  :label="$t('fdbs.associatedFoods.linkAsMain')"
                  name="linkAsMain"
                ></v-switch>
                <v-switch
                  v-model="dialog.item.multiple"
                  hide-details="auto"
                  :label="$t('fdbs.associatedFoods.multiple')"
                  name="multiple"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-title>{{ $t('fdbs.associatedFoods.association') }}</v-card-title>
                <select-resource
                  v-model="dialog.item.associatedCategoryCode"
                  item-id="code"
                  resource="categories"
                  @input="clearFood"
                >
                  <template #activator="{ attrs, on }">
                    <v-text-field
                      v-bind="attrs"
                      v-model="dialog.item.associatedCategoryCode"
                      class="mb-2"
                      clearable
                      hide-details="auto"
                      :label="$t('fdbs.categories._')"
                      name="associatedCategoryCode"
                      outlined
                      prepend-inner-icon="$categories"
                      readonly
                      v-on="on"
                      @input="clearFood"
                    ></v-text-field>
                  </template>
                  <template #title>{{ $t(`fdbs.categories.title`) }}</template>
                  <template #item="{ item }">
                    <v-list-item-title>{{ item.code }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
                  </template>
                </select-resource>
                <select-resource
                  v-model="dialog.item.associatedFoodCode"
                  item-id="code"
                  resource="foods"
                  @input="clearCategory"
                >
                  <template #activator="{ attrs, on }">
                    <v-text-field
                      v-bind="attrs"
                      v-model="dialog.item.associatedFoodCode"
                      clearable
                      hide-details="auto"
                      :label="$t('fdbs.foods._')"
                      name="associatedFoodCode"
                      outlined
                      prepend-inner-icon="$foods"
                      readonly
                      v-on="on"
                      @input="clearCategory"
                    ></v-text-field>
                  </template>
                  <template #title>{{ $t(`fdbs.foods.title`) }}</template>
                  <template #item="{ item }">
                    <v-list-item-title>{{ item.code }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
                  </template>
                </select-resource>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <language-selector
                  v-model="dialog.item.genericName"
                  :label="$t('fdbs.associatedFoods.genericName').toString()"
                  required
                >
                  <template v-for="lang in Object.keys(dialog.item.genericName)" #[`lang.${lang}`]>
                    <v-text-field
                      :key="lang"
                      v-model="dialog.item.genericName[lang]"
                      hide-details="auto"
                      :label="$t('fdbs.associatedFoods.genericName')"
                      :name="`genericName.${lang}`"
                      outlined
                    ></v-text-field>
                  </template>
                </language-selector>
              </v-col>
              <v-col cols="12">
                <language-selector
                  v-model="dialog.item.text"
                  :label="$t('fdbs.associatedFoods.text').toString()"
                  required
                >
                  <template v-for="lang in Object.keys(dialog.item.text)" #[`lang.${lang}`]>
                    <v-text-field
                      :key="lang"
                      v-model="dialog.item.text[lang]"
                      hide-details="auto"
                      :label="$t('fdbs.associatedFoods.text')"
                      :name="`text.${lang}`"
                      outlined
                    ></v-text-field>
                  </template>
                </language-selector>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="font-weight-bold" color="info" text type="submit">
                <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { Errors } from '@intake24/common/util';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { withIdAndOrder, withoutIdAndOrder } from '@intake24/admin/util';
import { randomString } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

import type { AssociatedFoodItem } from './associated-foods';
import { createDefaultAssociatedFood } from './associated-foods';

export default defineComponent({
  name: 'AssociatedFoodList',

  components: { ConfirmDialog, draggable, LanguageSelector, SelectResource },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<Errors>,
      required: true,
    },
    foodCode: {
      type: String,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<AssociatedFoodItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { translate } = useI18n();

    const newItem = () => ({
      ...createDefaultAssociatedFood(props.foodCode, props.localeId),
      _id: randomString(6),
    });

    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save, update } =
      useListWithDialog(props, context, {
        newItem,
        transformIn: withIdAndOrder,
        transformOut: withoutIdAndOrder,
      });

    const clearCategory = (code: string | null) => {
      if (!code) return;

      dialog.value.item.associatedCategoryCode = null;
    };

    const clearFood = (code: string | null) => {
      if (!code) return;

      dialog.value.item.associatedFoodCode = null;
    };

    return {
      dialog,
      form,
      translate,
      items,
      newDialog,
      add,
      edit,
      load,
      remove,
      reset,
      save,
      update,
      clearCategory,
      clearFood,
    };
  },
});
</script>
