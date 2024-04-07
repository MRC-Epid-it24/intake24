<template>
  <v-card class="card-screen d-flex flex-column" :color="detail.color" height="100%">
    <v-img :aspect-ratio="16 / 9" :src="backgroundImage" />
    <!-- <div v-if="isFiveADay" ref="gaugeRef" class="gauge-container"></div> -->
    <v-card-subtitle class="font-weight-medium" :class="textColor">
      <i18n class="mb-2" path="feedback.intake.your" tag="div">
        <template #nutrient>
          <span>{{ detail.name.toLowerCase() }}</span>
        </template>
        <template #amount>
          <span :class="textColor ?? detail.textClass">
            {{ formatOutput(detail.intake, detail.unit) }}
          </span>
        </template>
      </i18n>
      <div v-if="detail.recommendedIntake" :class="textColor ?? detail.textClass">
        <v-icon left>
          {{ detail.iconClass }}
        </v-icon>
        <span>{{ formatOutput(detail.recommendedIntake.toString(), detail.unit) }}</span>
      </div>
    </v-card-subtitle>
    <v-card-text class="flex-grow-1" :class="textColor">
      <div class="card-screen__summary" v-html="detail.summary" />
    </v-card-text>
    <tell-me-more v-bind="{ detail, textColor }" />
  </v-card>
</template>

<script lang="ts">
/* import type { GaugeInstance } from 'svg-gauge';
import SvgGauge from 'svg-gauge'; */
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { FeedbackCardParameters } from '@intake24/ui/feedback';
import { getContrastYIQ } from '@intake24/ui/util';

import TellMeMore from './tell-me-more.vue';
import { useCard } from './use-card';

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
    /* const gaugeRef = ref<InstanceType<typeof Element>>();
    const gaugeInstance = ref<GaugeInstance>(); */

    const { backgroundImage, detail, formatOutput } = useCard(props);

    const textColor = computed(() =>
      getContrastYIQ(detail.value.color) < 128 ? 'white--text' : undefined,
    );

    /* const colorMap = computed(() => [
      '#E64A19',
      '#E64A19',
      '#EF6C00',
      '#EEFF41',
      '#B2FF59',
      '#43A047',
    ]);

    const isFiveADay = props.parameters.type === 'five-a-day'; */

    return {
      backgroundImage,
      detail,
      formatOutput,
      textColor,
    };
  },

  /* watch: {
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
  }, */
});
</script>

<style lang="scss">
.card-screen {
  .card-screen__summary p {
    margin-bottom: 4px !important;
  }
}

/* .gauge-container {
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
} */
</style>
