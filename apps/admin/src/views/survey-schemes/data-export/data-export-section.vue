<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="dialog" tile>
      <v-toolbar color="secondary" dark>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="cancel" />
        <v-toolbar-title>
          {{ $t(`survey-schemes.data-export.sections.${section?.id}`) }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn :title="$t('common.action.ok')" variant="text" @click.stop="save">
            <v-icon icon="$success" start />{{ $t('common.action.ok') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('survey-schemes.data-export.current') }}</v-card-title>
            <v-list lines="two">
              <vue-draggable
                v-model="fields"
                :animation="300"
                handle=".drag-and-drop__handle"
              >
                <v-list-item
                  v-for="(field, index) in fields"
                  :key="field.id"
                  class="drag-and-drop__item"
                >
                  <template #prepend>
                    <v-avatar class="drag-and-drop__handle" icon="$handle" />
                  </template>
                  <v-list-item-subtitle class="mb-1">
                    <span class="text--secondary">{{ $t('survey-schemes.data-export.fields.id') }}:</span>
                    {{ field.id }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="text--secondary">
                      {{ $t('survey-schemes.data-export.fields.label') }}:
                    </span>
                    {{ field.label }}
                  </v-list-item-subtitle>
                  <template #append>
                    <v-list-item-action>
                      <v-btn
                        icon
                        :title="$t('common.action.edit')"
                        @click.stop="editOpen(index, field)"
                      >
                        <v-icon color="secondary-lighten-2">
                          $edit
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-btn color="error" icon="$delete" :title="$t('common.action.remove')" @click.stop="remove(index)" />
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </vue-draggable>
            </v-list>
          </v-col>
          <v-divider vertical />
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('survey-schemes.data-export.available') }}</v-card-title>
            <data-export-nutrients
              v-if="section?.id === 'foodNutrients'"
              v-model="fetchedRefFields"
            />
            <v-text-field
              v-model="search"
              clearable
              hide-details="auto"
              :label="$t('survey-schemes.data-export.fields.label')"
              prepend-inner-icon="$search"
              variant="outlined"
            />
            <v-list lines="two">
              <transition-group name="drag-and-drop" type="transition">
                <v-list-item
                  v-for="field in visibleFields"
                  :key="field.id"
                  class="list-item-border"
                  link
                >
                  <v-list-item-subtitle class="mb-1">
                    <span class="text--secondary">{{ $t('survey-schemes.data-export.fields.id') }}:</span>
                    {{ field.id }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="text--secondary">
                      {{ $t('survey-schemes.data-export.fields.label') }}:
                    </span>
                    {{ field.label }}
                  </v-list-item-subtitle>
                  <template #append>
                    <v-list-item-action>
                      <v-btn color="info" icon="$add" :title="$t('common.action.add')" @click.stop="add(field)" />
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </transition-group>
              <v-skeleton-loader
                v-if="fieldsAvailableToLoad"
                v-intersect="tryLoadMoreFields"
                type="list-item"
              />
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
                  disabled
                  hide-details="auto"
                  :label="$t('survey-schemes.data-export.fields.id')"
                  name="id"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editDialog.field.label"
                  hide-details="auto"
                  :label="$t('survey-schemes.data-export.fields.label')"
                  name="label"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="editReset">
              <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn class="font-weight-bold" color="info" variant="text" @click.stop="editConfirm">
              <v-icon icon="$success" start />{{ $t('common.action.ok') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import type { ExportField, ExportSection } from '@intake24/common/surveys';
import { DataExportNutrients } from '@intake24/admin/components/schemes';

export default defineComponent({
  name: 'DataExportSection',

  components: { DataExportNutrients, VueDraggable },

  props: {
    section: {
      type: Object as PropType<ExportSection | null>,
      default: null,
    },
    refFields: {
      type: Array as PropType<ExportField[]>,
      default: () => [],
    },
  },

  emits: ['close', 'update'],

  setup(props) {
    const newEditDialog = () => ({ show: false, index: -1, field: { id: '', label: '' } });
    const editDialog = ref(newEditDialog());

    const dialog = ref(false);
    const search = ref<string | null>(null);
    const fields = ref<ExportField[]>([]);
    const filteredFields = ref<ExportField[]>([]);
    const visibleFields = ref<ExportField[]>([]);
    const fetchedRefFields = ref<ExportField[]>([]);

    const availableFields = computed(() => {
      const fieldIds = fields.value.map(field => field.id);
      return (
        props.section?.id === 'foodNutrients' ? fetchedRefFields.value : props.refFields
      ).filter(field => !fieldIds.includes(field.id));
    });

    const loadMoreFields = () => {
      const startIndex = visibleFields.value.length;
      const endIndex
        = startIndex + 15 > filteredFields.value.length
          ? filteredFields.value.length
          : startIndex + 15;

      const items = filteredFields.value.slice(startIndex, endIndex);
      visibleFields.value.push(...items);
    };

    const loadFilteredFields = () => {
      filteredFields.value = search.value
        ? availableFields.value.filter(
          field => !!field.label.match(new RegExp(search.value, 'i')),
        )
        : [...availableFields.value];

      visibleFields.value = [];
      loadMoreFields();
    };

    const fieldsAvailableToLoad = computed(
      () => visibleFields.value.length < filteredFields.value.length,
    );

    const tryLoadMoreFields = (isIntersecting: boolean, entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && fieldsAvailableToLoad)
        loadMoreFields();
    };

    watch(
      availableFields,
      () => {
        loadFilteredFields();
      },
      { immediate: true },
    );

    watchDebounced(
      search,
      () => {
        loadFilteredFields();
      },
      { debounce: 500, maxWait: 1000 },
    );

    return {
      dialog,
      editDialog,
      newEditDialog,
      fetchedRefFields,
      fields,
      availableFields,
      fieldsAvailableToLoad,
      search,
      visibleFields,
      loadFilteredFields,
      loadMoreFields,
      tryLoadMoreFields,
    };
  },

  watch: {
    dialog(val: boolean) {
      if (!val)
        this.$emit('close');
    },
    section(val) {
      if (!val)
        return;

      this.fields = [...val.fields];
      this.dialog = true;
    },
  },

  methods: {
    add(field: ExportField) {
      this.fields.push(field);
    },

    editOpen(index: number, field: ExportField) {
      this.editDialog = { show: true, index, field: { ...field } };
    },

    editConfirm() {
      const { index, field } = this.editDialog;

      if (index !== -1)
        this.fields.splice(index, 1, field);

      this.editReset();
    },

    editReset() {
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
      if (!this.section)
        return;

      this.$emit('update', { id: this.section.id, fields: this.fields });
      this.close();
    },
  },
});
</script>

<style lang="scss" scoped></style>
