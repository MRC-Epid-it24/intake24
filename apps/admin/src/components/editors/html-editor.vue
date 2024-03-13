<template>
  <div>
    <editor v-bind="{ init, value }" @input="$emit('input', $event)"></editor>
    <v-messages v-show="hasErrors" class="mt-3 mx-2" color="error" :value="errors"></v-messages>
  </div>
</template>

<script lang="ts">
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/table';

import type { PropType } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import trimEnd from 'lodash/trimEnd';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HtmlEditor',

  components: { Editor },

  props: {
    initProps: {
      type: Object,
    },
    errorMessages: {
      type: [String, Array],
      default: () => [],
    },
    value: {
      type: String as PropType<string | null>,
      default: '',
    },
  },

  emits: ['input'],

  data() {
    const baseUrl = trimEnd(import.meta.env.VITE_APP_BASE_URL ?? '', '/');

    return {
      tinymceDefaults: {
        skin_url: `${baseUrl}/css/tinymce/ui/oxide`,
        // TODO: this should point to frontend stylesheet
        content_css: `${baseUrl}/css/tinymce/content/default/content.min.css`,
        directionality: this.$vuetify.rtl ? 'rtl' : 'ltr',
        default_link_target: '_blank',
        height: 400,
        menubar: false,
        paste_as_text: true,
        plugins: [
          'advlist',
          'autolink',
          'code',
          'fullscreen',
          'image',
          'lists',
          'media',
          'preview',
          'table',
        ],
        toolbar:
          'undo redo | formatselect | bold italic strikethrough | forecolor backcolor | hr | link image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | preview fullscreen code',
      },
    };
  },

  computed: {
    errors() {
      return typeof this.errorMessages === 'string' ? [this.errorMessages] : this.errorMessages;
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    init() {
      return {
        ...this.tinymceDefaults,
        ...(this.initProps ?? {}),
      };
    },
  },
});
</script>
