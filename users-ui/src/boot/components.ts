/* Register all global components */

import { boot } from 'quasar/wrappers';
import BaseThemeSwitcher from 'components/BaseThemeSwitcher.vue';

export default boot(({ app }) => {
  const Vue = app; // Jetbrains IDE autoload compatibility
  Vue.component('BaseThemeSwitcher', BaseThemeSwitcher);
});
