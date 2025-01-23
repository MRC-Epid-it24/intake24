<template>
  <div class="ma-4">
    <v-card-title>{{ $t('as-served-sets.images.title') }}</v-card-title>
    <v-row>
      <v-col v-for="image in images" :key="image.id" cols="12" md="4" sm="6">
        <v-card border flat min-height="200px">
          <v-img :src="image.mainImageUrl" />
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <v-text-field
                  v-model.number="image.weight"
                  :disabled="disabled"
                  hide-details="auto"
                  :label="$t('as-served-sets.weight')"
                  :name="`description-${image.id}`"
                  variant="outlined"
                  @update:model-value="updateImages"
                />
              </v-col>
              <v-col align-self="center" class="d-flex justify-end" cols="3">
                <confirm-dialog
                  v-if="!disabled"
                  color="error"
                  icon
                  icon-left="$delete"
                  :label="$t('as-served-sets.images.delete')"
                  @confirm="removeImage(image.id)"
                >
                  {{ $t('common.action.confirm.delete', { name: 'selected image' }) }}
                  <template #activator="{ props }">
                    <v-btn class="ml-auto" v-bind="props" color="error" icon="$delete" size="large" variant="text" />
                  </template>
                </confirm-dialog>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="!disabled" cols="12" md="4" sm="6">
        <v-card
          border
          flat
          height="100%"
          link
          :loading="loading"
          :title="$t('as-served-sets.images.add')"
          @click.stop="addImage"
        >
          <div class="d-flex justify-center align-center upload-input-wrapper">
            <v-btn color="primary" icon="$add" size="x-large" />
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
          >
        </label>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, useTemplateRef } from 'vue';

import { useForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import type { AsServedImageEntry } from '@intake24/common/types/http/admin';
import { copy } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

type AsServedImageForm = {
  image: File | null;
  weight: number;
};

defineOptions({ name: 'AsServedImages' });

const props = defineProps({
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
});

const emit = defineEmits(['images']);
const http = useHttp();

const fileInput = useTemplateRef('fileInput');
const images = ref(copy(props.items));
const loading = ref(false);

const { data, post } = useForm<AsServedImageForm>({
  data: {
    image: null as File | null,
    weight: 0,
  },
  config: { multipart: true },
});

function updateImages() {
  const outputImages = images.value.map(({ id, weight }) => ({ id, weight }));
  emit('images', outputImages);
};

function addImage() {
  loading.value = true;
  window.addEventListener(
    'focus',
    () => {
      loading.value = false;
    },
    { once: true },
  );

  fileInput.value?.click();
};

async function onFileChanged(e: Event) {
  const target = e.target as HTMLInputElement;
  data.value.image = target.files ? target.files[0] : null;

  try {
    const data = await post<AsServedImageEntry>(
      `admin/images/as-served-sets/${props.setId}/images`,
    );
    images.value.push(data);
  }
  finally {
    loading.value = false;
    if (fileInput.value)
      fileInput.value.value = '';
  }
};

async function removeImage(imageId: string) {
  await http.delete(`admin/images/as-served-sets/${props.setId}/images/${imageId}`);
  images.value = images.value.filter(image => image.id !== imageId);
};
</script>

<style lang="scss" scoped>
.upload-input-wrapper {
  min-height: 200px;
  height: 100%;
}
</style>
