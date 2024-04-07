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
    @input="input($event)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import debounce from 'lodash/debounce';
import { defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';

export default defineComponent({
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
      type: Array as PropType<string[]>,
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
      type: String as PropType<string | null>,
    },
    selected: {
      type: Object as PropType<Dictionary>,
    },
    responseObject: {
      type: String,
    },
  },

  emits: ['input', 'update:object'],

  data() {
    const items: Dictionary[] = [];

    if (this.selected)
      items.push(this.selected);

    return {
      isLoading: false,
      items,
      search: null as string | null,
    };
  },

  watch: {
    search(val) {
      if (!val)
        return;

      // @ts-expect-error debounced
      this.debouncedFetchItems();
    },
    selected(val) {
      if (!val)
        return;

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
      if (this.isLoading)
        return;

      this.isLoading = true;
      const { search } = this;

      try {
        const { data } = await this.$http.get(this.api, { params: { search } });

        this.items = this.resolveResponseObject(data);
      }
      finally {
        this.isLoading = false;
      }
    },

    input(value: any) {
      const object = this.items.find(item => item[this.itemValue] === value);
      this.$emit('input', value);
      this.$emit('update:object', object);
    },

    resolveResponseObject(data: any) {
      if (!this.responseObject)
        return data;

      const segments = this.responseObject.split('.');
      return segments.reduce((acc, segment) => acc[segment], data);
    },
  },
});
</script>
