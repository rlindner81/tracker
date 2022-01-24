<template>
  <div class="component tabs">
    <div class="tabs">
      <ul>
        <li
          v-for="(title, i) in tabTitles"
          :class="{ 'is-active': selectedTitle === title }"
          :key="i"
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

<script>
import { ref, provide } from "vue";
export default {
  setup(props, { slots }) {
    const tabTitles = ref(slots.default().map((tab) => tab.props.title));
    const selectedTitle = ref(
      slots.default().find((tab) => tab.props.selected).props.title
    );

    provide("selectedTitle", selectedTitle);
    return {
      tabTitles,
      selectedTitle,
    };
  },
  mounted() {
    const tabHrefs = this.tabTitles.map(this.hrefFromTitle.bind(this));
    const hashIndex = tabHrefs.indexOf(this.$route.hash);
    if (hashIndex >= 0) {
      this.selectedTitle = this.tabTitles[hashIndex];
    }
  },
  methods: {
    hrefFromTitle(title) {
      return "#" + title.toLowerCase();
    },
  },
};
</script>

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
