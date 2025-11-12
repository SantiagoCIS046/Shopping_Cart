import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar, Notify } from "quasar";
import router from "./router";
import App from "./App.vue";
import "./style.css";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/dist/quasar.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
  }, // import Quasar plugins and add here
});

app.mount("#app");
