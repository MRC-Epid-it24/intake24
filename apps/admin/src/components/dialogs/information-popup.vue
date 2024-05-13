<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="800px" :value="open" @click:outside="close">
    <v-card>
      <v-card-text class="pa-0">
        <component :is="componentType" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="font-weight-bold" color="info" text @click.stop="close">
          {{ $t('common.action.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import surveyInfoComponents from '../../views/surveys/information';

export default defineComponent({
  name: 'InformationPopup',

  components: {
    ...surveyInfoComponents,
  },

  props: {
    componentType: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: false,
      defaultValue: false,
    },
  },

  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    return {
      close,
    };
  },
});
</script>

<style lang="scss" scoped></style>
