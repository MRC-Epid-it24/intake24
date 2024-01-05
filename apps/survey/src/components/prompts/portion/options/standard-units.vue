<template>
  <v-sheet
    v-if="translationsLoaded"
    class="d-flex flex-column gr-1 px-3 py-2 standard-portion"
    color="grey lighten-5"
  >
    <v-chip
      v-for="(unit, index) in standardUnits"
      :key="unit.name"
      class="d-flex flex-grow-1 px-6"
      color="ternary"
      :input-value="index === selectedIndex"
      pill
    >
      <v-icon color="primary" left small>
        {{ index !== selectedIndex ? 'far fa-circle' : 'far fa-circle-dot' }}
      </v-icon>
      <i18n class="font-weight-medium" path="prompts.standardPortion.estimateIn">
        <template #unit>
          {{ translate(unit.inlineEstimateIn ?? standardUnitRefs[unit.name].estimateIn) }}
        </template>
      </i18n>
    </v-chip>
  </v-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { useI18n } from '@intake24/i18n';

import { useStandardUnits } from '../../partials';

type UnitData = {
  name: string;
  inlineEstimateIn?: string;
};

export default defineComponent({
  name: 'PortionStandardUnits',

  props: {
    max: {
      type: Number,
      default: 4,
    },
    method: {
      type: Object as PropType<UserPortionSizeMethod>,
      required: true,
    },
    timer: {
      type: Number,
    },
  },

  setup(props) {
    const { translate } = useI18n();
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const interval = ref<undefined | number>(undefined);
    const selectedIndex = ref<undefined | number>(props.timer ? 0 : undefined);
    const usingStandardTranslations = ref(true);

    const translationsLoaded = computed(() => {
      return usingStandardTranslations.value
        ? Object.keys(standardUnitRefs.value).length > 0
        : true;
    });

    const standardUnits = computed(() => {
      const units: UnitData[] = [];

      const count = Object.keys(props.method.parameters).filter((item) =>
        item.endsWith('-name')
      ).length;

      for (let i = 0; i < count; ++i) {
        units.push({
          name: props.method.parameters[`unit${i}-name`],
          inlineEstimateIn: props.method.parameters[`unit${i}-inline-estimate-in`],
        });
      }

      return units.slice(0, props.max);
    });

    const selectNextStandardUnit = () => {
      if (typeof selectedIndex.value === 'undefined') return;

      selectedIndex.value = (selectedIndex.value + 1) % standardUnits.value.length;
    };

    const startTimer = () => {
      if (!props.timer) return;

      interval.value = setInterval(() => {
        selectNextStandardUnit();
      }, props.timer);
    };

    const clearTimer = () => {
      clearInterval(interval.value);
    };

    onMounted(async () => {
      if (!standardUnits.value.length) return;

      const namesToTranslate = standardUnits.value
        .filter((unit) => unit.inlineEstimateIn === undefined)
        .map((unit) => unit.name);

      if (namesToTranslate.length > 0) {
        await fetchStandardUnits(namesToTranslate);
      } else {
        usingStandardTranslations.value = false;
      }

      selectNextStandardUnit();
      startTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return { translate, standardUnits, standardUnitRefs, selectedIndex, translationsLoaded };
  },
});
</script>

<style lang="scss" scoped>
.standard-portion {
  height: 100%;
  min-height: 180px;

  .v-chip {
    opacity: 0.75;
    pointer-events: none;
    user-select: none;
  }
}
</style>
