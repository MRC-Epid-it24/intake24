<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { CreateElement, VNode, VNodeChildren } from 'vue';
import { LanguageTranslationAttributes } from '@intake24/common/types/models';
import { copy } from '@intake24/common/util';
import {
  VBtn,
  VCard,
  VCol,
  VContainer,
  VDialog,
  VIcon,
  VRow,
  VSpacer,
  VTextField,
  VToolbar,
  VToolbarItems,
  VToolbarTitle,
} from 'vuetify/lib';
import has from 'lodash/has';
import pick from 'lodash/pick';
import { LocaleMessageObject } from 'vue-i18n';
import { VCardTitle } from 'vuetify/lib/components';
import IntersectableSkeleton from './intersectable-skeleton.vue';

export default defineComponent({
  name: 'TranslationSection',

  components: { IntersectableSkeleton },

  props: {
    translation: {
      type: Object as PropType<LanguageTranslationAttributes>,
    },
  },

  data() {
    return {
      dialog: false,
      messages: {
        chunk: 10,
        all: {} as LocaleMessageObject,
        loaded: {} as LocaleMessageObject,
      },
    };
  },

  computed: {
    allKeys(): string[] {
      return Object.keys(this.messages.all);
    },
    loadedKeys(): string[] {
      return Object.keys(this.messages.loaded);
    },
    messagesAvailableToLoad(): boolean {
      return this.loadedKeys.length < this.allKeys.length;
    },
  },

  watch: {
    dialog(val: boolean) {
      if (!val) this.$emit('close');
    },
    translation(val: LanguageTranslationAttributes | null) {
      if (!val) return;

      this.messages = {
        chunk: 10,
        all: copy(val.messages),
        loaded: {},
      };
      this.dialog = true;
    },
  },

  methods: {
    loadMoreMessages(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting && this.messagesAvailableToLoad) {
        const startIndex = this.loadedKeys.length;
        const endIndex =
          startIndex + this.messages.chunk > this.allKeys.length
            ? this.allKeys.length
            : startIndex + this.messages.chunk;

        const items = this.allKeys.slice(startIndex, endIndex);
        this.messages.loaded = { ...this.messages.loaded, ...pick(this.messages.all, items) };
      }
    },

    close() {
      this.dialog = false;
    },

    cancel(event: Event) {
      event.stopPropagation();

      this.close();
    },

    save(event: Event) {
      event.stopPropagation();

      if (!this.translation) return;

      const {
        translation: { id },
        messages: { all, loaded },
      } = this;

      this.$emit('update', { id, messages: { ...all, ...loaded } });
      this.close();
    },

    getSectionTitle(): string {
      const key = this.translation?.section;
      if (!key) return '';

      const check = has(this.$i18n.messages[this.$i18n.locale], `${key}.title`);
      if (check) return this.$t(`${key}.title`).toString();

      return this.$t(`languages.translations.sections.${key}`).toString();
    },

    createInputs(
      h: CreateElement,
      translations: LocaleMessageObject,
      path: string[] = []
    ): VNodeChildren {
      const items = Object.keys(translations);
      if (!items.length || this.translation === null) return [];

      const section = this.translation?.section;
      if (!section) return [];

      const inputs = items.map((item) => {
        const fullPath = [section, ...path, item].join('.');

        if (typeof translations[item] !== 'string')
          return this.createInputs(h, translations[item] as LocaleMessageObject, [...path, item]);

        return h(VCol, { props: { cols: 12 } }, [
          h(VTextField, {
            props: {
              messages: this.$t(fullPath).toString(),
              label: fullPath,
              outlined: true,
              value: translations[item],
            },
            on: {
              input: (event: string) => {
                // eslint-disable-next-line no-param-reassign
                translations[item] = event;
              },
            },
          }),
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
            h(
              VCardTitle,
              `${this.$t('languages.translations.title').toString()} - ${this.getSectionTitle()}`
            ),
            h(VRow, [
              this.createInputs(h, this.messages.loaded),
              ...[
                this.messagesAvailableToLoad
                  ? h(VCol, { props: { cols: 12 } }, [
                      h(IntersectableSkeleton, {
                        props: { type: 'list-item' },
                        on: {
                          intersected: this.loadMoreMessages,
                        },
                      }),
                    ])
                  : undefined,
              ].filter(Boolean),
            ]),
          ]),
        ]),
      ]
    );
  },
});
</script>

<style lang="scss" scoped></style>
