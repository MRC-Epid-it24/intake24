<template>
  <v-dialog
    v-if="$props.dialog"
    v-model="$props.dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="700px"
  >
    <v-card class="dialog-card" :loading="isLoading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar class="sticky-toolbar" color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="$emit('close')">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('locales.recipe-foods.steps') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" :title="$t('common.action.save')" @click.stop="saveSteps">
          {{ $t('common.action.save') }}
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item v-for="(item, idx) in form.items" :key="idx" class="list-item-border">
          <v-list-item-content class="v-list-item-content">
            <v-container>
              <v-row justify="center">
                <v-col>
                  <v-subheader class="headline">
                    {{ item.order + ': ' + translate(item.name) }}
                  </v-subheader>
                </v-col>
              </v-row>
              <v-row col="12">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.code"
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.code')"
                    name="special"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.order"
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.order')"
                    name="code"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <language-selector
                    v-model="item.name"
                    :label="$t('locales.recipe-foods.name').toString()"
                    required
                  >
                    <template v-for="lang in Object.keys(item.name)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="item.name[lang]"
                        :error-messages="form.errors.get(`estimateIn.${lang}`)"
                        hide-details="auto"
                        :name="`estimateIn.${lang}`"
                        outlined
                        @input="form.errors.clear(`estimateIn.${lang}`)"
                      ></v-text-field>
                    </template>
                  </language-selector>
                </v-col>
                <v-col cols="12">
                  <language-selector
                    v-model="item.name"
                    :label="$t('locales.recipe-foods.description').toString()"
                    required
                  >
                    <template v-for="lang in Object.keys(item.name)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="item.description[lang]"
                        :error-messages="form.errors.get(`recipe-foods.${lang}`)"
                        hide-details="auto"
                        :name="`recipe-foods.${lang}`"
                        outlined
                        @input="form.errors.clear(`recipe-foods.${lang}`)"
                      ></v-text-field>
                    </template>
                  </language-selector>
                </v-col>
              </v-row>
              <v-row col="12">
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="item.repeatable"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.repeat')"
                    name="Repeatable"
                  ></v-switch>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.categoryCode"
                    class="ma-5"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.ingredientsCategory')"
                    name="ingredientsCategoryCode"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
          <v-list-item-action class="v-list-item-action">
            <v-btn
              block
              class="full-width-btn"
              elevation="0"
              :title="$t('locales.recipe-foods.remove')"
              @click.stop="removeStep(idx)"
            >
              <v-icon color="error">$delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-spacer class="pa-2"></v-spacer>
        <div class="justify-center d-flex">
          <v-btn
            class="display-1"
            color="primary"
            fab
            :title="$t('locales.recipe-foods.add')"
            @click.stop="addStep"
          >
            <v-icon>$add</v-icon>
          </v-btn>
        </div>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { LocaleTranslation } from '@intake24/common/types';
import type {
  LocaleEntry,
  LocaleRecipeFoodSteps,
  LocaleRecipeFoodStepsInput,
} from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useEntry as useStoreEntry } from '@intake24/admin/stores';
import { useI18n } from '@intake24/i18n';

export type LocaleRecipeFoodStepsForm = {
  items: LocaleRecipeFoodStepsInput[];
};

export type Locale = {
  id: number;
  code: string;
};

export default defineComponent({
  name: 'StepsDialog',

  components: { LanguageSelector },

  mixins: [formMixin],

  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    activeRecipeFoodId: {
      type: String,
      required: true,
    },
    activeRecipeFoodCode: {
      type: String,
      required: true,
    },
    locale: {
      type: Object as () => Locale,
      required: true,
    },
    items: {
      type: Array as () => LocaleRecipeFoodStepsInput[],
    },
  },
  setup(props) {
    const isLoading = ref(false);
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);
    const { translate } = useI18n();
    const { clearError, form, routeLeave, submit, toForm } = useEntryForm<
      LocaleRecipeFoodStepsForm,
      LocaleEntry
    >(props, {
      data: { items: [] },
      config: { transform: ({ items }) => items },
    });

    return {
      isLoading,
      entry,
      entryLoaded,
      clearError,
      form,
      routeLeave,
      submit,
      toForm,
      translate,
    };
  },

  mounted() {
    if (this.$props.items) this.toForm({ items: this.$props.items });
    else console.error('No items');
  },

  methods: {
    async saveSteps() {
      this.form.items = this.form.items.filter(({ name }) => name);
      const items = await this.form.post<LocaleRecipeFoodSteps[]>(
        `admin/locales/${this.locale.id}/recipe-foods/${this.$props.activeRecipeFoodId}/steps`
      );

      useStoreEntry().updateEntry({ steps: items });
    },

    addStep() {
      this.form.items.push({
        id: undefined,
        code: '',
        recipeFoodsId: parseInt(this.$props.activeRecipeFoodId),
        name: { en: 'Name' } as LocaleTranslation,
        description: { en: 'Description' } as LocaleTranslation,
        order: 0,
        localeId: this.locale.code,
        categoryCode: '',
        repeatable: false,
      });
    },

    removeStep(index: number) {
      this.form.items.splice(index, 1);
    },
  },
});
</script>

<style scoped lang="scss">
.v-list-item-content {
  flex: 9;
  display: flex;
  align-items: center;
}

.v-list-item-action {
  flex: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;

  > .full-width-btn {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5d4;
  }
}

.dialog-card {
  .sticky-toolbar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
  }
}
</style>
