import "./firebase/app";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { readableDateTime, readableRelativeDateTime } from "./datetime";

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
