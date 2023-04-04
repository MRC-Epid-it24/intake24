<template>
  <div class="ma-4">
    <v-card-title>{{ $t('as-served-sets.images.title') }}</v-card-title>
    <v-row>
      <v-col v-for="image in images" :key="image.id" cols="12" md="4" sm="6">
        <v-card flat min-height="200px" outlined>
          <v-img :src="image.mainImageUrl"></v-img>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <v-text-field
                  v-model.number="image.weight"
                  :disabled="disabled"
                  hide-details="auto"
                  :label="$t('as-served-sets.weight')"
                  name="description"
                  outlined
                  @input="updateImages"
                ></v-text-field>
              </v-col>
              <v-col align-self="center" class="d-flex justify-end" cols="3">
                <confirm-dialog
                  v-if="!disabled"
                  color="error"
                  icon
                  icon-left="$delete"
                  :label="$t('as-served-sets.images.delete').toString()"
                  @confirm="removeImage(image.id)"
                >
                  {{ $t('common.action.confirm.delete', { name: 'selected image' }) }}
                  <template #activator="{ on, attrs }">
                    <v-btn class="ml-auto" icon large v-bind="attrs" v-on="on">
                      <v-icon color="error">$delete</v-icon>
                    </v-btn>
                  </template>
                </confirm-dialog>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="!disabled" cols="12" md="4" sm="6">
        <v-card
          flat
          height="100%"
          link
          :loading="loading"
          outlined
          :title="$t('as-served-sets.images.add')"
          @click.stop="addImage"
        >
          <div class="d-flex justify-center align-center upload-input-wrapper">
            <v-btn color="secondary" fab x-large>
              <v-icon>$add</v-icon>
            </v-btn>
          </div>
        </v-card>
        <label class="d-none" for="fileInput">
          <input
            id="fileInput"
            ref="fileInput"
            accept="image/jpeg"
            class="d-none"
            type="file"
            @change="onFileChanged"
          />
        </label>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { AsServedImageEntry } from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';
import { copy } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

type AsServedImageForm = {
  image: File | null;
  weight: number;
};

export default defineComponent({
  name: 'AsServedImages',

  components: { ConfirmDialog },

  props: {
    setId: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<AsServedImageEntry[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['images'],

  setup() {
    const fileInput = ref<InstanceType<typeof HTMLInputElement>>();

    return { fileInput };
  },

  data() {
    return {
      images: copy(this.items),
      form: createForm<AsServedImageForm>(
        {
          image: null as File | null,
          weight: 0,
        },
        { multipart: true }
      ),
      loading: false,
    };
  },

  methods: {
    updateImages() {
      const images = this.images.map(({ id, weight }) => ({ id, weight }));
      this.$emit('images', images);
    },

    addImage() {
      this.loading = true;
      window.addEventListener(
        'focus',
        () => {
          this.loading = false;
        },
        { once: true }
      );

      this.fileInput?.click();
    },

    async onFileChanged(e: Event) {
      const target = e.target as HTMLInputElement;
      this.form.image = target.files ? target.files[0] : null;

      try {
        const data = await this.form.post<AsServedImageEntry>(
          `admin/images/as-served-sets/${this.setId}/images`
        );
        this.images.push(data);
      } finally {
        this.loading = false;
        if (this.fileInput) this.fileInput.value = '';
      }
    },

    async removeImage(imageId: string) {
      await this.$http.delete(`admin/images/as-served-sets/${this.setId}/images/${imageId}`);
      this.images = this.images.filter((image) => image.id !== imageId);
    },
  },
});
</script>

<style lang="scss" scoped>
.upload-input-wrapper {
  min-height: 200px;
  height: 100%;
}
</style>
