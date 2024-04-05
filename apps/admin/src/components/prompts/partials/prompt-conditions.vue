<template>
  <v-tab-item key="conditions" value="conditions">
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
          <v-card-text class="px-0">
            <code class="pa-5 d-flex">
              {{ $t(`survey-schemes.conditions.showIf`) }}
              '{{
                $t(`survey-schemes.conditions.exTypes.${condition.type}`, {
                  ...condition.props,
                })
              }}'
              <v-icon left right small>{{ opToIconMap[condition.op] }}</v-icon>
              '{{ condition.value }}'
            </code>
          </v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="condition.type"
                  hide-details="auto"
                  item-value="type"
                  :items="conditionSelectList"
                  :label="$t('survey-schemes.conditions.types._')"
                  outlined
                  @change="updatePromptCondition(idx, $event)"
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
                  @change="updateValueType(idx)"
                >
                  <template #item="{ item }">
                    <v-icon left>{{ opToIconMap[item.op] }}</v-icon>
                    {{ item.text }}
                  </template>
                  <template #selection="{ item }">
                    <v-icon left>{{ opToIconMap[item.op] }}</v-icon>
                    {{ item.text }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <component
                  :is="comboOps.includes(condition.op) ? 'v-combobox' : 'v-text-field'"
                  v-model="condition.value"
                  hide-details="auto"
                  :label="$t('survey-schemes.conditions.value')"
                  multiple
                  outlined
                ></component>
              </v-col>
            </v-row>
            <component :is="condition.type" v-bind.sync="condition.props"></component>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="error" text @click="remove(idx)">
              <v-icon left>$delete</v-icon>{{ $t('survey-schemes.conditions.remove') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';
import { VCombobox, VTextField } from 'vuetify/lib';

import type { Condition, ConditionOp, ConditionType } from '@intake24/common/prompts';
import { withIdList } from '@intake24/admin/util';
import { conditionOps } from '@intake24/common/prompts';
import { copy, randomString } from '@intake24/common/util';

import conditionProps from './conditions';

const opToIconMap: Record<ConditionOp, string> = {
  eq: 'fas fa-equals',
  ne: 'fas fa-not-equal',
  in: 'far fa-circle-dot',
  notIn: 'far fa-circle',
  gte: 'fas fa-greater-than-equal',
  gt: 'fas fa-greater-than',
  lte: 'fas fa-less-than-equal',
  lt: 'fas fa-less-than',
};

const promptConditions: Condition[] = [
  {
    type: 'drinks',
    op: 'eq',
    value: '',
    props: {
      section: 'survey',
    },
  },
  {
    type: 'energy',
    op: 'eq',
    value: '',
    props: {
      section: 'survey',
    },
  },
  {
    type: 'flag',
    op: 'eq',
    value: '',
    props: {
      section: 'survey',
    },
  },
  {
    type: 'foodCategory',
    op: 'eq',
    value: '',
    props: {},
  },
  {
    type: 'meals',
    op: 'eq',
    value: '',
    props: {},
  },
  {
    type: 'promptAnswer',
    op: 'eq',
    value: '',
    props: {
      promptId: '',
      section: 'survey',
    },
  },
  {
    type: 'recallNumber',
    op: 'eq',
    value: '',
    props: {},
  },
  {
    type: 'property',
    op: 'eq',
    value: '',
    props: {
      name: 'userName',
    },
  },
];

export default defineComponent({
  name: 'PromptConditions',

  components: { VTextField, VCombobox, draggable, ...conditionProps },

  props: {
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
  },

  emits: ['update:conditions'],

  data() {
    return {
      comboOps: ['eq', 'ne', 'in', 'notIn'],
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
      if (deepEqual(val, this.outputConditions)) return;

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

      this.currentConditions.splice(
        idx,
        1,
        copy({ ...condition, id: this.currentConditions[idx].id })
      );
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

    updateValueType(idx: number) {
      const condition = this.currentConditions[idx];

      if (this.comboOps.includes(condition.op) && !Array.isArray(condition.value)) {
        this.currentConditions[idx].value = condition.value ? [condition.value] : [];
        return;
      }

      if (!this.comboOps.includes(condition.op) && typeof condition.value !== 'string') {
        this.currentConditions[idx].value = condition.value.toString();
        return;
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
