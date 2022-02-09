<template>
  <div>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon class="mr-3" color="primary">fas fa-people-arrows</v-icon>
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
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(group, idx) in items"
            :key="group.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
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
                @click.stop="edit(idx, group)"
              >
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.demographic-groups.remove')"
                @click.stop="remove(idx)"
              >
                <v-icon color="error">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon class="mr-3" dark>fas fa-people-arrows</v-icon>
          <v-toolbar-title>
            {{ $t('feedback-schemes.demographic-groups.edit') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <!-- <v-card-text>
          </v-card-text> -->
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
import { defineComponent, PropType } from '@vue/composition-api';
import { DemographicGroup } from '@intake24/common/feedback';
import { NutrientTypeAttributes } from '@intake24/common/types/models';
import { demographicGroupDefaults } from './demographic-group';
import { useTopFoodList } from '..';

export default defineComponent({
  name: 'DemographicGroupList',

  props: {
    feedbackSchemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<DemographicGroup[]>,
      required: true,
    },
  },

  components: { draggable },

  setup(props, context) {
    const { dialog, form, items, newDialog, edit, remove, reset, save } = useTopFoodList(
      props,
      context,
      demographicGroupDefaults
    );

    return { dialog, form, items, newDialog, edit, remove, reset, save };
  },

  computed: {
    allNutrientTypes(): NutrientTypeAttributes[] {
      return this.$store.state.resource.entry.refs.nutrientTypes ?? [];
    },
  },

  methods: {
    getListItemTitle(group: DemographicGroup): string {
      const nutrient = this.allNutrientTypes.find(({ id }) => group.nutrientTypeId === id);

      return [nutrient?.description, group.scaleSectors[0].name.en].filter(Boolean).join(' | ');
    },
  },
});
</script>

<style lang="scss" scoped></style>
