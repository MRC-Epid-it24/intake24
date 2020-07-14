<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat tile>
        <v-toolbar-title class="font-weight-medium">
          <div class="text-h6">{{ $t('schemes.questions.options._') }}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          fab
          small
          color="secondary"
          :title="$t('schemes.questions.options.add')"
          @click.stop="add"
        >
          <v-icon small>fa-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense>
        <draggable v-model="currentOptions" @end="update">
          <transition-group type="transition" name="drag-and-drop">
            <v-list-item
              v-for="(option, idx) in currentOptions"
              :key="option.id"
              class="drag-and-drop__item"
              draggable
              link
            >
              <v-list-item-avatar>
                <v-icon>fa-grip-vertical</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-text-field
                  v-model="option.label"
                  :label="$t('schemes.questions.options.label')"
                  class="mr-3"
                  dense
                  hide-details="auto"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="option.value"
                  :label="$t('schemes.questions.options.value')"
                  :rules="optionValueRules"
                  dense
                  hide-details="auto"
                  outlined
                ></v-text-field>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  :title="$t('schemes.questions.options.remove')"
                  @click.stop="remove(idx)"
                >
                  <v-icon color="error">fa-trash</v-icon>
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
import Vue from 'vue';
import draggable from 'vuedraggable';
import { ListOption } from '@common/types/promptProps';

export default Vue.extend({
  name: 'PromptListOptions',

  components: { draggable },

  props: {
    options: {
      type: Array as () => ListOption[],
      default: [],
    },
  },
  data() {
    const currentOptions: ListOption[] = this.options.map((option, idx) => ({
      id: idx + 1,
      ...option,
    }));

    return { currentOptions };
  },

  computed: {
    outputOptions(): ListOption[] {
      return this.currentOptions.map((item) => {
        const { label, value } = item;
        return { label, value };
      });
    },
    optionValueRules() {
      return [
        (value: string | null): boolean | string => {
          const values = this.currentOptions.filter((item) => item.value === value);
          return values.length < 2 || 'Value is already used.';
        },
      ];
    },
  },

  watch: {
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
