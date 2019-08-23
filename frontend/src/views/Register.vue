<template>
  <div class="view register">
    <form @submit.prevent="submit">

      <input v-model="user.name" type="text" placeholder="Name">
      <input v-model="user.email" type="text" placeholder="Email">
      <input v-model="user.password" type="password" placeholder="Password">
      <LoadingButton>Register</LoadingButton>
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
    ...mapState('user', { user: 'register' })
  },
  methods: {
    ...mapActions('user', ['register']),
    submit () {
      this.register()
        .then(() => {
          this.$router.replace('/')
        })
    }
  }
}
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
