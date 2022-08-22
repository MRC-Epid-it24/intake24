<template>
  <div class="ma-4">
    <v-card-title>{{ $t('as-served-sets.images.title') }}</v-card-title>
    <v-row>
      <v-col v-for="image in images" :key="image.id" cols="12" sm="6" md="4">
        <v-card min-height="200px" flat outlined>
          <v-img :src="image.mainImageUrl"></v-img>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <v-text-field
                  v-model.number="image.weight"
                  :label="$t('as-served-sets.weight')"
                  :disabled="disabled"
                  hide-details="auto"
                  name="description"
                  outlined
                  @input="updateImages"
                ></v-text-field>
              </v-col>
              <v-col cols="3" align-self="center" class="d-flex justify-end">
                <confirm-dialog
                  v-if="!disabled"
                  :label="$t('as-served-sets.images.delete')"
                  color="error"
                  icon
                  icon-left="$delete"
                  @confirm="removeImage(image.id)"
                >
                  {{ $t('common.action.confirm.delete', { name: 'selected image' }) }}
                  <template #activator="{ on, attrs }">
                    <v-btn icon large class="ml-auto" v-bind="attrs" v-on="on">
                      <v-icon color="error">$delete</v-icon>
                    </v-btn>
                  </template>
                </confirm-dialog>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="!disabled" cols="12" sm="6" md="4">
        <v-card
          :title="$t('as-served-sets.images.add')"
          height="100%"
          flat
          outlined
          link
          :loading="loading"
          @click.stop="addImage"
        >
          <div class="d-flex justify-center align-center upload-input-wrapper">
            <v-btn color="secondary" fab x-large>
              <v-icon>$add</v-icon>
            </v-btn>
          </div>
        </v-card>
        <label for="fileInput" class="d-none">
          <input
            id="fileInput"
            ref="fileInput"
            class="d-none"
            type="file"
            accept="image/jpeg"
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
import { form } from '@intake24/admin/helpers';
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

  setup() {
    const fileInput = ref<InstanceType<typeof HTMLInputElement>>();

    return { fileInput };
  },

  data() {
    return {
      images: copy(this.items),
      form: form<AsServedImageForm>(
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