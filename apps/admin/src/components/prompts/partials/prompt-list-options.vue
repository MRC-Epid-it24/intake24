<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat tile>
        <v-toolbar-title class="font-weight-medium">
          <div class="text-h5">{{ $t('survey-schemes.questions.options._') }}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          fab
          small
          :title="$t('survey-schemes.questions.options.add')"
          @click.stop="add"
        >
          <v-icon small>$add</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense>
        <draggable v-model="currentOptions" handle=".drag-and-drop__handle" @end="update">
          <transition-group name="drag-and-drop" type="transition">
            <v-list-item
              v-for="(option, idx) in currentOptions"
              :key="option.id"
              class="drag-and-drop__item"
              draggable
              link
              :ripple="false"
            >
              <v-list-item-avatar class="drag-and-drop__handle">
                <v-icon>$handle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-text-field
                  v-model="option.label"
                  class="mr-3"
                  dense
                  hide-details="auto"
                  :label="$t('survey-schemes.questions.options.label')"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="option.value"
                  dense
                  hide-details="auto"
                  :label="$t('survey-schemes.questions.options.value')"
                  outlined
                  :rules="optionValueRules"
                ></v-text-field>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  :title="$t('survey-schemes.questions.options.remove')"
                  @click.stop="remove(idx)"
                >
                  <v-icon color="error">$delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </transition-group>
        </draggable>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { RuleCallback } from '@intake24/admin/types';
import type { ListOption } from '@intake24/common/prompts';
import { toIndexedList } from '@intake24/admin/util';

export default defineComponent({
  name: 'PromptListOptions',

  components: { draggable },

  props: {
    options: {
      type: Array as PropType<ListOption[]>,
      required: true,
    },
    rules: {
      type: Array as PropType<RuleCallback[]>,
      default: () => [],
    },
  },

  emits: ['update:options'],

  data() {
    const currentOptions = toIndexedList(this.options);

    const defaultValueRules = [
      (value: string | null): boolean | string => {
        const values = currentOptions.filter((item) => item.value === value);
        return values.length < 2 || 'Value is already used.';
      },
    ];

    return { currentOptions, defaultValueRules };
  },

  computed: {
    outputOptions(): ListOption[] {
      return this.currentOptions.map(({ label, value }) => ({ label, value }));
    },
    optionValueRules(): RuleCallback[] {
      return [...this.defaultValueRules, ...this.rules];
    },
  },

  watch: {
    options(val) {
      if (deepEqual(val, this.outputOptions)) return;

      this.currentOptions = toIndexedList(val);
    },
    outputOptions: {
      deep: true,
      handler() {
        this.update();
      },
    },
  },

  methods: {
    add() {
      const size = this.currentOptions.length + 1;
      this.currentOptions.push({ id: size, label: `label-${size}`, value: `value-${size}` });
    },

    remove(index: number) {
      this.currentOptions.splice(index, 1);
    },

    update() {
      this.$emit('update:options', this.outputOptions);
    },
  },
});
</script>

<style lang="scss" scoped></style>
