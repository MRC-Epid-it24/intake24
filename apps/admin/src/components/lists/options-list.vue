<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat tile>
        <v-toolbar-title class="font-weight-medium">
          <div class="text-h5">
            {{ $t('common.options._') }}
          </div>
        </v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" icon="$add" size="small" :title="$t('common.options.add')" @click.stop="add" />
      </v-toolbar>
      <v-divider />
      <v-list density="compact">
        <vue-draggable
          v-model="currentOptions"
          :animation="300"
          handle=".drag-and-drop__handle"
          @end="update"
        >
          <v-list-item
            v-for="(option, idx) in currentOptions"
            :key="option.id"
            class="drag-and-drop__item"
            :ripple="false"
          >
            <template #prepend>
              <v-avatar class="drag-and-drop__handle" icon="$handle" />
            </template>
            <div class="options-list__item flex-column flex-lg-row align-stretch align-lg-stretch">
              <v-text-field
                v-model="option.label"
                density="compact"
                hide-details="auto"
                :label="$t('common.options.label')"
                variant="outlined"
              />
              <v-text-field
                v-model="option.value"
                density="compact"
                hide-details="auto"
                :label="$t('common.options.value')"
                :rules="optionValueRules"
                variant="outlined"
              />
              <v-switch
                v-if="exclusive"
                v-model="option.exclusive"
                class="mt-0"
                hide-details="auto"
                :label="$t('common.options.exclusive')"
              />
            </div>
            <template #append>
              <v-list-item-action>
                <v-btn color="error" icon="$delete" :title="$t('common.options.remove')" @click.stop="remove(idx)" />
              </v-list-item-action>
            </template>
          </v-list-item>
        </vue-draggable>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ZodNumber, ZodString } from 'zod';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import type { RuleCallback } from '@intake24/admin/types';
import type { ListOption } from '@intake24/common/types';
import { toIndexedList } from '@intake24/admin/util';

export default defineComponent({
  name: 'OptionsList',

  components: { VueDraggable },

  props: {
    exclusive: {
      type: Boolean,
    },
    options: {
      type: Array as PropType<ListOption<ZodString | ZodNumber>[]>,
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
        const values = currentOptions.filter(item => item.value === value);
        return values.length < 2 || 'Value is already used.';
      },
    ];

    return { currentOptions, defaultValueRules };
  },

  computed: {
    outputOptions(): ListOption<ZodString | ZodNumber>[] {
      return this.currentOptions.map(({ id, ...rest }) => (rest));
    },
    optionValueRules(): RuleCallback[] {
      return [...this.defaultValueRules, ...this.rules];
    },
  },

  watch: {
    options(val) {
      if (deepEqual(val, this.outputOptions))
        return;

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

<style lang="scss" scoped>
.options-list__item {
  gap: 0.5rem;
}
</style>
