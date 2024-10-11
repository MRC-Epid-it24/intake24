<template>
  <v-row>
    <v-col class="d-flex flex-column" cols="12">
      <v-btn
        class="mb-4 align-self-end"
        color="secondary"
        rounded
        :title="$t('standard-units.add')"
        variant="outlined"
        @click="add"
      >
        <v-icon icon="$add" start />
        {{ $t('standard-units.add') }}
      </v-btn>
      <v-table>
        <thead>
          <tr>
            <th />
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.unit') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.weight') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.omitFoodDescription') }}</th>
            <th />
          </tr>
        </thead>
        <vue-draggable
          v-model="parameters.units"
          :animation="300"
          handle=".drag-and-drop__handle"
          tag="tbody"
        >
          <tr v-for="(unit, idx) in parameters.units" :key="unit.name" class="drag-and-drop__item">
            <td>
              <v-icon class="drag-and-drop__handle">
                $handle
              </v-icon>
            </td>
            <td>
              <select-resource v-model="unit.name" resource="standard-units">
                <template #activator="{ props }">
                  <v-btn v-bind="props" :title="$t('standard-units.add')" variant="text">
                    <v-icon icon="$standard-units" start />
                    {{ unit.name }}
                  </v-btn>
                </template>
              </select-resource>
            </td>
            <td>
              <v-text-field
                v-model.number="unit.weight"
                density="compact"
                hide-details="auto"
                :name="`unit${idx}-weight`"
                :rules="weightRules"
              />
            </td>
            <td>
              <v-switch
                v-model="unit.omitFoodDescription"
                class="mt-0"
                hide-details="auto"
              />
            </td>
            <td>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('standard-units.remove')"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.delete', { name: unit.name }) }}
              </confirm-dialog>
            </td>
          </tr>
        </vue-draggable>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import type { PortionSizeParameters } from '@intake24/common/surveys';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { ConfirmDialog } from '@intake24/ui';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'StandardPortionParameters',

  components: { ConfirmDialog, SelectResource, VueDraggable },

  props: {
    modelValue: {
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
        if (Number.isNaN(number))
          return msg;

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
