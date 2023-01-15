import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { registerComponents } from './components';

import './css/styles.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

registerComponents({ app });

app.mount('#app');
