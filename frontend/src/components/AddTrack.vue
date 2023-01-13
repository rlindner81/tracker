<script setup lang="ts">
import { onBeforeMount, computed } from "vue";
import { useTrackStore } from "@/store/track";
import { TRACK_TYPE, TRACK_INPUT, TRACK_TYPE_INPUT } from "@/constants";
import Toggle from "@vueform/toggle";
import Modal from "./Modal.vue";
import LoadingButton from "./LoadingButton.vue";

const trackStore = useTrackStore();

const emit = defineEmits(["close"]);

const props = defineProps({
  edit: {
    default: false,
  },
});

const relevant = computed(() => (props.edit ? trackStore.newUpdateTrack : trackStore.newCreateTrack));

const addField = () => {
  relevant.value.fields?.push({
    position: relevant.value.fields.length,
    key: null,
    name: null,
    type: "TEXT",
    optional: false,
    input: {
      identifier: "FIELD",
      parameters: {
        selected: null,
        min: null,
        max: null,
        step: null,
        values: [],
      },
    },
  });
};

const removeField = (index) => {
  relevant.value.fields?.splice(index, 1);
};

const submit = async () => {
  if (props.edit) {
    await trackStore.updateTrack();
  } else {
    await trackStore.createTrack();
  }
  emit("close");
};

const addValue = (field) => {
  field.input.parameters.values.push({
    name: null,
    value: null,
  });
};

const removeSelectValue = (field, index) => {
  field.input.parameters.values.splice(index, 1);
  // ensure positions are correct
  field.input.parameters.values.forEach((value, index) => {
    value.position = index;
  });
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

const getInputs = (field) => TRACK_TYPE_INPUT[field.type];

const clearInputType = (field) => {
  if (
    field.input.identifier === TRACK_INPUT.SLIDER &&
    field.type !== TRACK_TYPE.FLOAT &&
    field.type !== TRACK_TYPE.INTEGER
  ) {
    field.input.identifier = null;
  }
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
  <Modal>
    <form @submit.prevent="submit" class="component add-track" v-if="relevant">
      <div class="general">
        <label>Name</label>
        <input type="text" v-model="relevant.name" placeholder="Enter a name ..." />
      </div>
      <div class="fields">
        <div class="field" v-for="(field, i) in relevant.fields" :key="i">
          <label>Field Name</label>
          <input
            type="text"
            v-model="field.name"
            placeholder="Enter a name ..."
            @input="onFieldNameChange($event, field)"
          />

          <label>Field Key</label>
          <input type="text" :value="field.key" :disabled="true" />

          <label>Entry is optional</label>
          <div class="toggle-wrapper">
            <Toggle v-model="field.optional" on-label="Yes" off-label="No" />
          </div>

          <label>Type</label>
          <select :disabled="edit" v-model="field.type" @change="clearInputType(field)">
            <option v-for="type in TRACK_TYPE" :key="type" :value="type">
              {{ type }}
            </option>
          </select>

          <label>Input Type</label>
          <select v-model="field.input.identifier">
            <option v-for="(type, typeIndex) in getInputs(field)" :key="typeIndex" :value="type">
              {{ type }}
            </option>
          </select>

          <div class="slider" v-if="field.input.identifier === 'SLIDER'">
            <label>Min Value</label>
            <input v-if="field.type === 'FLOAT'" type="number" step="0.0000001" v-model="field.input.parameters.min" />
            <input v-if="field.type === 'INTEGER'" type="number" step="1" v-model="field.input.parameters.min" />

            <label>Max Value</label>
            <input v-if="field.type === 'FLOAT'" type="number" step="0.0000001" v-model="field.input.parameters.max" />
            <input v-if="field.type === 'INTEGER'" type="number" step="1" v-model="field.input.parameters.max" />

            <label>Step Size</label>
            <input v-if="field.type === 'FLOAT'" type="number" step="0.0000001" v-model="field.input.parameters.step" />
            <input v-if="field.type === 'INTEGER'" type="number" step="1" v-model="field.input.parameters.step" />
          </div>

          <div class="select" v-if="field.input.identifier === 'SELECT'">
            <div class="value" v-for="(option, optionIndex) in field.input.parameters.values" :key="optionIndex">
              <input
                type="text"
                placeholder="Name"
                v-model="option.name"
                @input="!edit && (option.key = slugify(option.name))"
              />
              <input type="text" placeholder="Value" v-model="option.value" />

              <button class="remover" type="button" @click="removeSelectValue(field, optionIndex)">Remove</button>
            </div>
            <button type="button" @click="addValue(field)">Add Value</button>

            <label>Default Selection</label>
            <select v-model="field.input.parameters.selected">
              <option :value="null"></option>
              <option
                v-for="(option, optionIndex) in field.input.parameters.values"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.name }}
              </option>
            </select>
          </div>

          <button v-if="!edit" type="button" class="remove" @click="removeField(i)">Remove Field</button>
        </div>

        <button v-if="!edit" class="add-field" type="button" @click="addField">Add Field</button>
      </div>

      <div class="button-row">
        <button class="inverted" type="button" @click="$emit('close')">Cancel</button>
        <LoadingButton>{{ edit ? "Update" : "Create Track" }}</LoadingButton>
      </div>
    </form>
  </Modal>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.add-track {
  .toggle {
    --toggle-width: 3.5rem;
  }

  .toggle-wrapper {
    margin: 0 0 1rem 0;
  }

  .general {
    .shadow();
    background: @white;
    padding: 1rem;
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

  .value {
    .row(flex-start, space-between);
    margin: 0.5rem 0;

    .remover {
      width: auto;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    input {
      margin: 0 1rem 0 0;

      &:last-child {
        margin: 0;
      }
    }
  }

  .fields {
    .column(flex-end);

    input,
    select,
    label,
    .field {
      width: 100%;

      &[disabled] {
        background: #efefef;
        cursor: not-allowed;
      }
    }

    .field {
      .shadow();
      margin: 1rem auto;
      padding: 1rem;
      background: @white;
      position: relative;

      .remove {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.1rem 0.3rem;
        width: auto;
        margin: 0;
        font-size: 0.8rem;
      }
    }

    .add-field {
      width: 150px;
      margin: 0.5rem 0;
      border: 1px solid @highlight;
      background: @white;
      color: @highlight;
    }
  }
}
</style>
