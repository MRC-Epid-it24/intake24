<template>
  <v-tab-item key="conditions" value="conditions">
    <v-tabs v-model="selectedCondition" vertical>
      <v-btn class="my-4" color="primary" @click="add">
        <v-icon left>
          $add
        </v-icon>
        {{ $t(`survey-schemes.conditions.add`) }}
      </v-btn>
      <draggable v-model="currentConditions" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-tab v-for="condition in currentConditions" :key="condition.id">
            <div v-if="condition.orPrevious" style="position: absolute; top: -0.6em;">
              OR
            </div>
            {{ $t(`survey-schemes.conditions.property.${condition.property.id}`) }}
          </v-tab>
        </transition-group>
      </draggable>
      <v-tab-item v-for="(condition, idx) in currentConditions" :key="condition.id">
        <v-card class="mx-4" outlined>
          <v-card-title>
            <v-icon left>
              fas fa-location-arrow
            </v-icon>
            {{ $t(`survey-schemes.conditions.property.${condition.property.id}`) }}
          </v-card-title>
          <v-card-text class="px-0">
            <condition-summary :condition="condition" />
          </v-card-text>
          <v-card-text>
            <v-row v-if="idx !== 0">
              <v-col cols="12" md="6">
                <v-checkbox

                  v-model="condition.orPrevious"
                  class="mt-0"
                  hide-details="auto"
                  :label="$t(`survey-schemes.conditions.orPrevious`)"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  hide-details="auto"
                  item-value="object"
                  :items="objectSelectList"
                  :label="$t('survey-schemes.conditions.object._')"
                  outlined
                  :value="condition.object"
                  @change="updatePromptConditionObject(idx, $event)"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  hide-details="auto"
                  item-value="type"
                  :items="propertySelectList[condition.object]"
                  :label="$t('survey-schemes.conditions.property._')"
                  outlined
                  :value="condition.property.id"
                  @change="updatePromptConditionProperty(idx, $event)"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title>{{ $t(`survey-schemes.conditions._`) }}</v-card-title>
          <v-card-text>
            <component :is="condition.property.type" :value.sync="condition.property.check" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="font-weight-bold" color="error" text @click="remove(idx)">
              <v-icon left>
                $delete
              </v-icon>
              {{ $t('survey-schemes.conditions.remove') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-tab-item>
</template>

<script lang='ts'>
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { mapValues } from 'lodash';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import { withIdList } from '@intake24/admin/util';
import {
  type Condition,
  conditionObjectHasProperty,
  type ConditionObjectId,
  conditionObjectIds,
  getConditionDefaults,
  getDefaultConditionProperty,
  type ObjectPropertyId,
  promptConditionDefaults,
} from '@intake24/common/prompts';
import { foodSections, mealSections, type PromptSection } from '@intake24/common/surveys';
import { randomString } from '@intake24/common/util';
import { copy } from '@intake24/common/util/objects';

import conditionPartials from './conditions';

export default defineComponent({
  name: 'PromptConditions',

  components: { Draggable: draggable, ...conditionPartials.check, ConditionSummary: conditionPartials.summary },

  props: {
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
    promptSection: {
      type: String as PropType<PromptSection>,
      required: false,
    },
  },

  emits: ['update:conditions'],

  data() {
    return {
      currentConditions: withIdList(this.conditions),
      selectedCondition: 0,
    };
  },

  computed: {
    objectSelectList(): { object: ConditionObjectId; text: string }[] {
      const allowedObjects: ConditionObjectId[] = ['survey'];

      if (this.promptSection !== undefined) {
        if ((mealSections as readonly string[]).includes(this.promptSection))
          allowedObjects.push('meal');

        if ((foodSections as readonly string[]).includes(this.promptSection))
          allowedObjects.push('food');
      }

      return allowedObjects.map (object => ({ object, text: this.$t(`survey-schemes.conditions.object.${object}`).toString() }));
    },

    propertySelectList(): Record<ConditionObjectId, { type: string; text: string }[]> {
      return mapValues(promptConditionDefaults, properties => Object.keys(properties).map(id => ({ type: id, text: this.$t(`survey-schemes.conditions.property.${id}`).toString() })));
    },

    outputConditions(): Condition[] {
      return this.currentConditions.map(({ id, ...rest }) => rest);
    },
  },

  watch: {
    conditions(val) {
      if (deepEqual(val, this.outputConditions))
        return;

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
    updatePromptConditionObject(idx: number, newObjectId: ConditionObjectId) {
      const currentCondition = this.currentConditions[idx];

      if (currentCondition.object === newObjectId)
        return;

      // If currently selected property is compatible with the new object, keep current property settings
      if (conditionObjectHasProperty(newObjectId, currentCondition.property.id)) {
        this.currentConditions.splice(
          idx,
          1,
          // Type cast required since we don't know if new object has the same property at compile time
          copy({ ...currentCondition, object: newObjectId } as Condition & { id: string }),
        );
      }
      // Otherwise reset it to default property for that object
      else {
        this.currentConditions.splice(
          idx,
          1,
          copy({ ...getConditionDefaults(newObjectId, getDefaultConditionProperty(newObjectId)), id: currentCondition.id }),
        );
      }
    },

    updatePromptConditionProperty(idx: number, newPropertyId: string) {
      const currentCondition = this.currentConditions[idx];

      if (currentCondition.property.id === newPropertyId)
        return;

      this.currentConditions.splice(
        idx,
        1,
        copy({ ...getConditionDefaults(currentCondition.object, newPropertyId as ObjectPropertyId<ConditionObjectId>), id: currentCondition.id }),
      );
    },

    add() {
      const defaultObject = conditionObjectIds[0];

      const length = this.currentConditions.push(copy({
        id: randomString(6),
        ...getConditionDefaults(defaultObject, getDefaultConditionProperty(defaultObject)),
      }));

      this.selectedCondition = length - 1;
    },

    remove(index: number) {
      this.currentConditions.splice(index, 1);
      if (this.currentConditions.length > 0)
        this.currentConditions[0].orPrevious = false;
    },

    update() {
      this.$emit('update:conditions', this.outputConditions);
    },
  },
});
</script>

<style lang='scss' scoped></style>
