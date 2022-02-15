<template>
  <v-autocomplete
    v-bind="{
      clearable,
      errorMessages,
      hideDetails,
      hideNoData,
      hideSelected,
      name,
      items,
      itemText,
      itemValue,
      label,
      loading: isLoading,
      outlined,
      prependIcon,
      value,
    }"
    :search-input.sync="search"
    @input="$emit('input', $event)"
  ></v-autocomplete>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue';
import debounce from 'lodash/debounce';
import { Dictionary } from '@intake24/common/types';

type AutoComplete = {
  debouncedFetchItems: () => void;
};

export default (Vue as VueConstructor<Vue & AutoComplete>).extend({
  name: 'AutoComplete',

  props: {
    api: {
      type: String,
      required: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: String,
      default: 'auto',
    },
    hideNoData: {
      type: Boolean,
      default: false,
    },
    hideSelected: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: String,
    },
    itemText: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    prependIcon: {
      type: String,
    },
    value: {
      type: String,
    },
    selected: {
      type: Object as PropType<Dictionary>,
    },
    responseObject: {
      type: String,
    },
  },

  data() {
    const items: Dictionary[] = [];

    if (this.selected) items.push(this.selected);

    return {
      isLoading: false,
      items,
      search: null as string | null,
    };
  },

  watch: {
    search(val) {
      if (!val) return;

      this.debouncedFetchItems();
    },
    selected(val) {
      if (!val) return;

      this.items = [val];
    },
  },

  created() {
    this.debouncedFetchItems = debounce(() => {
      this.fetchItems();
    }, 500);
  },

  methods: {
    async fetchItems() {
      if (this.isLoading) return;

      this.isLoading = true;
      const { search } = this;

      try {
        const { data } = await this.$http.get(this.api, { params: { search } });

        this.items = this.resolveResponseObject(data);
      } finally {
        this.isLoading = false;
      }
    },

    resolveResponseObject(data: any) {
      if (!this.responseObject) return data;

      const segments = this.responseObject.split('.');
      return segments.reduce((acc, segment) => acc[segment], data);
    },
  },
});
</script>
