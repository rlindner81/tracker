<template>
  <div class="view login">
    <form @submit.prevent="login({ email, password })">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <LoadingButton>Login</LoadingButton>
    </form>
  </div>
</template>

<script lang="ts">
import LoadingButton from "@/components/LoadingButton.vue";
import { login } from "@/firebase/auth";

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
    async login(options) {
      return await login(options);
    },
  },
};
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.view.login {
  .shadow();
  transition: all 0.1s ease-in-out;
  width: 300px;
  background: @white;
  padding: 2rem;
}
</style>
