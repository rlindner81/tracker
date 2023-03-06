<script setup lang="ts">
// TODO: second password field and minimal input validation
import { ref } from "vue";
import { register } from "@/firebase/auth";

let name = ref<string | null>(null);
let email = ref<string | null>(null);
let password = ref<string | null>(null);
let loading = ref(false);

const doRegister = () => {
  loading.value = true;
  register({ email: email.value, password: password.value });
  loading.value = false;
};
</script>

<template>
  <v-form ref="form" @submit.prevent="doRegister">
    <v-text-field
      :label="$t('auth.register.name')"
      prepend-icon="mdi-account"
      v-model="name"
      variant="underlined"
    ></v-text-field>
    <!--                :error-messages="errorMessages.email"-->

    <v-text-field
      :label="$t('auth.register.email')"
      prepend-icon="mdi-email"
      v-model="email"
      variant="underlined"
      required
    ></v-text-field>
    <!--                :error-messages="errorMessages.email"-->

    <v-text-field
      :label="$t('auth.register.password')"
      prepend-icon="mdi-lock"
      type="password"
      v-model="password"
      variant="underlined"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn :loading="loading" class="large text rounded" type="submit">{{ $t("auth.register.signUp") }}</v-btn>
    </div>
    <div class="d-flex justify-start">
      <router-link :to="{ name: 'Login' }">{{ $t("auth.login.signIn") }}</router-link>
    </div>
  </v-form>
</template>

<style></style>
