<script setup lang="ts">
import { ref, provide, onMounted, useSlots } from "vue";
import { useRoute } from "vue-router";

const slots = useSlots();
const route = useRoute();

const tabTitles = ref(slots.default?.().map((tab) => tab.props?.title));
let selectedTitle = ref(slots.default?.().find((tab) => tab.props?.selected)?.props?.title);

provide("selectedTitle", selectedTitle);

const hrefFromTitle = (title) => {
  return "#" + title.toLowerCase();
};

onMounted(() => {
  const tabHrefs = tabTitles.value?.map?.(hrefFromTitle);
  const hashIndex = tabHrefs?.indexOf(route.hash);
  if (hashIndex !== undefined && hashIndex >= 0) {
    selectedTitle.value = tabTitles.value?.[hashIndex];
  }
});
</script>

<template>
  <div class="component tabs">
    <div class="tabs">
      <ul>
        <li
          v-for="(title, titleIndex) in tabTitles"
          :class="{ 'is-active': selectedTitle === title }"
          :key="titleIndex"
        >
          <a :href="hrefFromTitle(title)" @click="selectedTitle = title">
            {{ title }}
          </a>
        </li>
      </ul>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<style></style>
