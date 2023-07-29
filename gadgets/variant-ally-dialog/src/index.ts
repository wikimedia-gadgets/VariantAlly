import { createMwApp } from 'vue';
import App from './App.vue';

const root = document.createElement('div');
document.body.appendChild(root);
createMwApp(App).mount(root);
