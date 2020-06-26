import Vue from 'vue';
import Editor from '@tinymce/tinymce-vue';

export default Vue.extend({
  data() {
    return {
      tinymceInit: {
        height: 300,
        menubar: false,
        paste_as_text: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fullscreen | code | removeformat | help',
      },
    };
  },

  components: { Editor },
});
