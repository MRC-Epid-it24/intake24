<template>
  <v-row justify="center">
    <v-col cols="auto">
      <div class="d-flex flex-column">
        <div v-if="showAll" class="pa-2">
          <v-btn block @click.stop="setAll">
            {{ $t('prompts.linkedAmount.all') }}
          </v-btn>
        </div>
        <div class="pa-2 d-flex flex-row">
          <div v-if="whole" class="d-flex flex-column align-center">
            <v-card class="d-flex flex-column align-center pa-5 rounded-pill">
              <v-btn
                color="secondary"
                :disabled="maxDisabled"
                icon
                :title="$t('prompts.quantity.more')"
                x-large
                @click="update(1)"
              >
                <v-icon aria-hidden="false">
                  $increment
                </v-icon>
              </v-btn>
              <span class="my-4 font-weight-medium text-h4">{{ wholeLabel }}</span>
              <v-btn
                color="secondary"
                :disabled="minDisabled"
                icon
                :title="$t('prompts.quantity.less')"
                x-large
                @click="update(-1)"
              >
                <v-icon aria-hidden="false">
                  $decrement
                </v-icon>
              </v-btn>
            </v-card>
          </div>
          <div v-if="whole && fraction" class="d-flex flex-column justify-center align-center mx-6">
            <span class="font-weight-medium">{{ $t('prompts.quantity.and') }}</span>
          </div>
          <div v-if="whole" class="d-flex flex-column align-center">
            <v-card class="d-flex flex-column align-center pa-5 rounded-pill">
              <v-btn
                color="secondary"
                :disabled="maxDisabled"
                icon
                :title="$t('prompts.quantity.more')"
                x-large
                @click="update(0.25)"
              >
                <v-icon aria-hidden="false">
                  $increment
                </v-icon>
              </v-btn>
              <span class="my-4 font-weight-medium text-h4">{{ fractionLabel }}</span>
              <v-btn
                color="secondary"
                :disabled="minDisabled"
                icon
                :title="$t('prompts.quantity.less')"
                x-large
                @click="update(-0.25)"
              >
                <v-icon aria-hidden="false">
                  $decrement
                </v-icon>
              </v-btn>
            </v-card>
          </div>
        </div>
        <div class="px-3 d-flex flex-row justify-space-between">
          <span class="font-weight-medium text-button">
            {{ $t('prompts.quantity.whole') }}
          </span>
          <span class="font-weight-medium text-button">
            {{ $t('prompts.quantity.fraction') }}
          </span>
        </div>
        <div class="pa-3">
          <v-btn block color="primary" @click="updateConfirm(true)">
            {{ $t('prompts.quantity.confirm') }}
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
    showAll: {
      type: Boolean,
      default: false,
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

  emits: ['input', 'update:confirm'],

  data() {
    return {
      currentValue: Math.min(this.max, Math.max(this.min, this.value)),
    };
  },

  computed: {
    maxDisabled(): boolean {
      return this.currentValue === this.max;
    },

    minDisabled(): boolean {
      return this.currentValue === this.min;
    },

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

  watch: {
    value(val: number) {
      if (val === this.currentValue)
        return;

      this.currentValue = Math.min(this.max, Math.max(this.min, val));
    },
  },

  methods: {
    setAll() {
      this.update(this.max);
      this.updateConfirm(true);
    },

    update(value: number) {
      this.currentValue = Math.min(this.max, Math.max(this.min, this.currentValue + value));

      this.updateValue();

      if (this.confirm)
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
