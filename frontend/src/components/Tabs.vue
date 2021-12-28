<template>
  <div class="component tabs">
    <div class="tabs">
      <ul>
        <li
          v-for="(tab, i) in tabs"
          :class="{ 'is-active': tab.isActive }"
          :key="i"
        >
          <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
        </li>
      </ul>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { tabs: [] };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name === selectedTab.name;
      });
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
