<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded" @save="onSubmit">
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
            v-for="(section, idx) in form.export"
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
              <v-btn icon :title="$t('schemes.data-export.edit')" @click.stop="edit(idx, section)">
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
import formMixin from '@/components/entry/formMixin';
import form from '@/helpers/Form';
import { FormMixin } from '@/types/vue';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/defaults';
import { ExportField, ExportSection } from '@common/types/models';
import { SchemeExportRefsResponse } from '@common/types/http';
import DataExportSection from './DataExportSection.vue';
import { SchemeForm } from './Form.vue';

export default (Vue as VueConstructor<Vue & FormMixin>).extend({
  name: 'SchemeDataExport',

  components: { draggable, DataExportSection },

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

    edit(idx: number, section: ExportSection) {
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

    /*
     * formMixin override
     */
    /* toForm(data: AnyDictionary) {
      const { questions, ...rest } = data;
      this.form.load({ ...rest, questions: { ...defaultQuestions, ...questions } });
    }, */
  },
});
</script>

<style lang="scss" scoped></style>
