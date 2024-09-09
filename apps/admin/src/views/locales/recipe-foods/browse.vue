<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="save">
    <v-toolbar bottom color="grey lighten-5" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('locales.recipe-foods.title') }}
      </v-toolbar-title>
      <v-spacer />
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
          <v-icon>fas fa-bowl-food</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-container class="px-0">
            <div class="text-h4 font-weight-medium mb-4">
              {{ item.name }}
            </div>
            <v-row col="12">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.trim="item.name"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.title')"
                  name="special"
                  outlined
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.trim="item.code"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.code')"
                  name="code"
                  outlined
                  prepend-inner-icon="fa-sharp fa-regular fa-dollar-sign"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.trim="item.recipeWord"
                  hide-details="auto"
                  :label="$t('locales.recipe-foods.special')"
                  name="special"
                  outlined
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-select
                  v-if="form.synonymsSets"
                  v-model="item.synonymsId"
                  hide-details="auto"
                  :hint="`${item.synonymSet?.synonyms}, ${item.synonymSet?.id}`"
                  item-text="synonyms"
                  item-value="id"
                  :items="form.synonymsSets"
                  :label="$t('locales.recipe-foods.synonymsId')"
                  outlined
                  single-line
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="4">
                <v-btn
                  block
                  color="primary"
                  :disabled="form.errors.any() || isAppLoading || !item.id"
                  :title="$t('locales.recipe-foods.steps')"
                  type="button"
                  @click.stop="() => openStepsDialog(item.id, item.code, item)"
                >
                  <v-icon left>
                    fas fa-arrow-down-1-9
                  </v-icon>{{ $t('locales.recipe-foods.steps') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
        <v-list-item-action>
          <confirm-dialog
            color="error"
            icon
            icon-left="$delete"
            :label="$t('locales.recipe-foods.remove').toString()"
            @confirm="remove(idx)"
          >
            {{ $t('common.action.confirm.delete', { name: item.recipeWord }) }}
          </confirm-dialog>
        </v-list-item-action>
        <steps-dialog
          v-if="dialog && item.id === activeRecipeFoodId"
          v-bind="{
            dialog,
            activeRecipeFoodId,
            activeRecipeFoodCode,
            locale: { id, code: item.localeId },
            items: activeRecipeFood.steps,
          }"
          @close="toggleDialog"
          @update-steps="updateItemSteps(idx, item.id, $event)"
        />
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  LocaleEntry,
  RecipeFoodEntry,
  RecipeFoodRequest,
  SynonymSetAttributes,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

import StepsDialog from './steps-dialog.vue';

export type RecipeFoodItem = RecipeFoodRequest & Partial<{ synonymSet: RecipeFoodEntry['synonymSet']; steps: RecipeFoodEntry['steps'] }>;

export type RecipeFoodsForm = {
  items: RecipeFoodItem[];
  synonymsSets: SynonymSetAttributes[];
};
export type ChangedSynonyms = { idx: number; item: string };

export default defineComponent({
  name: 'RecipeFoods',

  components: { ConfirmDialog, StepsDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      RecipeFoodsForm,
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
      activeRecipeFood: {} as RecipeFoodItem,
    };
  },

  async mounted() {
    const [{ data: items }, { data: synonymsSets }] = await Promise.all([
      this.$http.get<RecipeFoodEntry[]>(`admin/locales/${this.id}/recipe-foods`),
      this.$http.get<SynonymSetAttributes[]>(`admin/locales/${this.id}/synonym-sets`),
    ]);

    this.toForm({ items, synonymsSets });
  },

  methods: {
    dollarSignAdd(value: string) {
      if (value[0] === '$')
        return value;
      return `$${value}`;
    },

    toggleDialog() {
      this.dialog = !this.dialog;
    },

    openStepsDialog(
      recipeFoodId: string | undefined,
      recipeFoodCode: string,
      recipeFood: RecipeFoodRequest,
    ) {
      if (!recipeFoodId)
        return;
      this.activeRecipeFoodId = recipeFoodId;
      this.activeRecipeFoodCode = recipeFoodCode;
      this.activeRecipeFood = recipeFood;
      this.toggleDialog();
      console.log(recipeFoodId, recipeFoodCode, recipeFood);
    },

    add() {
      this.form.items.push({
        localeId: this.id,
        name: '',
        code: '',
        recipeWord: '',
        synonymsId: null,
      });
    },

    remove(index: number) {
      this.form.items.splice(index, 1);
    },

    async updateItemSteps(idx: number, id: string, steps: RecipeFoodEntry['steps']) {
      this.toggleDialog();
      const item = this.form.items.find(item => item.id === id);
      if (!item)
        return;
      item.steps = steps;
      this.form.items.splice(idx, 1, item);
      useStoreEntry().setEntry({ items: this.form.items });
    },

    async save() {
      this.form.items = this.form.items.filter(({ name }) => name).map((item) => {
        item.code = this.dollarSignAdd(item.code);
        return item;
      });
      const synonymsSets = this.form.synonymsSets;
      const items = await this.form.post<RecipeFoodEntry[]>(
        `admin/locales/${this.id}/recipe-foods`,
      );

      useStoreEntry().setEntry({ items, synonymsSets });
    },
  },
});
</script>

<style lang="scss" scoped></style>
