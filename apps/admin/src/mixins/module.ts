import Vue from 'vue';
import { mapState } from 'pinia';
import { useResource } from '../stores';

export default Vue.extend({
  computed: mapState(useResource, { module: 'name' }),
});
