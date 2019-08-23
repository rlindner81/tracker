<template>
  <div class="view login">
    <form @submit.prevent="submit">
      <input v-model="user.nameOrEmail" type="text" placeholder="Name or Email">
      <input v-model="user.password" type="password" placeholder="Password">
      <LoadingButton>Login</LoadingButton>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoadingButton from '../components/LoadingButton'
export default {
  components: {
    LoadingButton
  },
  computed: {
    ...mapState('user', { user: 'login' })
  },
  methods: {
    ...mapActions('user', ['login']),
    submit () {
      this.login()
        .then(() => {
          this.$router.push('/')
        })
    }
  }
}
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
