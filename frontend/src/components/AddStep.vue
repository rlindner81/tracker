<script setup>
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";
import Toggle from "@vueform/toggle";
import Slider from "@vueform/slider";
import LoadingButton from "./LoadingButton.vue";

const trackStore = useTrackStore();
const stepStore = useStepStore();

const emit = defineEmits(["tracked", "closed"]);

const submit = async () => {
  await stepStore.createStep();
  emit("tracked");
};

const handleChange = (enabled, fieldKey) => {
  if (!enabled) {
    stepStore.newStep[fieldKey] = undefined;
  }
};
</script>

<template>
  <form
    class="component add-step"
    @submit.prevent="submit"
    v-if="trackStore.current && stepStore.newStep && stepStore.newEnabled"
  >
    <div class="input" v-for="field in trackStore.current.fields" :key="field._id">
      <div class="optional-wrapper">
        <div class="toggle-wrapper" v-if="trackStore.current.fields.some(({ optional }) => optional)">
          <Toggle
            v-if="field.optional"
            v-model="stepStore.newEnabled[field.key]"
            @change="handleChange($event, field.key)"
          />
        </div>
        <div class="choice-wrapper">
          <label :class="stepStore.newEnabled[field.key] ? '' : 'disable'">{{ field.name }}</label>
          <input
            type="text"
            v-model="stepStore.newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input.identifier === 'FIELD' && field.type === 'TEXT'"
            :disabled="!stepStore.newEnabled[field.key]"
          />
          <input
            type="number"
            step="0.00001"
            v-model="stepStore.newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input.identifier === 'FIELD' && field.type === 'FLOAT'"
            :disabled="!stepStore.newEnabled[field.key]"
          />
          <input
            type="number"
            step="1"
            v-model="stepStore.newStep[field.key]"
            :placeholder="`Enter ${field.name}`"
            v-if="field.input.identifier === 'FIELD' && field.type === 'INTEGER'"
            :disabled="!stepStore.newEnabled[field.key]"
          />
          <select
            v-if="field.input.identifier === 'SELECT'"
            v-model="stepStore.newStep[field.key]"
            :disabled="!stepStore.newEnabled[field.key]"
          >
            <option v-for="option in field.input.parameters.values" :key="option.key" :value="option.value">
              {{ option.name }}
            </option>
          </select>
          <div class="slider" v-if="field.input.identifier === 'SLIDER'">
            <div class="slider-container">
              <Slider
                :min="field.input.parameters.min ? parseFloat(field.input.parameters.min) : 0"
                :max="field.input.parameters.max ? parseFloat(field.input.parameters.max) : 1000"
                :step="
                  field.input.parameters.step
                    ? parseFloat(field.input.parameters.step) < 1
                      ? -1
                      : parseFloat(field.input.parameters.step)
                    : 1
                "
                v-model="stepStore.newStep[field.key]"
                :disabled="!stepStore.newEnabled[field.key]"
              />
            </div>
            <!-- <input
              type="number"
              step="0.00001"
              v-model="newStep[field.key]"
              :placeholder="`Enter ${field.name}`"
              v-if="field.type === 'FLOAT'"
            >
            <input
              type="number"
              step="1"
              v-model="newStep[field.key]"
              :placeholder="`Enter ${field.name}`"
              v-if="field.type === 'INTEGER'"
            > -->
          </div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <button type="button" @click="$emit('closed')">Cancel</button>
      <LoadingButton>Track It</LoadingButton>
    </div>
  </form>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style src="@vueform/slider/themes/default.css"></style>
<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-step {
  label.disable {
    color: #9ca3af;
  }

  .optional-wrapper {
    .row();

    > * {
      margin: 0 1rem;

      &:first-child {
        width: 3rem;
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
        flex: 1;
      }
    }
  }

  .input {
    margin: 1rem 0;
  }

  .slider-container {
    margin: 3rem 0 1rem 0;
  }

  .button-row {
    .row();

    > * {
      margin: 0;

      &:first-child {
        margin-right: 1rem;
      }
    }
  }
}
</style>
