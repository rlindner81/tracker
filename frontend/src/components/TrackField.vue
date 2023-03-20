<script setup lang="ts">
import { useTrackStore } from "@/store/track";
import { useStepStore } from "@/store/step";
import { TRACK_FIELD_INPUT, TRACK_FIELD_TYPE } from "@/constants";
import { ref } from "vue";

const trackStore = useTrackStore();
</script>

<template>
  {{ "This is my component." }}
</template>

<style></style>
