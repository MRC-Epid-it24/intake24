<template>
  <div>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(color, idx) in items"
            :key="`${color}-${idx}`"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-icon
              class="mx-2 my-auto px-4 py-4"
              :style="{ backgroundColor: color, borderRadius: '50%' }"
            >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ color }} ({{
                  idx + 1 < items.length ? idx + 1 : $t('feedback-schemes.top-foods.colors.other')
                }})
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.top-foods.colors.edit')"
                @click.stop="edit(idx, color)"
              >
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon dark left>fa-palette</v-icon>
          <v-toolbar-title>
            {{ $t('feedback-schemes.top-foods.colors.edit') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-color-picker v-model="dialog.item" show-swatches></v-color-picker>
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" text @click.stop="reset">
              <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="font-weight-bold" color="blue darken-3" text type="submit">
              <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
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

import { useList } from '..';

export default defineComponent({
  name: 'TopFoodsColorList',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  components: { draggable },

  setup(props, context) {
    const { dialog, form, items, newDialog, edit, reset, save } = useList(
      props,
      context,
      () => '#EF6C00'
    );

    return { dialog, form, items, newDialog, edit, reset, save };
  },
});
</script>

<style lang="scss" scoped></style>
