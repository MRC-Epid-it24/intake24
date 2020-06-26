<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-switch
        :input-value="validation.required"
        :label="$t('schemes.questions.validation.required')"
        hide-details="auto"
        @change="$emit('update:validation.required', $event)"
      ></v-switch>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :value="validation.message"
        :disabled="!validation.required"
        :label="$t('schemes.questions.validation.message')"
        hide-details="auto"
        outlined
        @input="$emit('update:validation.message', $event)"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-sheet color="grey" height="2px" width="100%"></v-sheet>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :value="text"
        :label="$t('schemes.questions.text')"
        :rules="textRules"
        hide-details="auto"
        outlined
        @input="$emit('update:text', $event)"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="mt-4 mb-2">{{ $t('schemes.questions.description') }}</v-label>
      <editor
        :init="tinymceInit"
        :value="description"
        @input="$emit('update:description', $event)"
      />
    </v-col>
    <v-col cols="12">
      <v-sheet color="grey" height="2px" width="100%"></v-sheet>
    </v-col>
    <v-col cols="12">
      <div class="text-h6">{{ $t('schemes.questions.options.title') }}</div>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :value="label"
        :label="$t('schemes.questions.label')"
        hide-details="auto"
        outlined
        @input="$emit('update:label', $event)"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-switch
        :input-value="other"
        :label="$t('schemes.questions.other')"
        hide-details="auto"
        @change="$emit('update:other', $event)"
      ></v-switch>
    </v-col>
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
          @click="add"
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
                  dense
                  hide-details="auto"
                  outlined
                ></v-text-field>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon :title="$t('schemes.questions.options.remove')" @click="remove(idx)">
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
import prompt from './prompt';

type Option = { id?: number; label: string; value: string };

export default Vue.extend({
  name: 'RadioListPrompt',

  components: { draggable },

  mixins: [prompt],

  props: {
    options: {
      type: Array as () => Option[],
      default: [],
    },
    label: {
      type: String,
    },
    orientation: {
      type: String,
      default: 'column',
    },
    other: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      currentOptions: this.options.map((option, idx) => ({ id: idx + 1, ...option })) as Option[],
    };
  },

  computed: {
    outputOptions(): Option[] {
      return this.currentOptions.map((item) => {
        const { label, value } = item;
        return { label, value };
      });
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
