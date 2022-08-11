<template>
  <div>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon left color="primary">fas fa-people-arrows</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.demographic-groups.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        color="secondary"
        :title="$t('feedback-schemes.demographic-groups.create')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <load-section-dialog
        :schemeId="schemeId"
        schemeType="feedback"
        section="demographicGroups"
        @load="load"
      ></load-section-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(group, index) in items"
            :key="group.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
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
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                :label="$t('feedback-schemes.demographic-groups.remove').toString()"
                color="error"
                icon
                icon-left="$delete"
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
      <v-card>
        <v-toolbar color="primary" dark>
          <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
            <v-icon>$cancel</v-icon>
          </v-btn>
          <v-toolbar-title>
            <v-icon dark left>fas fa-people-arrows</v-icon>
            {{
              $t(`feedback-schemes.demographic-groups.${dialog.index === -1 ? 'create' : 'edit'}`)
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn :title="$t('common.action.ok')" dark text @click.stop="save">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
            </v-btn>
          </v-toolbar-items>
          <template v-slot:extension>
            <v-container>
              <v-tabs v-model="tab" background-color="primary" dark>
                <v-tab v-for="item in ['general', 'sectors']" :key="item">
                  {{ $t(`feedback-schemes.demographic-groups.tabs.${item}`) }}
                </v-tab>
              </v-tabs>
            </v-container>
          </template>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-tabs-items v-model="tab" class="pt-1">
              <v-tab-item key="general">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="dialog.item.nutrientTypeId"
                        :items="nutrientTypes"
                        :label="$t('nutrient-types._')"
                        hide-details="auto"
                        item-text="description"
                        item-value="id"
                        name="nutrientTypeId"
                        outlined
                        prepend-icon="fas fa-seedling"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.nutrientRuleType"
                        :items="nutrientRuleTypes"
                        :label="$t('feedback-schemes.nutrientRuleTypes._')"
                        hide-details="auto"
                        name="nutrientRuleType"
                        outlined
                        prepend-icon="fas fa-divide"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.sex"
                        :items="sexes"
                        :label="$t('feedback-schemes.sexes._')"
                        hide-details="auto"
                        name="sex"
                        outlined
                        prepend-icon="fas fa-genderless"
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
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="dialog.item.physicalActivityLevelId"
                        :items="physicalActivityLevels"
                        :label="$t('feedback-schemes.physicalActivityLevels._')"
                        hide-details="auto"
                        item-text="name"
                        item-value="id"
                        name="physicalActivityLevelId"
                        outlined
                        prepend-icon="fas fa-running"
                      ></v-select>
                    </v-col>
                    <v-col v-for="item in ['age', 'height', 'weight']" :key="item" cols="12" md="6">
                      <demographic-group-range
                        v-model="dialog.item[item]"
                        :type="item"
                      ></demographic-group-range>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
              <v-tab-item key="sectors">
                <v-container>
                  <demographic-group-sectors
                    v-model="dialog.item.scaleSectors"
                  ></demographic-group-sectors>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
            <v-card-actions>
              <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
                <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
                <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
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
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { DemographicGroup } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import type { PhysicalActivityLevelAttributes } from '@intake24/common/types/models';
import { useListWithDialog } from '@intake24/admin/components/lists';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';
import { useEntry } from '@intake24/admin/stores';
import { nutrientRuleTypes, sexes } from '@intake24/common/feedback';
import { ConfirmDialog } from '@intake24/ui';

import { getDemographicGroupDefaults } from './demographic-group';
import DemographicGroupRange from './demographic-group-range.vue';
import DemographicGroupSectors from './demographic-group-sectors.vue';

export default defineComponent({
  name: 'DemographicGroupList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<DemographicGroup[]>,
      required: true,
    },
  },

  components: {
    ConfirmDialog,
    draggable,
    DemographicGroupRange,
    DemographicGroupSectors,
    LoadSectionDialog,
  },

  setup(props, context) {
    const { dialog, form, items, newDialog, add, edit, load, remove, reset, save } =
      useListWithDialog(props, context, getDemographicGroupDefaults);

    const tab = ref(0);

    return { dialog, form, items, tab, add, newDialog, edit, load, remove, reset, save };
  },

  data() {
    return {
      nutrientRuleTypes: nutrientRuleTypes.map((value) => ({
        text: this.$t(`feedback-schemes.nutrientRuleTypes.${value}`),
        value,
      })),
      sexes: [
        { text: this.$t('common.not.selected'), value: null, icon: 'fas fa-genderless' },
        ...sexes.map((value) => ({
          text: this.$t(`feedback-schemes.sexes.${value}`),
          value,
          icon: value === 'm' ? 'fas fa-mars' : 'fas fa-venus',
        })),
      ],
    };
  },

  computed: {
    nutrientTypes(): NutrientTypeEntry[] {
      return useEntry().refs.nutrientTypes ?? [];
    },
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
