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
    <v-toolbar flat tile color="grey lighten-2">
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`survey-schemes.data-export.sections._`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <select-resource resource="survey-schemes" return-object="dataExport" @input="load">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            class="ml-3"
            color="secondary"
            fab
            small
            :title="$t(`survey-schemes.load`)"
            v-on="on"
          >
            <v-icon>fa-download</v-icon>
          </v-btn>
        </template>
      </select-resource>
    </v-toolbar>
    <data-export-section
      :section="selected"
      :ref-fields="sectionRefFields"
      @close="close"
      @update="update"
    ></data-export-section>
    <v-list two-line>
      <draggable v-model="form.dataExport" handle=".drag-and-drop__handle">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="section in form.dataExport"
            :key="section.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>fa-grip-vertical</v-icon>
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
                <v-icon color="primary lighten-2">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

import type { ExportField, ExportSection } from '@intake24/common/schemes';
import type {
  SurveySchemeEntry,
  SurveySchemeExportRefsResponse,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { SelectResource } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';
import { defaultExport } from '@intake24/common/schemes';

import type { SurveySchemeForm } from '../form.vue';
import DataExportSection from './data-export-section.vue';

export type SurveySchemeDataExportForm = Pick<SurveySchemeForm, 'dataExport'>;

export default defineComponent({
  name: 'SurveySchemeDataExport',

  components: { draggable, DataExportSection, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveySchemeEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<SurveySchemeDataExportForm>({ dataExport: defaultExport }),
      selected: null as ExportSection | null,
      exportRefs: {} as SurveySchemeExportRefsResponse,
    };
  },

  computed: {
    sectionRefFields(): ExportField[] {
      if (!this.selected) return [];

      return this.exportRefs[this.selected.id];
    },
  },

  watch: {
    $route() {
      this.fetch();
    },
  },

  async created() {
    this.fetchExportRefs();
  },

  methods: {
    async fetchExportRefs(): Promise<void> {
      const { data } = await this.$http.get<SurveySchemeExportRefsResponse>(
        `admin/survey-schemes/${this.id}/data-export`
      );
      this.exportRefs = data;
    },

    edit(section: ExportSection) {
      this.selected = section;
    },

    update(section: ExportSection) {
      const match = this.form.dataExport.find((field) => field.id === section.id);

      if (match) match.fields = [...section.fields];
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
