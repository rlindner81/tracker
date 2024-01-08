<script setup lang="ts">
import { computed, watch } from "vue";
import { TRACK_FIELD_INPUT, TRACK_FIELD_TYPE } from "@/constants";

import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

const trackStore = useTrackStore();
const stepStore = useStepStore();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

// NOTE: this is a little weird, but props.show is _not_ reactive, so we cannot watch it
//   directly and wrapping it in toRef would be misleading, since its readonly, so
//   computed is a fair compromise
const show = computed(() => props.show);

watch(show, (newValue) => {
  if (newValue) {
    resetData();
  }
});

const resetData = () => {
  if (props.edit) {
    // trackStore.prepareNewUpdateTrack();
  } else {
    // trackStore.prepareNewCreateTrack();
  }
};

const onCreateOrUpdate = async () => {
  emit("close");
  if (props.edit) {
    // await trackStore.updateTrack();
  } else {
    await stepStore.createStep();
    // await trackStore.createTrack();
  }
};

const onClose = async () => {
  emit("close");
};
</script>

<template>
  <v-dialog v-model="show" persistent>
    <v-card class="pa-2">
      <v-card-title class="text-h5">{{ edit ? $t("entity.step.edit") : $t("entity.step.add") }}</v-card-title>
      <!-- TODO v-else would be nice-->
      <v-container v-if="trackStore.current && stepStore.newStepValues && stepStore.newStepEnabled">
        <v-row align="center" v-for="(field, fieldIndex) in trackStore.current.fields" :key="fieldIndex">
          <v-col cols="2" xs="1" sm="1">
            <div v-if="trackStore.current.fields.some(({ optional }) => optional)">
              <v-checkbox v-if="field.optional" v-model="stepStore.newStepEnabled[field.key]" color="secondary" />
            </div>
          </v-col>
          <v-col>
            <div>
              <label :class="stepStore.newStepEnabled[field.key] ? '' : 'disable'">{{ field.name }}</label>
              <v-text-field
                v-model="stepStore.newStepValues[field.key]"
                :placeholder="$t('entity.track.enter', field.name)"
                v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.STRING"
                :disabled="!stepStore.newStepEnabled[field.key]"
                variant="underlined"
                density="compact"
                hide-details="auto"
              />
              <v-text-field
                type="number"
                step="0.001"
                v-model="stepStore.newStepValues[field.key]"
                :placeholder="$t('entity.track.enter', field.name)"
                v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.FLOAT"
                :disabled="!stepStore.newStepEnabled[field.key]"
                variant="underlined"
                density="compact"
                hide-details="auto"
              />
              <v-text-field
                type="number"
                step="1"
                v-model="stepStore.newStepValues[field.key]"
                :placeholder="$t('entity.track.enter', field.name)"
                v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.INTEGER"
                :disabled="!stepStore.newStepEnabled[field.key]"
                variant="underlined"
                density="compact"
                hide-details="auto"
              />
              <v-select
                v-if="field.input === TRACK_FIELD_INPUT.SELECT"
                v-model="stepStore.newStepValues[field.key]"
                :items="field.params.choices"
                :disabled="!stepStore.newStepEnabled[field.key]"
                item-title="name"
                item-value="value"
                variant="underlined"
                density="compact"
                hide-details="auto"
              />
              <v-slider
                v-if="field.input === TRACK_FIELD_INPUT.SLIDER"
                v-model="stepStore.newStepValues[field.key]"
                :disabled="!stepStore.newStepEnabled[field.key]"
                :min="field.params.min ? parseFloat(field.params.min) : 0"
                :max="field.params.max ? parseFloat(field.params.max) : 1000"
                :step="field.params.step ? parseFloat(field.params.step) : 1"
                color="primary"
                thumb-label="always"
                thumb-size="15"
                thumb-color="primary"
                style="margin-top: 20px"
                density="compact"
                hide-details="auto"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onClose">{{ $t("action.cancel") }}</v-btn>
        <v-btn @click="onCreateOrUpdate" color="primary" variant="flat">{{ $t("entity.step.track") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style></style>
