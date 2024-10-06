<template>
  <v-tabs-window-item key="actions" value="actions">
    <v-col cols="12">
      <v-switch
        v-model="toggle"
        hide-details="auto"
        :label="$t('survey-schemes.actions.enable')"
        @update:model-value="changeToggle"
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
      <div class="d-flex flex-row ga-2">
        <div>
          <v-btn class="mb-4" color="primary" @click="add">
            <v-icon icon="$add" start />
            {{ $t(`survey-schemes.actions.add`) }}
          </v-btn>
          <v-tabs v-model="selectedAction" direction="vertical">
            <vue-draggable
              v-model="currentActions.items"
              :animation="300"
              handle=".drag-and-drop__handle"
              @end="update"
            >
              <v-tab v-for="(action, idx) in currentActions.items" :key="action.id" class="d-flex ga-3" :value="action.id">
                <v-icon class="drag-and-drop__handle">
                  $handle
                </v-icon>
                {{ $t(`survey-schemes.actions.types.${action.type}`) }}({{ idx + 1 }})
              </v-tab>
            </vue-draggable>
          </v-tabs>
        </div>
        <v-tabs-window v-model="selectedAction" class="flex-grow-1">
          <v-tabs-window-item v-for="(action, idx) in currentActions.items" :key="action.id" :value="action.id">
            <v-card border>
              <v-card-title>
                <v-icon icon="fas fa-location-arrow" start />
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
                      variant="outlined"
                    />
                    <div class="d-flex flex-row align-center">
                      <div class="mr-4">
                        {{ $t('survey-schemes.actions.layouts._') }}
                      </div>
                      <v-checkbox-btn
                        v-for="layout in layouts"
                        :key="layout.value"
                        v-model="action.layout"
                        class="mr-2"
                        :label="layout.title"
                        :value="layout.value"
                      />
                    </div>
                    <v-select
                      v-model="action.variant"
                      class="mb-4"
                      hide-details="auto"
                      :items="actionVariants"
                      :label="$t('survey-schemes.actions.variants._')"
                      variant="outlined"
                    />
                    <v-select
                      v-model="action.color"
                      class="mb-4"
                      hide-details="auto"
                      :items="colors"
                      :label="$t('survey-schemes.actions.color')"
                      variant="outlined"
                    >
                      <template #item="{ item, props }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <span
                              class="mr-2 pa-4 rounded-circle"
                              :style="{ backgroundColor: item.raw.color }"
                            />
                          </template>
                          <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                        </v-list-item>
                      </template>
                      <template #selection="{ item }">
                        <span
                          class="mr-2 pa-4 rounded-circle"
                          :style="{ backgroundColor: item.raw.color }"
                        />
                        {{ item.raw.title }}
                      </template>
                    </v-select>
                    <v-text-field
                      v-model="action.icon"
                      hide-details="auto"
                      :label="$t('survey-schemes.actions.icon')"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <language-selector
                      v-model="action.text"
                      border
                      class="mb-4"
                      :label="$t('survey-schemes.actions.text')"
                      :required="true"
                    >
                      <template v-for="lang in Object.keys(action.text)" :key="lang" #[`lang.${lang}`]>
                        <v-text-field
                          v-model="action.text[lang]"
                          hide-details="auto"
                          :label="$t('survey-schemes.actions.text')"
                          :rules="[]"
                          variant="outlined"
                        />
                      </template>
                    </language-selector>
                    <language-selector
                      v-model="action.label"
                      border
                      :label="$t('survey-schemes.actions.label')"
                    >
                      <template v-for="lang in Object.keys(action.label)" :key="lang" #[`lang.${lang}`]>
                        <v-text-field
                          v-model="action.label[lang]"
                          hide-details="auto"
                          :label="$t('survey-schemes.actions.label')"
                          :rules="[]"
                          variant="outlined"
                        />
                      </template>
                    </language-selector>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <json-editor-dialog v-model="action.params">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" size="large" variant="text">
                          <v-icon icon="fas fa-code" start />
                          {{ $t('survey-schemes.actions.parameters') }}
                        </v-btn>
                      </template>
                    </json-editor-dialog>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer />
                <v-btn class="font-weight-bold" color="error" variant="text" @click="remove(idx)">
                  <v-icon icon="$delete" start />
                  {{ $t('survey-schemes.actions.remove') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </template>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { computed, defineComponent, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useSelects } from '@intake24/admin/composables';
import { withIdList } from '@intake24/admin/util';
import { type Actions, defaultAction } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

export default defineComponent({
  name: 'PromptActions',

  components: { JsonEditorDialog, LanguageSelector, VueDraggable },

  props: {
    actions: {
      type: Object as PropType<Actions>,
    },
  },

  emits: ['update:actions'],

  setup(props) {
    const { actions: availableActions, actionVariants, colors, layouts } = useSelects();

    const currentActions = ref(props.actions ? { ...props.actions, items: withIdList(props.actions.items) } : undefined);
    const selectedAction = ref(currentActions.value?.items.length ? currentActions.value.items[0].id : undefined);
    const toggle = ref(!!props.actions);

    const outputActions = computed(() => {
      if (!currentActions.value)
        return undefined;

      return {
        ...currentActions.value,
        items: currentActions.value.items.map(({ id, ...rest }) => copy(rest)),
      };
    });

    return {
      actionVariants,
      availableActions,
      colors,
      currentActions,
      layouts,
      outputActions,
      selectedAction,
      toggle,
    };
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
