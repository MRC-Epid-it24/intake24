<template>
  <v-tab-item key="content">
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
            :value="nutrientTypeIds"
            @change="updateNutrientTypeId($event)"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
    <v-card-title>{{ $t('feedback-schemes.sentiments.title') }}</v-card-title>
    <v-container>
      <character-sentiments
        :value="sentiments"
        @update:sentiments="update('sentiments', $event)"
      ></character-sentiments>
    </v-container>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Character } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { useEntry } from '@intake24/admin/stores';

import { CharacterSentiments } from '../partials';

export default defineComponent({
  name: 'CharacterCard',

  components: { CharacterSentiments },

  props: {
    image: {
      type: String as PropType<Character['image']>,
      required: true,
    },
    nutrientTypeIds: {
      type: Array as PropType<Character['nutrientTypeIds']>,
      required: true,
    },
    sentiments: {
      type: Array as PropType<Character['sentiments']>,
      required: true,
    },
  },

  data() {
    return {
      nutrientTypeIdSearchInput: null as null | string,
    };
  },

  computed: {
    nutrientTypes(): NutrientTypeEntry[] {
      return useEntry().refs.nutrientTypes ?? [];
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },

    updateNutrientTypeId(value: string[]) {
      this.update('nutrientTypeIds', value);
      this.nutrientTypeIdSearchInput = null;
    },
  },
});
</script>
