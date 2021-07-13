<template>
  <div class="ma-4">
    <v-card-title>{{ $t('as-served.images') }}</v-card-title>
    <v-row>
      <v-col v-for="image in images" :key="image.id" cols="12" sm="6" md="4" lg="3">
        <v-card min-height="200px" flat outlined>
          <v-img :src="image.mainImageUrl"></v-img>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="image.weight"
                  :label="$t('as-served.weight')"
                  hide-details="auto"
                  name="description"
                  outlined
                  @input="updateImages"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import clone from 'lodash/cloneDeep';
import { AsServedImageEntry } from '@common/types/http/admin';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'AsServedImages',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array as () => AsServedImageEntry[],
      required: true,
    },
  },

  data() {
    return {
      images: clone(this.items),
    };
  },

  methods: {
    updateImages() {
      const images = this.images.map(({ id, weight }) => ({ id, weight }));
      this.$emit('images', images);
    },
  },
});
</script>

<style lang="scss" scoped></style>
