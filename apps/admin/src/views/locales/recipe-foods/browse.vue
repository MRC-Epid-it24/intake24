<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.recipe-foods.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3"
        color="secondary"
        fab
        small
        :title="$t('locales.recipe-foods.add')"
        @click.stop="add"
      >
        <v-icon>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list>
      <v-list-item v-for="(item, idx) in form.items" :key="idx" class="list-item-border">
        <v-list-item-avatar>
          <v-icon>fa-light fa-bowl-food</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-container>
            <v-row justify="center">
              <v-col>
                <v-subheader>
                  {{ item.name }}
                </v-subheader>
              </v-col>
            </v-row>
            <v-row col="12">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.trim="item.name"
                  class="ma-5"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.title')"
                  name="special"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.trim="item.recipeWord"
                  class="ma-5"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.special')"
                  name="special"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.trim="item.code"
                  class="ma-5"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.code')"
                  name="code"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8">
                <v-select
                  v-if="form.synonymsSets"
                  v-model="item.synonyms"
                  :hint="`${item.synonyms?.synonyms}, ${item.synonyms?.id}`"
                  item-text="synonyms"
                  item-value="id"
                  :items="form.synonymsSets"
                  :label="$t('locales.recipe-foods.synonyms_id')"
                  outlined
                  return-object
                  single-line
                  @change="changeSynonyms({ idx: idx, item: item.synonyms?.id })"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="4">
                <v-btn
                  block
                  color="primary"
                  :disabled="form.errors.any() || isAppLoading"
                  :title="$t('locales.recipe-foods.steps')"
                  type="button"
                  @click.stop="() => openStepsDialog(item.id, item.code, item)"
                >
                  <v-icon left>fa-light fa-arrow-down-1-9</v-icon
                  >{{ $t('locales.recipe-foods.steps') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('locales.recipe-foods.remove')" @click.stop="remove(idx)">
            <v-icon color="error">$delete</v-icon>
          </v-btn>
        </v-list-item-action>
        <steps-dialog
          v-if="dialog && item.id === activeRecipeFoodId"
          v-bind="{
            dialog,
            activeRecipeFoodId,
            activeRecipeFoodCode,
            locale: { id: parseInt(id), code: item.localeId },
            items: activeRecipeFood.steps,
          }"
          ref="stepsDialog"
          @close="toggleDialog"
        ></steps-dialog>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  LocaleEntry,
  LocaleRecipeFoods,
  LocaleRecipeFoodsInput,
  LocaleSynonymSet,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';

import StepsDialog from './steps-dialog.vue';

export type LocaleRecipeFoodsForm = {
  items: LocaleRecipeFoodsInput[];
  synonymsSets: LocaleSynonymSet[];
};
export type changedSynonms = { idx: number; item: string };

export default defineComponent({
  name: 'LocaleRecipeFoods',

  components: { StepsDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      LocaleRecipeFoodsForm,
      LocaleEntry
    >(props, {
      data: { items: [], synonymsSets: [] },
      config: { transform: ({ items }) => items },
    });

    return {
      entry,
      entryLoaded,
      clearError,
      form,
      routeLeave,
      submit,
      toForm,
    };
  },

  data() {
    return {
      dialog: false,
      activeRecipeFoodId: '',
      activeRecipeFoodCode: '',
      activeRecipeFood: {} as LocaleRecipeFoodsInput,
    };
  },

  async mounted() {
    const { data: items } = await this.$http.get<LocaleRecipeFoods[]>(
      `admin/locales/${this.id}/recipe-foods`
    );
    const { data: synonymsSets } = await this.$http.get<LocaleSynonymSet[]>(
      `admin/locales/${this.id}/synonym-sets`
    );

    this.toForm({ items, synonymsSets });
  },

  methods: {
    toggleDialog() {
      this.dialog = !this.dialog;
    },

    openStepsDialog(
      recipeFoodId: string | undefined,
      recipeFoodCode: string,
      recipeFood: LocaleRecipeFoodsInput
    ) {
      if (!recipeFoodId) return;
      this.activeRecipeFoodId = recipeFoodId;
      this.activeRecipeFoodCode = recipeFoodCode;
      this.activeRecipeFood = recipeFood;
      this.toggleDialog();
      console.log(recipeFoodId, recipeFoodCode, recipeFood);
    },

    changeSynonyms(changedSynonms: changedSynonms) {
      console.log(changedSynonms);
      if (changedSynonms.item)
        this.form.items[changedSynonms.idx].synonyms_id = parseInt(changedSynonms.item);
    },

    add() {
      this.form.items.push({
        localeId: this.id,
        name: '',
        code: '',
        recipeWord: '',
        synonyms_id: null,
      });
    },

    remove(index: number) {
      this.form.items.splice(index, 1);
    },

    async save() {
      this.form.items = this.form.items.filter(({ name }) => name);
      const synonymsSets = this.form.synonymsSets;
      const items = await this.form.post<LocaleRecipeFoods[]>(
        `admin/locales/${this.id}/recipe-foods`
      );

      useStoreEntry().setEntry({ items, synonymsSets });
    },
  },
});
</script>

<style lang="scss" scoped></style>
