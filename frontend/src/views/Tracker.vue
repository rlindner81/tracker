<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import AddStep from "@/components/AddStep.vue";
import TrackList from "@/components/TrackList.vue";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

const onAddStepClicked = () => {
  stepStore.resetNewStepValues();
};

onBeforeMount(() => {
  trackStore.setCurrentId(route.params.track);
  stepStore.resetNewStepValues();
  stepStore.subscribeSteps();
});

onBeforeUnmount(() => {
  stepStore.unsubscribeSteps();
});
</script>

<template>
  <div>
    <v-card>
      <v-card-title class="text-h5">{{ trackStore.titleById($route.params.track) }}</v-card-title>
      <v-container>
        <TrackList></TrackList>
      </v-container>
    </v-card>

    <v-btn @click="onAddStepClicked" class="mb-5 mr-5" position="fixed" location="bottom right" icon color="secondary">
      <v-icon>mdi-plus</v-icon>
      <AddStep></AddStep>
    </v-btn>
  </div>
</template>

<style></style>
