<template>
  <v-tab-item key="actions">
    <v-tabs vertical>
      <v-btn class="my-4" color="primary" @click="add">
        <v-icon left>$add</v-icon>
        {{ $t(`survey-schemes.actions.add`) }}
      </v-btn>
      <draggable v-model="currentActions" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-tab v-for="(action, idx) in currentActions" :key="action.id">
            <v-icon left>fas fa-location-arrow</v-icon>
            {{ $t(`survey-schemes.actions.types.${action.type}`) }}({{ idx + 1 }})
          </v-tab>
        </transition-group>
      </draggable>
      <v-tab-item v-for="(action, idx) in currentActions" :key="action.id">
        <v-card class="mx-4" outlined>
          <v-card-title>
            <v-icon left>fas fa-location-arrow</v-icon>
            {{ $t(`survey-schemes.actions.types._`) }} #{{ idx + 1 }}
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="action.type"
                  hide-details="auto"
                  item-value="type"
                  :items="actionList"
                  :label="$t('survey-schemes.actions.types._')"
                  outlined
                ></v-select>
              </v-col>
              <v-col class="d-flex flex-row align-center" cols="12" md="6">
                <div class="mr-4">
                  {{ $t('survey-schemes.actions.layouts._') }}
                </div>
                <v-checkbox
                  v-for="layout in layoutList"
                  :key="layout.value"
                  v-model="action.layout"
                  class="mr-2"
                  :label="layout.text"
                  :value="layout.value"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="action.color"
                  hide-details="auto"
                  :label="$t('survey-schemes.actions.color')"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="action.icon"
                  hide-details="auto"
                  :label="$t('survey-schemes.actions.icon')"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <language-selector
                  v-model="action.text"
                  :label="$t('survey-schemes.actions.text').toString()"
                  :required="true"
                >
                  <template v-for="lang in Object.keys(action.text)" #[`lang.${lang}`]>
                    <v-text-field
                      :key="lang"
                      v-model="action.text[lang]"
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
                  v-model="action.label"
                  :label="$t('survey-schemes.actions.label').toString()"
                >
                  <template v-for="lang in Object.keys(action.label)" #[`lang.${lang}`]>
                    <v-text-field
                      :key="lang"
                      v-model="action.label[lang]"
                      hide-details="auto"
                      :label="$t('survey-schemes.actions.label')"
                      outlined
                      :rules="[]"
                    ></v-text-field>
                  </template>
                </language-selector>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="error" text @click="remove(idx)">
              <v-icon left>$delete</v-icon> {{ $t('survey-schemes.actions.remove') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { PromptAction } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { withIdList } from '@intake24/admin/util';
import { promptActionTypes, promptLayouts } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

export const defaultAction: PromptAction = {
  type: 'next',
  text: { en: '' },
  label: { en: '' },
  color: 'primary',
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
    return {
      currentActions: withIdList(this.actions),
      promptActionTypes,
      promptLayouts,
    };
  },

  computed: {
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

      this.currentActions = withIdList(val);
    },
    outputActions: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    add() {
      this.currentActions.push(copy({ ...defaultAction, id: randomString(6) }));
    },

    remove(index: number) {
      this.currentActions.splice(index, 1);
    },

    update() {
      this.$emit('update:actions', this.outputActions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
