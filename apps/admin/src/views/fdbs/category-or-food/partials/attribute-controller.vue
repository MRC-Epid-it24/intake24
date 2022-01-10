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
          <v-btn outlined @click="toggleInherit('sameAsBeforeOption')">
            {{ title('sameAsBeforeOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.sameAsBeforeOption"
            :disabled="isInherited('sameAsBeforeOption')"
            :error-messages="errors.get('main.attributes.sameAsBeforeOption')"
            :label="$t('fdbs.attributes.sameAsBeforeOption')"
            class="mt-0"
            hide-details="auto"
            name="attributes.sameAsBeforeOption"
            @change="errors.clear('main.attributes.sameAsBeforeOption')"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" align-self="center">
          <v-btn outlined @click="toggleInherit('readyMealOption')">
            {{ title('readyMealOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.readyMealOption"
            :disabled="isInherited('readyMealOption')"
            :error-messages="errors.get('main.attributes.readyMealOption')"
            :label="$t('fdbs.attributes.readyMealOption')"
            class="mt-0"
            hide-details="auto"
            name="attributes.readyMealOption"
            @change="errors.clear('main.attributes.readyMealOption')"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" align-self="center">
          <v-btn outlined @click="toggleInherit('reasonableAmount')">
            {{ title('reasonableAmount') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-text-field
            v-model.number="attributes.reasonableAmount"
            :disabled="isInherited('reasonableAmount')"
            :error-messages="errors.get('main.attributes.reasonableAmount')"
            :label="$t('fdbs.attributes.reasonableAmount')"
            dense
            hide-details="auto"
            name="attributes.reasonableAmount"
            outlined
            @input="errors.clear('main.attributes.reasonableAmount')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" align-self="center">
          <v-btn outlined @click="toggleInherit('useInRecipes')">
            {{ title('useInRecipes') }}
          </v-btn>
        </v-col>
        <v-col cols align-self="center">
          <v-select
            v-model="attributes.useInRecipes"
            :disabled="isInherited('useInRecipes')"
            :error-messages="errors.get('main.attributes.useInRecipes')"
            :label="$t('fdbs.attributes.useInRecipes._')"
            :items="useInRecipeTypes"
            dense
            hide-details="auto"
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
import Vue from 'vue';
import isEqual from 'lodash/isEqual';
import {
  Attributes,
  AttributeType,
  Nullable,
  useInRecipeTypes,
} from '@intake24/common/types/models';
import { Errors } from '@intake24/common/util';

const defaultAttributes: Attributes = {
  sameAsBeforeOption: false,
  readyMealOption: false,
  reasonableAmount: 0,
  useInRecipes: 0,
};

export default Vue.extend({
  name: 'AttributeController',

  props: {
    value: {
      type: Object as () => Nullable<Attributes>,
      required: true,
    },
    errors: {
      type: Object as () => typeof Errors,
      required: true,
    },
  },

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
