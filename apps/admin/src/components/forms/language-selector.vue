<template>
  <v-card class="mb-4" v-bind="{ disabled, flat, outlined, tile }">
    <v-toolbar color="grey lighten-4" v-bind="{ flat, tile }">
      <v-toolbar-title>{{ label }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template #activator="{ attrs, on }">
          <v-btn
            color="primary"
            :disabled="!availableLanguages.length"
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>$add</v-icon>
          </v-btn>
        </template>
        <v-list class="grey lighten-3">
          <v-list-item v-for="lang in availableLanguages" :key="lang.code" @click="add(lang.code)">
            <span :class="`fi fi-${lang.countryFlagCode} mr-3`"></span>
            <span class="font-weight-medium">{{ lang.englishName }}</span>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-if="languages.length" #extension>
        <v-tabs v-model="selected" background-color="grey lighten-4">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="lang in languages" :key="lang">
            <span :class="`fi fi-${getLanguageFlag(lang)} mr-3`"></span>
            <span class="font-weight-medium">{{ getLanguageName(lang) }}</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="selected">
      <v-tab-item v-for="lang in languages" :key="lang">
        <v-card-text>
          <slot :lang="lang" :name="`lang.${lang}`"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" :disabled="isRemoveDisabled" text @click.stop="remove">
            <v-icon left>$delete</v-icon>{{ $t('common.action.delete') }}
          </v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { LocaleOptionList } from '@intake24/common/prompts';
import type { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import { useApp } from '@intake24/admin/stores';

export default defineComponent({
  name: 'LanguageSelector',

  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<
        LocaleTranslation | RequiredLocaleTranslation | LocaleOptionList<string | number>
      >,
      required: true,
    },
    default: {
      type: [String, Array],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
    },
  },

  emits: ['input', 'lang-add', 'lang-remove'],

  setup(props, { emit }) {
    const selected = ref<number | undefined>(undefined);
    const doNotRemove = computed(() => (props.required ? ['en'] : []));

    const languages = computed(() => Object.keys(props.value));

    const allLanguages = computed(
      () =>
        useApp().langs ?? [
          { code: 'en', englishName: 'English', localName: 'English', countryFlagCode: 'gb' },
        ]
    );

    const availableLanguages = computed(() =>
      allLanguages.value.filter((lang) => !languages.value.includes(lang.code))
    );

    const isRemoveDisabled = computed(() => {
      if (selected.value === undefined) return true;

      return doNotRemove.value.includes(languages.value[selected.value]);
    });

    const getLanguageFlag = (code: string) => {
      const language = allLanguages.value.find((lang) => lang.code === code);

      return language?.countryFlagCode ?? 'gb';
    };

    const getLanguageName = (code: string) => {
      const language = allLanguages.value.find((lang) => lang.code === code);

      return language?.englishName ?? 'English';
    };

    const add = async (code: string) => {
      emit('input', { ...props.value, [code]: props.default });
      selected.value = languages.value.length - 1;
      emit('lang-add');
    };

    const remove = () => {
      if (selected.value === undefined) return;

      const code = languages.value[selected.value];
      const { [code]: remove, ...rest } = props.value;
      emit('input', { ...rest });
      emit('lang-remove');
    };

    return {
      selected,
      doNotRemove,
      languages,
      allLanguages,
      availableLanguages,
      isRemoveDisabled,
      getLanguageFlag,
      getLanguageName,
      add,
      remove,
    };
  },
});
</script>

<style lang="scss" scoped></style>
