<template>
  <v-tab-item key="actions" value="actions">
    <v-col cols="12">
      <v-switch
        v-model="toggle"
        hide-details="auto"
        :label="$t('survey-schemes.actions.enable')"
        @change="changeToggle"
      />
    </v-col>
    <template v-if="currentActions">
      <v-col cols="12">
        <v-switch
          v-model="currentActions.both"
          hide-details="auto"
          :label="$t('survey-schemes.actions.both')"
        />
      </v-col>
      <v-card-subtitle>
        {{ $t(`survey-schemes.actions.title`) }}
      </v-card-subtitle>
      <v-tabs vertical>
        <v-btn class="mb-4" color="primary" @click="add">
          <v-icon left>
            $add
          </v-icon>
          {{ $t(`survey-schemes.actions.add`) }}
        </v-btn>
        <draggable v-model="currentActions.items" handle=".drag-and-drop__handle" @end="update">
          <transition-group name="drag-and-drop" type="transition">
            <v-tab v-for="(item, idx) in currentActions.items" :key="item.id" class="d-flex ga-3">
              <v-icon class="drag-and-drop__handle flex-grow-0">
                $handle
              </v-icon>
              <div class="flex-grow-1">
                <v-icon left>
                  fas fa-location-arrow
                </v-icon>
                {{ $t(`survey-schemes.actions.types.${item.type}`) }}({{ idx + 1 }})
              </div>
            </v-tab>
          </transition-group>
        </draggable>
        <v-tab-item v-for="(action, idx) in currentActions.items" :key="action.id">
          <v-card class="mx-4" outlined>
            <v-card-title>
              <v-icon left>
                fas fa-location-arrow
              </v-icon>
              {{ $t(`survey-schemes.actions.types._`) }} #{{ idx + 1 }}
            </v-card-title>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="action.type"
                    hide-details="auto"
                    :items="availableActions"
                    :label="$t('survey-schemes.actions.types._')"
                    outlined
                  />
                  <div class="d-flex flex-row align-center">
                    <div class="mr-4">
                      {{ $t('survey-schemes.actions.layouts._') }}
                    </div>
                    <v-checkbox
                      v-for="layout in layouts"
                      :key="layout.value"
                      v-model="action.layout"
                      class="mr-2"
                      :label="layout.text"
                      :value="layout.value"
                    />
                  </div>
                  <v-select
                    v-model="action.variant"
                    class="mb-4"
                    hide-details="auto"
                    :items="actionVariants"
                    :label="$t('survey-schemes.actions.variants._')"
                    outlined
                  />
                  <v-select
                    v-model="action.color"
                    class="mb-4"
                    hide-details="auto"
                    :items="colors"
                    :label="$t('survey-schemes.actions.color')"
                    outlined
                  >
                    <template #item="{ item }">
                      <span
                        class="mr-2 pa-4 rounded-circle"
                        :style="{ backgroundColor: item.color }"
                      />
                      {{ item.text }}
                    </template>
                    <template #selection="{ item }">
                      <span
                        class="mr-2 pa-4 rounded-circle"
                        :style="{ backgroundColor: item.color }"
                      />
                      {{ item.text }}
                    </template>
                  </v-select>
                  <v-text-field
                    v-model="action.icon"
                    hide-details="auto"
                    :label="$t('survey-schemes.actions.icon')"
                    outlined
                  />
                </v-col>
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
                      />
                    </template>
                  </language-selector>
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
                      />
                    </template>
                  </language-selector>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <json-editor-dialog v-model="action.params">
                    <template #activator="{ attrs, on }">
                      <v-btn v-bind="attrs" large outlined text v-on="on">
                        <v-icon left>
                          fas fa-code
                        </v-icon>
                        {{ $t('survey-schemes.actions.parameters') }}
                      </v-btn>
                    </template>
                  </json-editor-dialog>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer />
              <v-btn class="font-weight-bold" color="error" text @click="remove(idx)">
                <v-icon left>
                  $delete
                </v-icon>{{ $t('survey-schemes.actions.remove') }}
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
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useSelects } from '@intake24/admin/composables';
import { withIdList } from '@intake24/admin/util';
import { type Actions, defaultAction } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

export default defineComponent({
  name: 'PromptActions',

  components: { Draggable: draggable, JsonEditorDialog, LanguageSelector },

  props: {
    actions: {
      type: Object as PropType<Actions>,
    },
  },

  emits: ['update:actions'],

  setup() {
    const { actions: availableActions, actionVariants, colors, layouts } = useSelects();

    return {
      actionVariants,
      availableActions,
      colors,
      layouts,
    };
  },

  data() {
    return {
      toggle: !!this.actions,
      currentActions: this.actions
        ? { ...this.actions, items: withIdList(this.actions.items) }
        : undefined,
    };
  },

  computed: {
    outputActions(): Actions | undefined {
      const { currentActions } = this;
      if (!currentActions)
        return undefined;

      return {
        ...currentActions,
        items: currentActions.items.map(({ id, ...rest }) => rest),
      };
    },
  },

  watch: {
    actions(val) {
      if (deepEqual(val, this.outputActions))
        return;

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
