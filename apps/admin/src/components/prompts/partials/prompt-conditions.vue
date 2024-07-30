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
            <v-icon left>
              fas fa-location-arrow
            </v-icon>
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
          <v-container>
            <v-row>
              <v-col cols="12">
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
            </v-row>
            <v-row>
              <v-col cols="12">
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
            <v-row>
              <v-col class="pa-0" cols="12">
                <v-card flat>
                  <v-card-title>Condition</v-card-title>
                  <v-card-text>
                    <component :is="condition.property.type" :value.sync="condition.property.check" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
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
  type BooleanProperty,
  type Condition,
  type ConditionObjectId,
  conditionObjectIds,
  conditionObjectPropertyIds,
  type DrinksProperty,
  type EnergyProperty,
  type FlagProperty,
  type ObjectProperty,
  type ObjectPropertyId,
  type PromptAnswerProperty,
  type ValueProperty,
} from '@intake24/common/prompts';
import { mealSections, type PromptSection } from '@intake24/common/surveys';
import { randomString } from '@intake24/common/util';
import { copy } from '@intake24/common/util/objects';

import conditionPartials from './conditions';

const valuePropertyDefaults: ValueProperty = {
  type: 'value',
  check: {
    op: 'eq',
    value: null,
  },
};

const booleanPropertyDefaults: BooleanProperty = {
  type: 'boolean',
  check: {
    value: true,
  },
};

type CommonPropertyDefaults = {
  drinks: DrinksProperty;
  energy: EnergyProperty;
  flag: FlagProperty;
  promptAnswer: PromptAnswerProperty;
};

const commonPropertyDefaults: CommonPropertyDefaults = {
  drinks: {
    id: 'drinks',
    ...booleanPropertyDefaults,
  },
  energy: {
    id: 'energy',
    ...valuePropertyDefaults,
  },
  flag: {
    id: 'flag',
    type: 'flag',
    check: {
      flagId: '',
      value: true,
    },
  },
  promptAnswer: {
    id: 'promptAnswer',
    type: 'promptAnswer',
    check: {
      promptId: '',
      op: 'eq',
      value: null,
      required: true,
    },
  },
};

type PromptConditionDefaults = {
  survey: Record<ObjectPropertyId<'survey'>, ObjectProperty<'survey'>>;
  meal: Record<ObjectPropertyId<'meal'>, ObjectProperty<'meal'>>;
  food: Record<ObjectPropertyId<'food'>, ObjectProperty<'food'>>;
};

const promptConditionDefaults: PromptConditionDefaults = {
  survey: {
    ...commonPropertyDefaults,
    mealCompletion: {
      id: 'mealCompletion',
      type: 'mealCompletion',
      check: {
        completionState: 'searchComplete',
      },
    },
    recallNumber: {
      id: 'recallNumber',
      ...valuePropertyDefaults,
    },
    userName: {
      id: 'userName',
      ...valuePropertyDefaults,
    },
    numberOfMeals: {
      id: 'numberOfMeals',
      ...valuePropertyDefaults,
    },
  },
  meal: {
    ...commonPropertyDefaults,
    mealCompletion: {
      id: 'mealCompletion',
      type: 'mealCompletion',
      check: {
        completionState: 'searchComplete',
      },
    },
  },
  food: {
    ...commonPropertyDefaults,
    foodCategory: {
      id: 'foodCategory',
      ...valuePropertyDefaults,
    },
    foodCompletion: {
      id: 'foodCompletion',
      type: 'foodCompletion',
      check: {
        completionState: 'searchComplete',
      },
    },
    tag: {
      id: 'tag',
      type: 'tag',
      check: {
        tagId: '',
        value: true,
      },
    },
  },
};

function objectHasProperty(objectId: ConditionObjectId, propertyId: string): boolean {
  const propertyIds = conditionObjectPropertyIds.get(objectId);

  if (propertyIds === undefined)
    throw new Error(`Unexpected condition object id: ${objectId}, expected one of ${conditionObjectIds.join(', ')}`);

  return (propertyIds as string[]).includes(propertyId);
}

function getConditionDefaults<T extends ConditionObjectId>(object: T, id: ObjectPropertyId<T>): Condition {
  // TypeScript won't allow doing simply promptConditionDefaults[object][id]
  // so have to do this manually
  switch (object) {
    case 'survey':
      return {
        object: 'survey',
        property: promptConditionDefaults.survey[id],
      };
    case 'meal':
      return {
        object: 'meal',
        property: promptConditionDefaults.meal[id],
      };
    case 'food':
      return {
        object: 'food',
        property: promptConditionDefaults.food[id],
      };
    default:
      throw new Error(`Unexpected context argument: ${object}`);
  }
}

function getDefaultProperty<T extends ConditionObjectId>(objectId: T): ObjectPropertyId<T> {
  const propertyIds = conditionObjectPropertyIds.get(objectId);

  if (propertyIds === undefined)
    throw new Error(`Unexpected condition object id: ${objectId}, expected one of ${conditionObjectIds.join(', ')}`);

  return propertyIds[0] as ObjectPropertyId<T>; // See conditionObjectPropertyIds definition
}

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

        if (this.promptSection === 'foods')
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
      if (objectHasProperty(newObjectId, currentCondition.property.id)) {
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
          copy({ ...getConditionDefaults(newObjectId, getDefaultProperty(newObjectId)), id: currentCondition.id }),
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
        ...getConditionDefaults(defaultObject, getDefaultProperty(defaultObject)),
      }));

      this.selectedCondition = length - 1;
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

<style lang='scss' scoped></style>
