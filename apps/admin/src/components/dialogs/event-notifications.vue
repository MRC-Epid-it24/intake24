<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="800px">
    <template #activator="{ attrs, on }">
      <v-btn
        v-bind="attrs"
        block
        color="primary"
        large
        outlined
        rounded
        :title="$t('notifications.title')"
        v-on="on"
      >
        <v-icon left>fas fa-paper-plane</v-icon> {{ $t('notifications.title') }}
      </v-btn>
    </template>
    <v-card tile>
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('notifications.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <div class="d-flex justify-end pa-4">
        <v-btn color="primary" large rounded :title="$t('notifications.add')" @click="add">
          <v-icon left>fas fa-paper-plane</v-icon> {{ $t('notifications.add') }}
        </v-btn>
      </div>
      <v-list class="py-0">
        <template v-for="(item, idx) in items">
          <v-list-item :key="idx">
            <v-list-item-avatar>
              <v-icon>fas fa-paper-plane</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="item.type"
                      hide-details="auto"
                      :items="events"
                      name="type"
                      outlined
                      :title="$t('notifications.events._')"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="item.channel"
                      hide-details="auto"
                      :items="channels"
                      name="type"
                      outlined
                      :title="$t('notifications.channels._')"
                      @change="updateProps(idx)"
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-if="item.channel === 'webhook'"
                      v-model="item.url"
                      hide-details="auto"
                      :label="$t('notifications.channels.url')"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-else-if="item.channel === 'email'"
                      v-model="item.to"
                      hide-details="auto"
                      :label="$t('notifications.channels.to')"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-else-if="item.channel === 'slack'"
                      v-model="item.channelId"
                      hide-details="auto"
                      :label="$t('notifications.channels.channelId')"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('notifications.remove')" @click.stop="remove(idx)">
                <v-icon color="secondary lighten-2">$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < items.length" :key="`div-${idx}`"></v-divider>
        </template>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="info" text @click.stop="close">
          <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import { defineComponent, ref } from 'vue';

import type { Notification, Notifications } from '@intake24/common/types';
import { eventTypes, notificationChannels } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n/index';

const defaultNotifications: Notifications = {
  webhook: {
    type: 'survey.session.started',
    channel: 'webhook',
    url: '',
  },
  email: {
    type: 'survey.session.started',
    channel: 'email',
    to: '',
  },
  slack: {
    type: 'survey.session.started',
    channel: 'slack',
    channelId: '',
  },
};

export default defineComponent({
  name: 'EventNotifications',

  props: {
    value: {
      type: Array as PropType<Notification[]>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();
    const items = useVModel(props, 'value', emit, {
      eventName: 'input',
      passive: true,
      deep: true,
    });

    const channels = notificationChannels.map((value) => ({
      value,
      text: i18n.t(`notifications.channels.${value}`).toString(),
    }));
    const events = eventTypes.map((value) => ({
      value,
      text: i18n.t(`notifications.events.${value}`).toString(),
    }));

    const dialog = ref(false);

    const add = () => {
      items.value.push({ ...defaultNotifications.webhook });
    };

    const remove = (idx: number) => {
      items.value.splice(idx, 1);
    };

    const close = () => {
      dialog.value = false;
    };

    const updateProps = (idx: number) => {
      const defaults = defaultNotifications[items.value[idx].channel];
      console.log(defaults);
      console.log(items.value[idx].channel);
      console.log(items.value[idx].type);

      items.value.splice(idx, 1, { ...defaults, type: items.value[idx].type });
    };

    return {
      add,
      close,
      dialog,
      items,
      remove,
      channels,
      events,
      updateProps,
    };
  },
});
</script>

<style lang="scss" scoped></style>
