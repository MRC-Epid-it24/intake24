<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                disabled
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('drinkware-sets.id')"
                name="id"
                outlined
                prepend-inner-icon="$drinkware-sets"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.imageMapId"
                disabled
                :error-messages="form.errors.get('imageMapId')"
                hide-details="auto"
                :label="$t('image-maps._')"
                name="imageMapId"
                outlined
                prepend-inner-icon="$image-maps"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                outlined
                prepend-inner-icon="$description"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-card flat>
                <v-card-title>{{ $t('drinkware-sets.imageMapTitle') }}</v-card-title>
                <v-card-subtitle> {{ $t('drinkware-sets.imageMapSubtitle') }} </v-card-subtitle>
                <v-card-text>
                  <image-placeholder v-if="imageMapLoading" />
                  <drinkware-object-chooser
                    v-if="imageMapData"
                    :id="selectedObjectId"
                    :config="{
                      labels: false,
                      pinchZoom: false,
                    }"
                    :image-map-data="imageMapData"
                    :index="selectedObjectIndex"
                    @confirm="onObjectConfirmed"
                    @select="onObjectSelected"
                  />
                </v-card-text>
              </v-card>
              <v-card v-if="selectedScale" class="mt-4" flat>
                <v-card-title>{{ $t('drinkware-sets.label.title') }}</v-card-title>
                <v-card-text>
                  <language-selector
                    v-model="selectedScale.label"
                    :label="$t('guide-images.objects.label._').toString()"
                  >
                    <template v-for="lang in Object.keys(selectedScale.label)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="selectedScale.label[lang]"
                        hide-details="auto"
                        :label="$t('guide-images.objects.label._')"
                        outlined
                      />
                    </template>
                  </language-selector>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <!-- No object selected -->
              <v-card v-if="selectedObjectId === undefined" flat>
                <v-card-title>{{ $t('drinkware-sets.selector.empty.title') }}</v-card-title>
                <v-card-text>{{ $t('drinkware-sets.selector.empty.text') }}</v-card-text>
              </v-card>

              <!-- Object selected, but scale data is undefined -->
              <v-card v-if="selectedObjectId !== undefined && selectedScaleIndex === -1" flat>
                <v-card-title>
                  <v-icon class="mx-2">
                    fas fa-exclamation-circle
                  </v-icon>{{ $t('drinkware-sets.slidingScale.missing.title') }}
                </v-card-title>

                <v-card-text>{{ $t('drinkware-sets.slidingScale.missing.text') }}</v-card-text>

                <v-expand-transition>
                  <v-card v-if="baseImagePreviewUrls[selectedObjectId]" flat>
                    <v-card-title>
                      {{
                        $t('drinkware-sets.slidingScale.imagePreview')
                      }}
                    </v-card-title>
                    <v-card-text>
                      <v-img
                        :src="baseImagePreviewUrls[selectedObjectId]"
                        style="width: 50%"
                      />
                    </v-card-text>
                  </v-card>
                </v-expand-transition>

                <v-card flat>
                  <v-card-title>{{ $t('drinkware-sets.slidingScale.baseImageFile') }}</v-card-title>
                  <v-card-text>
                    <v-file-input
                      v-model="baseImageFiles[selectedObjectId]"
                      hide-details="auto"
                      :label="$t('image-maps.baseImage')"
                      name="baseImage"
                      outlined
                      prepend-icon=""
                      prepend-inner-icon="fas fa-paperclip"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      :disabled="!baseImageFiles[selectedObjectId]"
                      large
                      @click="createSlidingScale(selectedObjectId)"
                    >
                      <v-icon class="mr-2">
                        fas fa-file-circle-plus
                      </v-icon>{{ $t('drinkware-sets.slidingScale.createButtonLabel') }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-card>

              <!-- Object selected and sliding scale is available  -->
              <div v-if="selectedObjectId !== undefined && selectedScaleIndex !== -1">
                <sliding-scale-editor
                  :scale-index="selectedScaleIndex"
                  @baseImageChanged="onBaseImageChanged"
                />

                <v-card flat>
                  <v-card-title>
                    {{ $t('drinkware-sets.volumeMethod.title') }}
                  </v-card-title>
                  <v-card-text>
                    <v-select
                      v-if="selectedObjectId !== undefined && selectedScaleIndex !== -1"
                      v-model="entry.scales[selectedScaleIndex].volumeMethod"
                      hide-details="auto"
                      item-value="method"
                      :items="volumeMethodSelectList"
                      :label="$t('drinkware-sets.volumeMethod.title')"
                      outlined
                    />
                  </v-card-text>
                </v-card>

                <volume-samples-table
                  class="mt-4"
                  :scale-index="selectedScaleIndex"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { mapValues } from 'lodash';
import { computed, defineComponent, onUnmounted, ref, watch } from 'vue';

import type { ImageMapResponse } from '@intake24/common/types/http';
import type { DrinkwareScaleV2Entry, DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { LanguageSelector } from '@intake24/admin/components/forms';
import ImagePlaceholder from '@intake24/admin/components/util/ImagePlaceholder.vue';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import resources from '@intake24/admin/router/resources';
import { httpService } from '@intake24/admin/services';
import SlidingScaleEditor from '@intake24/admin/views/images/drinkware-sets/components/SlidingScaleEditor.vue';
import VolumeSamplesTable from '@intake24/admin/views/images/drinkware-sets/components/VolumeSamplesTable.vue';
import { useI18n } from '@intake24/i18n/index';

import DrinkwareObjectChooser from './components/DrinkwareObjectChooser.vue';

type EditDrinkwareSetForm = {
  id: string | null;
  description: string | null;
  imageMapId: string | null;
  scales: string | null;
  baseImage: Record<string, File>;
};

export default defineComponent({
  name: 'EditDrinkwareSetForm',

  components: {
    LanguageSelector,
    VolumeSamplesTable,
    SlidingScaleEditor,
    DrinkwareObjectChooser,
    ImagePlaceholder,
  },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<DrinkwareSetEntry>(props);
    useEntryFetch(props);
    const {
      clearError,
      form,
      routeLeave,
      submit: formSubmit,
    } = useEntryForm<EditDrinkwareSetForm, DrinkwareSetEntry>(props, {
      config: { multipart: true },
      data: { id: null, imageMapId: null, description: null, scales: null, baseImage: {} },
    });

    const { i18n } = useI18n();

    const imageMapEntryUrl = resources.find(r => r.name === 'image-maps')?.api;

    const imageMapData = ref<ImageMapResponse | undefined>(undefined);
    const imageMapLoading = ref(false);

    const selectedObjectId = ref<string | undefined>(undefined);
    const selectedObjectIndex = ref<number | undefined>(undefined);

    const selectedScaleIndex = computed(() => {
      if (selectedObjectId.value === undefined)
        return -1;

      const index = entry.value.scales.findIndex(
        scale => scale.choiceId.toString() === selectedObjectId.value,
      );

      return index;
    });

    const selectedScale = computed(() => {
      if (selectedScaleIndex.value === -1)
        return undefined;
      return entry.value.scales[selectedScaleIndex.value];
    });

    const baseImageFiles = ref<Record<string, File>>({});

    const baseImagePreviewUrls = ref<Record<string, string>>({});

    function releasePreviewObjectURLs() {
      for (const url of Object.values(baseImagePreviewUrls.value))
        URL.revokeObjectURL(url);
    }

    watch(baseImageFiles.value, (newValue) => {
      releasePreviewObjectURLs();
      baseImagePreviewUrls.value = mapValues(newValue, (file) => {
        return URL.createObjectURL(file);
      });
    });

    onUnmounted(() => {
      releasePreviewObjectURLs();

      if (entry.value.scales !== undefined) {
        for (const scale of entry.value.scales)
          URL.revokeObjectURL(scale.baseImageUrl);
      }
    });

    let loadedImageMapId: string | undefined;

    watch(entry, async (newEntry) => {
      if (loadedImageMapId !== newEntry.imageMapId) {
        imageMapLoading.value = true;

        if (imageMapEntryUrl !== undefined) {
          // This is clunky, there should be a better way to access other resources
          imageMapData.value = (await httpService.get(`${imageMapEntryUrl}/${newEntry.imageMapId}`))
            .data as ImageMapResponse;
          imageMapLoading.value = false;
          loadedImageMapId = newEntry.imageMapId;
        }
        else {
          console.error(`Couldn't find API configuration for resource 'image-maps'`);
        }
      }
    });

    const createSlidingScale = (objectId: string) => {
      entry.value.scales.push({
        version: 2,
        choiceId: Number.parseInt(objectId),
        baseImageUrl: baseImagePreviewUrls.value[objectId] || '',
        label: {},
        volumeSamples: [],
        volumeSamplesNormalised: [],
        volumeMethod: 'lookUpTable',
        outlineCoordinates: [],
      });
    };

    const onObjectSelected = (index: number, id: string) => {
      selectedObjectIndex.value = index;
      selectedObjectId.value = id;
    };
    const onObjectConfirmed = () => {};

    const toUrl = (file: File) => {
      if (file)
        return URL.createObjectURL(file);
      return undefined;
    };

    const submit = () => {
      const scaleFields = Object.fromEntries(
        entry.value.scales
          .filter(s => s.version === 2)
          .map((s) => {
            const v2 = s as DrinkwareScaleV2Entry;

            return [
              v2.choiceId,
              {
                label: v2.label,
                outlineCoordinates: v2.outlineCoordinates,
                volumeSamples: v2.volumeSamples,
                volumeMethod: v2.volumeMethod,
              },
            ];
          }),
      );

      for (const [objectId, baseImageFile] of Object.entries(baseImageFiles.value))
        form.data.baseImage[objectId] = baseImageFile;

      form.data.scales = JSON.stringify(scaleFields);

      formSubmit();
    };

    const onBaseImageChanged = (objectId: string, newBaseImage: File) => {
      baseImageFiles.value[objectId] = newBaseImage;
    };

    const volumeMethodSelectList
     = [{
       method: 'lookUpTable',
       text: i18n.t('drinkware-sets.volumeMethod.lookUpTable'),
     }, {
       method: 'cylindrical',
       text: i18n.t('drinkware-sets.volumeMethod.cylindrical'),
     }];

    return {
      entry,
      entryLoaded,
      clearError,
      form,
      routeLeave,
      submit,
      imageMapLoading,
      imageMapData,
      selectedObjectId,
      selectedObjectIndex,
      selectedScaleIndex,
      selectedScale,
      onObjectSelected,
      onObjectConfirmed,
      createSlidingScale,
      baseImagePreviewUrls,
      baseImageFiles,
      onBaseImageChanged,
      toUrl,
      volumeMethodSelectList,
    };
  },
});
</script>

<style lang="scss"></style>
