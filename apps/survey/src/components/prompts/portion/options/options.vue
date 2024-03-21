<template>
  <v-sheet class="d-flex flex-column gr-1 px-3 py-2 portion-options" color="grey lighten-5">
    <v-chip
      v-for="option in localeOptions"
      :key="option.value"
      class="d-flex flex-grow-1 px-6"
      color="ternary"
      :input-value="selected !== undefined && option.value === localeOptions[selected].value"
      pill
    >
      <v-icon color="primary" left small>
        {{
          selected === undefined || option.value !== localeOptions[selected].value
            ? 'far fa-circle'
            : 'far fa-circle-dot'
        }}
      </v-icon>
      <span class="font-weight-medium">{{ option.label }}</span>
    </v-chip>
  </v-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ZodNumber } from 'zod';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import type { LocaleOptionList, PortionSizeParameters } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'PortionOptions',

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
    const { i18n } = useI18n();

    const interval = ref<undefined | number>(undefined);
    const selected = ref<undefined | number>(props.timer ? 0 : undefined);
    const options = computed<LocaleOptionList<ZodNumber>>(() => {
      const { method, parameters } = props.method;
      return ((method === 'parent-food-portion'
        ? (parameters as PortionSizeParameters['parent-food-portion']).options._default
        : (parameters as PortionSizeParameters['parent-food-portion']).options) ?? {
        en: [],
      }) as LocaleOptionList<ZodNumber>;
    });
    const localeOptions = computed(() =>
      (options.value[i18n.locale] ?? options.value.en).slice(0, props.max)
    );

    const selectNext = () => {
      if (typeof selected.value === 'undefined') return;

      selected.value = selected.value === localeOptions.value.length - 1 ? 0 : selected.value + 1;
    };

    const startTimer = () => {
      if (!props.timer) return;

      interval.value = setInterval(() => {
        selectNext();
      }, props.timer);
    };

    const clearTimer = () => {
      clearInterval(interval.value);
    };

    onMounted(async () => {
      if (!localeOptions.value.length) return;

      selectNext();
      startTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return { localeOptions, selected };
  },
});
</script>

<style lang="scss" scoped>
.portion-options {
  height: 100%;
  min-height: 180px;

  .v-chip {
    opacity: 0.75;
    pointer-events: none;
    user-select: none;
  }
}
</style>
