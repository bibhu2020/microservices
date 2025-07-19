import '@/assets/main.css'
import 'primeicons/primeicons.css';
import 'vue-toastification/dist/index.css';
import router from '@/router/index';
import Toast from 'vue-toastification';

import { createApp } from 'vue'
import App from '@/App.vue'

// createApp(App).mount('#app')

const app = createApp(App);

app.use(router);
app.use(Toast, {
    timeout: 3000,
    position: 'top-right',
    hideProgressBar: false,
  });

app.mount('#app');
