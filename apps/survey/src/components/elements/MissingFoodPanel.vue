<template>
  <v-expand-transition>
    <v-card v-show="value" ref="card" color="grey lighten-4" outlined>
      <v-card-text class="px-6">
        <div v-html="$t(`prompts.${type}.missing.description`)"></div>
      </v-card-text>
      <v-card-text class="px-6 pt-0 d-flex flex-column flex-md-row align-stretch gap-3">
        <v-btn
          color="secondary"
          large
          outlined
          :title="$t(`prompts.${type}.missing.tryAgain`)"
          @click.stop="cancel"
        >
          <v-icon left>fas fa-repeat</v-icon>
          {{ $t(`prompts.${type}.missing.tryAgain`) }}
        </v-btn>
        <v-btn
          color="secondary"
          large
          outlined
          :title="$t(`prompts.${type}.missing.report`)"
          @click.stop="confirm"
        >
          <v-icon left>fas fa-flag</v-icon>
          {{ $t(`prompts.${type}.missing.report`) }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script lang="ts">
import type { VCard } from 'vuetify/lib';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'MissingFoodPanel',

  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['cancel', 'confirm', 'input'],

  setup(props, { emit }) {
    const card = ref<InstanceType<typeof VCard>>();

    const cancel = () => {
      emit('cancel');
      emit('input', false);
    };

    const confirm = async () => {
      emit('confirm');
    };

    watch(
      () => props.value,
      (value) => {
        if (!value) return;

        setTimeout(async () => {
          if (!card.value) return;

          await card.value.$vuetify.goTo(card.value.$el as HTMLElement, { duration: 1000 });
        }, 100);
      }
    );

    return { card, cancel, confirm };
  },
});
</script>

<style lang="scss" scoped></style>
