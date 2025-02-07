<template>
  <slot :open="showPreferences" />
</template>

<script lang="ts" setup>
import { useGtm } from '@gtm-support/vue-gtm';
import { onMounted } from 'vue';
import { bootstrap, setOptions } from 'vue-gtag';
import { gTagConfig } from './config';
import { useCookieConsent } from './plugin';

const cc = useCookieConsent();

function showPreferences() {
  cc.showPreferences();
}

async function enableAnalytics() {
  const on = cc.getUserPreferences().acceptedCategories.includes('analytics');
  if (!on)
    return;

  const gtm = useGtm();
  gtm?.enable(true);
  setOptions(gTagConfig());
  await bootstrap();
};

onMounted(async () => {
  await enableAnalytics();
});
</script>
