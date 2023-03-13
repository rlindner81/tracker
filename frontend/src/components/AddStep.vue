<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";
import { TRACK_FIELD_INPUT, TRACK_FIELD_TYPE } from "@/constants";
import { ref } from "vue";

const trackStore = useTrackStore();
const stepStore = useStepStore();

let showAddStepModal = ref(false);

const submit = async () => {
  showAddStepModal.value = false;
  await stepStore.createStep();
};
</script>

<template>
  <v-dialog
    activator="parent"
    v-model="showAddStepModal"
    persistent
    v-if="trackStore.current && stepStore.newStepValues && stepStore.newStepEnabled"
  >
    <v-card class="pa-2">
      <v-card-title class="text-h5">{{ $t("entity.step.add") }}</v-card-title>
      <v-container>
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
                density="compact"
              />
              <v-text-field
                type="number"
                step="0.00001"
                v-model="stepStore.newStepValues[field.key]"
                :placeholder="$t('entity.track.enter', field.name)"
                v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.FLOAT"
                :disabled="!stepStore.newStepEnabled[field.key]"
                density="compact"
              />
              <v-text-field
                type="number"
                step="1"
                v-model="stepStore.newStepValues[field.key]"
                :placeholder="$t('entity.track.enter', field.name)"
                v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.INTEGER"
                :disabled="!stepStore.newStepEnabled[field.key]"
                density="compact"
              />
              <v-select
                v-if="field.input === TRACK_FIELD_INPUT.SELECT"
                v-model="stepStore.newStepValues[field.key]"
                :items="field.params.choices"
                :disabled="!stepStore.newStepEnabled[field.key]"
                item-title="name"
                item-value="value"
                density="compact"
              />
              <v-slider
                v-if="field.input === TRACK_FIELD_INPUT.SLIDER"
                v-model="stepStore.newStepValues[field.key]"
                :disabled="!stepStore.newStepEnabled[field.key]"
                :min="field.params.min ? parseFloat(field.params.min) : 0"
                :max="field.params.max ? parseFloat(field.params.max) : 1000"
                :step="field.params.step ? (parseFloat(field.params.step) < 1 ? -1 : parseFloat(field.params.step)) : 1"
                color="primary"
                thumb-label="always"
                thumb-size="15"
                thumb-color="primary"
                style="margin-top: 20px"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showAddStepModal = false">{{ $t("action.cancel") }}</v-btn>
        <v-btn @click="submit" color="secondary" variant="flat">{{ $t("entity.step.track") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style></style>
