<template>
  <v-expand-transition>
    <v-card v-show="value" ref="card" class="my-4" color="red lighten-4" outlined>
      <v-card-text class="px-6">
        {{ message }}
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script lang="ts">
import type { TranslateResult } from 'vue-i18n';
import type { VCard } from 'vuetify/lib';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'MissingAllRecipeIngridients',

  props: {
    message: {
      type: String as () => TranslateResult,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const card = ref<InstanceType<typeof VCard>>();
    watch(
      () => props.value,
      (value) => {
        if (!value)
          return;

        setTimeout(async () => {
          if (!card.value)
            return;

          await card.value.$vuetify.goTo(card.value.$el as HTMLElement, { duration: 1000 });
        }, 100);
      },
    );

    return { card };
  },
});
</script>

<style lang="scss" scoped></style>
