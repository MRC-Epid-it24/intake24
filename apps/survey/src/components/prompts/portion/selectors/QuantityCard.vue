<template>
  <v-row justify="center">
    <v-col cols="auto">
      <div class="d-flex flex-column">
        <div class="pa-2 d-flex flex-row">
          <div v-if="whole" class="d-flex flex-column align-center">
            <v-card class="d-flex flex-column align-center pa-5">
              <v-btn color="primary" icon large @click="update(1)">
                <v-icon aria-hidden="false">fas fa-fw fa-plus</v-icon>
              </v-btn>
              <span class="my-4 font-weight-medium text-h5">{{ wholeLabel }}</span>
              <v-btn color="primary" icon large @click="update(-1)">
                <v-icon aria-hidden="false">fas fa-fw fa-minus</v-icon>
              </v-btn>
            </v-card>
          </div>
          <div v-if="whole && fraction" class="d-flex flex-column justify-center align-center mx-6">
            <span class="font-weight-medium">{{ $t('portion.quantity.and') }}</span>
          </div>
          <div v-if="whole" class="d-flex flex-column align-center">
            <v-card class="d-flex flex-column align-center pa-5">
              <v-btn color="primary" icon large @click="update(0.25)">
                <v-icon aria-hidden="false">fas fa-fw fa-plus</v-icon>
              </v-btn>
              <span class="my-4 font-weight-medium text-h5">{{ fractionLabel }}</span>
              <v-btn color="primary" icon large @click="update(-0.25)">
                <v-icon aria-hidden="false">fas fa-fw fa-minus</v-icon>
              </v-btn>
            </v-card>
          </div>
        </div>
        <div class="px-3 d-flex flex-row justify-space-between">
          <span class="font-weight-medium text-button">
            {{ $t('portion.quantity.whole') }}
          </span>
          <span class="font-weight-medium text-button">
            {{ $t('portion.quantity.fraction') }}
          </span>
        </div>
        <div class="pa-3">
          <v-btn block color="success" @click="updateConfirm(true)">
            {{ $t('portion.quantity.confirm') }}
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuantityCard',

  props: {
    min: {
      type: Number,
      default: 0.25,
    },
    max: {
      type: Number,
      default: 30,
    },
    value: {
      type: Number,
      default: 1,
    },
    confirm: {
      type: Boolean,
      default: true,
    },
    fraction: {
      type: Boolean,
      default: true,
    },
    whole: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      currentValue: Math.min(this.max, Math.max(this.min, this.value)),
    };
  },

  computed: {
    fractionLabel(): string {
      const fraction = this.currentValue - Math.floor(this.currentValue);

      switch (fraction) {
        case 0.25:
          return '¼';
        case 0.5:
          return '½';
        case 0.75:
          return '¾';
        default:
          return fraction.toString();
      }
    },

    wholeLabel(): string {
      return Math.floor(this.currentValue).toString();
    },
  },

  methods: {
    update(value: number) {
      this.currentValue = Math.min(this.max, Math.max(this.min, this.currentValue + value));

      this.updateValue();
      this.updateConfirm(false);
    },

    updateConfirm(value: boolean) {
      this.$emit('update:confirm', value);
    },

    updateValue() {
      this.$emit('input', this.currentValue);
    },
  },
});
</script>

<style></style>
