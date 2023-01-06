<template>
  <div class="view register">
    <form @submit.prevent="register({ email, password })">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <LoadingButton>Register</LoadingButton>
    </form>
  </div>
</template>

<script>
// TODO: second password field and minimal input validation

import { mapActions } from "vuex";
import LoadingButton from "@/components/LoadingButton.vue";
export default {
  components: {
    LoadingButton,
  },
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    ...mapActions("common", ["register"]),
  },
};
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.view.register {
  .shadow();
  transition: all 0.1s ease-in-out;
  width: 300px;
  background: @white;
  padding: 2rem;
}
</style>
