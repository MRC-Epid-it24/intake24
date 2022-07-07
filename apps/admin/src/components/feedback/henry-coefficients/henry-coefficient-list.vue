<template>
  <div>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon left color="primary">fas fa-square-root-alt</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.henry-coefficients.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        color="secondary"
        :title="$t('feedback-schemes.henry-coefficients.create')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <load-section-dialog
        :schemeId="schemeId"
        schemeType="feedback"
        section="henryCoefficients"
        @load="load"
      ></load-section-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(coefficient, index) in items"
            :key="coefficient.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
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
                :label="$t('feedback-schemes.henry-coefficients.remove')"
                color="error"
                icon
                icon-left="$delete"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: getListItemTitle(coefficient) }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
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
                    :items="sexes"
                    :label="$t('feedback-schemes.sexes._')"
                    hide-details="auto"
                    name="sex"
                    outlined
                  >
                    <template v-slot:item="{ item }">
                      <span :class="`${item.icon} mr-3`"></span>
                      {{ item.text }}
                    </template>
                    <template v-slot:selection="{ item }">
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
                    :label="$t('feedback-schemes.age.start')"
                    hide-details="auto"
                    name="age.start"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.age.end"
                    :label="$t('feedback-schemes.age.end')"
                    hide-details="auto"
                    name="age.end"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.weightCoefficient"
                    :label="$t('feedback-schemes.henry-coefficients.weightCoefficient')"
                    hide-details="auto"
                    name="weightCoefficient"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.heightCoefficient"
                    :label="$t('feedback-schemes.henry-coefficients.heightCoefficient')"
                    hide-details="auto"
                    name="heightCoefficient"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="dialog.item.constant"
                    :label="$t('feedback-schemes.henry-coefficients.constant')"
                    hide-details="auto"
                    name="constant"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { HenryCoefficient, Sex } from '@intake24/common/feedback';
import { sexes } from '@intake24/common/feedback';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';
import { ConfirmDialog } from '@intake24/ui';
import { getHenryCoefficientDefaults } from './henry-coefficient';
import { useList } from '..';

export default defineComponent({
  name: 'HenryCoefficientList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<HenryCoefficient[]>,
      required: true,
    },
  },

  components: { ConfirmDialog, draggable, LoadSectionDialog },

  setup(props, context) {
    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save } = useList(
      props,
      context,
      getHenryCoefficientDefaults
    );

    return { dialog, form, items, newDialog, add, edit, load, remove, reset, save };
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
