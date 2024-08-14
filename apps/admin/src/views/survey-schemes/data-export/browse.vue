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
      <v-menu v-if="availableSections.length" bottom :close-on-content-click="false" left offset-y>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" fab small v-bind="attrs" :title="$t('survey-schemes.data-export.add')" v-on="on">
            <v-icon>$add</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="section in availableSections" :key="section.id" link>
            <v-list-item-content>
              <v-list-item-title>{{ section.text }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-1">
              <v-btn icon :title="$t('survey-schemes.data-export.add')">
                <v-icon color="secondary lighten-1" @click.stop="add(section.id)">
                  $add
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
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
            v-for="(section, idx) in form.dataExport"
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
            <v-list-item-action>
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('survey-schemes.data-export.remove').toString()"
                @confirm="remove(idx)"
              >
                {{ $t('common.action.confirm.remove', { name: $t(`survey-schemes.data-export.sections.${section.id}`) }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import draggable from 'vuedraggable';

import type {
  SurveySchemeEntry,
  SurveySchemeExportRefs,
} from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import { type ExportSection, type ExportSectionId, exportSectionIds } from '@intake24/common/surveys';
import { defaultExport } from '@intake24/common/surveys';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

import type { SurveySchemeForm } from '../form.vue';
import DataExportSection from './data-export-section.vue';

export type SurveySchemeDataExportForm = Pick<SurveySchemeForm, 'dataExport'>;

export default defineComponent({
  name: 'SurveySchemeDataExport',

  components: { ConfirmDialog, Draggable: draggable, DataExportSection, JsonEditorDialog, OptionsMenu, SelectResource },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();
    const http = useHttp();
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

    const sectionRefFields = computed(() => {
      if (!selected.value || !exportRefs.value)
        return [];

      return exportRefs.value[selected.value.id] ?? [];
    });

    const availableSections = computed(() => {
      const used = form.dataExport.map(section => section.id);

      return exportSectionIds
        .filter(id => !used.includes(id))
        .map(id => ({ id, text: i18n.t(`survey-schemes.data-export.sections.${id}`) }));
    });

    const add = (section: ExportSectionId) => {
      form.dataExport.push({ id: section, fields: [] });
    };

    const edit = (section: ExportSection) => {
      selected.value = section;
    };

    const update = (section: ExportSection) => {
      const match = form.dataExport.find(field => field.id === section.id);
      if (!match)
        return;

      match.fields = [...section.fields];
    };

    const close = () => {
      selected.value = null;
    };

    const load = (exportSections: ExportSection[]) => {
      form.dataExport = [...exportSections];
    };

    const remove = (idx: number) => {
      form.dataExport.splice(idx, 1);
    };

    const fetchExportRefs = async () => {
      const { data } = await http.get<SurveySchemeExportRefs>(
        `admin/survey-schemes/${props.id}/data-export`,
      );
      exportRefs.value = data;
    };

    onMounted(async () => {
      await fetchExportRefs();
    });

    return {
      add,
      availableSections,
      clearError,
      close,
      edit,
      exportRefs,
      entry,
      entryLoaded,
      fetch,
      form,
      load,
      remove,
      routeLeave,
      sectionRefFields,
      selected,
      submit,
      update,
    };
  },

  watch: {
    async $route() {
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
