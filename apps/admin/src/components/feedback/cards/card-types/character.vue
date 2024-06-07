<template>
  <div>
    <v-tab-item key="content" value="content">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              hide-details="auto"
              item-text="description"
              item-value="id"
              :items="nutrientTypes"
              :label="$t('nutrient-types._')"
              multiple
              name="nutrientTypeIds"
              outlined
              prepend-inner-icon="$nutrient-types"
              :search-input.sync="nutrientTypeIdSearchInput"
              :value="value.nutrientTypeIds"
              @change="updateNutrientTypeId($event)"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-title>{{ $t('feedback-schemes.sentiments.title') }}</v-card-title>
      <v-container>
        <character-sentiments
          :value="value.sentiments"
          @update:sentiments="update('sentiments', $event)"
        />
      </v-container>
    </v-tab-item>
    <v-tab-item key="json" value="json">
      <json-editor v-bind="{ value }" @input="$emit('input', $event)" />
    </v-tab-item>
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
    value: {
      type: Object as PropType<Character>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const nutrientTypeIdSearchInput = ref<null | string>(null);

    const nutrientTypes = computed<NutrientTypeAttributes>(() => useEntry().refs.nutrientTypes ?? []);

    const update = (field: string, value: any) => {
      emit('input', { ...props.value, [field]: value });
    };

    const updateNutrientTypeId = (value: string[]) => {
      update('nutrientTypeIds', value);
      nutrientTypeIdSearchInput.value = null;
    };

    return { nutrientTypes, nutrientTypeIdSearchInput, update, updateNutrientTypeId };
  },
});
</script>
