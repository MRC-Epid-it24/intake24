<template>
  <div>
    <v-list>
      <draggable v-model="items" handle=".drag-and-drop__handle" @end="update">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(item, idx) in items"
            :key="item._id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-icon
              class="mx-2 my-auto pa-4 rounded-circle"
              :style="{ backgroundColor: item.color }"
            />
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ item.color }} ({{ lastLabel && idx + 1 === items.length ? lastLabel : idx + 1 }})
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('feedback-schemes.colors.edit')" @click.stop="edit(idx, item)">
                <v-icon color="secondary lighten-2">
                  $edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog
      v-model="dialog.show"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px"
      persistent
    >
      <v-card :tile="$vuetify.breakpoint.smAndDown">
        <v-toolbar color="secondary" dark flat>
          <v-icon dark left>
            fas fa-palette
          </v-icon>
          <v-toolbar-title>
            {{ $t('feedback-schemes.colors.edit') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list>
                  <v-list-item
                    v-for="[key, color] in Object.entries(colors)"
                    :key="key"
                    link
                    @click="dialog.item.color = color"
                  >
                    <v-list-item-icon
                      class="mx-2 my-auto pa-4 rounded-circle"
                      :style="{ backgroundColor: color }"
                    />
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-medium text-uppercase">
                        {{ key }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker v-model="dialog.item.color" show-swatches />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>
                $cancel
              </v-icon>{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn class="font-weight-bold" color="info" text type="submit">
              <v-icon left>
                $success
              </v-icon>{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import { useListWithDialog } from '@intake24/admin/composables';
import { colors } from '@intake24/common/theme';
import { randomString } from '@intake24/common/util';

export default defineComponent({
  name: 'ColorList',

  components: { Draggable: draggable },

  props: {
    lastLabel: {
      type: String,
    },
    value: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  setup(props, context) {
    const newItem = () => ({ _id: randomString(6), color: colors.primary });
    const transformIn = (color: string) => ({ _id: randomString(6), color });
    const transformOut = ({ color }: { _id: string; color: string }) => color;

    const { dialog, form, items, newDialog, edit, reset, save, update } = useListWithDialog(
      props,
      context,
      { newItem, transformIn, transformOut },
    );

    return { colors, dialog, form, items, newDialog, edit, reset, save, update };
  },
});
</script>

<style lang="scss" scoped></style>
