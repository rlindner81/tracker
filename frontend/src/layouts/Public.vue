<template>
  <v-app>
    <v-container fluid class="fill-height" id="login-page">
      <v-layout class="align-center justify-center">
        <v-flex style="width: 350px">
          <v-card>
            <v-card-text>
              <div class="text-center mb-6">
                <img src="../assets/logo.png" />
              </div>

              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style scoped>
#login-page {
  background-color: #34495e;
}
</style>
