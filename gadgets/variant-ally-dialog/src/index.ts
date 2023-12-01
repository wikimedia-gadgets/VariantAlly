import { createMwApp } from 'vue';
import App from './App.vue';

function getMountPoint(): Element {
  switch (mw.config.get('skin')) {
    case 'vector-2022':
      return document.getElementsByClassName('mw-page-container')[0] ?? document.body;
    case 'timeless':
      return document.getElementById('mw-content-block') ?? document.body;
    case 'vector':
    case 'minerva':
    case 'monobook':
    default:
      return document.body;
  }
}

const root = document.createElement('div');
getMountPoint().appendChild(root);
createMwApp(App).mount(root);
