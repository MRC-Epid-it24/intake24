<template>
  <v-dialog
    v-if="$props.dialog"
    v-model="$props.dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="700px"
  >
    <v-card class="dialog-card" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar class="sticky-toolbar" color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="$emit('close')">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('locales.recipe-foods.steps') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" :title="$t('common.action.save')" @click.stop="saveSteps">
          {{ $t('common.action.save') }}
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item v-for="(item, idx) in form.items" :key="idx" class="list-item-border">
          <v-list-item-content class="v-list-item-content">
            <v-container class="px-2">
              <v-subheader class="text-h4 font-weight-medium mb-4 px-0">
                <v-avatar class="mr-3" color="primary" size="28">
                  <span class="white--text font-weight-medium text-h6">{{ item.order }}</span>
                </v-avatar>
                {{ translate(item.name) }}
              </v-subheader>
              <v-row col="12">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.code"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.step_code')"
                    name="special"
                    outlined
                    readonly
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.trim="item.order"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.order')"
                    name="code"
                    outlined
                    readonly
                  />
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
                      />
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
                      />
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
                    name="repeatable"
                  />
                  <v-switch
                    v-model="item.required"
                    hide-details="auto"
                    :label="$t('locales.recipe-foods.require')"
                    name="required"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <select-resource
                    v-model.trim="item.categoryCode"
                    activator-class="mb-2"
                    item-id="code"
                    :label="$t('locales.recipe-foods.ingredientsCategory')"
                    name="ingredientsCategoryCode"
                    resource="categories"
                  >
                    <template #title>
                      {{ $t(`fdbs.categories.title`) }}
                    </template>
                    <template #item="{ item: resItem }">
                      <v-list-item-title>{{ resItem.code }}</v-list-item-title>
                      <v-list-item-subtitle>{{ resItem.name }}</v-list-item-subtitle>
                    </template>
                  </select-resource>
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
              <v-icon color="error">
                $delete
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-spacer class="pa-2" />
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
import type { PropType } from 'vue';
import { defineComponent, reactive } from 'vue';

import type {
  RecipeFoodStepAttributes,
  RecipeFoodStepRequest,
} from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { createForm } from '@intake24/admin/util';
import { useI18n } from '@intake24/i18n';

export type LocaleRecipeFoodStepsForm = {
  items: RecipeFoodStepRequest[];
};

export type Locale = {
  id: string;
  code: string;
};

export default defineComponent({
  name: 'StepsDialog',

  components: { LanguageSelector, SelectResource },

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
      type: Object as PropType<Locale>,
      required: true,
    },
    items: {
      type: Array as PropType<RecipeFoodStepRequest[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { translate } = useI18n();

    const form = reactive(createForm<LocaleRecipeFoodStepsForm>({ items: props.items }));

    const saveSteps = async () => {
      form.items = form.items
        .filter(({ name }) => name)
        .map((item, idx) => {
          item.order = idx + 1;
          return item;
        });

      const items = await form.post<RecipeFoodStepAttributes[]>(
        `admin/locales/${props.locale.id}/recipe-foods/${props.activeRecipeFoodId}/steps`,
      );

      emit('update-steps', items);
    };

    const addStep = () => {
      form.items.push({
        id: undefined,
        code: `${props.activeRecipeFoodCode.substring(1)}_STP-${form.items.length + 1}`,
        recipeFoodsId: props.activeRecipeFoodId,
        name: { en: 'Name' },
        description: { en: 'Description' },
        order: form.items.length + 1,
        localeId: props.locale.code,
        categoryCode: '',
        repeatable: false,
        required: false,
      });
    };

    const removeStep = (index: number) => {
      console.log(index);
      form.items.splice(index, 1);
    };

    return {
      form,
      addStep,
      removeStep,
      saveSteps,
      translate,
    };
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
