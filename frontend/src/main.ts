import "./firebase/app";
import { createApp } from "vue";
import { createPinia } from "pinia";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { readableDateTime, readableRelativeDateTime } from "./datetime";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";

import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: import.meta.env.VITE_COLOR_PRIMARY,
    "primary-darken-1": "#3700b3",
    secondary: import.meta.env.VITE_COLOR_SECONDARY,
    "secondary-darken-1": "#018786",
    background: import.meta.env.VITE_COLOR_BACKGROUND,
    surface: "#ffffff",
    error: "#a4133c",
    info: "#82a3a1",
    success: "#137547",
    warning: "#db7c26",
  },
};

const vuetify = createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: { myCustomLightTheme },
  },
});

// https://vite-pwa-org.netlify.app/guide/auto-update.html
registerSW({ immediate: true });

const app = createApp(App).use(vuetify).use(createPinia()).use(router).use(i18n);
app.mount("#app");

// https://primitive.dev/blog/vue-3-global-filters/
app.config.globalProperties.$filters = {
  readableDateTime,
  readableRelativeDateTime,
};

console.log(
  "running %s v%s (%s, %s)",
  import.meta.env.VITE_NPM_NAME,
  import.meta.env.VITE_NPM_VERSION,
  __VITE_MODE__,
  __GIT_COMMIT__,
);

// see https://stackoverflow.com/questions/64175742/using-globalproperties-in-vue-3-and-typescript
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $filters: { readableDateTime; readableRelativeDateTime };
  }
}
