<script setup lang="ts">
import { onBeforeMount, computed, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { TRACK_FIELD_TYPE, TRACK_FIELD_INPUT, TRACK_INPUT_TYPE } from "@/constants";

const trackStore = useTrackStore();

const props = defineProps({
  edit: {
    default: false,
  },
});

let showAddTrack = ref(false);

const relevant = computed(() => (props.edit ? trackStore.newUpdateTrack : trackStore.newCreateTrack));

const addField = () => {
  relevant.value.fields?.push({
    position: relevant.value.fields.length,
    key: null,
    name: null,
    input: TRACK_FIELD_INPUT.TEXT_FIELD,
    type: TRACK_FIELD_TYPE.STRING,
    optional: false,
    params: {},
  });
};

const removeField = () => {
  relevant.value.fields.pop();
};

const submit = async () => {
  if (props.edit) {
    await trackStore.updateTrack();
  } else {
    await trackStore.createTrack();
  }
};

const addSelectValue = (field) => {
  field.params.choices.push({
    name: null,
    value: null,
  });
};

const removeSelectValue = (field, index) => {
  field.params.choices.splice(index, 1);
};

const slugify = (str) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc______";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "_") // collapse whitespace and replace by -
    .replace(/-+/g, "_"); // collapse dashes

  return str;
};

const getFieldTypes = (field) => TRACK_INPUT_TYPE[field.input];

const prepareFieldParams = (field) => {
  switch (field.input) {
    case TRACK_FIELD_INPUT.TEXT_FIELD:
    case TRACK_FIELD_INPUT.DATETIME_PICKER: {
      field.params = {};
      return;
    }
    case TRACK_FIELD_INPUT.SELECT: {
      field.params = {
        choices: [],
        default_choice: 0,
      };
      return;
    }
    case TRACK_FIELD_INPUT.SLIDER: {
      field.params = {
        min: 1,
        max: 9,
        step: 1,
      };
      return;
    }
  }
};

const onChangeFieldInput = (field) => {
  const matchingTypes = getFieldTypes(field);
  if (matchingTypes.length === 0) return;
  if (!field.type || !matchingTypes.includes(field.type)) {
    field.type = matchingTypes[0];
  }
  prepareFieldParams(field);
};

const onFieldNameChange = (event, field) => {
  let target = event.target as HTMLInputElement;
  if (!props.edit) {
    field.key = slugify(target.value);
  }
};

onBeforeMount(() => {
  if (props.edit) {
    trackStore.prepareNewUpdateTrack();
  } else {
    trackStore.prepareNewCreateTrack();
  }
});
</script>

<template>
  <v-dialog activator="parent" v-model="showAddTrack" persistent>
    <v-card class="pa-2">
      <v-card-title class="text-h5">{{ edit ? "Edit" : "Add" }} Track</v-card-title>
      <v-container>
        <v-text-field label="Track Name" v-model="relevant.name" variant="underlined" required></v-text-field>
        <v-card class="my-2" elevation="0" v-for="(field, fieldIndex) in relevant.fields" :key="fieldIndex">
          <v-text-field label="Field Name" v-model="field.name" variant="underlined" required></v-text-field>
        </v-card>
      </v-container>
      <v-card-actions>
        <v-btn @click="removeField">Remove Field</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="addField" color="secondary" variant="flat">Add Field</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn @click="showAddTrack = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary" variant="flat">{{ edit ? "Update" : "Create" }} Track</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--
  <Modal>
    <form @submit.prevent="submit" class="component add-track" v-if="relevant">
      <div class="general">
        <label>{{ $t("entity.track.name") }}</label>
        <input type="text" v-model="relevant.name" :placeholder="$t('entity.track.namePlaceholder')" />
      </div>
      <div class="fields">
        <div class="field" v-for="(field, i) in relevant.fields" :key="i">
          <label>{{ $t("entity.track.fieldName") }}</label>
          <input
            type="text"
            v-model="field.name"
            :placeholder="$t('entity.track.namePlaceholder')"
            @input="onFieldNameChange($event, field)"
          />

          <label>{{ $t("entity.track.fieldKey") }}</label>
          <input type="text" :value="field.key" :disabled="true" />

          <label>{{ $t("entity.track.entryOptional") }}</label>
          <div class="toggle-wrapper">
            <Toggle v-model="field.optional" :on-label="$t('action.yes')" :off-label="$t('action.no')" />
          </div>

          <label>{{ $t("entity.track.inputMethod") }}</label>
          <select :disabled="edit" v-model="field.input" @change="onChangeFieldInput(field)">
            <option v-for="(input, inputIndex) in TRACK_FIELD_INPUT" :key="inputIndex" :value="input">
              {{ input }}
            </option>
          </select>

          <label>{{ $t("entity.track.valueType") }}</label>
          <select :disabled="edit" v-model="field.type">
            <option v-for="(type, typeIndex) in getFieldTypes(field)" :key="typeIndex" :value="type">
              {{ type }}
            </option>
          </select>

          <div class="slider" v-if="field.input === TRACK_FIELD_INPUT.SLIDER">
            <label>{{ $t("entity.track.minValue") }}</label>
            <input v-if="field.type === TRACK_FIELD_TYPE.INTEGER" type="number" step="1" v-model="field.params.min" />
            <input
              v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
              type="number"
              step="0.0000001"
              v-model="field.params.min"
            />

            <label>{{ $t("entity.track.maxValue") }}</label>
            <input v-if="field.type === TRACK_FIELD_TYPE.INTEGER" type="number" step="1" v-model="field.params.max" />
            <input
              v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
              type="number"
              step="0.0000001"
              v-model="field.params.max"
            />

            <label>{{ $t("entity.step.size") }}</label>
            <input v-if="field.type === TRACK_FIELD_TYPE.INTEGER" type="number" step="1" v-model="field.params.step" />
            <input
              v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
              type="number"
              step="0.0000001"
              v-model="field.params.step"
            />
          </div>

          <div class="select" v-if="field.input === TRACK_FIELD_INPUT.SELECT">
            <div class="value" v-for="(choice, choiceIndex) in field.params.choices" :key="choiceIndex">
              <input
                type="text"
                :placeholder="$t('entity.track.name')"
                v-model="choice.name"
                @input="!edit && (choice.value = slugify(choice.name))"
              />
              <input type="text" :placeholder="$t('entity.track.value')" v-model="choice.value" />

              <button class="remover" type="button" @click="removeSelectValue(field, choiceIndex)">
                {{ $t("action.remove") }}
              </button>
            </div>
            <button type="button" @click="addSelectValue(field)">{{ $t("entity.track.addValue") }}</button>

            <label>{{ $t("entity.track.defaultSelection") }}</label>
            <select v-model="field.params.default_choice">
              <option :value="null"></option>
              <option v-for="(choice, choiceIndex) in field.params.choices" :key="choiceIndex" :value="choice.value">
                {{ choice.name }}
              </option>
            </select>
          </div>

          <button v-if="!edit" type="button" class="remove" @click="removeField(i)">
            {{ $t("entity.track.removeField") }}
          </button>
        </div>

        <button v-if="!edit" class="add-field" type="button" @click="addField">
          {{ $t("entity.track.addField") }}
        </button>
      </div>

      <div class="button-row">
        <button class="inverted" type="button" @click="$emit('close')">{{ $t("action.cancel") }}</button>
        <button>{{ edit ? $t("action.update") : $t("entity.track.create") }}</button>
      </div>
    </form>
  </Modal>
--></template>

<style></style>
