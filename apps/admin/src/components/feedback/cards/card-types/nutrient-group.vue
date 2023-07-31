<template>
  <div>
    <card-content
      v-bind="{ name, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
    ></card-content>
    <card-unit v-bind="{ unit }" @update:unit="update('unit', $event)"></card-unit>
    <card-thresholds
      :thresholds="{ high, low }"
      @update:high="update('high', $event)"
      @update:low="update('low', $event)"
    ></card-thresholds>
    <v-tab-item key="nutrients">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('nutrient-types.current') }}</v-card-title>
            <v-list>
              <transition-group name="drag-and-drop" type="transition">
                <v-list-item
                  v-for="(nutrientType, idx) in currentNutrientTypes"
                  :key="nutrientType.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-avatar>
                    <v-icon>$nutrient-types</v-icon>
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
          <v-divider vertical></v-divider>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('nutrient-types.available') }}</v-card-title>
            <v-text-field
              v-model="search"
              clearable
              hide-details="auto"
              :label="$t('nutrient-types._')"
              outlined
              prepend-inner-icon="$search"
            ></v-text-field>
            <v-list>
              <transition-group name="drag-and-drop" type="transition">
                <v-list-item
                  v-for="nutrientType in visibleNutrientTypes"
                  :key="nutrientType.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-avatar>
                    <v-icon>$nutrient-types</v-icon>
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
                      <v-icon color="info">$add</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
              <v-skeleton-loader
                v-if="nutrientTypesAvailableToLoad"
                v-intersect="tryLoadMoreNutrientTypes"
                type="list-item"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, ref, watch } from 'vue';

import type { NutrientGroupCard } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { useEntry } from '@intake24/admin/stores';

import { CardContent, CardThresholds, CardUnit } from '../partials';

export default defineComponent({
  name: 'NutrientGroupCard',

  components: { CardContent, CardThresholds, CardUnit },

  props: {
    name: {
      type: Object as PropType<NutrientGroupCard['name']>,
      required: true,
    },
    description: {
      type: Object as PropType<NutrientGroupCard['description']>,
      required: true,
    },
    high: {
      type: Object as PropType<NutrientGroupCard['high']>,
      default: null,
    },
    low: {
      type: Object as PropType<NutrientGroupCard['low']>,
      default: null,
    },
    unit: {
      type: Object as PropType<NutrientGroupCard['unit']>,
      required: true,
    },
    nutrientTypes: {
      type: Array as PropType<NutrientGroupCard['nutrientTypes']>,
      required: true,
    },
  },

  setup(props) {
    const currentNutrientTypeIds = ref([...props.nutrientTypes]);
    const search = ref<string | null>(null);
    const filteredNutrientTypes = ref<NutrientTypeEntry[]>([]);
    const visibleNutrientTypes = ref<NutrientTypeEntry[]>([]);

    const allNutrientTypes = computed<NutrientTypeEntry[]>(
      () => useEntry().refs.nutrientTypes ?? []
    );

    const availableNutrientTypes = computed(() =>
      allNutrientTypes.value.filter(
        (nutrient) => !currentNutrientTypeIds.value.includes(nutrient.id)
      )
    );

    const currentNutrientTypes = computed(() =>
      currentNutrientTypeIds.value.reduce<NutrientTypeEntry[]>((acc, nutrientId) => {
        const match = allNutrientTypes.value.find((nutrient) => nutrient.id === nutrientId);

        if (match) acc.push(match);

        return acc;
      }, [])
    );

    const loadFilteredNutrientTypes = () => {
      filteredNutrientTypes.value = search.value
        ? availableNutrientTypes.value.filter(
            (nutrient) => !!nutrient.description.match(new RegExp(search.value, 'i'))
          )
        : [...availableNutrientTypes.value];

      visibleNutrientTypes.value = [];
      loadMoreNutrientTypes();
    };

    const nutrientTypesAvailableToLoad = computed(
      () => visibleNutrientTypes.value.length < filteredNutrientTypes.value.length
    );

    const loadMoreNutrientTypes = () => {
      const startIndex = visibleNutrientTypes.value.length;
      const endIndex =
        startIndex + 15 > filteredNutrientTypes.value.length
          ? filteredNutrientTypes.value.length
          : startIndex + 15;

      const items = filteredNutrientTypes.value.slice(startIndex, endIndex);
      visibleNutrientTypes.value.push(...items);
    };

    const tryLoadMoreNutrientTypes = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && nutrientTypesAvailableToLoad) loadMoreNutrientTypes();
    };

    watch(
      allNutrientTypes,
      () => {
        loadFilteredNutrientTypes();
      },
      { immediate: true }
    );

    watchDebounced(
      search,
      () => {
        loadFilteredNutrientTypes();
      },
      { debounce: 500, maxWait: 1000 }
    );

    return {
      currentNutrientTypeIds,
      currentNutrientTypes,
      allNutrientTypes,
      availableNutrientTypes,
      nutrientTypesAvailableToLoad,
      search,
      visibleNutrientTypes,
      loadFilteredNutrientTypes,
      loadMoreNutrientTypes,
      tryLoadMoreNutrientTypes,
    };
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },

    add(nutrientTypeId: string) {
      this.currentNutrientTypeIds.push(nutrientTypeId);

      this.loadFilteredNutrientTypes();

      this.update('nutrientTypes', this.currentNutrientTypeIds);
    },

    remove(index: number) {
      this.currentNutrientTypeIds.splice(index, 1);

      this.loadFilteredNutrientTypes();

      this.update('nutrientTypes', this.currentNutrientTypeIds);
    },
  },
});
</script>
