/* Register all global components */

import { boot } from 'quasar/wrappers';
import BaseThemeSwitcher from 'components/BaseThemeSwitcher.vue';
import BasePage from 'components/BasePage.vue';
import BaseInput from 'components/BaseInput.vue';
import BaseLayout from 'components/BaseLayout.vue';

export default boot(({ app }) => {
  const Vue = app; // Jetbrains IDE autoload compatibility
  Vue.component('BasePage', BasePage);
  Vue.component('BaseInput', BaseInput);
  Vue.component('BaseLayout', BaseLayout);
  Vue.component('BaseThemeSwitcher', BaseThemeSwitcher);
});
