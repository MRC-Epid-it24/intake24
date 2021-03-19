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
        <confirm-dialog
          v-if="!isCreate && can({ action: 'delete' })"
          :label="$t('common.action.delete')"
          color="error"
          iconLeft="$delete"
          @confirm="remove"
        >
          {{ $t('common.action.confirm.delete', { name: entry.name ? entry.name : entry.id }) }}
        </confirm-dialog>
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
import Vue, { VueConstructor } from 'vue';
import has from 'lodash/has';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import ResourceMixin from '@/mixins/ResourceMixin';

type Mixins = InstanceType<typeof ResourceMixin>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
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

  components: { ConfirmDialog },

  mixins: [ResourceMixin],

  computed: {
    isCreate(): boolean {
      return this.id === 'create';
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

    async remove(): Promise<void> {
      const { id, name } = this.entry;

      await this.$http.delete(`${this.resource.api}/${this.id}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name: name ?? id }) as string);
      await this.$router.push({ name: this.resource.name });
    },
  },
});
</script>
