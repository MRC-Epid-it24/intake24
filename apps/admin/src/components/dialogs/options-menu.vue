<template>
  <v-menu v-model="menu" location="left" :persistent="false">
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn
          class="ms-2"
          color="primary"
          icon="$options"
          size="small"
          :title="$t('common.options._')"
          v-bind="props"
        />
      </slot>
    </template>
    <v-list>
      <slot />
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'OptionsMenu',
});
</script>
