<script setup lang="ts">
// TODO: second password field and minimal input validation
import { ref } from "vue";
import { register } from "@/firebase/auth";
import LoadingButton from "@/components/LoadingButton.vue";

let email = ref<string | null>(null);
let password = ref<string | null>(null);
</script>

<template>
  <v-form ref="form" @submit.prevent="register">
    <v-text-field label="E-mail" prepend-icon="mdi-account" v-model="email" required></v-text-field>
    <!--                :error-messages="errorMessages.email"-->

    <v-text-field label="Password" prepend-icon="mdi-lock" type="password" v-model="password" required></v-text-field>

    <div class="text-center">
      <v-btn class="large text rounded" type="submit">Sign Up</v-btn>
    </div>
    <div class="d-flex justify-start">
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </div>
  </v-form>
</template>

<style></style>
