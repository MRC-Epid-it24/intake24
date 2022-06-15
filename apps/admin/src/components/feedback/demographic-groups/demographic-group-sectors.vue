<template>
  <v-tabs vertical>
    <v-btn class="my-4" color="primary" @click="add">
      <v-icon left>$add</v-icon>
      {{ $t(`feedback-schemes.demographic-groups.sectors.add`) }}
    </v-btn>
    <v-tab v-for="(sector, index) in sectors" :key="index">
      <v-icon left>fas fa-scale-balanced</v-icon>
      {{ `${$t(`feedback-schemes.demographic-groups.sectors._`)} ${index + 1}` }}
    </v-tab>
    <v-tab-item v-for="(sector, index) in sectors" :key="index">
      <v-card tile>
        <v-card-title>
          <v-icon left>fas fa-scale-balanced</v-icon>
          {{ `${$t(`feedback-schemes.demographic-groups.sectors._`)} ${index + 1}` }}
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="sector.sentiment"
                :items="sentiments"
                :label="$t('feedback-schemes.sentiments._')"
                hide-details="auto"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end">
              <div class="mr-4 subtitle-1">
                <v-icon left>fas fa-left-right</v-icon>
                {{ $t('feedback-schemes.ranges._') }}
              </div>
              <div>
                <v-text-field
                  v-model.number="sector.range.start"
                  :label="$t('feedback-schemes.ranges.start')"
                  class="mb-4"
                  dense
                  hide-details="auto"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model.number="sector.range.end"
                  :label="$t('feedback-schemes.ranges.end')"
                  dense
                  hide-details="auto"
                  outlined
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12">
              <language-selector v-model="sector.name" :label="$t('common.name')">
                <template v-for="lang in Object.keys(sector.name)" v-slot:[`lang.${lang}`]>
                  <v-text-field
                    v-model="sector.name[lang]"
                    :key="lang"
                    :label="$t('common.name')"
                    :rules="nameRules"
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <language-selector :label="$t('common.description')" v-model="sector.description">
                <template v-for="lang in Object.keys(sector.description)" v-slot:[`lang.${lang}`]>
                  <editor :init="tinymceInit" :key="lang" v-model="sector.description[lang]" />
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                color="error"
                large
                :title="$t(`feedback-schemes.demographic-groups.sectors.remove`)"
                @click.stop="remove"
              >
                <v-icon left>$delete</v-icon>
                {{ $t(`feedback-schemes.demographic-groups.sectors.remove`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import isEqual from 'lodash/isEqual';
import { defineComponent, PropType } from '@vue/composition-api';
import { DemographicGroupScaleSector, sentiments } from '@intake24/common/feedback';
import { tinymce } from '@intake24/admin/components/tinymce';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { copy } from '@intake24/common/util';
import type { RuleCallback } from '@intake24/admin/types';
import { demographicGroupScaleSectorDefaults } from '.';

export default defineComponent({
  name: 'DemographicGroupSectors',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    value: {
      type: Array as PropType<DemographicGroupScaleSector[]>,
      required: true,
    },
  },

  data() {
    return {
      demographicGroupScaleSectorDefaults,
      sectors: this.value,
      sentiments: sentiments.map((value) => ({
        text: this.$t(`feedback-schemes.sentiments.${value}`),
        value,
      })),
    };
  },

  computed: {
    nameRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          !!value || this.$t('feedback-schemes.cards.required').toString(),
      ];
    },
  },

  watch: {
    value(val) {
      if (isEqual(val, this.sectors)) return;

      this.sectors = [...val];
    },
    sectors: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    add() {
      this.sectors.push(copy(demographicGroupScaleSectorDefaults));
    },

    remove(index: number) {
      this.sectors.splice(index, 1);
    },

    update() {
      this.$emit('input', this.sectors);
    },
  },
});
</script>

<style lang="scss" scoped></style>
