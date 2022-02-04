<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`feedback-schemes.food-groups.${dialog.index === -1 ? 'create' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" dark text @click.stop="save">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
        <template v-slot:extension>
          <v-container>
            <v-tabs v-model="tab" background-color="primary" dark>
              <v-tab v-for="item in foodGroupSettings[dialog.group.type].tabs" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-container>
        </template>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-tabs-items v-model="tab" class="pt-1">
            <v-tab-item key="general">
              <v-row>
                <v-col cols="12">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        {{ $t(`feedback-schemes.food-groups.type`) }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-item-group
                      active-class="secondary"
                      v-model="dialog.group.type"
                      @change="updatePromptProps"
                    >
                      <v-container>
                        <v-row>
                          <v-col
                            v-for="item in foodGroupDefaults"
                            :key="item.type"
                            cols="12"
                            md="3"
                          >
                            <v-item v-slot:default="{ active, toggle }" :value="item.type">
                              <v-card
                                :color="active ? 'primary' : ''"
                                dark
                                height="180"
                                @click.stop="toggle"
                              >
                                <v-card-title class="justify-center">
                                  {{ $t(`feedback-schemes.food-groups.${item.type}.title`) }}
                                </v-card-title>
                                <v-card-subtitle class="text-center">
                                  {{ $t(`feedback-schemes.food-groups.${item.type}.subtitle`) }}
                                </v-card-subtitle>
                                <v-card-text v-show="active" class="text-center">
                                  <v-icon x-large>fa-check-circle</v-icon>
                                </v-card-text>
                              </v-card>
                            </v-item>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-item-group>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <component
              :is="dialog.group.type"
              v-bind.sync="dialog.group"
              @validate="validate"
            ></component>
          </v-tabs-items>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { copy, merge } from '@intake24/common/util';
import { FoodGroup } from '@intake24/common/feedback';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { defineComponent, ref } from '@vue/composition-api';
import tinymce from '@intake24/admin/components/tinymce/tinymce';
import { RuleCallback } from '@intake24/admin/types';
import foodGroupTypes from './food-group-types';
import { foodGroupDefaults, foodGroupSettings } from './food-group';

export type FoodGroupDialog = {
  show: boolean;
  index: number;
  group: FoodGroup;
};

export default defineComponent({
  name: 'FoodGroupSelector',

  props: {
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    LanguageSelector,
    ...foodGroupTypes,
  },

  mixins: [tinymce],

  setup() {
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
  },

  data() {
    const dialog = (show = false): FoodGroupDialog => ({
      show,
      index: -1,
      group: copy(foodGroupDefaults[0]),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      foodGroupDefaults,
      foodGroupSettings,
      tab: 0,
    };
  },

  computed: {
    textRules(): RuleCallback[] {
      return this.textRequired
        ? [(value: string | null): boolean | string => !!value || 'Question name is required.']
        : [];
    },
  },

  mounted() {
    document.addEventListener('focusin', this.focusInTox, true);
  },

  beforeDestroy() {
    document.removeEventListener('focusin', this.focusInTox, true);
  },

  methods: {
    focusInTox(event: FocusEvent) {
      const toxDialog = (event.target as HTMLElement).closest('.tox');
      if (!toxDialog) return;

      event.stopImmediatePropagation();
    },

    updatePromptProps() {
      const {
        show,
        index,
        group: { type },
      } = this.dialog;

      const group = this.foodGroupDefaults.find((item) => item.type === type);
      if (!group) return;

      this.dialog = { show, index, group: { ...copy(group) } };
    },

    create() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, group: FoodGroup) {
      const promptDefaults = this.foodGroupDefaults.find((g) => g.type === group.type);

      this.dialog = {
        show: true,
        index,
        group: { ...merge<FoodGroup>(promptDefaults ?? {}, group) },
      };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid) return;

      const { index, group } = this.dialog;

      this.$emit('save', { group, index });

      this.reset();
    },

    reset() {
      this.tab = 0;
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>
