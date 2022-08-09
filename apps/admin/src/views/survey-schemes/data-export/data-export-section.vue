<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile v-if="dialog">
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`survey-schemes.data-export.sections.${section.id}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" dark text @click.stop="save">
            <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('survey-schemes.data-export.current') }}</v-card-title>
            <v-list two-line>
              <draggable v-model="fields" handle=".drag-and-drop__handle">
                <transition-group type="transition" name="drag-and-drop">
                  <v-list-item
                    v-for="(field, idx) in fields"
                    :key="field.id"
                    class="drag-and-drop__item"
                    draggable
                    link
                  >
                    <v-list-item-avatar size="32" class="drag-and-drop__handle">
                      <v-icon>fa-grip-vertical</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-subtitle class="mb-1">
                        <span class="text--primary"
                          >{{ $t('survey-schemes.data-export.fields.id') }}:</span
                        >
                        {{ field.id }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span class="text--primary">
                          {{ $t('survey-schemes.data-export.fields.label') }}:
                        </span>
                        {{ field.label }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon :title="$t('common.action.edit')" @click.stop="edit(field)">
                        <v-icon color="primary lighten-2">$edit</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-btn icon :title="$t('common.action.remove')" @click.stop="remove(idx)">
                        <v-icon color="error">$delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </transition-group>
              </draggable>
            </v-list>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('survey-schemes.data-export.available') }}</v-card-title>
            <v-list two-line>
              <transition-group type="transition" name="drag-and-drop">
                <v-list-item
                  v-for="field in availableFields"
                  :key="field.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-content>
                    <v-list-item-subtitle class="mb-1">
                      <span class="text--primary"
                        >{{ $t('survey-schemes.data-export.fields.id') }}:</span
                      >
                      {{ field.id }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <span class="text--primary">
                        {{ $t('survey-schemes.data-export.fields.label') }}:
                      </span>
                      {{ field.label }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon :title="$t('common.action.add')" @click.stop="add(field)">
                      <v-icon color="blue darken-3">$add</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="editDialog.show" max-width="500px">
        <v-card>
          <v-card-title>{{ $t('survey-schemes.data-export.fields._') }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editDialog.field.id"
                  :label="$t('survey-schemes.data-export.fields.id')"
                  disabled
                  hide-details="auto"
                  name="id"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editDialog.field.label"
                  :label="$t('survey-schemes.data-export.fields.label')"
                  hide-details="auto"
                  name="label"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="confirm">
              {{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { ExportField, ExportSection } from '@intake24/common/schemes';

export default defineComponent({
  name: 'DataExportSection',

  props: {
    section: {
      type: Object as PropType<ExportSection>,
    },
    refFields: {
      type: Array as PropType<ExportField[]>,
      default: () => [],
    },
  },

  components: { draggable },

  data() {
    const newEditDialog = () => ({ show: false, field: { id: '', label: '' } });

    return {
      dialog: false,
      fields: [] as ExportField[],
      newEditDialog,
      editDialog: newEditDialog(),
    };
  },

  computed: {
    availableFields(): ExportField[] {
      const currentFieldIds = this.fields.map((field) => field.id);
      return this.refFields.filter((field) => !currentFieldIds.includes(field.id));
    },
  },

  watch: {
    dialog(val: boolean) {
      if (!val) this.$emit('close');
    },
    section(val) {
      if (!val) return;

      this.fields = [...val.fields];
      this.dialog = true;
    },
  },

  methods: {
    add(field: ExportField) {
      this.fields.push(field);
    },

    edit(field: ExportField) {
      this.editDialog = { show: true, field };
    },

    confirm() {
      this.editDialog = this.newEditDialog();
    },

    remove(index: number) {
      this.fields.splice(index, 1);
    },

    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    save() {
      if (!this.section) return;

      this.$emit('update', { id: this.section.id, fields: this.fields });
      this.close();
    },
  },
});
</script>

<style lang="scss" scoped></style>
