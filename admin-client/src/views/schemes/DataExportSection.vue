<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card tile v-if="dialog">
      <v-toolbar dark color="primary">
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`schemes.data-export.sections.${section.id}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :title="$t('common.action.save')" dark text @click.stop="save">
            <v-icon left>$save</v-icon> {{ $t('common.action.save') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title>Current export fields</v-card-title>
            <v-list two-line>
              <draggable v-model="fields">
                <transition-group type="transition" name="drag-and-drop">
                  <v-list-item
                    v-for="(field, idx) in fields"
                    :key="field.id"
                    class="drag-and-drop__item"
                    draggable
                    link
                  >
                    <v-list-item-avatar size="32">
                      <v-icon>fa-grip-vertical</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>ID: {{ field.id }}</v-list-item-title>
                      <v-list-item-subtitle>Label: {{ field.label }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon :title="$t('common.action.edit')" @click.stop="edit(idx, field)">
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
          <v-col cols="12" md="6">
            <v-card-title>Available fields</v-card-title>
            <v-list two-line>
              <transition-group type="transition" name="drag-and-drop">
                <v-list-item
                  v-for="field in availableFields"
                  :key="field.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-content>
                    <v-list-item-title>ID: {{ field.id }}</v-list-item-title>
                    <v-list-item-subtitle>Label: {{ field.label }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon :title="$t('common.action.add')" @click.stop="add(field)">
                      <v-icon color="blue darken-3">fa-plus</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import { ExportSchemeSection, ExportField } from '@common/types/models';

export default Vue.extend({
  name: 'DataExportSection',

  props: {
    section: {
      type: Object as () => ExportSchemeSection | null,
    },
    refFields: {
      type: Array as () => ExportField[],
    },
  },

  components: { draggable },

  data() {
    return {
      dialog: false,
      fields: [] as ExportField[],
      editDialog: {
        show: false,
        field: {} as ExportField,
      },
    };
  },

  computed: {
    availableFields(): ExportField[] {
      if (!this.refFields) return [];

      const currentFieldIds = this.fields.map((field) => field.id);
      return this.refFields.filter((field) => !currentFieldIds.includes(field.id));
    },
  },

  watch: {
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

    edit(index: number, field: ExportField) {
      this.editDialog = { show: true, field };
    },

    remove(index: number) {
      this.fields.splice(index, 1);
    },

    close() {
      this.dialog = false;
    },

    cancel() {
      this.$emit('cancel');
      this.close();
    },

    save() {
      this.$emit('update', { id: this.section?.id, fields: this.fields });
      this.close();
    },
  },
});
</script>

<style lang="scss" scoped></style>
