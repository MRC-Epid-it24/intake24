<template>
  <div>
    <editor v-bind="{ init, value }" @input="$emit('input', $event)" />
    <v-messages v-show="hasErrors" class="mt-3 mx-2" color="error" :value="errors" />
  </div>
</template>

<script lang="ts">
import 'tinymce/tinymce';
import 'tinymce/icons/default/icons.min.js';
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';
import 'tinymce/skins/ui/oxide/skin.js';
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
import 'tinymce/skins/content/default/content.js';
import 'tinymce/skins/ui/oxide/content.js';

import type { PropType } from 'vue';
import Editor from '@tinymce/tinymce-vue';
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
    return {
      tinymceDefaults: {
        license_key: 'gpl',
        skin_url: 'default',
        content_css: 'default',
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
          'link',
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
