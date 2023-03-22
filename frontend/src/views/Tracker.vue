<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";

import AddStep from "@/components/AddStep.vue";
import { computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const trackStore = useTrackStore();
const stepStore = useStepStore();
const route = useRoute();

const onAddStepClicked = () => {
  stepStore.resetNewStepValues();
};

const headers = computed(() => {
  const trackFields = trackStore.current?.fields;
  if (!trackFields) return [];
  const metaFields = [
    { name: "Tracked By", key: "postedBy" },
    { name: "Tracked On", key: "postedAt" },
  ];
  return trackFields.concat(metaFields).map((field) => ({
    title: field.name,
    key: field.key,
    align: "start",
    sortable: true,
  }));
});

const rows = computed(() => {
  return !stepStore.stepsDisplayRows.length
    ? []
    : stepStore.stepsDisplayRows.map(({ values, meta }) => ({ ...values, ...meta }));
});

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
    <v-data-table
      :v-if="rows.length"
      items-per-page="20"
      :headers="headers"
      :items="rows"
      item-value="name"
      class="elevation-2"
    />
    <v-btn @click="onAddStepClicked" class="mb-5 mr-5" position="fixed" location="bottom right" icon color="secondary">
      <v-icon>mdi-plus</v-icon>
      <AddStep></AddStep>
    </v-btn>
  </div>
</template>

<style></style>
