<template>
  <div>
    <v-tab-item key="content">
      <v-select
        :items="characterTypes"
        :label="$t('feedback-schemes.cards.characterTypes._')"
        :value="characterType"
        hide-details="auto"
        name="characterType"
        outlined
        @change="update('characterType', $event)"
      ></v-select>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import { Character, characterTypes } from '@intake24/common/feedback';
import { defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'CharacterCard',

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
        text: this.$t(`feedback-schemes.cards.characterTypes.${value}`),
      })),
    };
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
</script>
