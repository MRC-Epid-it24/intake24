<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <v-list two-line subheader>
      <v-subheader>{{ $t('profile.info') }}</v-subheader>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon class="primary" dark>fa-id-badge</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ $t('profile.provider') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.provider.provider || $t('common.not.provided') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon class="primary" dark>fa-key</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ $t('profile.providerId') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.provider.providerKey || $t('common.not.provided') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader two-line flat>
      <v-subheader>{{ $t('profile.settings') }}</v-subheader>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon class="primary" dark>fa-language</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-select
            v-model="language"
            :items="languages"
            :label="$t('profile.languages._')"
            hide-details="auto"
          ></v-select>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

type LanguageOption = {
  value: string;
  text: string;
};

export default Vue.extend({
  name: 'Profile',

  data() {
    return {
      language: this.$i18n.locale,
      // TODO: move to more appropriate location
      rtlLanguages: ['ar'],
    };
  },

  computed: {
    ...mapGetters('user', ['profile']),
    languages(): LanguageOption[] {
      return this.$i18n.availableLocales.map((locale) => ({
        value: locale,
        text: this.$t(`profile.languages.${locale}`).toString(),
      }));
    },
  },

  watch: {
    language(val, oldVal) {
      if (!val || val === oldVal) return;

      this.updateLanguage(val);
    },
  },

  methods: {
    updateLanguage(language: string) {
      this.$root.$i18n.locale = language;
      this.$vuetify.rtl = this.rtlLanguages.includes(language);
      this.$ls.set('language', language);
    },
  },
});
</script>
