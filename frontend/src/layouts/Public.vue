<template>
  <v-app>
    <v-container fluid class="outer fill-height">
      <v-layout class="fill-height align-center justify-center" style="width: 350px">
        <v-card class="px-4" style="width: 25rem">
          <v-card-text>
            <div class="text-center pb-6">
              <img src="@/assets/logo.png" />
            </div>

            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component"></component>
              </transition>
            </router-view>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style scoped>
.outer {
  background: radial-gradient(circle, rgba(29, 56, 28, 1) 0%, rgba(71, 143, 68, 1) 100%);
}
</style>
