<template>
  <div class="layout protected">
    <div class="letter-box">
      <nav :data-open="mobileNavVisible">
        <router-link
          to="/tracker"
        >Dashboard</router-link>

        <h1>Tracks</h1>

        <router-link
          v-for="track in tracks"
          :key="track._id"
          :to="`/tracker/${track._id}`"
        >{{ track.name }}</router-link>

        <div class="toggle" @click="toggleMobileNav">
          <div></div><div></div><div></div>
        </div>
      </nav>

      <main>
        <router-view v-if="initialized" :key="$route.path"></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      initialized: false,
      mobileNavVisible: false
    }
  },
  created () {
    this.load()
      .catch(() => {
        this.clear()
        this.$router.push('/login')
      })
      .then(() => {
        return this.loadTracks()
      })
      .then(() => {
        this.initialized = true
      })
  },
  computed: {
    ...mapState('track', { tracks: 'data' })
  },
  methods: {
    ...mapActions('user', { load: 'init', clear: 'clear' }),
    ...mapActions('track', { loadTracks: 'load' }),
    toggleMobileNav () {
      this.mobileNavVisible = !this.mobileNavVisible
    }
  }
}
</script>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.layout.protected {
  .size(100%, 100%);
  overflow-y: auto;
  padding: 8rem 4rem;
  position: relative;
  background: url('~@/assets/paper.png') repeat;

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

      &.router-link-active:not(:first-child), &.router-link-exact-active {
        color: @highlight;
        text-decoration: underline;
      }

      &:hover {
        transform: translateX(5px);
      }
    }

    .toggle {
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

      .toggle {
        display: flex;
      }

      &[data-open] {
        transform: translateY(0);

        .toggle > div {
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
