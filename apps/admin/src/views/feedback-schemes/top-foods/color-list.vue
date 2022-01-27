<template>
  <div>
    <v-list two-line>
      <draggable v-model="colors">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="(color, idx) in colors"
            :key="`${color}-${idx}`"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
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
                  idx + 1 < colors.length ? idx + 1 : $t('feedback-schemes.top-foods.colors.other')
                }})
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('feedback-schemes.top-foods.colors.edit')"
                @click.stop="edit(idx, color)"
              >
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <v-dialog v-model="dialog.show" max-width="600px" persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-icon class="mr-3" dark>fa-palette</v-icon>
          <v-toolbar-title>
            {{ $t('feedback-schemes.top-foods.colors.edit') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-color-picker v-model="dialog.color" show-swatches></v-color-picker>
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
import isEqual from 'lodash/isEqual';
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { FormRefs } from '@intake24/common/types';

export default (Vue as VueConstructor<Vue & FormRefs>).extend({
  name: 'TopFoodsColorList',

  props: {
    feedbackSchemeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as () => string[],
      required: true,
    },
  },

  components: { draggable },

  data() {
    const dialog = (show = false) => ({
      show,
      index: -1,
      color: '#EF6C00',
    });

    return {
      dialog: dialog(),
      newDialog: dialog,
      colors: [...this.value],
    };
  },

  watch: {
    value(val) {
      if (isEqual(val, this.colors)) return;

      this.colors = [...val];
    },
    colors(val) {
      this.$emit('input', val);
    },
  },

  methods: {
    edit(index: number, color: string) {
      this.dialog = { show: true, index, color };
    },

    save() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      const { index, color } = this.dialog;

      if (index === -1) this.colors.push(color);
      else this.colors.splice(index, 1, color);

      this.reset();
    },

    reset() {
      this.dialog = this.newDialog();
    },
  },
});
</script>

<style lang="scss" scoped></style>
