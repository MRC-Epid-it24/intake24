<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">fa-seedling</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.top-foods.nutrientTypes.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        color="secondary"
        :title="$t('feedback-schemes.top-foods.nutrientTypes.create')"
        @click.stop="add"
      >
        <v-icon small>fa-plus</v-icon>
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
      <draggable v-model="nutrientTypes">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(nutrientType, idx) in nutrientTypes"
            :key="nutrientType.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="nutrientType.name.en"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.top-foods.nutrientTypes.edit')"
                @click.stop="edit(idx, nutrientType)"
              >
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.top-foods.nutrientTypes.remove')"
                @click.stop="remove(idx)"
              >
                <v-icon color="error">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon class="mr-3" dark>fa-seedling</v-icon>
          <v-toolbar-title>
            {{
              $t(
                `feedback-schemes.top-foods.nutrientTypes.${
                  dialog.index === -1 ? 'create' : 'edit'
                }`
              )
            }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-select
              v-model="dialog.nutrientType.id"
              :items="availableNutrientTypes"
              :label="$t('feedback-schemes.top-foods.nutrientTypes._')"
              :rules="rules"
              hide-details="auto"
              item-text="description"
              item-value="id"
              outlined
              @change="updateNutrientLabel"
            ></v-select>
          </v-card-text>
          <language-selector
            :label="$t('feedback-schemes.top-foods.nutrientTypes.label')"
            v-model="dialog.nutrientType.name"
            flat
            :outlined="false"
          >
            <template v-for="lang in Object.keys(dialog.nutrientType.name)" v-slot:[`lang.${lang}`]>
              <v-text-field
                v-model="dialog.nutrientType.name[lang]"
                :key="lang"
                :label="$t('feedback-schemes.top-foods.nutrientTypes._')"
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
import { copy } from '@intake24/common/util';
import isEqual from 'lodash/isEqual';
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { FormRefs } from '@intake24/common/types';
import { ConfirmDialog } from '@intake24/ui';
import LanguageSelector from '@intake24/admin/components/prompts/partials/language-selector.vue';
import { defaultTopFoods, TopFoodNutrientType } from '@intake24/common/feedback';
import { NutrientTypeAttributes } from '@intake24/common/types/models';

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'TopFoodsNutrientTypeList',

  props: {
    feedbackSchemeId: {
      type: String,
      required: true,
    },
    availableNutrientTypes: {
      type: Array as () => NutrientTypeAttributes[],
      required: true,
    },
    value: {
      type: Array as () => TopFoodNutrientType[],
    },
  },

  components: { ConfirmDialog, draggable, LanguageSelector /* , LoadSectionDialog */ },

  data() {
    const dialog = (show = false) => ({
      show,
      index: -1,
      nutrientType: {
        id: this.availableNutrientTypes[0].id,
        name: { en: this.availableNutrientTypes[0].description },
      },
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      nutrientTypes: [...this.value],
      defaultNutrientTypes: defaultTopFoods.nutrientTypes,
    };
  },

  computed: {
    rules() {
      return [
        (value: string | null): boolean | string => {
          if (!value)
            return this.$t(
              'feedback-schemes.top-foods.nutrientTypes.validation.required'
            ).toString();

          const { index } = this.dialog;
          const match = this.nutrientTypes.find(
            (nutrientType, idx) => value === nutrientType.id && index !== idx
          );

          return match
            ? this.$t('feedback-schemes.top-foods.nutrientTypes.validation.unique').toString()
            : true;
        },
      ];
    },
  },

  watch: {
    value(val) {
      if (isEqual(val, this.nutrientTypes)) return;

      this.nutrientTypes = [...val];
    },
    nutrientTypes(val) {
      this.$emit('input', val);
    },
  },

  methods: {
    add() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, nutrientType: TopFoodNutrientType) {
      this.dialog = { show: true, index, nutrientType: copy(nutrientType) };
    },

    save() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const { index, nutrientType } = this.dialog;

      if (index === -1) this.nutrientTypes.push(nutrientType);
      else this.nutrientTypes.splice(index, 1, nutrientType);

      this.reset();
    },

    remove(index: number) {
      this.nutrientTypes.splice(index, 1);
    },

    reset() {
      this.dialog = this.newDialog();
      this.$refs.form.resetValidation();
    },

    load(nutrientType: TopFoodNutrientType[]) {
      this.nutrientTypes = [...nutrientType];
    },

    resetList() {
      this.nutrientTypes = [...this.defaultNutrientTypes];
    },

    updateNutrientLabel(nutrientTypeId: string) {
      const match = this.availableNutrientTypes.find((nutrient) => nutrient.id === nutrientTypeId);
      if (!match) return;

      this.dialog.nutrientType.name.en = match.description;
    },
  },
});
</script>

<style lang="scss" scoped></style>
