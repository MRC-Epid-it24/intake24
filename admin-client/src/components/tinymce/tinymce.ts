import Vue from 'vue';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/code';
import 'tinymce/plugins/help';

import Editor from '@tinymce/tinymce-vue';

export default Vue.extend({
  data() {
    return {
      tinymceInit: {
        skin_url: '/css/tinymce/ui/oxide',
        height: 300,
        menubar: false,
        paste_as_text: true,
        plugins: [
          'advlist autolink lists link image print preview anchor',
          'visualblocks fullscreen media table paste code help',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | media | fullscreen | code | removeformat | help',
      },
    };
  },

  components: { Editor },
});
