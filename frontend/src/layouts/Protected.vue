<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useTrackStore } from "@/store/track";
import { useCommonStore } from "@/store/common";
import { logout } from "@/firebase/auth";
import LoadingButton from "@/components/LoadingButton.vue";
import { tracksLoadedPromise, usersLoadedPromise } from "@/firebase/db";
import { useUserStore } from "@/store/user";

const commonStore = useCommonStore();
const userStore = useUserStore();
const trackStore = useTrackStore();

let initialized = ref(false);
let mobileNavVisible = ref(false);

const toggleMobileNav = () => {
  mobileNavVisible.value = !mobileNavVisible.value;
};

onMounted(async () => {
  userStore.subscribeUsers();
  trackStore.subscribeTracks();
  // TODO this promise approach doesn't really work for the unmount case... is there a better way?
  await Promise.all([usersLoadedPromise, tracksLoadedPromise]);
  initialized.value = true;
});
onUnmounted(() => {
  userStore.unsubscribeUsers();
  trackStore.unsubscribeTracks();
  initialized.value = false;
});
</script>

<template>
  <div class="layout protected">
    <div class="letter-box">
      <nav :data-open="mobileNavVisible || null">
        <router-link :to="{ name: 'Home' }">Dashboard</router-link>

        <h1>Tracks</h1>

        <router-link
          v-for="track in trackStore.tracks"
          :key="track._id"
          :to="{ name: 'Track', params: { track: track._id } }"
          >{{ track.name }}</router-link
        >

        <p v-if="commonStore.user" class="logout">
          Logged in as {{ commonStore.user?.email }}
          <LoadingButton @click.prevent="logout()">Logout</LoadingButton>
        </p>

        <div class="toggle-nav" @click="toggleMobileNav">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>

      <main>
        <router-view v-if="initialized" :key="$route.path"></router-view>
      </main>
    </div>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.layout.protected {
  .size(100%, 100%);
  overflow-y: auto;
  padding: 8rem 4rem;
  position: relative;
  background: url("@/assets/paper.png") repeat;

  @media @medium {
    padding: 4rem 0;
  }

  @media @small {
    padding: 0;
    overflow: hidden;
  }

  .letter-box {
    .max(1000px);
    .row();
    margin: 0 auto;
  }

  nav {
    width: 200px;
    flex-shrink: 0;
    text-align: end;
    margin-top: 3.5rem;

    h1 {
      margin: 1rem 0;
      font-size: 1.5rem;
    }

    a {
      margin-top: 0.25rem;
      transition: all 0.1s ease;

      &.router-link-active:not(:first-child),
      &.router-link-exact-active {
        color: @highlight;
        text-decoration: underline;
      }

      &:hover {
        transform: translateX(5px);
      }
    }

    .toggle-nav {
      .column(space-between, space-between);
      transition: all 0.1s ease-in-out;
      width: 30px;
      height: 25px;
      position: absolute;
      top: -50px;
      right: 1rem;
      cursor: pointer;

      > div {
        width: 100%;
        height: 3px;
        background: @font-color;
      }
    }

    .logout {
      margin: 1rem 0;
    }

    @media @small {
      .shadow();
      width: 100%;
      transition: all 0.2s ease-in-out;
      transform: translateY(100%);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      padding: 1rem;
      background: @white;
      z-index: 1;
      text-align: left;
      a {
        font-size: 1.25rem;
      }

      h1 {
        font-size: 2.5rem;
      }

      .toggle-nav {
        display: flex;
      }

      &[data-open] {
        transform: translateY(0);

        .toggle-nav > div {
          &:nth-child(1) {
            transform: translateY(11px) rotate(45deg);
          }
          &:nth-child(2) {
            display: none;
          }
          &:nth-child(3) {
            transform: translateY(-10px) rotate(-45deg);
          }
        }
      }
    }
  }

  main {
    flex-grow: 1;
    padding: 0 4rem;

    h1 {
      font-size: 2.5rem;
    }

    @media @full, @medium {
      max-width: ~"calc(100% - 200px)";
    }

    @media @small {
      padding: 1rem;
      height: 100vh;
      overflow-y: auto;
    }
  }
}
</style>
