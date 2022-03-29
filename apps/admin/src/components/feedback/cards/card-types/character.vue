<template>
  <v-tab-item key="content">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :items="characterTypes"
            :label="$t('feedback-schemes.characterTypes._')"
            :value="characterType"
            hide-details="auto"
            name="characterType"
            outlined
            @change="update('characterType', $event)"
          >
            <template v-slot:item="{ item }">
              <v-avatar tile class="mr-4 my-2">
                <v-img :src="characterImageMap[item.value]" :alt="item.value"></v-img>
              </v-avatar>
              {{ $t(`feedback-schemes.characterTypes.${item.value}`) }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :items="nutrientTypes"
            :label="$t('nutrient-types._')"
            :value="nutrientTypeIds"
            hide-details="auto"
            item-text="description"
            item-value="id"
            multiple
            name="nutrientTypeIds"
            outlined
            prepend-icon="fas fa-seedling"
            @change="update('nutrientTypeIds', $event)"
          ></v-select>
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
import { useEntry } from '@intake24/admin/stores';
import { Character, characterTypes } from '@intake24/common/feedback';
import { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { characterImageMap } from '@intake24/ui/feedback';
import { defineComponent, PropType } from '@vue/composition-api';
import CharacterSentiments from '../partials/character-sentiments.vue';

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
  },
});
</script>
