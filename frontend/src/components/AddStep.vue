<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";
import { TRACK_FIELD_INPUT, TRACK_FIELD_TYPE } from "@/constants";

const trackStore = useTrackStore();
const stepStore = useStepStore();

defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["tracked", "closed"]);

const submit = async () => {
  emit("tracked");
  await stepStore.createStep();
};
</script>

<template>
  <v-dialog
    v-model="$props.isVisible"
    persistent
    v-if="trackStore.current && stepStore.newStepValues && stepStore.newStepEnabled"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Step</span>
      </v-card-title>
      <v-card-text>
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
                  :placeholder="`Enter ${field.name}`"
                  v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.STRING"
                  :disabled="!stepStore.newStepEnabled[field.key]"
                  density="compact"
                />
                <v-text-field
                  type="number"
                  step="0.00001"
                  v-model="stepStore.newStepValues[field.key]"
                  :placeholder="`Enter ${field.name}`"
                  v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.FLOAT"
                  :disabled="!stepStore.newStepEnabled[field.key]"
                  density="compact"
                />
                <v-text-field
                  type="number"
                  step="1"
                  v-model="stepStore.newStepValues[field.key]"
                  :placeholder="`Enter ${field.name}`"
                  v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.INTEGER"
                  :disabled="!stepStore.newStepEnabled[field.key]"
                  density="compact"
                />
                <v-select
                  v-if="field.input === TRACK_FIELD_INPUT.SELECT"
                  v-model="stepStore.newStepValues[field.key]"
                  :items="field.params.choices"
                  :disabled="!stepStore.newStepEnabled[field.key]"
                  item-value="value"
                  item-title="name"
                  density="compact"
                />
                <v-slider
                  v-if="field.input === TRACK_FIELD_INPUT.SLIDER"
                  v-model="stepStore.newStepValues[field.key]"
                  :disabled="!stepStore.newStepEnabled[field.key]"
                  :min="field.params.min ? parseFloat(field.params.min) : 0"
                  :max="field.params.max ? parseFloat(field.params.max) : 1000"
                  :step="
                    field.params.step ? (parseFloat(field.params.step) < 1 ? -1 : parseFloat(field.params.step)) : 1
                  "
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closed')"> Close </v-btn>
        <v-btn color="secondary" variant="flat" @click="submit"> Track It </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style></style>
