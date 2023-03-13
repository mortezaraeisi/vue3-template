import { createApp } from 'vue'
import { createPinia } from "pinia";
import { router } from "./router";
import { registerGlobalComponents } from "./components";
import App from './App.vue'
import './css/style.scss'
import './utils/register-icons'

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)
app.use(router)

registerGlobalComponents(app);


app.mount('#app')
