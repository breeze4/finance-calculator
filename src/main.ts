import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'

// Vue DevTools - only in development
if (import.meta.env.DEV) {
  import('@vue/devtools').then(() => {
    // DevTools will auto-connect in development
    console.log('Vue DevTools enabled for development')
  }).catch(err => {
    console.warn('Failed to load Vue DevTools:', err)
  })
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
