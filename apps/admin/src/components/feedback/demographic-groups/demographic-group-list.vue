<template>
  <div>
    <v-toolbar color="grey lighten-5" flat tile>
      <v-icon color="secondary" left>
        fas fa-people-arrows
      </v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.demographic-groups.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        color="primary"
        fab
        small
        :title="$t('feedback-schemes.demographic-groups.create')"
        @click.stop="add"
      >
        <v-icon small>
          $add
        </v-icon>
      </v-btn>
      <options-menu>
        <select-resource
          resource="feedback-schemes"
          return-object="demographicGroups"
          @input="load"
        >
          <template #activator="{ attrs, on }">
            <v-list-item v-bind="attrs" link v-on="on">
              <v-list-item-title>
                <v-icon left>
                  $download
                </v-icon>
                {{ $t('feedback-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="items" @input="update" />
      </options-menu>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(group, index) in items"
            :key="group.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ getListItemTitle(group) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.demographic-groups.edit')"
                @click.stop="edit(index, group)"
              >
                <v-icon color="secondary lighten-2">
                  $edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('feedback-schemes.demographic-groups.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: getListItemTitle(group) }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar color="secondary" dark>
          <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="reset">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            <v-icon dark left>
              fas fa-people-arrows
            </v-icon>
            {{
              $t(`feedback-schemes.demographic-groups.${dialog.index === -1 ? 'create' : 'edit'}`)
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text :title="$t('common.action.ok')" @click.stop="save">
              <v-icon left>
                $success
              </v-icon>{{ $t('common.action.ok') }}
            </v-btn>
          </v-toolbar-items>
          <template #extension>
            <v-container>
              <v-tabs v-model="tab" background-color="secondary" dark>
                <v-tab v-for="item in ['general', 'sectors', 'json']" :key="item" :tab-value="item">
                  {{ $t(`feedback-schemes.demographic-groups.tabs.${item}`) }}
                </v-tab>
              </v-tabs>
            </v-container>
          </template>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-tabs-items v-model="tab" class="pt-1">
              <v-tab-item key="general" value="general">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.type"
                        hide-details="auto"
                        :items="cardTypes"
                        :label="$t('feedback-schemes.cards.type')"
                        name="type"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="dialog.item.nutrientTypeId"
                        hide-details="auto"
                        item-text="description"
                        item-value="id"
                        :items="nutrientTypes"
                        :label="$t('nutrient-types._')"
                        name="nutrientTypeId"
                        outlined
                        prepend-inner-icon="$nutrient-types"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.nutrientRuleType"
                        hide-details="auto"
                        :items="nutrientRuleTypes"
                        :label="$t('feedback-schemes.nutrientRuleTypes._')"
                        name="nutrientRuleType"
                        outlined
                        prepend-inner-icon="fas fa-divide"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.sex"
                        hide-details="auto"
                        :items="sexes"
                        :label="$t('feedback-schemes.sexes._')"
                        name="sex"
                        outlined
                        prepend-inner-icon="fas fa-genderless"
                      >
                        <template #item="{ item }">
                          <span :class="`${item.icon} mr-3`" />
                          {{ item.text }}
                        </template>
                        <template #selection="{ item }">
                          <span :class="`${item.icon} mr-3`" />
                          {{ item.text }}
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.physicalActivityLevelId"
                        hide-details="auto"
                        item-text="name"
                        item-value="id"
                        :items="physicalActivityLevels"
                        :label="$t('feedback-schemes.physicalActivityLevels._')"
                        name="physicalActivityLevelId"
                        outlined
                        prepend-inner-icon="fas fa-running"
                      />
                    </v-col>
                    <v-col v-for="item in ['age', 'height', 'weight']" :key="item" cols="12" md="6">
                      <demographic-group-range
                        v-model="dialog.item[item]"
                        :type="item"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
              <v-tab-item key="sectors" value="sectors">
                <v-container>
                  <demographic-group-sectors
                    v-model="dialog.item.scaleSectors"
                  />
                </v-container>
              </v-tab-item>
              <v-tab-item key="json" value="json">
                <v-container>
                  <json-editor v-model="dialog.item" />
                </v-container>
              </v-tab-item>
            </v-tabs-items>
            <v-card-actions>
              <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                <v-icon left>
                  $cancel
                </v-icon>{{ $t('common.action.cancel') }}
              </v-btn>
              <v-spacer />
              <v-btn class="font-weight-bold" color="info" text type="submit">
                <v-icon left>
                  $success
                </v-icon>{{ $t('common.action.ok') }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { DemographicGroup } from '@intake24/common/feedback';
import type { NutrientTypeResponse } from '@intake24/common/types/http/admin';
import type { PhysicalActivityLevelAttributes } from '@intake24/db';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditor, JsonEditorDialog, useTinymce } from '@intake24/admin/components/editors';
import { useListWithDialog } from '@intake24/admin/composables';
import { useEntry } from '@intake24/admin/stores';
import { cardTypes as cardTypesRef, nutrientRuleTypes, sexes } from '@intake24/common/feedback';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

import { getDemographicGroupDefaults } from './demographic-group';
import DemographicGroupRange from './demographic-group-range.vue';
import DemographicGroupSectors from './demographic-group-sectors.vue';

export default defineComponent({
  name: 'DemographicGroupList',

  components: {
    ConfirmDialog,
    Draggable: draggable,
    DemographicGroupRange,
    DemographicGroupSectors,
    JsonEditor,
    JsonEditorDialog,
    OptionsMenu,
    SelectResource,
  },

  props: {
    nutrientTypes: {
      type: Array as PropType<NutrientTypeResponse[]>,
      default: () => [],
    },
    value: {
      type: Array as PropType<DemographicGroup[]>,
      required: true,
    },
  },

  setup(props, context) {
    useTinymce();
    const { i18n } = useI18n();
    const { dialog, form, items, newDialog, add, edit, load, remove, reset: resetItem, save, update }
      = useListWithDialog(props, context, { newItem: getDemographicGroupDefaults });

    const tab = ref('general');

    const cardTypes = computed(() =>
      cardTypesRef.map(value => ({
        text: i18n.t(`feedback-schemes.cards.${value}.title`).toString(),
        value,
      })),
    );

    const reset = () => {
      tab.value = 'general';
      resetItem();
    };

    return {
      cardTypes,
      dialog,
      form,
      items,
      tab,
      add,
      newDialog,
      edit,
      load,
      remove,
      reset,
      save,
      update,
    };
  },

  data() {
    return {
      nutrientRuleTypes: nutrientRuleTypes.map(value => ({
        text: this.$t(`feedback-schemes.nutrientRuleTypes.${value}`),
        value,
      })),
      sexes: [
        { text: this.$t('common.not.selected'), value: null, icon: 'fas fa-genderless' },
        ...sexes.map(value => ({
          text: this.$t(`feedback-schemes.sexes.${value}`),
          value,
          icon: value === 'm' ? 'fas fa-mars' : 'fas fa-venus',
        })),
      ],
    };
  },

  computed: {
    physicalActivityLevels(): PhysicalActivityLevelAttributes[] {
      return [
        { name: this.$t('common.not.selected'), id: null },
        ...(useEntry().refs.physicalActivityLevels ?? []),
      ];
    },
  },

  methods: {
    getListItemTitle(group: DemographicGroup): string {
      const nutrient = this.nutrientTypes.find(({ id }) => group.nutrientTypeId === id);

      return [nutrient?.description, group.scaleSectors[0].name.en].filter(Boolean).join(' | ');
    },
  },
});
</script>

<style lang="scss" scoped></style>
