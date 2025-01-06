<template>
  <v-card flat tile>
    <v-toolbar color="grey-lighten-2" flat tile>
      <v-icon color="secondary" end start>
        fas fa-hamburger
      </v-icon>
      <div class="d-flex flex-column">
        <v-toolbar-title class="font-weight-medium">
          {{ title }}
        </v-toolbar-title>
        <span v-if="subtitle" class="text-subtitle-2">{{ subtitle }}</span>
      </div>
      <v-spacer />
      <v-btn color="primary" icon="$add" size="small" :title="$t('survey-schemes.meals.create')" @click.stop="add" />
      <confirm-dialog
        color="error"
        :label="$t('survey-schemes.meals.reset._')"
        @confirm="resetList"
      >
        <template #activator="{ props }">
          <v-btn
            class="ml-3"
            color="error"
            icon="$sync"
            size="small"
            :title="$t('survey-schemes.meals.reset._')"
            v-bind="props"
          />
        </template>
        {{ $t('survey-schemes.meals.reset.text') }}
      </confirm-dialog>
      <options-menu>
        <select-resource resource="survey-schemes" return-object="meals" @update:model-value="load">
          <template #activator="{ props }">
            <v-list-item v-bind="props" link>
              <template #prepend>
                <v-icon icon="$download" />
              </template>
              <v-list-item-title>
                {{ $t('survey-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="meals" />
      </options-menu>
    </v-toolbar>
    <v-list class="list-border" lines="two">
      <vue-draggable
        v-model="meals"
        :animation="300"
        handle=".drag-and-drop__handle"
      >
        <v-list-item
          v-for="(meal, index) in meals"
          :key="meal.name.en"
        >
          <template #prepend>
            <v-avatar class="drag-and-drop__handle" icon="$handle" />
          </template>
          <v-list-item-title>{{ meal.name.en }}</v-list-item-title>
          <v-list-item-subtitle>{{ meal.time }}</v-list-item-subtitle>
          <template #append>
            <v-list-item-action>
              <v-btn icon="$edit" :title="$t('survey-schemes.meals.edit')" @click.stop="edit(index, meal)" />
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('survey-schemes.meals.remove')"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: meal.name.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </template>
        </v-list-item>
      </vue-draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      :fullscreen="$vuetify.display.smAndDown"
      max-width="600px"
      persistent
    >
      <v-card :tile="$vuetify.display.smAndDown">
        <v-toolbar color="secondary" dark flat>
          <v-icon icon="fas fa-hamburger" start />
          <v-toolbar-title>
            {{ $t(`survey-schemes.meals.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-form ref="form" @submit.prevent="save">
          <language-selector
            v-model="dialog.meal.name"
            :label="$t('survey-schemes.meals.name')"
            :outlined="false"
          >
            <template v-for="lang in Object.keys(dialog.meal.name)" :key="lang" #[`lang.${lang}`]>
              <v-text-field
                v-model="dialog.meal.name[lang]"
                hide-details="auto"
                :label="$t('survey-schemes.meals.name')"
                :rules="rules(lang)"
                variant="outlined"
              />
            </template>
          </language-selector>
          <v-card-text class="d-flex justify-center align-center pa-0">
            <time-picker
              v-model="dialog.meal.time"
              full-width
              :landscape="$vuetify.display.smAndUp"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="reset">
              <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn class="font-weight-bold" color="info" type="submit" variant="text">
              <v-icon icon="$success" start />{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

import { VueDraggable } from 'vue-draggable-plus';
import type { Meal, Meals } from '@intake24/common/surveys';
import { defaultMeals } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';

import { useI18n } from '@intake24/i18n';
import { ConfirmDialog, TimePicker } from '@intake24/ui';
import { OptionsMenu, SelectResource } from '../dialogs';
import { JsonEditorDialog } from '../editors';
import { LanguageSelector } from '../forms';

type MealDialog = {
  show: boolean;
  index: number;
  meal: Meal;
};

defineOptions({ name: 'MealList' });

const props = defineProps({
  schemeId: {
    type: String,
    required: true,
  },
  mode: {
    type: String as PropType<'full' | 'override'>,
    default: 'full',
  },
  modelValue: {
    type: Array as PropType<Meal[]>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const { i18n: { t } } = useI18n();

function newDialog(show = false): MealDialog {
  return {
    show,
    index: -1,
    meal: { name: { en: '' }, time: '8:00' },
  };
}

const dialog = ref(newDialog());
const form = ref<InstanceType<typeof HTMLFormElement>>();
const meals = ref(copy(props.modelValue));

const isOverrideMode = computed(() => props.mode === 'override');
const title = computed(() => t(
  isOverrideMode.value ? 'survey-schemes.overrides.meals.title' : 'survey-schemes.meals.title',
));
const subtitle = computed(() => isOverrideMode.value ? t('survey-schemes.overrides.meals.subtitle') : undefined);

function rules(langId: string) {
  return [
    (value: string | null): boolean | string => {
      if (!value)
        return t('survey-schemes.meals.validation.required');

      const { index } = dialog.value;
      const match = meals.value.find(
        (meal, idx) => value === meal.name[langId] && index !== idx,
      );

      return match ? t('survey-schemes.meals.validation.unique') : true;
    },
  ];
};

function add() {
  dialog.value = newDialog(true);
};

function edit(index: number, meal: Meal) {
  dialog.value = { show: true, index, meal: copy(meal) };
};

function save() {
  const isValid = form.value?.validate();
  if (!isValid)
    return;

  const { index, meal } = dialog.value;

  if (index === -1)
    meals.value.push(meal);
  else meals.value.splice(index, 1, meal);

  reset();
};

function remove(index: number) {
  meals.value.splice(index, 1);
};

function reset() {
  dialog.value = newDialog();
  form.value?.resetValidation();
};

function load(items: Meals) {
  meals.value = [...items];
};

function resetList() {
  meals.value = copy(defaultMeals);
};

watch(meals, (val) => {
  emit('update:modelValue', val);
}, { deep: true });
</script>

<style lang="scss" scoped></style>
