<template>
  <v-tab-item key="conditions">
    <v-expand-transition>
      <v-card v-show="dialog.show" class="mb-6" outlined>
        <v-toolbar color="grey lighten-4" flat>
          <v-toolbar-title>
            {{ $t(`survey-schemes.conditions.${isCreate ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="font-weight-bold" color="error" @click.stop="cancel" text>
            <v-icon>$cancel</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="dialog.condition.type"
                :items="conditionSelectList"
                :label="$t('survey-schemes.conditions.types._', {})"
                hide-details="auto"
                item-value="type"
                outlined
                @change="updatePromptCondition"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="dialog.condition.op"
                :items="operationSelectList"
                :label="$t('survey-schemes.conditions.ops._')"
                hide-details="auto"
                item-value="op"
                outlined
              >
                <template v-slot:item="{ item }">
                  <span :class="`fas fa-${opToIconMap[item.op]} mr-3`"></span>
                  {{ item.text }}
                </template>
                <template v-slot:selection="{ item }">
                  <span :class="`fas fa-${opToIconMap[item.op]} mr-3`"></span>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dialog.condition.value"
                :label="$t('survey-schemes.conditions.value')"
                hide-details="auto"
                outlined
              ></v-text-field>
            </v-col>
            <component :is="dialog.condition.type" v-bind.sync="dialog.condition.props"></component>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text @click="save">
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
            <div class="text-h5">{{ $t('survey-schemes.conditions.title') }}</div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            color="secondary"
            :title="$t('survey-schemes.conditions.create')"
            @click.stop="add"
          >
            <v-icon small>$add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list dense>
          <draggable v-model="currentConditions" handle=".drag-and-drop__handle" @end="update">
            <transition-group type="transition" name="drag-and-drop">
              <v-list-item
                v-for="(condition, idx) in currentConditions"
                :key="condition.id"
                :ripple="false"
                class="drag-and-drop__item"
                draggable
                link
              >
                <v-list-item-avatar class="drag-and-drop__handle">
                  <v-icon>fa-grip-vertical</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="font-weight-medium">
                  <code class="pa-5 large">
                    {{ $t(`survey-schemes.conditions.showIf`) }}
                    '{{
                      $t(`survey-schemes.conditions.exTypes.${condition.type}`, {
                        ...condition.props,
                      })
                    }}'
                    <span :class="`fas fa-${opToIconMap[condition.op]} mx-2`"></span>
                    '{{ condition.value }}'
                  </code>
                </v-list-item-content>
                <v-list-item-action class="ml-2">
                  <v-btn
                    icon
                    :title="$t('survey-schemes.conditions.edit')"
                    @click.stop="edit(idx, condition)"
                  >
                    <v-icon color="primary lighten-2">$edit</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action class="ml-2">
                  <v-btn
                    icon
                    :title="$t('survey-schemes.conditions.remove')"
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
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { Condition, ConditionOp } from '@intake24/common/prompts';
import PromptAnswerProps from '@intake24/admin/components/prompts/partials/conditions/prompt-answer-props.vue';
import RecallNumberProps from '@intake24/admin/components/prompts/partials/conditions/recall-number-props.vue';
import { conditionOps } from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';

export interface IndexedCondition extends Condition {
  id: number;
}

export type PromptConditionDialog = {
  show: boolean;
  index: number;
  condition: Condition;
};

const opToIconMap: Record<ConditionOp, string> = {
  eq: 'equals',
  ne: 'not-equal',
  gte: 'greater-than-equal',
  gt: 'greater-than',
  lte: 'less-than-equal',
  lt: 'less-than',
};

const promptConditions: Condition[] = [
  {
    type: 'surveyPromptAnswer',
    op: 'eq',
    value: '',
    props: {
      promptId: '',
    },
  },
  {
    type: 'mealPromptAnswer',
    op: 'eq',
    value: '',
    props: {
      promptId: '',
    },
  },
  {
    type: 'foodPromptAnswer',
    op: 'eq',
    value: '',
    props: {
      promptId: '',
    },
  },
  {
    type: 'recallNumber',
    op: 'eq',
    value: '',
    props: {},
  },
];

export default defineComponent({
  name: 'PromptConditions',

  components: {
    draggable,
    surveyPromptAnswer: PromptAnswerProps,
    mealPromptAnswer: PromptAnswerProps,
    foodPromptAnswer: PromptAnswerProps,
    recallNumber: RecallNumberProps,
  },

  props: {
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
  },

  data() {
    const currentConditions: IndexedCondition[] = this.conditions.map((condition, idx) => ({
      id: idx + 1,
      ...condition,
    }));

    const dialog = (show = false): PromptConditionDialog => ({
      show,
      index: -1,
      condition: copy(promptConditions[0]),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      currentConditions,
      promptConditions,
      opToIconMap,
    };
  },

  computed: {
    isCreate(): boolean {
      return this.dialog.index === -1;
    },
    isEdit(): boolean {
      return !this.isCreate;
    },
    conditionSelectList(): { type: string; text: string }[] {
      return this.promptConditions.map(({ type }) => ({
        type,
        text: this.$t(`survey-schemes.conditions.types.${type}`).toString(),
      }));
    },
    operationSelectList(): { op: string; text: string }[] {
      return Object.keys(conditionOps).map((op) => ({
        op,
        text: this.$t(`survey-schemes.conditions.ops.${op}`).toString(),
      }));
    },
    outputConditions(): Condition[] {
      return this.currentConditions.map(({ id, ...rest }) => rest);
    },
  },

  watch: {
    outputConditions: {
      deep: true,
      handler() {
        this.update();
      },
    },
  },

  methods: {
    updatePromptCondition() {
      const {
        show,
        index,
        condition: { type },
      } = this.dialog;

      const condition = this.promptConditions.find((item) => item.type === type);
      if (!condition) return;

      this.dialog = { show, index, condition: copy(condition) };
    },

    add() {
      this.dialog = this.newDialog(true);
    },

    cancel() {
      this.dialog = this.newDialog(false);
    },

    edit(index: number, condition: Condition) {
      const defaults = this.currentConditions.find((item) => item.type === condition.type);

      this.dialog = {
        show: true,
        index,
        condition: merge(defaults ?? {}, condition),
      };
    },

    save() {
      const { index, condition } = this.dialog;

      const newCondition = { id: this.currentConditions.length + 1, ...condition };

      if (index === -1) this.currentConditions.push(newCondition);
      else this.currentConditions.splice(index, 1, newCondition);

      this.update();
      this.reset();
    },

    remove(index: number) {
      this.currentConditions.splice(index, 1);
      this.update();
    },

    reset() {
      this.dialog = this.newDialog();
    },

    update() {
      this.$emit('update:conditions', this.outputConditions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
