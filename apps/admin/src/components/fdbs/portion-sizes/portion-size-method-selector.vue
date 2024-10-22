<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    persistent
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="reset" />
        <v-toolbar-title>
          {{ $t(`fdbs.portionSizes.${dialog.index === -1 ? 'add' : 'edit'}`) }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" variant="text" @click.stop="save">
            <v-icon icon="$success" start />{{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-row class="mt-2">
            <v-col cols="12" md="4">
              <v-card-title class="px-0">
                {{ $t(`fdbs.portionSizes._`) }} {{ $t('fdbs.portionSizes.parameters') }}
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.method"
                    hide-details="auto"
                    :items="estimationMethods"
                    :label="$t('fdbs.portionSizes.methods._')"
                    name="method"
                    variant="outlined"
                    @update:model-value="updateItemProps"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.description"
                    hide-details="auto"
                    :items="selections"
                    :label="$t('fdbs.portionSizes.description')"
                    name="description"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="dialog.item.useForRecipes"
                    hide-details="auto"
                    :label="$t('fdbs.portionSizes.useForRecipes')"
                    name="useForRecipes"
                  />
                </v-col>
                <v-col cols="12">
                  <v-slider
                    v-model="dialog.item.conversionFactor"
                    class="mt-5"
                    :label="$t('fdbs.portionSizes.conversionFactor')"
                    :max="10"
                    :min="0.2"
                    name="conversionFactor"
                    :step="0.1"
                    thumb-label="always"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md>
              <v-card-title class="px-0">
                {{ $t(`fdbs.portionSizes.methods.${dialog.item.method}._`) }}
                {{ $t('fdbs.portionSizes.parameters') }}
              </v-card-title>
              <component
                :is="dialog.item.method"
                v-model="dialog.item.parameters"
                @validate="validate"
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="reset">
              <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn class="font-weight-bold" color="info" type="submit" variant="text">
              <v-icon icon="$success" start />{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { InternalPortionSizeMethodItem, PortionSizeMethodDialog } from './portion-sizes';

import { defineComponent, ref } from 'vue';

import { copy, merge, randomString } from '@intake24/common/util';
import portionSizeParams from './parameters';
import { psmDefaults, usePortionSizeMethods } from './portion-sizes';

export default defineComponent({
  name: 'PortionSizeMethodSelector',

  components: { ...portionSizeParams },

  emits: ['save'],

  setup() {
    const { estimationMethods, selections } = usePortionSizeMethods();

    const newDialog = (show = false): PortionSizeMethodDialog => ({
      show,
      index: -1,
      item: copy({ ...psmDefaults[0], _id: randomString(6) }),
    });

    const dialog = ref(newDialog());
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return {
      dialog,
      newDialog,
      form,
      selections,
      estimationMethods,
      psmDefaults,
    };
  },

  methods: {
    updateItemProps() {
      const {
        show,
        index,
        item: { method },
      } = this.dialog;

      const item = this.psmDefaults.find(item => item.method === method);
      if (!item)
        return;

      this.dialog = { show, index, item: copy({ ...item, _id: randomString(6) }) };
    },

    add() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, item: InternalPortionSizeMethodItem) {
      const defaults = this.psmDefaults.find(d => d.method === item.method);
      if (!defaults) {
        console.warn(`Portion size method defaults for method '${item.method}' not found.`);
        return;
      }

      this.dialog = { show: true, index, item: copy(merge(defaults, item)) };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid)
        return;

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
