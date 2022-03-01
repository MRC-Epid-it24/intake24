<template>
  <v-card width="320px" height="100%" class="d-flex flex-column">
    <v-img max-height="180px" :src="backgroundImage"></v-img>
    <v-card-subtitle class="font-weight-medium">
      <i18n path="feedback.intake.your" tag="div" class="mb-2">
        <template v-slot:nutrient>
          <span>{{ detail.name.toLowerCase() }}</span>
        </template>
        <template v-slot:amount>
          <span :class="detail.textClass">{{ detail.intake }} {{ detail.unit }}</span>
        </template>
      </i18n>
      <div v-if="detail.recommendedIntake" :class="detail.textClass">
        <v-icon left>{{ detail.iconClass }}</v-icon>
        <span>{{ detail.recommendedIntake.toString() }} {{ detail.unit }}</span>
      </div>
    </v-card-subtitle>
    <tell-me-more v-bind="{ detail }" class="mt-auto"></tell-me-more>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/survey/feedback';
import { getDetails, getBackgroundImage } from '.';
import TellMeMore from './tell-me-more.vue';

export default defineComponent({
  name: 'GenericCard',

  components: { TellMeMore },

  props: {
    parameters: {
      type: Object as PropType<FeedbackCardParameters>,
      required: true,
    },
  },

  setup(props) {
    const detail = computed(() => getDetails[props.parameters.type](props.parameters));
    const backgroundImage = computed(() =>
      getBackgroundImage[props.parameters.type](props.parameters)
    );

    return {
      detail,
      backgroundImage,
    };
  },
});
</script>

<style lang="scss" scoped></style>
