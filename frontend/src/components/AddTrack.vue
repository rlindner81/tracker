<script setup lang="ts">
import { onBeforeMount, computed, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { TRACK_FIELD_TYPE, TRACK_FIELD_INPUT, TRACK_INPUT_TYPE } from "@/constants";
import { slugify } from "@/shared";

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

const removeField = (index) => {
  relevant.value.fields?.splice(index, 1);
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
  const [entry] = field.params.choices.splice(index, 1);
  if (entry.value === field.params.default_choice || field.params.choices.length === 0) {
    field.params.default_choice = null;
  }
};

const getFieldTypes = (input) => TRACK_INPUT_TYPE[input];

const prepareFieldParams = (field) => {
  switch (field.input) {
    case TRACK_FIELD_INPUT.TEXT_FIELD:
    case TRACK_FIELD_INPUT.DATETIME_PICKER: {
      field.params = {};
      return;
    }
    case TRACK_FIELD_INPUT.SELECT: {
      field.params = {
        choices: [{ name: null, value: null }],
        default_choice: null,
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

const onChangeFieldInput = (input, field) => {
  const matchingTypes = getFieldTypes(input);
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

if (props.edit) {
  addField();
}

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
        <v-text-field
          :label="$t('entity.track.name')"
          v-model="relevant.name"
          variant="underlined"
          density="compact"
          hide-details="auto"
          required
        ></v-text-field>
        <v-card class="my-4" elevation="2" v-for="(field, fieldIndex) in relevant.fields" :key="fieldIndex">
          <v-container class="py-2">
            <v-row class="flex-nowrap align-center">
              <v-col class="flex-grow-1 flex-shrink-0">
                <v-text-field
                  :label="$t('entity.track.fieldName')"
                  v-model="field.name"
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  required
                  @input="onFieldNameChange($event, field)"
                ></v-text-field>
              </v-col>
              <v-col class="flex-grow-1 flex-shrink-0">
                <v-text-field
                  :label="$t('entity.track.fieldKey')"
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  v-model="field.key"
                  disabled
                />
              </v-col>
              <v-col class="flex-grow-0 flex-shrink-1">
                <v-btn
                  @click="removeField(fieldIndex)"
                  variant="text"
                  icon="mdi-trash-can"
                  color="secondary"
                  density="compact"
                ></v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-checkbox
                  :label="$t('entity.track.entryOptional')"
                  density="compact"
                  hide-details="auto"
                  v-model="field.optional"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  :label="$t('entity.track.inputMethod')"
                  :items="Object.values(TRACK_FIELD_INPUT)"
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  v-model="field.input"
                  :disabled="edit"
                  @update:modelValue="onChangeFieldInput($event, field)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  :label="$t('entity.track.valueType')"
                  :items="getFieldTypes(field.input)"
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  v-model="field.type"
                  :disabled="edit"
                />
              </v-col>
            </v-row>

            <div v-if="field.input === TRACK_FIELD_INPUT.SELECT">
              <v-row
                class="flex-nowrap align-center"
                v-for="(choice, choiceIndex) in field.params.choices"
                :key="choiceIndex"
              >
                <v-col class="flex-grow-1 flex-shrink-0">
                  <v-text-field
                    :label="$t('entity.track.name')"
                    v-model="choice.name"
                    variant="underlined"
                    density="compact"
                    hide-details="auto"
                    required
                    @input="!edit && (choice.value = slugify(choice.name))"
                  ></v-text-field>
                </v-col>
                <v-col class="flex-grow-1 flex-shrink-0">
                  <v-text-field
                    :label="$t('entity.track.value')"
                    v-model="choice.value"
                    variant="underlined"
                    density="compact"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="flex-grow-0 flex-shrink-1">
                  <v-btn
                    @click="removeSelectValue(field, choiceIndex)"
                    variant="text"
                    icon="mdi-trash-can"
                    color="secondary"
                    density="compact"
                  ></v-btn>
                </v-col>
              </v-row>
              <v-row v-if="field.params.choices.length > 0">
                <v-col>
                  <v-select
                    :label="$t('entity.track.defaultSelection')"
                    :items="field.params.choices"
                    item-title="name"
                    item-value="value"
                    variant="underlined"
                    density="compact"
                    hide-details="auto"
                    v-model="field.params.default_choice"
                  />
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="secondary" @click="addSelectValue(field)">Add Choice</v-btn>
              </v-card-actions>
            </div>

            <div v-if="field.input === TRACK_FIELD_INPUT.SLIDER">
              <v-row>
                <v-col>
                  <v-text-field
                    :label="$t('entity.track.minValue')"
                    type="number"
                    :step="field.type === TRACK_FIELD_TYPE.FLOAT ? 0.01 : 1"
                    v-model="field.params.min"
                    variant="underlined"
                    density="compact"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :label="$t('entity.track.maxValue')"
                    type="number"
                    :step="field.type === TRACK_FIELD_TYPE.FLOAT ? 0.01 : 1"
                    v-model="field.params.max"
                    variant="underlined"
                    density="compact"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :label="$t('entity.step.size')"
                    type="number"
                    :step="field.type === TRACK_FIELD_TYPE.FLOAT ? 0.01 : 1"
                    v-model="field.params.step"
                    variant="underlined"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showAddTrack = false">Close</v-btn>
        <v-btn @click="addField" color="secondary" variant="flat">Add Field</v-btn>
        <v-btn @click="submit" color="primary" variant="flat">{{ edit ? "Update" : "Create" }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style></style>
