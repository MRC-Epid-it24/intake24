<template>
  <v-row>
    <v-col class="d-flex flex-column" cols="12">
      <v-btn
        class="mb-4 align-self-end"
        color="secondary"
        outlined
        rounded
        :title="$t('standard-units.add')"
        @click="add"
      >
        <v-icon left>$add</v-icon>
        {{ $t('standard-units.add') }}
      </v-btn>
      <v-simple-table>
        <thead>
          <tr>
            <th></th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.unit') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.weight') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.omitFoodDescription') }}</th>
            <th></th>
          </tr>
        </thead>
        <draggable v-model="parameters.units" handle=".drag-and-drop__handle" tag="tbody">
          <tr v-for="(unit, idx) in parameters.units" :key="unit.name" class="drag-and-drop__item">
            <td>
              <v-icon class="drag-and-drop__handle">$handle</v-icon>
            </td>
            <td>
              <select-resource v-model="unit.name" resource="standard-units">
                <template #activator="{ attrs, on }">
                  <v-btn v-bind="attrs" text :title="$t('standard-units.add')" v-on="on">
                    <v-icon left>$standard-units</v-icon>
                    {{ unit.name }}
                  </v-btn>
                </template>
              </select-resource>
            </td>
            <td>
              <v-text-field
                v-model.number="unit.weight"
                dense
                hide-details="auto"
                :name="`unit${idx}-weight`"
                :rules="weightRules"
              ></v-text-field>
            </td>
            <td>
              <v-switch
                v-model="unit.omitFoodDescription"
                class="mt-0"
                hide-details="auto"
              ></v-switch>
            </td>
            <td>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('standard-units.remove').toString()"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.delete', { name: unit.name }) }}
              </confirm-dialog>
            </td>
          </tr>
        </draggable>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { PortionSizeParameters } from '@intake24/common/types';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { ConfirmDialog } from '@intake24/ui';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'StandardPortionParameters',

  components: { ConfirmDialog, draggable, SelectResource },

  props: {
    value: {
      type: Object as PropType<PortionSizeParameters['standard-portion']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'standard-portion'>(props, context);

    const add = () => {
      parameters.value.units.push({
        name: `unit-${parameters.value.units.length + 1}`,
        weight: 1,
        omitFoodDescription: false,
      });
    };

    const remove = (index: number) => {
      parameters.value.units.splice(index, 1);
    };

    const weightRules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number)) return msg;

        return number > 0 || msg;
      },
    ];

    return {
      parameters,
      add,
      remove,
      weightRules,
    };
  },
});
</script>
