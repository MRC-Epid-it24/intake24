<template>
  <div>
    <food-group-content
      v-bind="{ name, description }"
      @update:name="update('name', $event)"
      @update:description="update('description', $event)"
    ></food-group-content>
    <food-group-thresholds
      :thresholds="{ high, low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    ></food-group-thresholds>
    <v-tab-item key="nutrients">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title>
              {{ $t('nutrient-types.current') }}
            </v-card-title>
            <v-list>
              <transition-group type="transition" name="drag-and-drop">
                <v-list-item
                  v-for="(nutrientType, idx) in currentNutrientTypes"
                  :key="nutrientType.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-avatar>
                    <v-icon>fas fa-seedling</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    {{ nutrientType.description }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon :title="$t('nutrient-types.remove')" @click.stop="remove(idx)">
                      <v-icon color="error">$delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('nutrient-types.available') }}</v-card-title>
            <v-list>
              <transition-group type="transition" name="drag-and-drop">
                <v-list-item
                  v-for="nutrientType in availableNutrientTypes"
                  :key="nutrientType.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-avatar>
                    <v-icon>fas fa-seedling</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    {{ nutrientType.description }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      :title="$t('nutrient-types.add')"
                      @click.stop="add(nutrientType.id)"
                    >
                      <v-icon color="blue darken-3">$add</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { NutrientGroupFeedback } from '@intake24/common/feedback';
import { NutrientTypeAttributes } from '@intake24/common/types/models';
import FoodGroupContent from '../partials/food-group-content.vue';
import FoodGroupThresholds from '../partials/food-group-thresholds.vue';

export default defineComponent({
  name: 'NutrientGroup',

  components: { FoodGroupContent, FoodGroupThresholds },

  props: {
    name: {
      type: Object as PropType<NutrientGroupFeedback['name']>,
      required: true,
    },
    description: {
      type: Object as PropType<NutrientGroupFeedback['description']>,
      required: true,
    },
    high: {
      type: Object as PropType<NutrientGroupFeedback['high']>,
    },
    low: {
      type: Object as PropType<NutrientGroupFeedback['low']>,
    },
    nutrientTypes: {
      type: Array as PropType<NutrientGroupFeedback['nutrientTypes']>,
      default: () => [],
    },
  },

  data() {
    return {
      currentNutrientTypeIds: [...this.nutrientTypes],
    };
  },

  computed: {
    allNutrientTypes(): NutrientTypeAttributes[] {
      return this.$store.state.resource.entry.refs.nutrients ?? [];
    },
    currentNutrientTypes(): NutrientTypeAttributes[] {
      return this.currentNutrientTypeIds.reduce<NutrientTypeAttributes[]>((acc, nutrientId) => {
        const match = this.allNutrientTypes.find((nutrient) => nutrient.id === nutrientId);

        if (match) acc.push(match);

        return acc;
      }, []);
    },
    availableNutrientTypes(): NutrientTypeAttributes[] {
      return this.allNutrientTypes.filter(
        (nutrient) => !this.currentNutrientTypeIds.includes(nutrient.id)
      );
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },

    add(nutrientTypeId: string) {
      this.currentNutrientTypeIds.push(nutrientTypeId);

      this.update('nutrientTypes', this.currentNutrientTypeIds);
    },

    remove(index: number) {
      this.currentNutrientTypeIds.splice(index, 1);

      this.update('nutrientTypes', this.currentNutrientTypeIds);
    },
  },
});
</script>
