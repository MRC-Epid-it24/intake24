<template>
  <div>
    <v-toolbar color="grey lighten-5" flat tile>
      <v-icon color="primary" left>fas fa-square-root-alt</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.henry-coefficients.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        fab
        small
        :title="$t('feedback-schemes.henry-coefficients.create')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <options-menu>
        <select-resource
          resource="feedback-schemes"
          return-object="henryCoefficients"
          @input="load"
        >
          <template #activator="{ attrs, on }">
            <v-list-item v-bind="attrs" link v-on="on">
              <v-list-item-title>
                <v-icon left>fas fa-download</v-icon>
                {{ $t('feedback-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor v-model="items"></json-editor>
      </options-menu>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(coefficient, index) in items"
            :key="coefficient.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-icon class="my-auto">
              <v-icon>{{ getListItemIcon(coefficient) }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ getListItemTitle(coefficient) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.henry-coefficients.edit')"
                @click.stop="edit(index, coefficient)"
              >
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('feedback-schemes.henry-coefficients.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: getListItemTitle(coefficient) }) }}
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
          <v-icon dark left>fas fa-square-root-alt</v-icon>
          <v-toolbar-title>
            {{
              $t(`feedback-schemes.henry-coefficients.${dialog.index === -1 ? 'create' : 'edit'}`)
            }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="dialog.item.sex"
                    hide-details="auto"
                    :items="sexes"
                    :label="$t('feedback-schemes.sexes._')"
                    name="sex"
                    outlined
                  >
                    <template #item="{ item }">
                      <span :class="`${item.icon} mr-3`"></span>
                      {{ item.text }}
                    </template>
                    <template #selection="{ item }">
                      <span :class="`${item.icon} mr-3`"></span>
                      {{ item.text }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-card-subtitle>
                {{ $t('feedback-schemes.age.range') }}
              </v-card-subtitle>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.age.start"
                    hide-details="auto"
                    :label="$t('feedback-schemes.age.start')"
                    name="age.start"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.age.end"
                    hide-details="auto"
                    :label="$t('feedback-schemes.age.end')"
                    name="age.end"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.weightCoefficient"
                    hide-details="auto"
                    :label="$t('feedback-schemes.henry-coefficients.weightCoefficient')"
                    name="weightCoefficient"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.heightCoefficient"
                    hide-details="auto"
                    :label="$t('feedback-schemes.henry-coefficients.heightCoefficient')"
                    name="heightCoefficient"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.constant"
                    hide-details="auto"
                    :label="$t('feedback-schemes.henry-coefficients.constant')"
                    name="constant"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
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
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { HenryCoefficient, Sex } from '@intake24/common/feedback';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditor } from '@intake24/admin/components/editors';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { sexes } from '@intake24/common/feedback';
import { ConfirmDialog } from '@intake24/ui';

import { getHenryCoefficientDefaults } from './henry-coefficient';

export default defineComponent({
  name: 'HenryCoefficientList',

  components: { ConfirmDialog, draggable, JsonEditor, OptionsMenu, SelectResource },

  props: {
    value: {
      type: Array as PropType<HenryCoefficient[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save, update } =
      useListWithDialog(props, context, getHenryCoefficientDefaults);

    return { dialog, form, items, newDialog, add, edit, load, remove, reset, save, update };
  },

  data() {
    return {
      sexes: sexes.map((value) => ({
        text: this.$t(`feedback-schemes.sexes.${value}`),
        value,
        icon: value === 'm' ? 'fas fa-mars' : 'fas fa-venus',
      })),
    };
  },

  methods: {
    getGenderIcon(gender: Sex): string {
      const icons: Record<Sex, string> = { m: 'fas fa-mars', f: 'fas fa-venus' };
      return icons[gender];
    },

    getListItemIcon(coefficient: HenryCoefficient): string {
      const { sex } = coefficient;

      return this.getGenderIcon(sex);
    },

    getListItemTitle(coefficient: HenryCoefficient): string {
      const { sex, age } = coefficient;

      return `${this.$t(`feedback-schemes.sexes.${sex}`)} (${age.start} => ${age.end})`;
    },
  },
});
</script>

<style lang="scss" scoped></style>
