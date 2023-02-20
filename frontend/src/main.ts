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
    background: "#FFFFFF",
    surface: "#FaaFaa",
    primary: "#004d40",
    "primary-darken-1": "#3700B3",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
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
