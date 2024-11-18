<template>
  <div>
    <h2 class="mb-4">
      {{ $t('user.profile') }}
    </h2>
    <v-card v-if="profile" :border="!$vuetify.display.mobile" :flat="$vuetify.display.mobile" :tile="$vuetify.display.mobile">
      <v-list lines="two">
        <v-list-subheader>{{ $t('user.info') }}</v-list-subheader>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-envelope" />
          </template>
          <v-list-item-title>{{ $t('user.email') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.email || $t('common.not.provided') }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-user" />
          </template>
          <v-list-item-title>{{ $t('user.name') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.name || $t('common.not.provided') }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-phone" />
          </template>
          <v-list-item-title>{{ $t('user.phone') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.phone ?? $t('common.not.provided') }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-key" />
          </template>
          <v-list-item-title>
            <user-password :email="profile.email" />
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list lines="two">
        <v-list-subheader>{{ $t('user.access') }}</v-list-subheader>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-users" />
          </template>
          <v-list-item-title>{{ $t('user.roles') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ roles.length ? roles.join(', ') : '' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-avatar color="secondary" icon="fas fa-eye-slash" />
          </template>
          <v-list-item-title>{{ $t('user.permissions') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ permissions.length ? permissions.join(', ') : '' }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-list lines="two">
            <v-list-subheader>{{ $t('user.settings') }}</v-list-subheader>
            <v-list-item>
              <template #prepend>
                <v-avatar color="secondary" icon="fas fa-language" />
              </template>
              <v-select
                class="py-1"
                hide-details="auto"
                item-title="englishName"
                item-value="code"
                :items="languages"
                :label="$t('user.languages._')"
                :model-value="language"
                variant="outlined"
                @update:model-value="updateLanguage"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props" :title="item.raw.englishName">
                    <template #prepend>
                      <span :class="`fi fi-${item.raw.countryFlagCode} mr-3`" />
                    </template>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <span :class="`fi fi-${item.raw.countryFlagCode} mr-3`" />
                  {{ item.raw.englishName }}
                </template>
              </v-select>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider />
      <user-mfa />
      <v-divider />
      <app-info />
    </v-card>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { computed, defineComponent } from 'vue';

import { UserMfa, UserPassword } from '@intake24/admin/components/user';
import { useApp, useUser } from '@intake24/admin/stores';
import { AppInfo } from '@intake24/ui';

export default defineComponent({
  name: 'UserProfile',

  components: { AppInfo, UserMfa, UserPassword },

  setup() {
    const app = useApp();

    const language = computed(() => app.lang);
    const languages = computed(() => app.availableLanguages);

    const updateLanguage = async (languageId: string) => {
      useApp().setLanguage(languageId);
    };

    return {
      language,
      languages,
      updateLanguage,
    };
  },

  computed: {
    ...mapState(useUser, ['profile', 'permissions', 'roles']),
  },
});
</script>
