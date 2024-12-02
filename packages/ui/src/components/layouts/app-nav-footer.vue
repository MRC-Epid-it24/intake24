<template>
  <v-divider />
  <v-list v-if="$vuetify.display.mobile" class="py-0" density="compact">
    <v-list-group>
      <template #activator="{ props }">
        <v-list-item v-bind="props" :title="$t('legal._')" />
      </template>
      <v-list-item :href="legal.privacy" link target="_blank" :title="$t('legal.privacy')">
        <template #append>
          <v-list-item-action>
            <v-icon icon="$redirect" size="x-small" />
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :href="legal.terms" link target="_blank" :title="$t('legal.terms')">
        <template #append>
          <v-list-item-action>
            <v-icon icon="$redirect" size="x-small" />
          </v-list-item-action>
        </template>
      </v-list-item>
      <cookie-consent v-slot="{ open }">
        <v-list-item href="#" link :title="$t('legal.cookies._')" @click.stop="open" />
      </cookie-consent>
    </v-list-group>
  </v-list>
  <div class="text--secondary text-caption px-4 py-2">
    <v-icon icon="fas fa-tag" size="small" start />
    {{ appInfo.build.fullVersion }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useApp } from '@intake24/ui/stores';
import { CookieConsent } from '../../cookie-consent';

defineOptions({ name: 'AppNavFooter' });

const appInfo = computed(() => useApp().app);

const legal = computed(() => ({
  home: import.meta.env.VITE_LEGAL_HOME,
  copyright: import.meta.env.VITE_LEGAL_COPYRIGHT,
  privacy: import.meta.env.VITE_LEGAL_PRIVACY,
  terms: import.meta.env.VITE_LEGAL_TERMS,
}));
</script>
