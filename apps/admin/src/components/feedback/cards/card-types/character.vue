<template>
  <div>
    <v-tabs-window-item key="content" value="content">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model:search-input="nutrientTypeIdSearchInput"
              hide-details="auto"
              item-title="description"
              item-value="id"
              :items="nutrientTypes"
              :label="$t('nutrient-types._')"
              :model-value="modelValue.nutrientTypeIds"
              multiple
              name="nutrientTypeIds"
              prepend-inner-icon="$nutrient-types"
              variant="outlined"
              @update:model-value="updateNutrientTypeId($event)"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-title>{{ $t('feedback-schemes.sentiments.title') }}</v-card-title>
      <v-container>
        <character-sentiments
          :model-value="modelValue.sentiments"
          @update:model-value="update('sentiments', $event)"
        />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item key="json" value="json">
      <json-editor v-bind="{ modelValue }" @update:model-value="$emit('update:modelValue', $event)" />
    </v-tabs-window-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { Character } from '@intake24/common/feedback';
import type { NutrientTypeAttributes } from '@intake24/common/types/http/admin';
import { JsonEditor } from '@intake24/admin/components/editors';
import { useEntry } from '@intake24/admin/stores';

import { CharacterSentiments } from '../partials';

export default defineComponent({
  name: 'CharacterCard',

  components: { CharacterSentiments, JsonEditor },

  props: {
    modelValue: {
      type: Object as PropType<Character>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const nutrientTypeIdSearchInput = ref<null | string>(null);

    const nutrientTypes = computed<NutrientTypeAttributes[]>(() => useEntry().refs.nutrientTypes ?? []);

    const update = (field: string, value: any) => {
      emit('update:modelValue', { ...props.modelValue, [field]: value });
    };

    const updateNutrientTypeId = (value: string[]) => {
      update('nutrientTypeIds', value);
      nutrientTypeIdSearchInput.value = null;
    };

    return { nutrientTypes, nutrientTypeIdSearchInput, update, updateNutrientTypeId };
  },
});
</script>
