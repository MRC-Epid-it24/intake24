<template>
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
          {{ $t(`feedback-schemes.cards.${dialog.index === -1 ? 'add' : 'edit'}`) }}
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
              <v-tab
                v-for="item in cardSettings[dialog.card.type].tabs" :key="item"
                :tab-value="item"
              >
                {{ $t(`feedback-schemes.cards.tabs.${item}`) }}
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
                  <v-col cols="12">
                    <v-card outlined>
                      <v-toolbar color="grey lighten-4" flat>
                        <v-toolbar-title>
                          <v-icon left>
                            fas fa-cloud-meatball
                          </v-icon>
                          {{ $t(`feedback-schemes.cards.type`) }}
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-item-group
                        v-model="dialog.card.type"
                        active-class="primary"
                        @change="updateCardProps"
                      >
                        <v-container>
                          <v-row>
                            <v-col v-for="card in cardDefaults" :key="card.type" cols="12" md="3">
                              <v-item v-slot="{ active, toggle }" :value="card.type">
                                <v-card
                                  :color="active ? 'primary' : ''"
                                  dark
                                  height="180"
                                  @click.stop="toggle"
                                >
                                  <v-card-title class="justify-center">
                                    {{ $t(`feedback-schemes.cards.${card.type}.title`) }}
                                  </v-card-title>
                                  <v-card-subtitle class="text-center">
                                    {{ $t(`feedback-schemes.cards.${card.type}.subtitle`) }}
                                  </v-card-subtitle>
                                  <v-card-text v-show="active" class="text-center">
                                    <v-icon x-large>
                                      $check
                                    </v-icon>
                                  </v-card-text>
                                </v-card>
                              </v-item>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-item-group>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined>
                      <v-toolbar color="grey lighten-4" flat>
                        <v-toolbar-title>
                          <v-icon left>
                            fas fa-gears
                          </v-icon>
                          {{ $t(`feedback-schemes.cards.options`) }}
                        </v-toolbar-title>
                      </v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="dialog.card.image"
                                hide-details="auto"
                                :items="images"
                                :label="$t('feedback-schemes.images._')"
                                name="image"
                                outlined
                              >
                                <template #item="{ item }">
                                  <v-avatar class="mr-4 my-2" tile>
                                    <v-img
                                      :alt="item.value"
                                      :src="characterImageMap[item.value]"
                                    />
                                  </v-avatar>
                                  {{ $t(`feedback-schemes.images.${item.value}`) }}
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-expansion-panels>
                                <v-expansion-panel key="color">
                                  <v-expansion-panel-header>
                                    {{ $t(`feedback-schemes.cards.color`) }}
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-color-picker
                                      v-model="dialog.card.color"
                                      show-swatches
                                    />
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-switch
                                v-model="dialog.card.showRecommendations"
                                hide-details="auto"
                                :label="$t('feedback-schemes.cards.showRecommendations')"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <component
              :is="dialog.card.type"
              v-model="dialog.card"
              @validate="validate"
            />
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { Card } from '@intake24/common/feedback';
import { useTinymce } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { cardDefaults, images as characterTypesRef } from '@intake24/common/feedback';
import { copy, merge, randomString } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n/index';
import { characterImageMap } from '@intake24/ui/feedback';

import { cardSettings } from './card';
import cardTypes from './card-types';

export type CardDialog = {
  show: boolean;
  index: number;
  card: Card;
};

export default defineComponent({
  name: 'CardSelector',

  components: { LanguageSelector, ...cardTypes },

  props: {
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['save'],

  setup() {
    useTinymce();
    const { i18n } = useI18n();
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    const images = characterTypesRef.map(value => ({
      value,
      text: i18n.t(`feedback-schemes.images.${value}`),
    }));

    return { images, characterImageMap, form };
  },

  data() {
    const dialog = (show = false): CardDialog => ({
      show,
      index: -1,
      card: copy({ ...cardDefaults[0], id: randomString(6) }),
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      cardDefaults,
      cardSettings,
      tab: 'general',
    };
  },

  computed: {
    textRules(): RuleCallback[] {
      return this.textRequired
        ? [(value: string | null): boolean | string => !!value || 'Card name is required.']
        : [];
    },
  },

  methods: {
    updateCardProps() {
      const {
        show,
        index,
        card: { type },
      } = this.dialog;

      const card = this.cardDefaults.find(item => item.type === type);
      if (!card)
        return;

      this.dialog = { show, index, card: copy({ ...card, id: randomString(6) }) };
    },

    add() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, card: Card) {
      const defaults = this.cardDefaults.find(c => c.type === card.type);
      if (!defaults) {
        console.warn(`Card defaults for card type '${card.type}' not found.`);
        return;
      }

      this.dialog = {
        show: true,
        index,
        card: copy(merge<Card>(defaults, card)),
      };
    },

    save() {
      const isValid = this.form?.validate();
      if (!isValid)
        return;

      const { index, card } = this.dialog;

      this.$emit('save', { card, index });

      this.reset();
    },

    reset() {
      this.tab = 'general';
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>
