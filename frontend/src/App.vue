<script setup lang="ts">
import { onMounted } from "vue";
import { useCommonStore } from "@/store/common";
import { observeAuthChanges } from "@/firebase/auth";

const commonStore = useCommonStore();

onMounted(() => {
  observeAuthChanges();
});
</script>

<template>
  <router-view />

  <div class="errors">
    <div class="error" v-for="(error, index) in commonStore.errors" :key="index">
      {{ error }}
    </div>
  </div>
</template>

<style></style>
