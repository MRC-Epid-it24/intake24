<script lang="ts">
import Vue, { CreateElement, VNode, VNodeChildren } from 'vue';
import { LanguageMessageAttributes } from '@common/types/models';
import { copy } from '@common/util';
import {
  VBtn,
  VCard,
  VCol,
  VContainer,
  VDialog,
  VIcon,
  VLazy,
  VList,
  VListItem,
  VListItemContent,
  VListItemSubtitle,
  VListItemTitle,
  VRow,
  VSpacer,
  VTextField,
  VToolbar,
  VToolbarItems,
  VToolbarTitle,
} from 'vuetify/lib';

import has from 'lodash/has';
import { LocaleMessages } from 'vue-i18n';

export default Vue.extend({
  name: 'TranslationSection',

  props: {
    languageMessage: {
      type: Object as () => LanguageMessageAttributes | null,
    },
  },

  data() {
    return {
      dialog: false,
      messages: {} as LocaleMessages,
    };
  },

  watch: {
    dialog(val: boolean) {
      if (!val) this.$emit('close');
    },
    languageMessage(val: LanguageMessageAttributes | null) {
      if (!val) return;

      this.messages = copy(val.messages);
      this.dialog = true;
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },

    cancel(event: Event) {
      event.stopPropagation();

      this.close();
    },

    save(event: Event) {
      event.stopPropagation();

      if (!this.languageMessage) return;

      const {
        languageMessage: { id },
        messages,
      } = this;

      this.$emit('update', { id, messages });
      this.close();
    },

    getSectionTitle(): string {
      const key = this.languageMessage?.section;
      if (!key) return '';

      const check = has(this.$i18n.messages[this.$i18n.locale], `${key}.title`);
      if (check) return this.$t(`${key}.title`).toString();

      return this.$t(`languages.messages.sections.${key}`).toString();
    },

    createInputs(h: CreateElement, messages: LocaleMessages, path: string[] = []): VNodeChildren {
      const items = Object.keys(messages);
      if (!items.length || this.languageMessage === null) return [];

      const { section } = this.languageMessage;

      const inputs = items.map((item) => {
        const fullPath = [section, ...path, item].join('.');

        if (typeof messages[item] !== 'string')
          return this.createInputs(h, messages[item] as LocaleMessages, [...path, item]);

        return h(VLazy, [
          h(
            VListItem,
            {
              attrs: { class: 'list-item-border' },
              props: { link: true },
              key: fullPath,
            },
            [
              h(VListItemContent, [
                h(VListItemTitle, `${this.$t('languages.messages.path')}: ${fullPath}`),
                h(VListItemSubtitle, this.$t(fullPath).toString()),
                h(VTextField, {
                  props: {
                    dense: true,
                    hideDetails: 'auto',
                    label: this.$t('schemes.data-export.field.id'),
                    outlined: true,
                    value: messages[item],
                  },
                  on: {
                    input: (event: string) => {
                      // eslint-disable-next-line no-param-reassign
                      (messages[item] as unknown as string) = event;
                    },
                  },
                }),
              ]),
            ]
          ),
        ]);
      });

      return inputs;
    },
  },

  render(h: CreateElement): VNode {
    return h(
      VDialog,
      {
        props: {
          fullscreen: true,
          hideOverlay: true,
          value: this.dialog,
          transition: 'dialog-bottom-transition',
        },
        on: {
          input: (event: boolean) => {
            this.dialog = event;
          },
        },
      },
      [
        h(VCard, { props: { tile: true } }, [
          h(VToolbar, { props: { dark: true, color: 'primary' } }, [
            h(
              VBtn,
              {
                props: {
                  title: this.$t('common.action.cancel'),
                  icon: true,
                  dark: true,
                },
                on: {
                  click: this.cancel,
                },
              },
              [h(VIcon, '$cancel')]
            ),
            h(VToolbarTitle, this.getSectionTitle()),
            h(VSpacer),
            h(VToolbarItems, [
              h(
                VBtn,
                {
                  props: {
                    title: this.$t('common.action.ok'),
                    dark: true,
                    text: true,
                  },
                  on: {
                    click: this.save,
                  },
                },
                [
                  h(VIcon, { props: { left: true } }, '$success'),
                  this.$t('common.action.ok').toString(),
                ]
              ),
            ]),
          ]),
          h(VContainer, [
            h(VRow, [
              h(VCol, [
                h(VList, { props: { twoLine: true } }, this.createInputs(h, this.messages)),
              ]),
            ]),
          ]),
        ]),
      ]
    );
  },
});
</script>

<style lang="scss" scoped></style>
