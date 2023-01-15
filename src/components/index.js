import BaseButton from './BaseButton.vue';

export function registerComponents({ app }) {
  const Vue = app; // In case of IDE detects global components when they register on `Vue` name
  Vue.component('BaseButton', BaseButton);
}
