<template>
  <v-card width="320px" height="100%" class="d-flex flex-column">
    <v-img :src="backgroundImage" :aspect-ratio="16 / 9"></v-img>
    <div v-if="isFiveADay" ref="gaugeRef" class="gauge-container"></div>
    <v-card-subtitle class="font-weight-medium">
      <i18n path="feedback.intake.your" tag="div" class="mb-2">
        <template v-slot:nutrient>
          <span>{{ detail.name.toLowerCase() }}</span>
        </template>
        <template v-slot:amount>
          <span :class="detail.textClass">{{ formatOutput(detail.intake, detail.unit) }}</span>
        </template>
      </i18n>
      <div v-if="detail.recommendedIntake" :class="detail.textClass">
        <v-icon left>{{ detail.iconClass }}</v-icon>
        <span>{{ formatOutput(detail.recommendedIntake, detail.unit) }}</span>
      </div>
    </v-card-subtitle>
    <tell-me-more v-bind="{ detail }" class="mt-auto"></tell-me-more>
  </v-card>
</template>

<script lang="ts">
import type { GaugeInstance } from 'svg-gauge';
import type { PropType } from 'vue';
import SvgGauge from 'svg-gauge';
import { computed, defineComponent, ref, toRefs } from 'vue';

import type { FeedbackCardParameters } from '@intake24/ui/feedback';

import { formatOutput, getBackgroundImage, getDetails } from '.';
import TellMeMore from './tell-me-more.vue';

export default defineComponent({
  name: 'ScreenCard',

  components: { TellMeMore },

  props: {
    parameters: {
      type: Object as PropType<FeedbackCardParameters>,
      required: true,
    },
  },

  setup(props) {
    const { parameters } = toRefs(props);

    const gaugeRef = ref<InstanceType<typeof Element>>();
    const gaugeInstance = ref<GaugeInstance>();

    const detail = computed(() => getDetails[parameters.value.type](parameters.value));
    const backgroundImage = computed(() =>
      getBackgroundImage[parameters.value.type](parameters.value)
    );

    const colorMap = computed(() => [
      '#E64A19',
      '#E64A19',
      '#EF6C00',
      '#EEFF41',
      '#B2FF59',
      '#43A047',
    ]);

    const isFiveADay = parameters.value.type === 'five-a-day';

    return {
      backgroundImage,
      colorMap,
      detail,
      formatOutput,
      gaugeRef,
      gaugeInstance,
      isFiveADay,
    };
  },

  watch: {
    'parameters.portions': {
      handler(val) {
        if (typeof val !== 'number') return;

        this.renderGauge(val);
      },
    },
  },

  mounted() {
    this.renderGauge(this.detail.intake);
  },

  methods: {
    renderGauge(value: number) {
      if (!this.isFiveADay || !this.gaugeRef) return;

      if (!this.gaugeInstance) {
        this.gaugeInstance = SvgGauge(this.gaugeRef, {
          max: 5,
          radius: 40,
          dialStartAngle: 180,
          dialEndAngle: 0,
          showValue: false,
          color: (currentValue: number) => this.colorMap[Math.round(currentValue)],
        });
      }

      this.gaugeInstance.setValue(value);
    },
  },
});
</script>

<style lang="scss">
.gauge-container {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .gauge {
    .dial {
      stroke: #eee7;
      stroke-width: 15;
      fill: rgba(0, 0, 0, 0);
    }

    .value {
      stroke-width: 15;
      fill: rgba(0, 0, 0, 0);
    }
  }
}
</style>
