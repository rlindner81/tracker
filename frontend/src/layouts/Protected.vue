<template>
  <div class="layout protected">
    <div class="letter-box">
      <nav>
        <router-link
          to="/tracker"
        >Dashboard</router-link>

        <h1>Tracks</h1>

        <router-link
          v-for="track in tracks"
          :key="track._id"
          :to="`/tracker/${track._id}`"
        >{{ track.name }}</router-link>
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
      initialized: false
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
    ...mapActions('track', { loadTracks: 'load' })
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
  background: url('~@/assets/paper.png') repeat;

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

      &.router-link-exact-active {
        color: @highlight;
        text-decoration: underline;
      }

      &:hover {
        transform: translateX(5px);
      }
    }
  }

  main {
    flex-grow: 1;
    padding: 0 4rem;

    h1 {
      font-size: 2.5rem;
    }
  }
}
</style>
