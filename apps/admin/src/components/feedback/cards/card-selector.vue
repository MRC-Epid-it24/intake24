<template>
  <v-dialog
    v-model="dialog.show"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="reset">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`feedback-schemes.cards.${dialog.index === -1 ? 'create' : 'edit'}`) }}
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
              <v-tab v-for="item in cardSettings[dialog.card.type].tabs" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-container>
        </template>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="save">
        <v-container>
          <v-tabs-items v-model="tab" class="pt-1">
            <v-tab-item key="general">
              <v-row>
                <v-col cols="12">
                  <v-card outlined>
                    <v-toolbar color="grey lighten-4" flat>
                      <v-toolbar-title>
                        {{ $t(`feedback-schemes.cards.type`) }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-item-group
                      active-class="secondary"
                      v-model="dialog.card.type"
                      @change="updateCardProps"
                    >
                      <v-container>
                        <v-row>
                          <v-col v-for="card in cardDefaults" :key="card.type" cols="12" md="3">
                            <v-item v-slot:default="{ active, toggle }" :value="card.type">
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
                                  <v-icon x-large>fa-check-circle</v-icon>
                                </v-card-text>
                              </v-card>
                            </v-item>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-item-group>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <component
              :is="dialog.card.type"
              v-bind.sync="dialog.card"
              @validate="validate"
            ></component>
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
</template>

<script lang="ts">
import { copy, merge, randomString } from '@intake24/common/util';
import { Card } from '@intake24/common/feedback';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { defineComponent, ref } from '@vue/composition-api';
import tinymce from '@intake24/admin/components/tinymce/tinymce';
import { RuleCallback } from '@intake24/admin/types';
import cardTypes from './card-types';
import { cardDefaults, cardSettings } from './card';

export type CardDialog = {
  show: boolean;
  index: number;
  card: Card;
};

export default defineComponent({
  name: 'CardSelector',

  props: {
    textRequired: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    LanguageSelector,
    ...cardTypes,
  },

  mixins: [tinymce],

  setup() {
    const form = ref<InstanceType<typeof HTMLFormElement>>();

    return { form };
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
      tab: 0,
    };
  },

  computed: {
    textRules(): RuleCallback[] {
      return this.textRequired
        ? [(value: string | null): boolean | string => !!value || 'Card name is required.']
        : [];
    },
  },

  mounted() {
    document.addEventListener('focusin', this.focusInTox, true);
  },

  beforeDestroy() {
    document.removeEventListener('focusin', this.focusInTox, true);
  },

  methods: {
    focusInTox(event: FocusEvent) {
      const toxDialog = (event.target as HTMLElement).closest('.tox');
      if (!toxDialog) return;

      event.stopImmediatePropagation();
    },

    updateCardProps() {
      const {
        show,
        index,
        card: { type },
      } = this.dialog;

      const card = this.cardDefaults.find((item) => item.type === type);
      if (!card) return;

      this.dialog = { show, index, card: copy({ ...card, id: randomString(6) }) };
    },

    create() {
      this.dialog = this.newDialog(true);
    },

    edit(index: number, card: Card) {
      const defaults = this.cardDefaults.find((c) => c.type === card.type);
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
      if (!isValid) return;

      const { index, card } = this.dialog;

      this.$emit('save', { card, index });

      this.reset();
    },

    reset() {
      this.tab = 0;
      this.dialog = this.newDialog();
      this.form?.resetValidation();
    },

    validate() {
      this.form?.validate();
    },
  },
});
</script>
