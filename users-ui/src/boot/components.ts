/* Register all global components */

import { boot } from 'quasar/wrappers';
import BaseThemeSwitcher from 'components/BaseThemeSwitcher.vue';
import BasePage from 'components/BasePage.vue';
import BaseLayout from 'components/BaseLayout.vue';

export default boot(({ app }) => {
  const Vue = app; // Jetbrains IDE autoload compatibility
  Vue.component('BaseLayout', BaseLayout);
  Vue.component('BasePage', BasePage);
  Vue.component('BaseThemeSwitcher', BaseThemeSwitcher);
});
