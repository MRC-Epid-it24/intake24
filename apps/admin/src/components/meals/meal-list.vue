<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon left color="primary">fa-hamburger</v-icon>
      <v-toolbar-title class="font-weight-medium">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        color="secondary"
        :title="$t('survey-schemes.meals.create')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <load-section-dialog
        schemeType="survey"
        :schemeId="schemeId"
        section="meals"
        @load="load"
      ></load-section-dialog>
      <confirm-dialog
        color="error"
        :label="$t('survey-schemes.meals.reset._')"
        @confirm="resetList"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            class="ml-3"
            color="error"
            fab
            small
            :title="$t('survey-schemes.meals.reset._')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>fa-sync</v-icon>
          </v-btn>
        </template>
        {{ $t('survey-schemes.meals.reset.text') }}
      </confirm-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="meals">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(meal, index) in meals"
            :key="meal.name.en"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ meal.name.en }}</v-list-item-title>
              <v-list-item-subtitle>{{ meal.time }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('survey-schemes.meals.edit')" @click.stop="edit(index, meal)">
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                :label="$t('survey-schemes.meals.remove')"
                color="error"
                icon
                icon-left="$delete"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: meal.name.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon left dark>fa-hamburger</v-icon>
          <v-toolbar-title>
            {{ $t(`survey-schemes.meals.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <language-selector
            :label="$t('survey-schemes.meals.name')"
            v-model="dialog.meal.name"
            flat
            :outlined="false"
          >
            <template v-for="lang in Object.keys(dialog.meal.name)" v-slot:[`lang.${lang}`]>
              <v-text-field
                v-model="dialog.meal.name[lang]"
                :key="lang"
                :label="$t('survey-schemes.meals.name')"
                :rules="rules(lang)"
                hide-details="auto"
                outlined
              ></v-text-field>
            </template>
          </language-selector>
          <v-card-text>
            <v-time-picker
              v-model="dialog.meal.time"
              :landscape="$vuetify.breakpoint.smAndUp"
              format="24hr"
              full-width
            ></v-time-picker>
          </v-card-text>
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
import type { PropType } from '@vue/composition-api';
import { defineComponent, ref } from '@vue/composition-api';
import draggable from 'vuedraggable';
import { copy } from '@intake24/common/util';
import type { Meal, Meals } from '@intake24/common/types';
import { defaultMeals } from '@intake24/common/schemes';
import { ConfirmDialog } from '@intake24/ui';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';

export type MealDialog = {
  show: boolean;
  index: number;
  meal: Meal;
};

export default defineComponent({
  name: 'MealList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    mode: {
      type: String as PropType<'full' | 'override'>,
      default: 'full',
    },
    value: {
      type: Array as PropType<Meal[]>,
      required: true,
    },
  },

  components: { ConfirmDialog, draggable, LanguageSelector, LoadSectionDialog },

  setup() {
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
  },

  data() {
    const dialog = (show = false): MealDialog => ({
      show,
      index: -1,
      meal: { name: { en: '' }, time: '8:00' },
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      meals: [...this.value],
      defaultMeals,
    };
  },

  computed: {
    isOverrideMode(): boolean {
      return this.mode === 'override';
    },
    title(): string {
      return this.$t(
        this.isOverrideMode ? 'survey-schemes.overrides.meals.title' : 'survey-schemes.meals.title'
      ).toString();
    },
  },

  watch: {
    meals(val) {
      this.$emit('input', val);
    },
  },

  methods: {
    rules(langId: string) {
      return [
        (value: string | null): boolean | string => {
          if (!value) return this.$t('survey-schemes.meals.validation.required').toString();

          const { index } = this.dialog;
          const match = this.meals.find(
            (meal, idx) => value === meal.name[langId] && index !== idx
          );

          return match ? this.$t('survey-schemes.meals.validation.unique').toString() : true;
        },
      ];
    },

    add() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, meal: Meal) {
      this.dialog = { show: true, index, meal: copy(meal) };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid) return;

      const { index, meal } = this.dialog;

      if (index === -1) this.meals.push(meal);
      else this.meals.splice(index, 1, meal);

      this.reset();
    },

    remove(index: number) {
      this.meals.splice(index, 1);
    },

    reset() {
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    load(meals: Meals) {
      this.meals = [...meals];
    },

    resetList() {
      this.meals = [...this.defaultMeals];
    },
  },
});
</script>

<style lang="scss" scoped></style>
