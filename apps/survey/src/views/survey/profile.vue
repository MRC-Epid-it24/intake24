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
            item-text="englishName"
            item-value="id"
            hide-details="auto"
            outlined
            @change="updateLanguage"
          ></v-select>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapState } from 'pinia';
import { setsLanguage } from '@intake24/ui';
import { LanguageAttributes } from '@intake24/common/types/models';
import { useUser } from '@intake24/survey/stores';

type Mixins = InstanceType<typeof setsLanguage>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'SurveyUserProfile',

  mixins: [setsLanguage],

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      language: this.$i18n.locale,
      languages: [] as LanguageAttributes[],
    };
  },

  computed: {
    ...mapState(useUser, ['profile']),
  },

  async mounted() {
    const { data } = await this.$http.get('i18n');
    this.languages = data;
  },

  methods: {
    async updateLanguage(languageId: string) {
      await this.setLanguage('survey', languageId);
    },
  },
});
</script>
