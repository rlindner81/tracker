<script setup>
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";
import Toggle from "@vueform/toggle";
import Slider from "@vueform/slider";
import { TRACK_FIELD_INPUT, TRACK_FIELD_TYPE } from "@/constants";

const trackStore = useTrackStore();
const stepStore = useStepStore();

const emit = defineEmits(["tracked", "closed"]);

const submit = async () => {
  await stepStore.createStep();
  emit("tracked");
};

const handleChange = (enabled, fieldKey) => {
  if (!enabled) {
    stepStore.newStepValues[fieldKey] = undefined;
  }
};
</script>

<template>
  <form
    class="component add-step"
    @submit.prevent="submit"
    v-if="trackStore.current && stepStore.newStepValues && stepStore.newStepEnabled"
  >
    <div class="input" v-for="(field, fieldIndex) in trackStore.current.fields" :key="fieldIndex">
      <div class="optional-wrapper">
        <div class="toggle-wrapper" v-if="trackStore.current.fields.some(({ optional }) => optional)">
          <Toggle
            v-if="field.optional"
            v-model="stepStore.newStepEnabled[field.key]"
            @change="handleChange($event, field.key)"
          />
        </div>
        <div class="choice-wrapper">
          <label :class="stepStore.newStepEnabled[field.key] ? '' : 'disable'">{{ field.name }}</label>
          <input
            type="text"
            v-model="stepStore.newStepValues[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.STRING"
            :disabled="!stepStore.newStepEnabled[field.key]"
          />
          <input
            type="number"
            step="0.00001"
            v-model="stepStore.newStepValues[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.FLOAT"
            :disabled="!stepStore.newStepEnabled[field.key]"
          />
          <input
            type="number"
            step="1"
            v-model="stepStore.newStepValues[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input === TRACK_FIELD_INPUT.TEXT_FIELD && field.type === TRACK_FIELD_TYPE.INTEGER"
            :disabled="!stepStore.newStepEnabled[field.key]"
          />
          <select
            v-if="field.input === TRACK_FIELD_INPUT.SELECT"
            v-model="stepStore.newStepValues[field.key]"
            :disabled="!stepStore.newStepEnabled[field.key]"
          >
            <option v-for="(option, optionIndex) in field.params.choices" :key="optionIndex" :value="option.value">
              {{ option.name }}
            </option>
          </select>
          <div class="slider" v-if="field.input === TRACK_FIELD_INPUT.SLIDER">
            <div class="slider-container">
              <Slider
                :min="field.params.min ? parseFloat(field.params.min) : 0"
                :max="field.params.max ? parseFloat(field.params.max) : 1000"
                :step="field.params.step ? (parseFloat(field.params.step) < 1 ? -1 : parseFloat(field.params.step)) : 1"
                v-model="stepStore.newStepValues[field.key]"
                :disabled="!stepStore.newStepEnabled[field.key]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <button type="button" @click="$emit('closed')">Cancel</button>
      <button>Track It</button>
    </div>
  </form>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style src="@vueform/slider/themes/default.css"></style>
<style></style>
