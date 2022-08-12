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
          {{ $t(`fdbs.portionSizeMethods.${dialog.index === -1 ? 'add' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" dark text @click.stop="save">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-row class="mt-2">
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.description"
                    :items="selections"
                    :label="$t('fdbs.portionSizeMethods.description')"
                    hide-details="auto"
                    name="method"
                    outlined
                  >
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.item.imageUrl"
                    :label="$t('fdbs.portionSizeMethods.imageUrl')"
                    clearable
                    hide-details="auto"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="dialog.item.useForRecipes"
                    :label="$t('fdbs.portionSizeMethods.useForRecipes')"
                    hide-details="auto"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-slider
                    v-model="dialog.item.conversionFactor"
                    :label="$t('fdbs.portionSizeMethods.conversionFactor')"
                    :min="0.2"
                    :max="10"
                    :step="0.1"
                    class="mt-5"
                    thumb-label="always"
                  ></v-slider>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.method"
                    :items="estimationMethods"
                    :label="$t('fdbs.portionSizeMethods.methods._')"
                    hide-details="auto"
                    name="method"
                    outlined
                    @change="updateItemProps"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
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

  props: {
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    ...portionSizeParams,
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
      text: this.$t(`fdbs.portionSizeMethods.methods.${value}._`),
    }));

    const selections = Object.keys(portionSizeSelectionImages)
      .map((value) => ({
        value,
        text: this.$t(`fdbs.portionSizeMethods.selections.${value}`),
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
