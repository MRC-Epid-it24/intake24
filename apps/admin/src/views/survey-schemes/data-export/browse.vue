<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
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
      <load-section-dialog
        schemeType="survey"
        :schemeId="id"
        section="dataExport"
        @load="loadFromScheme"
      ></load-section-dialog>
    </v-toolbar>
    <data-export-section
      :section="selected"
      :refFields="sectionRefFields"
      @close="close"
      @update="update"
    ></data-export-section>
    <v-list two-line>
      <draggable v-model="form.dataExport">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="section in form.dataExport"
            :key="section.id"
            link
            draggable
            class="drag-and-drop__item"
          >
            <v-list-item-avatar>
              <v-icon>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="$t(`survey-schemes.data-export.sections.${section.id}`)"
              ></v-list-item-title>
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
import Vue, { VueConstructor } from 'vue';
import draggable from 'vuedraggable';
import { defaultExport, ExportField, ExportSection } from '@intake24/common/schemes';
import { SurveySchemeExportRefsResponse } from '@intake24/common/types/http/admin';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { LoadSectionDialog } from '@intake24/admin/components/schemes';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import DataExportSection from './data-export-section.vue';
import { SurveySchemeForm } from '../form.vue';

export type SurveySchemeDataExportForm = Pick<SurveySchemeForm, 'dataExport'>;

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SurveySchemeDataExport',

  components: { draggable, DataExportSection, LoadSectionDialog },

  mixins: [formMixin],

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

    loadFromScheme(exportSections: ExportSection[]) {
      this.form.dataExport = [...exportSections];
    },
  },
});
</script>

<style lang="scss" scoped></style>
