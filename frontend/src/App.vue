<template>
  <div id="app">
    <router-view />

    <div class="errors">
      <div class="error" v-for="(error, index) in errors" :key="index">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
export default {
  mounted() {
    this.observeAuthChanges();
  },
  computed: {
    ...mapState("common", ["errors"]),
  },
  methods: {
    ...mapActions("common", ["observeAuthChanges"]),
  },
};
</script>

<style lang="less">
@import (css) url("https://fonts.googleapis.com/css?family=Lato");
@import "less/variables";
@import "less/helpers";

html,
body {
  margin: 0;
  padding: 0;
}

body * {
  font-family: "Lato", sans-serif;

  color: @font-color;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-decoration: none;
  display: block;
  font-size: 1rem;

  -webkit-appearance: unset;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;

  .errors {
    position: fixed;
    width: 200px;
    top: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;

    .error {
      .shadow();
      background: tomato;
      padding: 0.5rem 1rem;
      color: @white;
    }
  }
}

input:not([type="range"]),
select,
textarea,
button {
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid @highlight;

  + * {
    margin-top: 1rem;
  }
}

input[type="range"] {
  width: 100%;
  position: relative;
  &:after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background: #ccc;
  }
}

button {
  border: none;
  background: @highlight;
  color: @white;
  cursor: pointer;

  &.inverted {
    border: 1px solid @highlight;
    background: @white;
    color: @highlight;
  }
}
</style>
