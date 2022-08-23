<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`fdbs.portionSizes.${dialog.index === -1 ? 'add' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-row class="mt-2">
            <v-col cols="12" md="6">
              <v-card-title class="px-0">
                {{ $t(`fdbs.portionSizes._`) }} {{ $t('fdbs.portionSizes.parameters') }}
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.description"
                    hide-details="auto"
                    :items="selections"
                    :label="$t('fdbs.portionSizes.description')"
                    name="method"
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.item.imageUrl"
                    clearable
                    hide-details="auto"
                    :label="$t('fdbs.portionSizes.imageUrl')"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="dialog.item.useForRecipes"
                    hide-details="auto"
                    :label="$t('fdbs.portionSizes.useForRecipes')"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-slider
                    v-model="dialog.item.conversionFactor"
                    class="mt-5"
                    :label="$t('fdbs.portionSizes.conversionFactor')"
                    :max="10"
                    :min="0.2"
                    :step="0.1"
                    thumb-label="always"
                  ></v-slider>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.method"
                    hide-details="auto"
                    :items="estimationMethods"
                    :label="$t('fdbs.portionSizes.methods._')"
                    name="method"
                    outlined
                    @change="updateItemProps"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" md="6">
              <v-card-title class="px-0">
                {{ $t(`fdbs.portionSizes.methods.${dialog.item.method}._`) }}
                {{ $t('fdbs.portionSizes.parameters') }}
              </v-card-title>
              <component
                :is="dialog.item.method"
                v-model="dialog.item.parameters"
                @validate="validate"
              ></component>
            </v-col>
          </v-row>
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
import { defineComponent, ref } from 'vue';

import { copy, merge, randomString } from '@intake24/common/util';

import type { InternalPortionSizeMethodItem, PortionSizeMethodDialog } from './portion-sizes';
import portionSizeParams from './parameters';
import { portionSizeSelectionImages, psmDefaults } from './portion-sizes';

export default defineComponent({
  name: 'PortionSizeMethodSelector',

  components: {
    ...portionSizeParams,
  },

  props: {
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
  },

  data() {
    const dialog = (show = false): PortionSizeMethodDialog => ({
      show,
      index: -1,
      item: copy({ ...psmDefaults[0], _id: randomString(6) }),
    });

    const estimationMethods = psmDefaults.map(({ method: value }) => ({
      value,
      text: this.$t(`fdbs.portionSizes.methods.${value}._`),
    }));

    const selections = Object.keys(portionSizeSelectionImages)
      .map((value) => ({
        value,
        text: this.$t(`fdbs.portionSizes.selections.${value}`),
      }))
      .sort((a, b) => (a.text > b.text ? 1 : -1));

    return {
      dialog: dialog(),
      newDialog: dialog,
      psmDefaults,
      selections,
      estimationMethods,
      portionSizeSelectionImages,
    };
  },

  methods: {
    updateItemProps() {
      const {
        show,
        index,
        item: { method },
      } = this.dialog;

      const item = this.psmDefaults.find((item) => item.method === method);
      if (!item) return;

      this.dialog = { show, index, item: copy({ ...item, _id: randomString(6) }) };
    },

    add() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, item: InternalPortionSizeMethodItem) {
      const defaults = this.psmDefaults.find((d) => d.method === item.method);
      if (!defaults) {
        console.warn(`Portion size method defaults for method '${item.method}' not found.`);
        return;
      }

      this.dialog = {
        show: true,
        index,
        item: copy(merge(defaults, item)),
      };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid) return;

      const { index, item } = this.dialog;

      this.$emit('save', { item, index });

      this.reset();
    },

    reset() {
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>
