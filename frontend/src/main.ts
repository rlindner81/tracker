import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { readableDateTime, readableRelativeDateTime} from "./datetime";

const app = createApp(App).use(store).use(router);
app.mount("#app");

// https://primitive.dev/blog/vue-3-global-filters/
app.config.globalProperties.$filters = {
  readableDateTime,
  readableRelativeDateTime
}
