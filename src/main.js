import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import mitt from 'mitt';
const emitter = mitt();        // Event bus

const app = createApp(App);
app.provide('emitter', emitter); 
app.mount('#app');
