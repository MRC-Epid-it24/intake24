<template>
  <v-dialog
    v-if="$props.dialog"
    v-model="$props.dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="600px"
  >
    <v-card :loading="isLoading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="$emit('close')">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('locales.recipe-foods.steps') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(item, idx) in $props.activeRecipeFood?.steps"
          :key="idx"
          class="list-item-border"
        >
          <v-list-item-content>
            <v-container>
              <v-row justify="center">
                <v-col>
                  <v-subheader>
                    {{ translate(item.name) }}
                  </v-subheader>
                </v-col>
              </v-row>
              <v-row col="12">
                <v-col cols="12">
                  <v-text-field
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.code')"
                    name="special"
                    outlined
                    :value="JSON.stringify(item.name)"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.code"
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.code')"
                    name="special"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.order"
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.title')"
                    name="code"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';

import type { LocaleRecipeFoodsInput } from '@intake24/common/types/http/admin';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'StepsDialog',

  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    activeRecipeFoodId: {
      type: String,
      required: true,
    },
    activeRecipeFoodCode: {
      type: String,
      required: true,
    },
    activeRecipeFood: {
      type: Object as () => LocaleRecipeFoodsInput,
    },
  },
  setup() {
    const isLoading = ref(false);
    const { translate } = useI18n();

    return { isLoading, translate };
  },
});
</script>

<style scoped></style>
