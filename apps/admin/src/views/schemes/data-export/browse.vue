<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-card-title>{{ $t('schemes.data-export.title') }}</v-card-title>
    <v-card-text>
      <ul>
        <li>List of export sections to be exported</li>
        <li>Export sections can be re-ordered using drag & drop</li>
        <li>Each section can be modified to define specific fields and order for export</li>
      </ul>
    </v-card-text>
    <v-toolbar flat tile color="grey lighten-2">
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`schemes.data-export.sections._`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <load-section-dialog
        :schemeId="id"
        section="export"
        @load="loadFromScheme"
      ></load-section-dialog>
    </v-toolbar>
    <data-export-section
      :section="section"
      :refFields="sectionRefFields"
      @cancel="close"
      @update="update"
    ></data-export-section>
    <v-list two-line>
      <draggable v-model="form.export">
        <transition-group type="transition" name="drag-and-drop">
          <v-list-item
            v-for="section in form.export"
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
                v-text="$t(`schemes.data-export.sections.${section.id}`)"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :title="$t('schemes.data-export.edit')" @click.stop="edit(section)">
                <v-icon color="primary lighten-2">fa-ellipsis-v</v-icon>
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
import { defaultExport, defaultMeals, defaultQuestions } from '@common/schemes';
import { ExportField, ExportSection } from '@common/types/models';
import { SchemeExportRefsResponse } from '@common/types/http/admin';
import formMixin from '@/components/entry/form-mixin';
import LoadSectionDialog from '@/components/prompts/load-section-dialog.vue';
import { form } from '@/helpers';
import { FormMixin } from '@/types';
import DataExportSection from './data-export-section.vue';

import { SchemeForm } from '../form.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeDataExport',

  components: { draggable, DataExportSection, LoadSectionDialog },

  mixins: [formMixin],

  data() {
    return {
      form: form<SchemeForm>({
        id: null,
        name: null,
        type: 'data-driven',
        questions: defaultQuestions,
        meals: defaultMeals,
        export: defaultExport,
      }),
      section: null as ExportSection | null,
      exportRefs: {} as SchemeExportRefsResponse,
    };
  },

  computed: {
    sectionRefFields(): ExportField[] | undefined {
      if (!this.section) return undefined;

      return this.exportRefs[this.section.id];
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
      const { data } = await this.$http.get<SchemeExportRefsResponse>(
        `admin/schemes/${this.id}/data-export`
      );
      this.exportRefs = data;
    },

    edit(section: ExportSection) {
      this.section = section;
    },

    update(section: ExportSection) {
      const match = this.form.export.find((field) => field.id === section.id);

      if (match) match.fields = [...section.fields];

      this.close();
    },

    close() {
      this.section = null;
    },

    loadFromScheme(exportSections: ExportSection[]) {
      this.form.export = [...exportSections];
    },
  },
});
</script>

<style lang="scss" scoped></style>
