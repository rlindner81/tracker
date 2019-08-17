<template>
  <div class="component tiles">
    <div class="tiles-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tiles'
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.component.tiles {
  .row(flex-start, center);
  width: 100%;

  > .tiles-container {
    .row(flex-start, flex-start, wrap);
    width: ~"calc(100% + 2rem)";
    margin: 0 auto;
    flex-shrink: 0;
  }
}
</style>
