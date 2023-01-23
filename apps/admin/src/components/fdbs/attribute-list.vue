<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.attributes.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <v-btn :disabled="disabled" outlined @click="toggleInherit('sameAsBeforeOption')">
            {{ title('sameAsBeforeOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.sameAsBeforeOption"
            class="mt-0"
            :disabled="isInherited('sameAsBeforeOption')"
            :error-messages="errors.get('main.attributes.sameAsBeforeOption')"
            hide-details="auto"
            :label="$t('fdbs.attributes.sameAsBeforeOption')"
            name="attributes.sameAsBeforeOption"
            @change="errors.clear('main.attributes.sameAsBeforeOption')"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" outlined @click="toggleInherit('readyMealOption')">
            {{ title('readyMealOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.readyMealOption"
            class="mt-0"
            :disabled="isInherited('readyMealOption')"
            :error-messages="errors.get('main.attributes.readyMealOption')"
            hide-details="auto"
            :label="$t('fdbs.attributes.readyMealOption')"
            name="attributes.readyMealOption"
            @change="errors.clear('main.attributes.readyMealOption')"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" outlined @click="toggleInherit('reasonableAmount')">
            {{ title('reasonableAmount') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-text-field
            v-model.number="attributes.reasonableAmount"
            dense
            :disabled="isInherited('reasonableAmount')"
            :error-messages="errors.get('main.attributes.reasonableAmount')"
            hide-details="auto"
            :label="$t('fdbs.attributes.reasonableAmount')"
            name="attributes.reasonableAmount"
            outlined
            @input="errors.clear('main.attributes.reasonableAmount')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" outlined @click="toggleInherit('useInRecipes')">
            {{ title('useInRecipes') }}
          </v-btn>
        </v-col>
        <v-col align-self="center" cols>
          <v-select
            v-model="attributes.useInRecipes"
            dense
            :disabled="isInherited('useInRecipes')"
            :error-messages="errors.get('main.attributes.useInRecipes')"
            hide-details="auto"
            :items="useInRecipeTypes"
            :label="$t('fdbs.attributes.useInRecipes._')"
            name="attributes.useInRecipes"
            outlined
            @change="errors.clear('main.attributes.useInRecipes')"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { Nullable } from '@intake24/common/types';
import type { Attributes, AttributeType } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';
import { useInRecipeTypes } from '@intake24/common/types/models';

const defaultAttributes: Attributes = {
  sameAsBeforeOption: false,
  readyMealOption: false,
  reasonableAmount: 0,
  useInRecipes: 0,
};

export default defineComponent({
  name: 'AttributeList',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<Errors>,
      required: true,
    },
    value: {
      type: Object as PropType<Nullable<Attributes>>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    return {
      defaultAttributes,
      attributes: { ...this.value } as Nullable<Attributes>,
      useInRecipeTypes: Object.values(useInRecipeTypes).map((value) => ({
        value,
        text: this.$t(`fdbs.attributes.useInRecipes.${value}`),
      })),
    };
  },

  watch: {
    value(val: Attributes) {
      this.attributes = { ...val };
    },
    attributes: {
      handler(val: Attributes, oldVal: Attributes) {
        if (isEqual(oldVal, val)) return;

        this.$emit('input', { ...val });
      },
      deep: true,
    },
  },

  methods: {
    isInherited(attribute: AttributeType) {
      return this.attributes[attribute] === null;
    },

    title(attribute: AttributeType): string {
      const key = this.attributes[attribute] === null ? 'override' : 'inherit';
      return this.$t(`fdbs.attributes.${key}`).toString();
    },

    toggleInherit(attribute: AttributeType) {
      if (this.attributes[attribute] !== null) {
        this.attributes[attribute] = null;
        return;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error it doesn't narrow the type correctly
      this.attributes[attribute] = this.defaultAttributes[attribute];
    },
  },
});
</script>
