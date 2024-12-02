<template>
  <v-footer v-if="!$vuetify.display.mobile" class="justify-center pa-4 flex-grow-0">
    <div class="d-flex flex-column flex-md-row justify-center align-center text--secondary text-body-2">
      <i18n-t keypath="legal.copyright" tag="span">
        <template #name>
          <a class="text-decoration-none text-primary" :href="legal.home" target="_blank">
            {{ $t('common._') }}
          </a>
        </template>
        <template #team>
          {{ legal.copyright }}
        </template>
        <template #year>
          {{ new Date().getFullYear() }}
        </template>
      </i18n-t>
      <span class="d-none d-md-flex mx-2">|</span>
      <a class="text-decoration-none text-primary" :href="legal.privacy" target="_blank">
        {{ $t('legal.privacy') }}
      </a>
      <span class="d-none d-md-flex mx-2">|</span>
      <a class="text-decoration-none text-primary" :href="legal.terms" target="_blank">
        {{ $t('legal.terms') }}
      </a>
      <span class="d-none d-md-flex mx-2">|</span>
      <cookie-consent v-slot="{ open }">
        <a class="text-decoration-none text-primary" href="#" @click="open">
          {{ $t('legal.cookies._') }}
        </a>
      </cookie-consent>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CookieConsent } from '../../cookie-consent';

defineOptions({ name: 'AppFooter' });

const legal = computed(() => ({
  home: import.meta.env.VITE_LEGAL_HOME,
  copyright: import.meta.env.VITE_LEGAL_COPYRIGHT,
  privacy: import.meta.env.VITE_LEGAL_PRIVACY,
  terms: import.meta.env.VITE_LEGAL_TERMS,
}));
</script>
