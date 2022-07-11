<template>
  <div>
    <h2 class="mb-4">{{ $t('user._') }}</h2>
    <v-card v-if="profile" :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
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
            <v-list-item-title>
              <user-password></user-password>
            </v-list-item-title>
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
            <v-icon class="primary" dark>fa-eye-slash</v-icon>
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
      <v-row no-gutters>
        <v-col cols="12" md="6">
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
                  item-text="englishName"
                  item-value="id"
                  hide-details="auto"
                  outlined
                  @change="updateLanguage"
                >
                  <template v-slot:item="{ item }">
                    <span
                      :class="`fi fi-${
                        item.countryFlagCode === 'en' ? 'gb' : item.countryFlagCode
                      } mr-3`"
                    >
                    </span>
                    {{ item.englishName }}
                  </template>
                  <template v-slot:selection="{ item }">
                    <span
                      :class="`fi fi-${
                        item.countryFlagCode === 'en' ? 'gb' : item.countryFlagCode
                      } mr-3`"
                    >
                    </span>
                    {{ item.englishName }}
                  </template>
                </v-select>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { LanguageAttributes } from '@intake24/common/types/models';
import { defineComponent } from 'vue';
import { setsLanguage } from '@intake24/ui';
import { mapState } from 'pinia';
import { useUser } from '@intake24/admin/stores';
import UserPassword from './password.vue';

export default defineComponent({
  name: 'UserProfile',

  components: { UserPassword },

  mixins: [setsLanguage],

  data() {
    return {
      language: this.$root?.$i18n.locale,
      languages: [] as LanguageAttributes[],
    };
  },

  computed: {
    ...mapState(useUser, ['profile', 'permissions', 'roles']),
  },

  async mounted() {
    const { data } = await this.$http.get('i18n');
    this.languages = data;
  },

  methods: {
    async updateLanguage(languageId: string) {
      await this.setLanguage('admin', languageId);
    },
  },
});
</script>
