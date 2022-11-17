<template>
  <v-tab-item key="conditions">
    <v-tabs vertical>
      <v-btn class="my-4" color="primary" @click="add">
        <v-icon left>$add</v-icon>
        {{ $t(`survey-schemes.conditions.add`) }}
      </v-btn>
      <draggable v-model="currentConditions" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-tab v-for="condition in currentConditions" :key="condition.id">
            <v-icon left>fas fa-location-arrow</v-icon>
            {{ $t(`survey-schemes.conditions.types.${condition.type}`) }}
          </v-tab>
        </transition-group>
      </draggable>
      <v-tab-item v-for="(condition, idx) in currentConditions" :key="condition.id">
        <v-card class="mx-4" outlined>
          <v-card-title>
            <v-icon left>fas fa-location-arrow</v-icon>
            {{ $t(`survey-schemes.conditions.types.${condition.type}`) }}
          </v-card-title>
          <v-card-text class="px-0 my-4">
            <code class="pa-5 large" :style="{ width: '100%' }">
              {{ $t(`survey-schemes.conditions.showIf`) }}
              '{{
                $t(`survey-schemes.conditions.exTypes.${condition.type}`, {
                  ...condition.props,
                })
              }}'
              <span :class="`fas fa-${opToIconMap[condition.op]} mx-2`"></span>
              '{{ condition.value }}'
            </code>
          </v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="condition.type"
                  hide-details="auto"
                  item-value="type"
                  :items="conditionSelectList"
                  :label="$t('survey-schemes.conditions.types._')"
                  outlined
                  @change="updatePromptCondition"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="condition.op"
                  hide-details="auto"
                  item-value="op"
                  :items="operationSelectList"
                  :label="$t('survey-schemes.conditions.ops._')"
                  outlined
                >
                  <template #item="{ item }">
                    <span :class="`fas fa-${opToIconMap[item.op]} mr-3`"></span>
                    {{ item.text }}
                  </template>
                  <template #selection="{ item }">
                    <span :class="`fas fa-${opToIconMap[item.op]} mr-3`"></span>
                    {{ item.text }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="condition.value"
                  hide-details="auto"
                  :label="$t('survey-schemes.conditions.value')"
                  outlined
                ></v-text-field>
              </v-col>
              <component :is="condition.type" v-bind.sync="condition.props"></component>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="error" text @click="remove(idx)">
              <v-icon left>$delete</v-icon> {{ $t('survey-schemes.conditions.remove') }}
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

import type { Condition, ConditionOp, ConditionType } from '@intake24/common/prompts';
import { withIdList } from '@intake24/admin/util';
import { conditionOps } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

import conditionProps from './conditions';

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
  {
    type: 'totalEnergy',
    op: 'eq',
    value: '',
    props: {},
  },
];

export default defineComponent({
  name: 'PromptConditions',

  components: { draggable, ...conditionProps },

  props: {
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
  },

  data() {
    return {
      currentConditions: withIdList(this.conditions),
      promptConditions,
      opToIconMap,
    };
  },

  computed: {
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
    conditions(val) {
      if (isEqual(val, this.outputConditions)) return;

      this.currentConditions = withIdList(val);
    },
    outputConditions: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    updatePromptCondition(idx: number, type: ConditionType) {
      const condition = this.promptConditions.find((item) => item.type === type);
      if (!condition) return;

      this.currentConditions.splice(idx, 1, copy({ ...condition, id: randomString(6) }));
    },

    add() {
      this.currentConditions.push(copy({ ...this.promptConditions[0], id: randomString(6) }));
    },

    remove(index: number) {
      this.currentConditions.splice(index, 1);
    },

    update() {
      this.$emit('update:conditions', this.outputConditions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
