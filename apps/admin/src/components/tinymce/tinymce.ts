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

import Editor from '@tinymce/tinymce-vue';
import trimEnd from 'lodash/trimEnd';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Editor },
  data() {
    const baseUrl = trimEnd(import.meta.env.VITE_APP_BASE_URL ?? '', '/');

    return {
      tinymceInit: {
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
});
