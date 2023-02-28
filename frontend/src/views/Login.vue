<script setup lang="ts">
import { ref } from "vue";
import { login } from "@/firebase/auth";
import LoadingButton from "@/components/LoadingButton.vue";

let email = ref<string | null>(null);
let password = ref<string | null>(null);
</script>

<template>
  <div class="view login">
    <form @submit.prevent="login({ email, password })">
      <input v-model="email" type="text" :placeholder="$t('login.email')" />
      <input v-model="password" type="password" :placeholder="$t('login.password')" />
      <LoadingButton>{{ $t("login.button") }}</LoadingButton>
    </form>
  </div>
</template>

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
