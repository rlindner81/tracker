<script setup lang="ts">
import { onBeforeMount, computed } from "vue";
import { useTrackStore } from "@/store/track";
import { TRACK_FIELD_TYPE, TRACK_FIELD_INPUT, TRACK_INPUT_TYPE } from "@/constants";
import { useRouter } from "vue-router";
import TrackField from "@/components/TrackField.vue";

const trackStore = useTrackStore();
const props = defineProps({
  edit: {
    default: false,
  },
});

const router = useRouter();

const relevant = computed(() => (props.edit ? trackStore.newUpdateTrack : trackStore.newCreateTrack));

const onSave = async () => {
  if (props.edit) {
    await trackStore.updateTrack();
  } else {
    await trackStore.createTrack();
  }
  router.push({ name: "Home" });
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
  </v-container>
  <v-card flat location="bottom" position="fixed" color="primary" :rounded="0" width="100%">
    <v-card-actions>
      <v-btn>Cancel</v-btn>
      <v-btn color="success" variant="elevated" @click="onSave()">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style></style>
