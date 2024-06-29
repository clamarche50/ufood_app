import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";
import './style.css'
import Toast, { PluginOptions } from "vue-toastification"; // https://vue-toastification.maronato.dev/
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
const options = {}
app.use(Toast, options);
app.mount("#app");
