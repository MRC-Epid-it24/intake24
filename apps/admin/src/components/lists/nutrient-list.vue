<template>
  <v-card flat tile>
    <v-toolbar color="grey lighten-2" flat tile>
      <v-icon color="primary" left>$nutrient-types</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('nutrient-types.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="secondary" fab small :title="$t('nutrient-types.create')" @click.stop="add">
        <v-icon small>$add</v-icon>
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('nutrient-types.reset._').toString()"
        @confirm="resetList"
      >
        <template #activator="{ attrs, on }">
          <v-btn
            class="ml-3"
            color="error"
            fab
            small
            :title="$t('nutrient-types.reset._')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>$sync</v-icon>
          </v-btn>
        </template>
        {{ $t('nutrient-types.reset.text') }}
      </confirm-dialog>
    </v-toolbar>
    <v-list>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(nutrientType, idx) in items"
            :key="nutrientType.id.join(':')"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ nutrientType.name.en }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('nutrient-types.edit')" @click.stop="edit(idx, nutrientType)">
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('nutrient-types.remove').toString()"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.delete', { name: nutrientType.name.en }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px"
      persistent
    >
      <v-card :tile="$vuetify.breakpoint.smAndDown">
        <v-toolbar color="primary" dark flat>
          <v-icon dark left>$nutrient-types</v-icon>
          <v-toolbar-title>
            {{ $t(`nutrient-types.${dialog.index === -1 ? 'create' : 'edit'}`) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-autocomplete
              v-model="dialog.item.id"
              hide-details="auto"
              item-text="description"
              item-value="id"
              :items="nutrientTypes"
              :label="$t('nutrient-types.title')"
              multiple
              name="nutrientTypeId"
              outlined
              prepend-inner-icon="$nutrient-types"
              :rules="rules"
              @change="updateNutrientLabel"
            >
            </v-autocomplete>
          </v-card-text>
          <language-selector
            v-model="dialog.item.name"
            flat
            :label="$t('nutrient-types.label').toString()"
            :outlined="false"
            required
          >
            <template v-for="lang in Object.keys(dialog.item.name)" #[`lang.${lang}`]>
              <v-text-field
                :key="lang"
                v-model="dialog.item.name[lang]"
                hide-details="auto"
                :label="$t('nutrient-types.label')"
                outlined
              ></v-text-field>
            </template>
          </language-selector>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="info" text type="submit">
              <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { Nutrient } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'TopFoodsNutrientTypeList',

  components: { ConfirmDialog, draggable, LanguageSelector },

  props: {
    nutrientTypes: {
      type: Array as PropType<NutrientTypeEntry[]>,
      required: true,
    },
    defaults: {
      type: Array as PropType<Nutrient[]>,
      default: () => [],
    },
    value: {
      type: Array as PropType<Nutrient[]>,
      required: true,
    },
  },

  setup(props, context) {
    const defaultItem = () => ({
      id: [props.nutrientTypes[0].id],
      name: { en: props.nutrientTypes[0].description },
    });

    const {
      dialog,
      form,
      items,
      newDialog,
      add,
      edit,
      load,
      remove,
      reset,
      resetList,
      save,
      update,
    } = useListWithDialog(props, context, defaultItem);

    const updateNutrientLabel = (nutrientTypeId: string) => {
      const match = props.nutrientTypes.find((nutrient) => nutrient.id === nutrientTypeId);
      if (!match) return;

      dialog.value.item.name.en = match.description;
    };

    return {
      dialog,
      form,
      items,
      newDialog,
      add,
      edit,
      load,
      remove,
      reset,
      save,
      update,
      resetList,
      updateNutrientLabel,
    };
  },

  computed: {
    rules() {
      return [
        (value: string[]): boolean | string => {
          if (!value.length) return this.$t('nutrient-types.validation.required').toString();

          const { index } = this.dialog;
          const match = this.items.find(
            (nutrientType, idx) =>
              [...value].sort().join(':') === [...nutrientType.id].sort().join(':') && index !== idx
          );

          return match ? this.$t('nutrient-types.validation.unique').toString() : true;
        },
      ];
    },
  },
});
</script>

<style lang="scss" scoped></style>
