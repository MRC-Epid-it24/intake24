<template>
  <v-card flat tile>
    <v-toolbar color="grey-lighten-4" flat tile>
      <v-icon color="secondary" end>
        fas fa-cloud-meatball
      </v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.cards.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" icon="$add" size="small" :title="$t('feedback-schemes.cards.add')" @click.stop="add" />
      <options-menu>
        <select-resource resource="feedback-schemes" return-object="cards" @update:model-value="load">
          <template #activator="{ props }">
            <v-list-item v-bind="props" link>
              <template #prepend>
                <v-icon icon="$download" />
              </template>
              <v-list-item-title>
                {{ $t('feedback-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="cards" />
      </options-menu>
    </v-toolbar>
    <v-list lines="two">
      <vue-draggable
        v-model="cards"
        :animation="300"
        handle=".drag-and-drop__handle"
      >
        <v-list-item
          v-for="(card, index) in cards"
          :key="card.id"
          class="drag-and-drop__item"
        >
          <template #prepend>
            <v-avatar class="drag-and-drop__handle" icon="$handle" />
          </template>
          <v-list-item-title>{{ getListItemTitle(card) }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ `Type: ${card.type}` }}
          </v-list-item-subtitle>
          <template #append>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.cards.edit')"
                @click.stop="edit({ card, index })"
              >
                <v-icon color="secondary-lighten-1">
                  $edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('feedback-schemes.cards.remove')"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: getListItemTitle(card) }) }}
              </confirm-dialog>
            </v-list-item-action>
          </template>
        </v-list-item>
      </vue-draggable>
    </v-list>
    <card-selector ref="selector" :images="images" @save="save" />
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import type { Card } from '@intake24/common/feedback';
import type { FeedbackImage, NutrientTypeResponse } from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { ConfirmDialog } from '@intake24/ui';

import CardSelector from './card-selector.vue';

export type CardEvent = {
  index: number;
  card: Card;
};

export default defineComponent({
  name: 'CardList',

  components: {
    CardSelector,
    ConfirmDialog,
    JsonEditorDialog,
    OptionsMenu,
    SelectResource,
    VueDraggable,
  },

  props: {
    images: {
      type: Array as PropType<FeedbackImage[]>,
      default: () => [],
    },
    nutrientTypes: {
      type: Array as PropType<NutrientTypeResponse[]>,
      default: () => [],
    },
    modelValue: {
      type: Array as PropType<Card[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const cards = ref<Card[]>(props.modelValue);
    const selector = ref<InstanceType<typeof CardSelector>>();

    return { cards, selector };
  },

  watch: {
    value(val) {
      if (deepEqual(val, this.cards))
        return;

      this.cards = [...val];
    },
    cards() {
      this.update();
    },
  },

  methods: {
    getListItemTitle(card: Card): string {
      const { image } = card;

      if (!('nutrientTypeIds' in card))
        return image;

      const nutrients = this.nutrientTypes
        .filter(({ id }) => card.nutrientTypeIds.includes(id))
        .map(item => item.description);

      return `${image} | ${nutrients.join(' | ')}`;
    },

    add() {
      this.selector?.add();
    },

    load(cards: Card[]) {
      this.cards = [...cards];
    },

    edit({ card, index }: CardEvent) {
      this.selector?.edit(index, card);
    },

    save({ card, index }: CardEvent) {
      if (index === -1)
        this.cards.push(card);
      else this.cards.splice(index, 1, card);
    },

    remove(index: number) {
      this.cards.splice(index, 1);
    },

    update() {
      this.$emit('update:modelValue', this.cards);
    },
  },
});
</script>
