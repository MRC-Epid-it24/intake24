<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>
        fas fa-barcode
      </v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.barcodes.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-select
        :items="barcodes"
        :label="$t('survey-schemes.prompts.barcodes.providers._')"
        name="barcode"
        outlined
        :value="barcode.type"
        @input="update('type', $event)"
      />
      <template v-if="barcode.type !== 'none'">
        <v-select

          :items="readers"
          :label="$t('survey-schemes.prompts.barcodes.readers._')"
          multiple
          name="readers"
          outlined
          :value="barcode.readers"
          @input="update('readers', $event)"
        />
        <v-label>{{ $t('survey-schemes.prompts.barcodes.feedback._') }}</v-label>
        <v-switch
          hide-details="auto"
          :input-value="barcode.feedback.vibration"
          :label="$t('survey-schemes.prompts.barcodes.feedback.vibration')"
          @change="update('feedback', { ...barcode.feedback, vibration: $event })"
        />
        <v-switch
          disabled
          hide-details="auto"
          :input-value="barcode.feedback.audio"
          :label="$t('survey-schemes.prompts.barcodes.feedback.audio')"
          @change="update('feedback', { ...barcode.feedback, audio: $event })"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { BarcodeScannerOptions } from '@intake24/common/barcodes';
import { barcodeReaders, barcodeScanners, defaultBarcodeScannerOptions } from '@intake24/common/barcodes';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'BarcodeScannerSettings',

  props: {
    barcode: {
      type: Object as PropType<BarcodeScannerOptions>,
      required: true,
    },
  },

  emits: ['update:barcode'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const barcodes = barcodeScanners.map(value => ({
      text: i18n.t(`survey-schemes.prompts.barcodes.providers.${value}`).toString(),
      value,
    }));

    const readers = computed(() => {
      return barcodeReaders[props.barcode.type];
    });

    const update = (field: string, value: any) => {
      if (field === 'type') {
        emit('update:barcode', copy(defaultBarcodeScannerOptions[value]));
        return;
      }

      emit('update:barcode', { ...props.barcode, [field]: value });
    };

    return { barcodes, readers, update };
  },
});
</script>

<style lang="scss" scoped></style>
