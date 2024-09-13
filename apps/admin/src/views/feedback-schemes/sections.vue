<template>
  <v-card flat tile>
    <v-toolbar color="grey lighten-3" flat tile>
      <v-icon color="secondary" left>
        fas fa-bars-staggered
      </v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.sections.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-menu close-on-click left offset-y>
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            class="ml-3"
            color="primary"
            fab
            small
            :title=" $t('feedback-schemes.sections.add')"
            v-on="on"
          >
            <v-icon>$add</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="section in availableSections" :key="section.id" link @click="add(section.id)">
            <v-list-item-title>
              {{ section.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-list class="py-0">
      <draggable
        v-model="items"
        handle=".drag-and-drop__handle"
        @end="update"
      >
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(section, index) in sections"
            :key="section.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fas fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.sections.edit')"
                @click.stop="edit(index, items[index])"
              >
                <v-icon color="secondary lighten-2">
                  $edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('feedback-schemes.sections.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: section.title }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-if="typeof dialog.item !== 'string'"
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
            <v-icon dark left>
              fas fa-bars-staggered
            </v-icon>
            {{
              $t(`feedback-schemes.sections.${dialog.index === -1 ? 'add' : 'edit'}`)
            }}
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
                <v-tab v-for="item in ['general', 'json']" :key="item" :tab-value="item">
                  {{ $t(`feedback-schemes.sections.tabs.${item}`) }}
                </v-tab>
              </v-tabs>
            </v-container>
          </template>
        </v-toolbar>
        <v-form ref="form" @submit.prevent="save">
          <v-container>
            <v-tabs-items v-model="tab" class="pt-1">
              <v-tab-item key="general" value="general">
                <language-selector
                  v-model="dialog.item.title"
                  :label="$t('feedback-schemes.custom.header').toString()"
                >
                  <template v-for="lang in Object.keys(dialog.item.title)" #[`lang.${lang}`]>
                    <v-text-field
                      :key="lang"
                      v-model="dialog.item.title[lang]"
                      hide-details="auto"
                      :label="$t('feedback-schemes.custom.header')"
                      outlined
                    />
                  </template>
                </language-selector>
                <language-selector
                  v-model="dialog.item.content"
                  :label="$t('feedback-schemes.custom.content').toString()"
                >
                  <template v-for="lang in Object.keys(dialog.item.content)" #[`lang.${lang}`]>
                    <html-editor :key="lang" v-model="dialog.item.content[lang]" />
                  </template>
                </language-selector>
              </v-tab-item>
              <v-tab-item key="json" value="json">
                <v-container>
                  <json-editor v-model="dialog.item" />
                </v-container>
              </v-tab-item>
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
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';
import Draggable from 'vuedraggable';

import type {
  FeedbackSection,
  FeedbackStandardSection,
} from '@intake24/common/feedback';
import { HtmlEditor, JsonEditor, useTinymce } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { useListWithDialog } from '@intake24/admin/composables';
import {
  feedbackStandardSections,
} from '@intake24/common/feedback';
import { kebabCase, randomString } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'FeedbackSections',

  components: { ConfirmDialog, Draggable, HtmlEditor, JsonEditor, LanguageSelector },

  props: {
    value: {
      type: Array as PropType<FeedbackSection[]>,
      required: true,
    },
  },

  setup(props, ctx) {
    const route = useRoute();
    const router = useRouter();
    useTinymce();
    const { i18n, translate } = useI18n();

    const newCustomSection = () => ({ id: randomString(6), title: { en: null }, content: { en: null } });

    const { dialog, form, items, add: addCustomSection, edit: editCustomSection, remove, reset: resetItem, save, update }
      = useListWithDialog<FeedbackSection>(props, ctx, { newItem: newCustomSection });

    const tab = ref('general');

    const add = (section: FeedbackStandardSection | 'custom') => {
      if (section === 'custom') {
        addCustomSection();
        return;
      }

      if (section === 'submissions')
        items.value.unshift(section);
      else
        items.value.push(section);

      update();
    };

    const edit = (index: number, section: FeedbackSection) => {
      if (typeof section !== 'string') {
        editCustomSection(index, section);
        return;
      }

      const { id } = route.params;
      router.push({ name: `feedback-schemes-${kebabCase(section)}`, params: { id } });
    };

    const reset = () => {
      tab.value = 'general';
      resetItem();
    };

    const availableSections = computed(() => {
      const usedSections = props.value.filter(section => typeof section === 'string');
      return ['custom', ...feedbackStandardSections.filter(section => !usedSections.includes(section))].map(id => ({
        id,
        title: i18n.t(`feedback-schemes.${kebabCase(id)}.title`).toString(),
      }) as { id: FeedbackStandardSection | 'custom'; title: string });
    });

    const sections = computed(() => items.value.map(section =>
      typeof section == 'string'
        ? { id: section, title: i18n.t(`feedback-schemes.${kebabCase(section)}.title`) }
        : { id: section.id, title: translate(section.title) || i18n.t(`feedback-schemes.custom.title`) }));

    return {
      add,
      availableSections,
      dialog,
      edit,
      form,
      items,
      remove,
      reset,
      save,
      sections,
      tab,
      update,
    };
  },
});
</script>

<style lang="scss" scoped></style>
