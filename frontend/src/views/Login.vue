<template>
  <div class="view login">
    <form @submit.prevent="login({ email, password })">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <LoadingButton>Login</LoadingButton>
    </form>
  </div>
</template>

<script>
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
    ...mapActions("common", ["login"]),
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
