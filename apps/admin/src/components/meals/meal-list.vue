<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">fa-hamburger</v-icon>
      <v-toolbar-title class="font-weight-medium">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn fab small color="secondary" :title="$t('schemes.meals.create')" @click.stop="add">
        <v-icon small>fa-plus</v-icon>
      </v-btn>
      <load-section-dialog :schemeId="schemeId" section="meals" @load="load"></load-section-dialog>
      <confirm-dialog color="error" :label="$t('schemes.meals.reset._')" @confirm="resetList">
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            class="ml-3"
            color="error"
            fab
            small
            :title="$t('schemes.meals.reset._')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>fa-sync</v-icon>
          </v-btn>
        </template>
        {{ $t('schemes.meals.reset.text') }}
      </confirm-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="meals">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(meal, idx) in meals"
            :key="meal.name.en"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="meal.name.en"></v-list-item-title>
              <v-list-item-subtitle v-text="meal.time"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.meals.edit')" @click.stop="edit(idx, meal)">
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.meals.remove')" @click.stop="remove(idx)">
                <v-icon color="error">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <v-icon class="mr-3" color="primary">fa-hamburger</v-icon>
          <span class="text-h5">
            {{ $t(`schemes.meals.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <language-selector
            :label="$t('schemes.questions.text')"
            v-model="dialog.meal.name"
            flat
            :outlined="false"
          >
            <template v-for="lang in Object.keys(dialog.meal.name)" v-slot:[`lang.${lang}`]>
              <v-text-field
                v-model="dialog.meal.name[lang]"
                :key="lang"
                :label="$t('schemes.meals._')"
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
import { copy } from '@common/util';
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { FormRefs, Meal, Meals } from '@common/types';
import { defaultMeals } from '@common/schemes';
import LanguageSelector from '@/components/prompts/partials/LanguageSelector.vue';
import LoadSectionDialog from '@/components/prompts/load-section-dialog.vue';
import ConfirmDialog from '@/components/dialogs/confirm-dialog.vue';

export type MealDialog = {
  show: boolean;
  index: number;
  meal: Meal;
};

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'MealList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    mode: {
      type: String as () => 'full' | 'override',
      default: 'full',
    },
    value: {
      type: Array as () => Meal[],
    },
  },

  components: { ConfirmDialog, draggable, LanguageSelector, LoadSectionDialog },

  data() {
    const dialog = (show = false): MealDialog => ({
      show,
      index: -1,
      meal: { name: { en: null }, time: '8:00' },
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
        this.isOverrideMode ? 'schemes.overrides.meals.title' : 'schemes.meals.title'
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
          if (!value) return this.$t('schemes.meals.validation.required').toString();

          const { index } = this.dialog;
          const match = this.meals.find(
            (meal, idx) => value === meal.name[langId] && index !== idx
          );

          return match ? this.$t('schemes.meals.validation.unique').toString() : true;
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
      const isValid = this.$refs.form.validate();
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
      this.$refs.form.resetValidation();
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
