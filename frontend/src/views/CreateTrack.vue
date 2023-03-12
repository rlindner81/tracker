<script setup lang="ts">
import { onBeforeMount, computed, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { TRACK_FIELD_TYPE, TRACK_FIELD_INPUT, TRACK_INPUT_TYPE } from "@/constants";
import { useRouter } from "vue-router";

const trackStore = useTrackStore();

const show = ref(false);
const edit = ref(false);
const trackFieldInput = Object.keys(TRACK_FIELD_INPUT);
const trackFieldType = Object.keys(TRACK_FIELD_TYPE);

const router = useRouter();

const relevant = computed(() => (edit.value ? trackStore.newUpdateTrack : trackStore.newCreateTrack));

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

const onSave = async () => {
  if (edit.value) {
    await trackStore.updateTrack();
  } else {
    await trackStore.createTrack();
  }
  router.push({ name: "Home" });
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
  if (!edit.value) {
    field.key = slugify(target.value);
  }
};

onBeforeMount(() => {
  if (edit.value) {
    trackStore.prepareNewUpdateTrack();
  } else {
    trackStore.prepareNewCreateTrack();
  }
});
</script>

<template>
  <v-container v-if="relevant">
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="relevant.name"
          :label="$t('entity.track.name')"
          :placeholder="$t('entity.track.namePlaceholder')"
          density="compact"
        ></v-text-field>
        <v-text-field label="Track Description" placeholder="Enter a description ..." density="compact"></v-text-field>
      </v-card-text>
    </v-card>
    <div v-for="(field, i) in relevant.fields" :key="i">
      <v-card class="mx-auto">
        <v-toolbar dark prominent density="compact">
          <v-btn :icon="show ? 'mdi-chevron-down' : 'mdi-chevron-right'" @click="show = !show"></v-btn>
          <v-toolbar-title>{{ field.name }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </v-toolbar>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              <div>
                <v-text-field
                  :label="$t('entity.track.fieldName')"
                  type="text"
                  density="compact"
                  v-model="field.name"
                  :placeholder="$t('entity.track.namePlaceholder')"
                  @input="onFieldNameChange($event, field)"
                />

                <v-text-field
                  type="text"
                  :value="field.key"
                  :disabled="true"
                  :label="$t('entity.track.fieldKey')"
                  density="compact"
                />

                <v-checkbox v-model="field.optional" color="secondary" :label="$t('entity.track.entryOptional')" />

                <v-select
                  :disabled="edit"
                  v-model="field.input"
                  :items="trackFieldInput"
                  @change="onChangeFieldInput(field)"
                  :label="$t('entity.track.inputMethod')"
                  density="compact"
                >
                </v-select>

                <v-select
                  :disabled="edit"
                  v-model="field.type"
                  :label="$t('entity.track.valueType')"
                  :items="trackFieldType"
                  density="compact"
                >
                </v-select>

                <div v-if="field.input === TRACK_FIELD_INPUT.SLIDER">
                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.INTEGER"
                    type="number"
                    step="1"
                    :label="$t('entity.track.minValue')"
                    v-model="field.params.min"
                    density="compact"
                  />
                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
                    type="number"
                    step="0.0000001"
                    :label="$t('entity.track.minValue')"
                    v-model="field.params.min"
                    density="compact"
                  />

                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.INTEGER"
                    type="number"
                    step="1"
                    :label="$t('entity.track.maxValue')"
                    v-model="field.params.max"
                    density="compact"
                  />
                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
                    type="number"
                    step="0.0000001"
                    :label="$t('entity.track.maxValue')"
                    v-model="field.params.max"
                    density="compact"
                  />

                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.INTEGER"
                    type="number"
                    step="1"
                    :label="$t('entity.step.size')"
                    v-model="field.params.step"
                    density="compact"
                  />
                  <v-text-field
                    v-if="field.type === TRACK_FIELD_TYPE.FLOAT"
                    type="number"
                    step="0.0000001"
                    :label="$t('entity.step.size')"
                    v-model="field.params.step"
                    density="compact"
                  />
                </div>

                <div v-if="field.input === TRACK_FIELD_INPUT.SELECT">
                  <div v-for="(choice, choiceIndex) in field.params.choices" :key="choiceIndex">
                    <v-text-field
                      :placeholder="$t('entity.track.name')"
                      v-model="choice.name"
                      @input="!edit && (choice.value = slugify(choice.name))"
                      density="compact"
                    />
                    <v-text-field :placeholder="$t('entity.track.value')" v-model="choice.value" density="compact" />

                    <button class="remover" type="button" @click="removeSelectValue(field, choiceIndex)">
                      {{ $t("action.remove") }}
                    </button>
                  </div>
                  <v-btn @click="addSelectValue(field)">{{ $t("entity.track.addValue") }}</v-btn>

                  <v-select
                    v-model="field.params.default_choice"
                    :label="$t('entity.track.defaultSelection')"
                    :items="field.params.choices"
                    density="compact"
                  >
                    <!--option :value="null"></option-->
                    <!--option
                      v-for="(choice, choiceIndex) in field.params.choices"
                      :key="choiceIndex"
                      :value="choice.value"
                    >
                      {{ choice.name }}
                    </option-->
                  </v-select>
                </div>

                <v-btn v-if="!edit" @click="removeField(i)">
                  {{ $t("entity.track.removeField") }}
                </v-btn>
              </div>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
    <v-btn v-if="!edit" class="mb-5 mr-5" icon="mdi-plus" color="primary" @click="addField"></v-btn>
  </v-container>
  <v-card flat location="bottom" position="fixed" color="primary" :rounded="0" width="100%">
    <v-card-actions>
      <v-btn @click="$router.push({ name: 'Home' })">{{ $t("action.cancel") }}</v-btn>
      <v-btn color="success" variant="elevated" @click="onSave()">{{ $t("action.save") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style></style>
