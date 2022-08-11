<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-5">
      <v-icon left color="primary">fas fa-cloud-meatball</v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.cards.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        class="mx-3"
        color="secondary"
        :title="$t('feedback-schemes.cards.add')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
      <load-section-dialog
        :schemeId="schemeId"
        schemeType="feedback"
        section="cards"
        @load="load"
      ></load-section-dialog>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="cards" handle=".drag-and-drop__handle">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(card, index) in cards"
            :key="card.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ getListItemTitle(card) }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ `Type: ${card.type}` }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.cards.edit')"
                @click.stop="edit({ card, index })"
              >
                <v-icon color="primary lighten-1">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                :label="$t('feedback-schemes.cards.remove').toString()"
                color="error"
                icon
                icon-left="$delete"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: getListItemTitle(card) }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <card-selector ref="selector" @save="save"></card-selector>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { Card } from '@intake24/common/feedback';
import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';
import { useEntry } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

import CardSelector from './card-selector.vue';

export type CardEvent = {
  index: number;
  card: Card;
};

export default defineComponent({
  name: 'CardList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<Card[]>,
      required: true,
    },
  },

  components: {
    draggable,
    CardSelector,
    ConfirmDialog,
    LoadSectionDialog,
  },

  setup(props) {
    const cards = ref<Card[]>(props.value);
    const selector = ref<InstanceType<typeof CardSelector>>();

    return { cards, selector };
  },

  computed: {
    allNutrientTypes(): NutrientTypeEntry[] {
      return useEntry().refs.nutrientTypes ?? [];
    },
  },

  watch: {
    value(val) {
      if (isEqual(val, this.cards)) return;

      this.cards = [...val];
    },
    cards() {
      this.update();
    },
  },

  methods: {
    getListItemTitle(card: Card): string {
      if (card.type === 'character') {
        const { characterType, nutrientTypeIds } = card;

        const nutrients = this.allNutrientTypes
          .filter(({ id }) => nutrientTypeIds.includes(id))
          .map((item) => item.description);

        return `${this.$t(`feedback-schemes.characterTypes.${characterType}`)} | ${nutrients.join(
          ' | '
        )}`;
      }

      return card.name.en;
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
      if (index === -1) this.cards.push(card);
      else this.cards.splice(index, 1, card);
    },

    remove(index: number) {
      this.cards.splice(index, 1);
    },

    update() {
      this.$emit('input', this.cards);
    },
  },
});
</script>
