import { createMwApp } from 'vue';
import App from './App.vue';
import { getMountPoint } from './utils';

const root = document.createElement('div');
getMountPoint().appendChild(root);
createMwApp(App).mount(root);
