<template>
  <v-expand-transition>
    <v-card v-show="modelValue" ref="card" border class="my-4" color="red-lighten-4">
      <v-card-text class="px-6">
        {{ message }}
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script lang="ts" setup>
import { useTemplateRef, watch } from 'vue';
import { useGoTo } from 'vuetify';

defineOptions({ name: 'MissingAllRecipeIngridients' });

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const card = useTemplateRef('card');
const goTo = useGoTo();

watch(
  () => props.modelValue,
  (value) => {
    if (!value)
      return;

    setTimeout(async () => {
      if (!card.value)
        return;

      await goTo(card.value.$el as HTMLElement, { duration: 1000 });
    }, 100);
  },
);
</script>

<style lang="scss" scoped></style>
