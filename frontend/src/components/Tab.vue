<template>
  <div class="component tab" v-show="selectedTitle === title">
    <slot></slot>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  props: {
    title: { required: true },
    selected: { default: false },
  },
  setup() {
    const selectedTitle = inject("selectedTitle");
    return {
      selectedTitle,
    };
  },
};
</script>
