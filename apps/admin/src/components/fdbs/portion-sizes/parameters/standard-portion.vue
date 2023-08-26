<template>
  <v-row>
    <v-col class="d-flex flex-column" cols="12">
      <v-btn
        class="mb-4 align-self-end"
        color="secondary"
        outlined
        rounded
        :title="$t('standard-units.add')"
        @click="addUnit"
      >
        <v-icon left>$add</v-icon>
        {{ $t('standard-units.add') }}
      </v-btn>
      <v-simple-table>
        <tbody>
          <tr>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.unit') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.weight') }}</th>
            <th>{{ $t('fdbs.portionSizes.methods.standard-portion.omitFoodDescription') }}</th>
            <th></th>
          </tr>
          <tr v-for="(_, idx) in units" :key="idx">
            <td>
              <select-resource
                resource="standard-units"
                :value="getParameter(`unit${idx}-name`)?.value"
                @input="setParameter(`unit${idx}-name`, $event)"
              >
                <template #activator="{ attrs, on }">
                  <v-btn v-bind="attrs" text :title="$t('standard-units.add')" v-on="on">
                    <v-icon left>$standard-units</v-icon>
                    {{ getParameter(`unit${idx}-name`)?.value }}
                  </v-btn>
                </template>
              </select-resource>
            </td>
            <td>
              <v-text-field
                dense
                hide-details="auto"
                :name="`unit${idx}-weight`"
                :rules="weightRules"
                :value="getParameter(`unit${idx}-weight`)?.value"
                @input="setParameter(`unit${idx}-weight`, $event)"
              ></v-text-field>
            </td>
            <td>
              <v-switch
                class="mt-0"
                :false-value="false"
                hide-details="auto"
                :input-value="getParameter(`unit${idx}-omit-food-description`)?.value === 'true'"
                :true-value="true"
                @change="setParameter(`unit${idx}-omit-food-description`, $event)"
              ></v-switch>
            </td>
            <td>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('standard-units.remove').toString()"
                @confirm="removeUnit(idx)"
              >
                {{
                  $t('common.action.confirm.delete', {
                    name: getParameter(`unit${idx}-name`)?.value,
                  })
                }}
              </confirm-dialog>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import { SelectResource } from '@intake24/admin/components/dialogs';
import { ConfirmDialog } from '@intake24/ui';

import type { PortionSizeMethodParameterItem } from '..';
import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'StandardPortionParameters',

  components: { ConfirmDialog, SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters, getParameter, setParameter } = useParameters(props, context);

    const getUnitIndex = (length: number) => Math.floor(length / 3);

    const units = computed(() => Array(getUnitIndex(parameters.value.length)).fill(0));

    const addUnit = () => {
      const idx = units.value.length;
      parameters.value.push(
        ...[
          { name: `unit${idx}-name`, value: '' },
          { name: `unit${idx}-weight`, value: '1' },
          { name: `unit${idx}-omit-food-description`, value: 'false' },
        ]
      );
    };

    const removeUnit = (index: number) => {
      parameters.value = parameters.value
        .filter(
          (parameter) =>
            ![
              `unit${index}-name`,
              `unit${index}-weight`,
              `unit${index}-omit-food-description`,
            ].includes(parameter.name)
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((parameter, idx) => ({
          ...parameter,
          name: parameter.name.replace(/unit\d+-/, `unit${getUnitIndex(idx)}-`),
        }));
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
      getParameter,
      setParameter,
      parameters,
      units,
      addUnit,
      removeUnit,
      weightRules,
    };
  },
});
</script>
