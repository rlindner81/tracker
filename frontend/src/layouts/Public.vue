<template>
  <div class="layout public">
    <div class="flex-aligner">
      <main>
        <router-view></router-view>
      </main>

      <nav>
        <router-link to="/auth/login">Login</router-link>
        <router-link to="/auth/register">Register</router-link>
      </nav>
    </div>
  </div>
</template>

<style lang="less">
@import "../less/variables";
@import "../less/helpers";

.layout.public {
  .size(100%, 100%);
  .row(center, center);
  background: url("~@/assets/paper.png") repeat;

  .flex-aligner {
    .column();

    main {
      margin-bottom: 1rem;
    }

    nav {
      .row(center, center);
      width: 100%;

      > a {
        transition: transform 0.1s ease-in-out;
        margin: 0.5rem 1rem;

        &.router-link-exact-active {
          border-bottom: 1px solid @font-color;
        }

        &:hover {
          transform: scale(1.1) rotate(5deg);
        }
      }
    }
  }
}
</style>
