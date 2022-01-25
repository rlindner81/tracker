<template>
  <div class="view login">
    <form @submit.prevent="submit">
      <input
        v-model="user.nameOrEmail"
        type="text"
        placeholder="Name or Email"
      />
      <input v-model="user.password" type="password" placeholder="Password" />
      <LoadingButton>Login</LoadingButton>
    </form>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { mapActions, mapGetters } from "vuex";
import LoadingButton from "../components/LoadingButton";
export default {
  components: {
    LoadingButton,
  },
  data() {
    return {
      user: {
        nameOrEmail: null,
        password: null,
      },
    };
  },
  methods: {
    ...mapGetters("user", ["isLoggedIn"]),
    ...mapActions("user", ["login"]),
    async submit() {
      await this.login(toRaw(this.user));
      if (this.isLoggedIn()) {
        return this.$router.push("/");
      }
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
