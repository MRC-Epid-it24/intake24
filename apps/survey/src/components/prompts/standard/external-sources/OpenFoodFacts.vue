<template>
  <div>
    <v-card :tile="isMobile">
      <v-card-text>
        <div class="d-flex gc-1">
          <component
            :is="prompt.barcode.type"
            :clearable="prompt.barcode.type === 'none'"
            flat
            hide-details
            :label="promptI18n.search"
            :model-value.sync="searchTerm"
            :options="prompt.barcode"
            outlined
            :placeholder="promptI18n.search"
            prepend-inner-icon="$search"
            @detected="search"
            @keydown.enter="search"
          />
          <v-btn
            v-if="$vuetify.breakpoint.smAndUp"
            color="primary"
            :disabled="!searchTerm?.length"
            elevation="0"
            height="initial"
            :title="promptI18n.search"
            x-large
            @click="search"
          >
            <v-icon left>
              fas fa-turn-down fa-rotate-90
            </v-icon>
            {{ promptI18n.search }}
          </v-btn>
        </div>
        <template v-if="selectedProductDetails">
          <v-btn class="my-4" color="grey lighten-2" elevation="0" large @click="back">
            <v-icon left>
              fas fa-turn-up fa-flip-horizontal
            </v-icon>
            {{ promptI18n.back }}
          </v-btn>
          <v-card class="off-product-card pa-3">
            <div class="pa-2 white rounded">
              <v-img
                height="250px"
                :src="selectedProductDetails.url"
              />
            </div>
            <v-card-title class="px-0">
              {{ selectedProductDetails.name }}
            </v-card-title>
            <v-card-text class="px-0">
              <div v-if="selectedProductDetails.code" class="my-2">
                <span class="font-weight-medium">Code:</span>
                {{ selectedProductDetails.code }}
              </div>
              <div v-if="selectedProductDetails.genericName" class="my-2">
                <span class="font-weight-medium">Gen Name:</span>
                {{ selectedProductDetails.genericName }}
              </div>
              <div v-if="selectedProductDetails.quantity" class="my-2">
                <span class="font-weight-medium">Quantity:</span>
                {{ selectedProductDetails.quantity }}
              </div>
              <div v-if="selectedProductDetails.packaging" class="my-2">
                <span class="font-weight-medium">Packaging:</span>
                {{ selectedProductDetails.packaging }}
              </div>
            </v-card-text>
          </v-card>
        </template>
        <image-placeholder v-if="loading" class="my-8" />
        <v-container v-if="!loading && !selected && response?.products.length" class="px-0" fluid>
          <div class="d-flex flex-column flex-md-row justify-space-between align-center py-3 gr-2">
            <div>
              {{ promptI18n.results }}
            </div>
            <v-pagination
              v-model="response.page"
              circle
              :length="Math.ceil(response.count / response.page_size)"
              :total-visible="5"
            />
          </div>
          <v-row justify="center">
            <v-col v-for="product in response.products" :key="product.code" cols="12" md="4" sm="6">
              <v-card class="off-product-card off-product-card--result pa-3" height="100%" link @click="select(product)">
                <div class="pa-2 white rounded">
                  <v-img
                    height="250px"
                    :src="resolveImageUrl(product)"
                  />
                </div>
                <v-card-title class="px-0">
                  {{ getProductName(product, true) }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <div v-if="response.products.length > 9" class="d-flex justify-end align-center py-3">
            <v-pagination
              v-model="response.page"
              circle
              :length="Math.ceil(response.count / response.page_size)"
              outlined
              :total-visible="7"
            />
          </div>
        </v-container>
        <v-alert v-if="response?.products.length === 0" class="my-4" type="warning">
          {{ promptI18n.none }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { watchDebounced } from '@vueuse/core';
import axios, { isAxiosError } from 'axios';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import { ImagePlaceholder } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';
import { barcodes } from '@intake24/ui';
import { useApp } from '@intake24/ui/stores';

const searchParams = {
  json: 1,
};

export type OOFProduct = Record<string, any> & {
  code: string;
};

export type OOFProductResponse = {
  code: string;
  status: 1;
  status_verbose: string;
  product: OOFProduct;
}/*  | {
  code: string;
  status: 0;
  _verbose: string;
} */;

export type OOFProductsResponse = {
  count: number;
  page: 1;
  page_count: number;
  page_size: number;
  products: OOFProduct[];
  skip: number;
};

export default defineComponent({
  name: 'OpenFoodFacts',

  components: { ...barcodes, ImagePlaceholder },

  props: {
    food: {
      type: Object as PropType<FoodState>,
      required: true,
    },
    prompt: {
      type: Object as PropType<Prompts['external-source-prompt']>,
      required: true,
    },
    value: {
      type: Object as PropType<PromptStates['external-source-prompt']>,
      required: true,
    },
  },

  setup(props, ctx) {
    const app = useApp();
    const { translatePrompt } = usePromptUtils(props, ctx);

    const baseUrl = computed(() => `https://${props.prompt.source.country || 'world'}.openfoodfacts.org`);
    const searchBaseUrl = computed(() => `${baseUrl.value}/cgi/search.pl`);
    const productBaseUrl = computed(() => `${baseUrl.value}/api/v2/product`);
    const categoriesTags = computed(() => {
      if (props.food.type !== 'encoded-food')
        return [];

      return props.food.data.tags.reduce<string[]>((acc, tag) => {
        if (tag.startsWith('off:'))
          acc.push(tag.replace(/^off:/, ''));

        return acc;
      }, []);
    });

    const client = axios.create({ baseURL: baseUrl.value });

    const loading = ref(false);
    const lang = computed(() => app.lang);

    const searchFields = computed(() => [
      'id',
      'code',
      'countries_tags',
      'generic_name',
      'generic_name_en',
      `generic_name_${lang.value}`,
      'product_name',
      'product_name_en',
      `product_name_${lang.value}`,
      'packaging',
      'quantity',
      'image_front_small_url',
      'selected_images',
    ]);

    const productFields = computed(() => []);

    const response = ref<OOFProductsResponse | undefined>();
    const selected = ref<OOFProduct | undefined>();
    const searchTerm = ref(props.value.searchTerm);

    const promptI18n = computed(() =>
      translatePrompt(['search', 'back', 'results', 'none'], { results: { count: response.value?.count ?? 0 } }),
    );

    const resolveImageUrl = (product: OOFProduct) => {
      return product.image_front_small_url ?? Object.values(product.selected_images?.front?.small ?? {})[0];
    };

    const getProductName = (product: OOFProduct, withQuantity = false) => {
      const name = product[`product_name_${lang.value}`] || product.product_name_en || product.product_name;
      return withQuantity && product.quantity ? `${name} (${product.quantity})` : name;
    };

    const selectedProductDetails = computed(() => {
      if (!selected.value)
        return undefined;

      const code = selected.value.code;
      const name = selected.value[`product_name_${lang.value}`] || selected.value.product_name_en || selected.value.product_name;
      const genericName = selected.value[`generic_name_${lang.value}`] || selected.value.generic_name_en || selected.value.generic_name;
      const quantity = selected.value.quantity;
      const packaging = selected.value.packaging;
      const url = resolveImageUrl(selected.value);

      return {
        code,
        name,
        genericName,
        quantity,
        packaging,
        url,
      };
    });

    const fetchProduct = async (barcode: string) => {
      if (loading.value)
        return;

      try {
        loading.value = true;

        const { data: { product } } = await client.get<OOFProductResponse>(`${productBaseUrl.value}/${barcode}`, {
          params: {
            fields: productFields.value.length ? productFields.value.join(',') : undefined,
          },
        });

        selected.value = product;
      }
      catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          response.value = { count: 0, page: 1, page_count: 0, page_size: 1, products: [], skip: 0 };
          return;
        }

        throw err;
      }
      finally {
        loading.value = false;
      }
    };

    const fetchProducts = async (search: string) => {
      if (loading.value)
        return;

      try {
        loading.value = true;
        selected.value = undefined;

        const { data } = await client.get<OOFProductsResponse>(searchBaseUrl.value, {
          params: {
            ...searchParams,
            ...props.prompt.source.query,
            categories_tags: categoriesTags.value.length ? categoriesTags.value.join('|') : undefined,
            search_terms: search,
            fields: searchFields.value.length ? searchFields.value.join(',') : undefined,
            page: response.value?.page ?? 1,
          },
        });
        response.value = data;
      }
      finally {
        loading.value = false;
      }
    };

    const search = async () => {
      const searchValue = searchTerm.value;
      if (!searchValue) {
        response.value = undefined;
        return;
      }

      if (/^\d+$/.test(searchValue))
        await fetchProduct(searchValue);
      else
        await fetchProducts(searchValue);
    };

    const back = () => {
      selected.value = undefined;
    };

    const select = async (product: OOFProduct) => {
      await fetchProduct(product.code);
    };

    onMounted(async () => {
      await search();
    });

    watch(() => response.value?.page, async (val, oldVal) => {
      if (!oldVal || !val || val === oldVal)
        return;

      await search();
    });

    watch(selected, (data) => {
      ctx.emit('input', { ...props.value, data });
    });

    watchDebounced(
      searchTerm,
      async (searchTerm) => {
        ctx.emit('input', { ...props.value, searchTerm });
      },
      { debounce: 500, maxWait: 2000 },
    );

    return {
      back,
      getProductName,
      loading,
      promptI18n,
      resolveImageUrl,
      response,
      search,
      searchTerm,
      select,
      selected,
      selectedProductDetails,
    };
  },
});
</script>

<style lang="scss">
.off-product-card {
  background-color: rgba(#ff9d60, 0.2) !important;

  .v-image__image--cover {
    background-size: contain;
  }

  &.off-product-card--result:hover {
    background-color: rgba(#ff9d60, 0.5) !important;
  }
}
</style>
