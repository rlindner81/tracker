<script setup lang="ts">
import { ref } from "vue";
import { login } from "@/firebase/auth";

let email = ref<string | null>(null);
let password = ref<string | null>(null);
let loading = ref(false);

const doLogin = () => {
  loading.value = true;
  login({ email: email.value, password: password.value });
  loading.value = false;
};
</script>

<template>
  <v-form ref="form" @submit.prevent="doLogin">
    <v-text-field prepend-icon="mdi-email" label="E-mail" v-model="email" variant="underlined" required></v-text-field>
    <!--                :error-messages="errorMessages.email"-->

    <v-text-field
      prepend-icon="mdi-lock"
      label="Password"
      type="password"
      v-model="password"
      variant="underlined"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn :loading="loading" class="large text rounded" type="submit">Sign In</v-btn>
    </div>
    <div class="d-flex justify-end">
      <router-link :to="{ name: 'Register' }">Register</router-link>
    </div>
  </v-form>
</template>
