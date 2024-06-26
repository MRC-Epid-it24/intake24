<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-card-title>{{ $t('survey-schemes.data-export.title') }}</v-card-title>
    <v-card-text>
      <ul>
        <li>List of export sections to be exported</li>
        <li>Export sections can be re-ordered using drag & drop</li>
        <li>Each section can be modified to define specific fields and order for export</li>
      </ul>
    </v-card-text>
    <v-toolbar color="grey lighten-2" flat tile>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`survey-schemes.data-export.sections._`) }}
      </v-toolbar-title>
      <v-spacer />
      <options-menu>
        <select-resource resource="survey-schemes" return-object="dataExport" @input="load">
          <template #activator="{ attrs, on }">
            <v-list-item v-bind="attrs" link v-on="on">
              <v-list-item-title>
                <v-icon left>
                  $download
                </v-icon>
                {{ $t('survey-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="form.dataExport" />
      </options-menu>
    </v-toolbar>
    <data-export-section
      :ref-fields="sectionRefFields"
      :section="selected"
      @close="close"
      @update="update"
    />
    <v-list two-line>
      <draggable v-model="form.dataExport" handle=".drag-and-drop__handle">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="section in form.dataExport"
            :key="section.id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(`survey-schemes.data-export.sections.${section.id}`) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :title="$t('survey-schemes.data-export.edit')"
                @click.stop="edit(section)"
              >
                <v-icon color="secondary lighten-2">
                  $edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { ExportField, ExportSection } from '@intake24/common/surveys';
import type {
  SurveySchemeEntry,
  SurveySchemeExportRefs,
} from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultExport } from '@intake24/common/surveys';

import type { SurveySchemeForm } from '../form.vue';
import DataExportSection from './data-export-section.vue';

export type SurveySchemeDataExportForm = Pick<SurveySchemeForm, 'dataExport'>;

export default defineComponent({
  name: 'SurveySchemeDataExport',

  components: { Draggable: draggable, DataExportSection, JsonEditorDialog, OptionsMenu, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const selected = ref<ExportSection | null>(null);
    const exportRefs = ref<SurveySchemeExportRefs | null>(null);

    const { entry, entryLoaded } = useEntry<SurveySchemeEntry>(props);
    const { fetch } = useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      SurveySchemeDataExportForm,
      SurveySchemeEntry
    >(props, {
      data: { dataExport: defaultExport },
      editMethod: 'patch',
    });

    return {
      selected,
      exportRefs,
      entry,
      entryLoaded,
      fetch,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  computed: {
    sectionRefFields(): ExportField[] {
      if (!this.selected || !this.exportRefs)
        return [];

      return this.exportRefs[this.selected.id] ?? [];
    },
  },

  watch: {
    async $route() {
      await this.fetch();
    },
  },

  async created() {
    await this.fetchExportRefs();
  },

  methods: {
    async fetchExportRefs(): Promise<void> {
      const { data } = await this.$http.get<SurveySchemeExportRefs>(
        `admin/survey-schemes/${this.id}/data-export`,
      );
      this.exportRefs = data;
    },

    edit(section: ExportSection) {
      this.selected = section;
    },

    update(section: ExportSection) {
      const match = this.form.dataExport.find(field => field.id === section.id);

      if (match)
        match.fields = [...section.fields];
    },

    close() {
      this.selected = null;
    },

    load(exportSections: ExportSection[]) {
      this.form.dataExport = [...exportSections];
    },
  },
});
</script>

<style lang="scss" scoped></style>
