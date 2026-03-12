import { createApp } from "vue";
import App from "./App.vue";
import halleyxKit from "halleyx-ui-framework";
import "halleyx-ui-framework/dist/es/index.css";

import "./registerServiceWorker";
import "./assets/icons/icon-style.css";
import "./assets/theme.css";
import router from "./router";
import store from "./store";

const app = createApp(App);
app.use(store).use(router).use(halleyxKit);

// Initialize theme on app mount
store.dispatch("initTheme");

app.mount("#app");
