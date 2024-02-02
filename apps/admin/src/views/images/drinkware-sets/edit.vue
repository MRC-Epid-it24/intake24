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
              ></v-text-field>
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
              ></v-text-field>
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
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-card flat>
                <v-card-title>{{ $t('drinkware-sets.imageMapTitle') }}</v-card-title>
                <v-card-subtitle> {{ $t('drinkware-sets.imageMapSubtitle') }} </v-card-subtitle>
                <v-card-text>
                  <image-placeholder v-if="imageMapLoading"></image-placeholder>
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
                  >
                  </drinkware-object-chooser>
                </v-card-text>
              </v-card>
              <v-card v-if="selectedScale" class="mt-4" flat>
                <v-card-title>{{ $t('drinkware-sets.label.title') }}</v-card-title>
                <v-card-text>
                  <language-selector
                    v-model="selectedScale.label"
                    flat
                    :label="$t('guide-images.objects.label._').toString()"
                  >
                    <template v-for="lang in Object.keys(selectedScale.label)" #[`lang.${lang}`]>
                      <v-text-field
                        :key="lang"
                        v-model="selectedScale.label[lang]"
                        hide-details="auto"
                        :label="$t('guide-images.objects.label._')"
                        outlined
                      ></v-text-field>
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
              <v-card v-if="selectedObjectId !== undefined && selectedScaleIndex == -1" flat>
                <v-card-title
                  ><v-icon class="mx-2">fas fa-exclamation-circle</v-icon
                  >{{ $t('drinkware-sets.slidingScale.missing.title') }}
                </v-card-title>

                <v-card-text>{{ $t('drinkware-sets.slidingScale.missing.text') }}</v-card-text>

                <v-expand-transition>
                  <v-card v-if="baseImagePreviewUrls[selectedObjectId]" flat>
                    <v-card-title>{{
                      $t('drinkware-sets.slidingScale.imagePreview')
                    }}</v-card-title>
                    <v-card-text
                      ><v-img
                        :src="baseImagePreviewUrls[selectedObjectId]"
                        style="width: 50%"
                      ></v-img
                    ></v-card-text>
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
                    ></v-file-input>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      :disabled="!baseImageFiles[selectedObjectId]"
                      large
                      @click="createSlidingScale(selectedObjectId)"
                      ><v-icon class="mr-2">fas fa-file-circle-plus</v-icon
                      >{{ $t('drinkware-sets.slidingScale.createButtonLabel') }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-card>

              <!-- Object selected and sliding scale is available  -->
              <div v-if="selectedObjectId !== undefined && selectedScaleIndex !== -1">
                <sliding-scale-editor
                  :scale-index="selectedScaleIndex"
                  @baseImageChanged="onBaseImageChanged"
                ></sliding-scale-editor>

                <volume-samples-table
                  class="mt-4"
                  :scale-index="selectedScaleIndex"
                ></volume-samples-table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { map, mapValues } from 'lodash';
import { computed, defineComponent, ref, watch } from 'vue';

import type { LocaleTranslation } from '@intake24/common/types';
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

import DrinkwareObjectChooser from './components/DrinkwareObjectChooser.vue';

type DrinkwareSetFormScale = {
  choiceId: number;
  label: LocaleTranslation;
  outlineCoordinates: number[];
  volumeSamples: number[];
  baseImageFile: File | null;
};

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

    const imageMapEntryUrl = resources.find((r) => r.name === 'image-maps')?.api;

    const imageMapData = ref<ImageMapResponse | undefined>(undefined);
    const imageMapLoading = ref(false);

    const selectedObjectId = ref<string | undefined>(undefined);
    const selectedObjectIndex = ref<number | undefined>(undefined);

    const selectedScaleIndex = computed(() => {
      if (selectedObjectId.value === undefined) return -1;

      const index = entry.value.scales.findIndex(
        (scale) => scale.choiceId.toString() === selectedObjectId.value
      );

      return index;
    });

    const selectedScale = computed(() => {
      if (selectedScaleIndex.value === -1) return undefined;
      return entry.value.scales[selectedScaleIndex.value];
    });

    const baseImageFiles = ref<Record<string, File>>({});

    const baseImagePreviewUrls = computed(() => {
      return mapValues(baseImageFiles.value, (file) => {
        return file ? URL.createObjectURL(file) : undefined;
      });
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
        } else {
          console.error(`Couldn't find API configuration for resource 'image-maps'`);
        }
      }
    });

    const createSlidingScale = (objectId: string) => {
      entry.value.scales.push({
        version: 2,
        choiceId: parseInt(objectId),
        baseImageUrl: baseImagePreviewUrls.value[objectId] || '',
        label: {},
        volumeSamples: [],
        volumeSamplesNormalised: [],
        outlineCoordinates: [],
      });
    };

    const onObjectSelected = (index: number, id: string) => {
      selectedObjectIndex.value = index;
      selectedObjectId.value = id;
    };
    const onObjectConfirmed = () => {};

    const toUrl = (file: File) => {
      if (file) return URL.createObjectURL(file);
      return undefined;
    };

    const submit = () => {
      const scaleFields = Object.fromEntries(
        entry.value.scales
          .filter((s) => s.version === 2)
          .map((s) => {
            const v2 = s as DrinkwareScaleV2Entry;

            return [
              v2.choiceId,
              {
                label: v2.label,
                outlineCoordinates: v2.outlineCoordinates,
                volumeSamples: v2.volumeSamples,
              },
            ];
          })
      );

      for (const [objectId, baseImageFile] of Object.entries(baseImageFiles.value)) {
        form.data.baseImage[objectId] = baseImageFile;
      }

      form.data.scales = JSON.stringify(scaleFields);

      formSubmit();
    };

    const onBaseImageChanged = (objectId: string, newBaseImage: File) => {
      baseImageFiles.value[objectId] = newBaseImage;
    };

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
    };
  },
});
</script>

<style lang="scss"></style>
