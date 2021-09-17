import Vue, { VueConstructor } from 'vue';
import pollsForJobsMixin from '@/mixins/polls-for-jobs-mixin';

type mixins = InstanceType<typeof pollsForJobsMixin>;

export default (Vue as VueConstructor<Vue & mixins>).extend({
  mixins: [pollsForJobsMixin],

  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    surveyId(): string {
      return this.$route.params.id;
    },
  },

  watch: {
    async dialog(val: boolean) {
      if (!val) {
        this.stopPolling();
        return;
      }

      await this.status();
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },
  },
});
