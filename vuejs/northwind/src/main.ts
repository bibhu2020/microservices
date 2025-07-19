import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/main.css'

// console.log(process.env.VITE_API_URL);

const app = createApp(App)

app.use(router)

app.mount('#app')
