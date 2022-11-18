<template>
  <v-tab-item key="actions">
    <v-col cols="12">
      <v-switch
        v-model="toggle"
        hide-details="auto"
        :label="$t('survey-schemes.actions.enable')"
        @change="changeToggle"
      ></v-switch>
    </v-col>
    <template v-if="currentActions">
      <v-col cols="12">
        <v-switch
          v-model="currentActions.both"
          hide-details="auto"
          :label="$t('survey-schemes.actions.both')"
        ></v-switch>
      </v-col>
      <v-card-subtitle>
        {{ $t(`survey-schemes.actions.title`) }}
      </v-card-subtitle>
      <v-tabs vertical>
        <v-btn class="mb-4" color="primary" @click="add">
          <v-icon left>$add</v-icon>
          {{ $t(`survey-schemes.actions.add`) }}
        </v-btn>
        <draggable v-model="currentActions.items" @end="update">
          <transition-group name="drag-and-drop" type="transition">
            <v-tab v-for="(item, idx) in currentActions.items" :key="item.id">
              <v-icon left>fas fa-location-arrow</v-icon>
              {{ $t(`survey-schemes.actions.types.${item.type}`) }}({{ idx + 1 }})
            </v-tab>
          </transition-group>
        </draggable>
        <v-tab-item v-for="(item, idx) in currentActions.items" :key="item.id">
          <v-card class="mx-4" outlined>
            <v-card-title>
              <v-icon left>fas fa-location-arrow</v-icon>
              {{ $t(`survey-schemes.actions.types._`) }} #{{ idx + 1 }}
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="item.type"
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
                    v-model="item.layout"
                    class="mr-2"
                    :label="layout.text"
                    :value="layout.value"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.color"
                    hide-details="auto"
                    :label="$t('survey-schemes.actions.color')"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.icon"
                    hide-details="auto"
                    :label="$t('survey-schemes.actions.icon')"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <language-selector
                    v-model="item.text"
                    :label="$t('survey-schemes.actions.text').toString()"
                    :required="true"
                  >
                    <template v-for="lang in Object.keys(item.text)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="item.text[lang]"
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
                    v-model="item.label"
                    :label="$t('survey-schemes.actions.label').toString()"
                  >
                    <template v-for="lang in Object.keys(item.label)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="item.label[lang]"
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
    </template>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { ActionItem, Actions } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { withIdList } from '@intake24/admin/util';
import { actionTypes, promptLayouts } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

export const defaultAction: ActionItem = {
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
      type: Object as PropType<Actions>,
    },
  },

  data() {
    return {
      toggle: !!this.actions,
      currentActions: this.actions
        ? { ...this.actions, items: withIdList(this.actions.items) }
        : undefined,
      actionTypes,
      promptLayouts,
    };
  },

  computed: {
    actionList(): { type: string; text: string }[] {
      return this.actionTypes.map((type) => ({
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
    outputActions(): Actions | undefined {
      const { currentActions } = this;
      if (!currentActions) return undefined;

      return {
        ...currentActions,
        items: currentActions.items.map(({ id, ...rest }) => rest),
      };
    },
  },

  watch: {
    actions(val) {
      if (isEqual(val, this.outputActions)) return;

      this.currentActions = val ? { ...val, items: withIdList(val.items) } : undefined;
      this.toggle = !!val;
    },
    outputActions: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    changeToggle(enable: boolean) {
      if (!enable) {
        this.currentActions = undefined;
        return;
      }

      this.currentActions = { both: false, items: [] };
    },

    add() {
      this.currentActions?.items.push(copy({ ...defaultAction, id: randomString(6) }));
    },

    remove(index: number) {
      this.currentActions?.items.splice(index, 1);
    },

    update() {
      this.$emit('update:actions', this.outputActions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
