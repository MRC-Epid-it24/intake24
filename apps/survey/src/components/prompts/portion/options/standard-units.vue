<template>
  <v-sheet
    v-if="Object.keys(standardUnitRefs).length"
    class="d-flex flex-column gr-3 pa-3 standard-portion"
    color="grey lighten-5"
  >
    <v-chip
      v-for="unit in standardUnits"
      :key="unit"
      class="d-flex flex-grow-1 px-6"
      color="ternary"
      :input-value="unit === selected"
      pill
    >
      <v-icon color="primary" left>
        {{ unit === selected ? 'far fa-circle-dot' : 'far fa-circle' }}
      </v-icon>
      <i18n class="font-weight-medium" path="prompts.standardPortion.estimateIn">
        <template #unit>
          {{ translate(standardUnitRefs[unit].estimateIn) }}
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

export default defineComponent({
  name: 'PortionStandardUnits',

  props: {
    max: {
      type: Number,
      default: 3,
    },
    method: {
      type: Object as PropType<UserPortionSizeMethod>,
      required: true,
    },
    timer: {
      type: Number,
      default: 1500,
    },
  },

  setup(props) {
    const { translate } = useI18n();
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    const interval = ref<undefined | number>(undefined);
    const selected = ref('');

    const standardUnits = computed(() =>
      Object.entries(props.method.parameters)
        .reduce<string[]>((acc, [key, value]) => {
          if (key.endsWith('-name')) acc.push(value);
          return acc;
        }, [])
        .slice(0, props.max)
    );

    const selectNextStandardUnit = () => {
      const keys = Object.keys(standardUnitRefs.value);
      if (!keys.length) {
        clearTimer();
        return;
      }

      const index = keys.findIndex((key) => key === selected.value);

      selected.value = index === keys.length - 1 ? keys[0] : keys[index + 1];
    };

    const startTimer = () => {
      interval.value = setInterval(() => {
        selectNextStandardUnit();
      }, props.timer);
    };

    const clearTimer = () => {
      clearInterval(interval.value);
    };

    onMounted(async () => {
      if (!standardUnits.value.length) return;

      await fetchStandardUnits(standardUnits.value);
      selectNextStandardUnit();
      startTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return { translate, standardUnits, standardUnitRefs, selected };
  },
});
</script>

<style lang="scss" scoped>
@import 'vuetify/src/styles/styles.sass';

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
