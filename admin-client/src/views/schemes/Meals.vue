<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">fa-hamburger</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('schemes.meals.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        class="mr-3"
        color="secondary"
        :title="$t('schemes.meals.add')"
        @click.stop="add"
      >
        <v-icon small>fa-plus</v-icon>
      </v-btn>
      <v-btn fab small color="error" :title="$t('schemes.meals.reset')" @click.stop="resetMealList">
        <v-icon small>fa-sync</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="meals">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(meal, idx) in meals"
            :key="meal.name"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="meal.name"></v-list-item-title>
              <v-list-item-subtitle v-text="meal.time"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.meals.edit')" @click.stop="edit(idx, meal)">
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.meals.remove')" @click.stop="remove(idx)"
                ><v-icon color="error">fa-trash</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-3" color="primary">fa-hamburger</v-icon>
          <span class="text-h5">
            {{ $t(`schemes.meals.${dialog.index === -1 ? 'add' : 'edit'}`) }}
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.meal.name"
                    :label="$t('schemes.meals._')"
                    :rules="rules"
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-time-picker
                    v-model="dialog.meal.time"
                    :landscape="$vuetify.breakpoint.smAndUp"
                    format="24hr"
                    full-width
                  ></v-time-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="reset">
              {{ $t('common.action.cancel') }}
            </v-btn>
            <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
              {{ $t('common.action.save') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { FormRefs } from '@common/types/common';

export type Meal = { name: string | null; time: string };

export type MealDialog = {
  show: boolean;
  index: number;
  meal: Meal;
};

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'SchemeMeals',

  props: {
    value: {
      type: Array as () => Meal[],
    },
    defaults: {
      type: Array as () => Meal[],
    },
  },

  components: { draggable },

  data() {
    const defaultDialog = (show = false): MealDialog => ({
      show,
      index: -1,
      meal: { name: null, time: '8:00' },
    });

    return {
      dialog: defaultDialog(),
      newDialog: defaultDialog,
      meals: [...this.value],
    };
  },

  computed: {
    rules() {
      return [
        (value: string | null): boolean | string => {
          if (!value) return this.$t('schemes.meals.validation.required') as string;

          const { index } = this.dialog;
          const match = this.meals.find((meal, idx) => value === meal.name && index !== idx);

          return match ? (this.$t('schemes.meals.validation.unique') as string) : true;
        },
      ];
    },
  },

  watch: {
    meals(val) {
      this.$emit('input', val);
    },
  },

  methods: {
    add() {
      this.dialog = this.newDialog(true);
    },
    edit(index: number, meal: Meal) {
      this.dialog = { show: true, index, meal: { ...meal } };
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
    resetMealList() {
      this.meals = [...this.defaults];
    },
  },
});
</script>

<style lang="scss" scoped></style>
