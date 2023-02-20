import "./firebase/app";
import { createApp } from "vue";
import { createPinia } from "pinia";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";
import { readableDateTime, readableRelativeDateTime } from "./datetime";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#f8f9fa",
    surface: "#FFFFFF",
    primary: "#1b4965",
    "primary-darken-1": "#3700B3",
    secondary: "#1c7293",
    "secondary-darken-1": "#018786",
    error: "#a4133c",
    info: "#82a3a1",
    success: "#137547",
    warning: "#db7c26",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: { myCustomLightTheme },
  },
});

// https://vite-pwa-org.netlify.app/guide/auto-update.html
registerSW({ immediate: true });

const app = createApp(App).use(vuetify).use(createPinia()).use(router);
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
