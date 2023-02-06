import "./firebase/app";
import { createApp } from "vue";
import { createPinia } from "pinia";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";
import { readableDateTime, readableRelativeDateTime } from "./datetime";

// https://vite-pwa-org.netlify.app/guide/auto-update.html
registerSW({ immediate: true });

const app = createApp(App).use(createPinia()).use(router);
app.mount("#app");

// https://primitive.dev/blog/vue-3-global-filters/
app.config.globalProperties.$filters = {
  readableDateTime,
  readableRelativeDateTime,
};

// see https://stackoverflow.com/questions/64175742/using-globalproperties-in-vue-3-and-typescript
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $filters: { readableDateTime; readableRelativeDateTime };
  }
}
