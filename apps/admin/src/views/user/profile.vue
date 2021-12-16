<template>
  <div>
    <h2 class="mb-4">{{ $t('user._') }}</h2>
    <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
      <v-list two-line subheader>
        <v-subheader>{{ $t('user.info') }}</v-subheader>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-envelope</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t('user.email') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ profile.email || $t('common.not.provided') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-user</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t('user.name') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ profile.name || $t('common.not.provided') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-phone</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t('user.phone') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ profile.phone || $t('common.not.provided') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-key</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title><user-password></user-password></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list two-line subheader>
        <v-subheader>{{ $t('user.access') }}</v-subheader>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-users</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t('user.roles') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ roles.length ? roles.join(', ') : '' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-users</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $t('user.permissions') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ permissions.length ? permissions.join(', ') : '' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list subheader two-line flat>
        <v-subheader>{{ $t('user.settings') }}</v-subheader>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary" dark>fa-language</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-select
              v-model="language"
              :items="languages"
              :label="$t('user.languages._')"
              hide-details="auto"
              outlined
            >
              <template v-slot:item="{ item }">
                <span
                  :class="`flag-icon flag-icon-${item.value === 'en' ? 'gb' : item.value} mr-3`"
                >
                </span>
                {{ item.text }}
              </template>
              <template v-slot:selection="{ item }">
                <span
                  :class="`flag-icon flag-icon-${item.value === 'en' ? 'gb' : item.value} mr-3`"
                >
                </span>
                {{ item.text }}
              </template>
            </v-select>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import UserPassword from './password.vue';

type LanguageOption = {
  value: string;
  text: string;
};

export default Vue.extend({
  name: 'UserProfile',

  components: { UserPassword },

  data() {
    return {
      language: this.$i18n.locale,
      // TODO: move to more appropriate location
      rtlLanguages: ['ar'],
    };
  },

  computed: {
    ...mapGetters('user', ['profile', 'permissions', 'roles']),
    languages(): LanguageOption[] {
      return this.$i18n.availableLocales.map((locale) => ({
        value: locale,
        text: this.$t(`user.languages.${locale}`).toString(),
      }));
    },

    /* flags: orderBy(
      Object.entries(this.$i18n.messages[this.$i18n.locale].flags).map(([key, value]) => ({
        value: key,
        text: value,
      })),
      'text'
    ), */
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
