<template>
  <v-tab-item key="content">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            hide-details="auto"
            :items="characterTypes"
            :label="$t('feedback-schemes.characterTypes._')"
            name="characterType"
            outlined
            :value="characterType"
            @change="update('characterType', $event)"
          >
            <template #item="{ item }">
              <v-avatar class="mr-4 my-2" tile>
                <v-img :alt="item.value" :src="characterImageMap[item.value]"></v-img>
              </v-avatar>
              {{ $t(`feedback-schemes.characterTypes.${item.value}`) }}
            </template>
          </v-select>
        </v-col>
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
            prepend-icon="fas fa-seedling"
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
import { characterTypes } from '@intake24/common/feedback';
import { characterImageMap } from '@intake24/ui/feedback';

import { CharacterSentiments } from '../partials';

export default defineComponent({
  name: 'CharacterCard',

  components: { CharacterSentiments },

  props: {
    characterType: {
      type: String as PropType<Character['characterType']>,
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
      characterTypes: characterTypes.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.characterTypes.${value}`),
      })),
      characterImageMap,
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
