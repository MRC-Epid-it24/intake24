<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-2">
      <v-icon class="mr-3" color="primary">fas cloud-meatball</v-icon>
      <v-toolbar-title class="font-weight-medium">{{
        $t('feedback-schemes.food-groups.title')
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        class="mx-3"
        color="secondary"
        :title="$t('feedback-schemes.food-groups.create')"
        @click.stop="create"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="groups" @end="update">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(group, index) in groups"
            :key="`${group.type}-${index}`"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ group.name.en }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ `Type: ${group.type}` }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.food-groups.edit')"
                @click.stop="edit({ group, index })"
              >
                <v-icon color="primary lighten-1">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.food-groups.remove')"
                @click.stop="remove(index)"
              >
                <v-icon color="error">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <food-group-selector ref="selector" @save="save"> </food-group-selector>
  </v-card>
</template>

<script lang="ts">
import isEqual from 'lodash/isEqual';
import draggable from 'vuedraggable';
import { promptSettings } from '@intake24/admin/components/prompts';
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { FoodGroup } from '@intake24/common/feedback';
import FoodGroupSelector from './food-group-selector.vue';

export type FoodGroupEvent = {
  index: number;
  group: FoodGroup;
};

export default defineComponent({
  name: 'FoodGroupList',

  props: {
    value: {
      type: Array as PropType<FoodGroup[]>,
      required: true,
    },
  },

  components: {
    draggable,
    FoodGroupSelector,
  },

  setup() {
    const selector = ref<InstanceType<typeof FoodGroupSelector>>();

    return { selector };
  },

  data() {
    return {
      groups: this.value,
      promptSettings,
    };
  },

  watch: {
    value(val) {
      if (isEqual(val, this.groups)) return;

      this.groups = [...val];
    },
    groups() {
      this.update();
    },
  },

  methods: {
    create() {
      this.selector?.create();
    },

    load(group: FoodGroup) {
      this.groups.push(group);
    },

    edit({ group, index }: FoodGroupEvent) {
      this.selector?.edit(index, group);
    },

    save({ group, index }: FoodGroupEvent) {
      if (index === -1) this.groups.push(group);
      else this.groups.splice(index, 1, group);
    },

    remove(index: number) {
      this.groups.splice(index, 1);
    },

    update() {
      this.$emit('input', this.groups);
    },
  },
});
</script>
