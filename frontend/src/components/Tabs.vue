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
        <li v-for="(title, i) in tabTitles" :class="{ 'is-active': selectedTitle === title }" :key="i">
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

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.tabs {
  width: 100%;
  .tabs {
    width: 100%;
    ul {
      .row();
      border-bottom: 2px solid #ccc;

      li {
        margin-right: 1rem;
        padding: 0.25rem 0.5rem;
        border-bottom: 2px solid transparent;
        transform: translateY(2px);

        a {
          font-size: 1.2rem;
        }

        &.is-active {
          border-color: @highlight;
        }
      }
    }
  }
}
</style>
