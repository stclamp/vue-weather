import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/_global.scss'
import i18n from '@/i18n'

const app = createApp(App)

app.use(i18n)

app.use(router)

app.mount('#app')
