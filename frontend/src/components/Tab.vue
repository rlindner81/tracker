<script setup lang="ts">
import { inject } from "vue";

defineProps({
  title: { required: true },
  selected: { default: false },
});

const selectedTitle = inject("selectedTitle");
</script>

<template>
  <div class="component tab" v-show="selectedTitle === title">
    <slot></slot>
  </div>
</template>
