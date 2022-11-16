<template>
  <v-tab-item key="actions">
    <v-expand-transition>
      <v-card v-show="dialog.show" class="mb-6" outlined>
        <v-toolbar color="grey lighten-4" flat>
          <v-toolbar-title>
            {{ $t(`survey-schemes.actions.${isCreate ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
            <v-icon>$cancel</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="dialog.action.type"
                hide-details="auto"
                item-value="type"
                :items="actionList"
                :label="$t('survey-schemes.actions.types._')"
                outlined
              ></v-select>
            </v-col>
            <v-col class="d-flex flex-row" cols="12" md="6">
              <v-checkbox
                v-for="layout in layoutList"
                :key="layout.value"
                v-model="dialog.action.layout"
                class="mr-2"
                :label="layout.text"
                :value="layout.value"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dialog.action.color"
                hide-details="auto"
                :label="$t('survey-schemes.actions.color')"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dialog.action.icon"
                hide-details="auto"
                :label="$t('survey-schemes.actions.icon')"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <language-selector
                v-model="dialog.action.text"
                :label="$t('survey-schemes.actions.text').toString()"
                :required="true"
              >
                <template v-for="lang in Object.keys(dialog.action.text)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="dialog.action.text[lang]"
                    hide-details="auto"
                    :label="$t('survey-schemes.actions.text')"
                    outlined
                    :rules="[]"
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12" md="6">
              <language-selector
                v-model="dialog.action.label"
                :label="$t('survey-schemes.actions.label').toString()"
              >
                <template v-for="lang in Object.keys(dialog.action.label)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="dialog.action.label[lang]"
                    hide-details="auto"
                    :label="$t('survey-schemes.actions.label')"
                    outlined
                    :rules="[]"
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="info" text @click="save">
              <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-expand-transition>

    <v-row>
      <v-col cols="12">
        <v-toolbar flat tile>
          <v-toolbar-title class="font-weight-medium">
            <div class="text-h5">{{ $t('survey-schemes.actions.title') }}</div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            fab
            small
            :title="$t('survey-schemes.actions.create')"
            @click.stop="add"
          >
            <v-icon small>$add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list dense>
          <draggable v-model="currentActions" handle=".drag-and-drop__handle" @end="update">
            <transition-group name="drag-and-drop" type="transition">
              <v-list-item
                v-for="(action, idx) in currentActions"
                :key="action.id"
                class="drag-and-drop__item"
                draggable
                link
                :ripple="false"
              >
                <v-list-item-avatar class="drag-and-drop__handle">
                  <v-icon>fa-grip-vertical</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="font-weight-medium">
                  {{ $t(`survey-schemes.actions.types.${action.type}`) }}
                </v-list-item-content>
                <v-list-item-action class="ml-2">
                  <v-btn
                    icon
                    :title="$t('survey-schemes.actions.edit')"
                    @click.stop="edit(idx, action)"
                  >
                    <v-icon color="primary lighten-2">$edit</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action class="ml-2">
                  <v-btn
                    icon
                    :title="$t('survey-schemes.actions.remove')"
                    @click.stop="remove(idx)"
                  >
                    <v-icon color="error">$delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </transition-group>
          </draggable>
        </v-list>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { PromptAction } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { toIndexedList } from '@intake24/admin/util';
import { promptActionTypes, promptLayouts } from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';

export type PromptActionDialog = {
  show: boolean;
  index: number;
  action: PromptAction;
};

export const defaultAction: PromptAction = {
  type: 'next',
  text: { en: '' },
  label: { en: '' },
  icon: '',
  layout: [],
};

export default defineComponent({
  name: 'PromptActions',

  components: { draggable, LanguageSelector },

  props: {
    actions: {
      type: Array as PropType<PromptAction[]>,
      required: true,
    },
  },

  data() {
    const dialog = (show = false): PromptActionDialog => ({
      show,
      index: -1,
      action: copy(defaultAction),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      currentActions: toIndexedList(this.actions),
      promptActionTypes,
      promptLayouts,
    };
  },

  computed: {
    isCreate(): boolean {
      return this.dialog.index === -1;
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
    actionList(): { type: string; text: string }[] {
      return this.promptActionTypes.map((type) => ({
        type,
        text: this.$t(`survey-schemes.actions.types.${type}`).toString(),
      }));
    },
    layoutList(): { text: string; value: string }[] {
      return this.promptLayouts.map((value) => ({
        value,
        text: this.$t(`survey-schemes.actions.layouts.${value}`).toString(),
      }));
    },
    outputActions(): PromptAction[] {
      return this.currentActions.map(({ id, ...rest }) => rest);
    },
  },

  watch: {
    actions(val) {
      if (isEqual(val, this.outputActions)) return;

      this.currentActions = toIndexedList(val);
    },
  },

  methods: {
    add() {
      this.dialog = this.newDialog(true);
    },

    cancel() {
      this.dialog = this.newDialog(false);
    },

    edit(index: number, action: PromptAction) {
      this.dialog = { show: true, index, action: merge(defaultAction, action) };
    },

    save() {
      const { index, action } = this.dialog;

      const newCondition = { id: this.currentActions.length + 1, ...action };

      if (index === -1) this.currentActions.push(newCondition);
      else this.currentActions.splice(index, 1, newCondition);

      this.update();
      this.reset();
    },

    remove(index: number) {
      this.currentActions.splice(index, 1);
      this.update();
    },

    reset() {
      this.dialog = this.newDialog();
    },

    update() {
      this.$emit('update:actions', this.outputActions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
