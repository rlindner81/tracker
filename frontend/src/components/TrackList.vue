<script setup lang="ts">
import { useStepStore } from "@/store/step";
import { useTrackStore } from "@/store/track";
import { computed } from "vue";

const trackStore = useTrackStore();
const stepStore = useStepStore();

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
</script>

<template>
  <v-data-table
    :v-if="rows.length"
    items-per-page="20"
    :headers="headers"
    :items="rows"
    item-value="name"
    class="elevation-1"
  />
  <v-btn class="mb-5 mr-5" position="fixed" location="bottom right" icon="mdi-plus" color="primary" />
</template>

<style></style>
