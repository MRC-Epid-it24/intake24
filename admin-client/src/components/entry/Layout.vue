<template>
  <div>
    <v-card outlined class="my-5">
      <v-toolbar flat>
        <v-btn
          class="mr-3"
          color="white"
          :title="$t(`common.action.back`)"
          :to="{ name: resource.name }"
        >
          <v-icon left>$back</v-icon> {{ $t(`common.action.back`) }}
        </v-btn>
        <v-btn
          v-if="$route.name !== `${module}-detail`"
          color="primary"
          :title="$t(`common.action.save`)"
          @click="$emit('save')"
        >
          <v-icon left>$save</v-icon> {{ $t(`common.action.save`) }}
        </v-btn>
        <slot name="actions"></slot>
        <v-spacer></v-spacer>
        <delete
          v-if="!isCreate && can({ action: 'delete' })"
          action="delete"
          @action="onDelete"
        ></delete>
      </v-toolbar>
    </v-card>
    <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
      <v-tabs dark background-color="secondary">
        <v-tab
          v-for="tab in tabs"
          :key="tab"
          :to="{ name: `${resource.name}-${tab}`, params: { id } }"
          :title="tabTitle(tab)"
        >
          {{ tabTitle(tab) }}
        </v-tab>
      </v-tabs>
      <slot></slot>
    </v-card>
    <slot name="addons"></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import has from 'lodash/has';
import Delete from '@/components/toolbar/Delete.vue';
import resources from '@/router/resources';
import { Resource } from '@/types/vue-router';

export default Vue.extend({
  name: 'EntryLayout',

  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    entry: {
      type: Object,
      required: true,
    },
  },

  components: { Delete },

  computed: {
    isCreate(): boolean {
      return this.id === 'create';
    },
    resource(): Resource {
      return resources.find((item) => item.name === this.module) as Resource;
    },
    tabs(): string[] {
      if (this.isCreate) return ['create'];

      return this.resource.routes.filter((item) => item !== 'create' && this.can({ action: item }));
    },
  },

  methods: {
    tabTitle(tab: string) {
      const check = has(this.$i18n.messages[this.$i18n.locale], `${this.module}.${tab}._`);
      return this.$t(check ? `${this.module}.${tab}._` : `common.action.${tab}`);
    },

    async onDelete(): Promise<void> {
      const name = this.entry.name ?? this.entry.id;
      if (!confirm(this.$t('common.action.confirm.delete', { name }) as string)) return;

      await this.$http.delete(`${this.resource.api}/${this.id}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name }) as string);
      await this.$router.push({ name: this.resource.name });
    },
  },
});
</script>
