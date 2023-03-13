import BaseButton from './BaseButton.vue';
import BaseCalendar from './BaseCalendar.vue';
import BaseCheckbox from './BaseCheckbox.vue';
import BaseForm from './BaseForm.vue';
import BaseGrid from './BaseGrid.vue';
import BaseIcon from './BaseIcon.vue';
import BaseLayout from './BaseLayout.vue';
import BaseLoading from './BaseLoading.vue';
import BasePage from './BasePage.vue';
import BaseTextBox from './BaseTextBox.vue';

export function registerGlobalComponents(app: any) {
  const Vue = app; // In case of being resolved by the IDE
  Vue.component('BaseButton', BaseButton);
  Vue.component('BaseCalendar', BaseCalendar);
  Vue.component('BaseCheckbox', BaseCheckbox);
  Vue.component('BaseForm', BaseForm);
  Vue.component('BaseGrid', BaseGrid);
  Vue.component('BaseIcon', BaseIcon);
  Vue.component('BaseLayout', BaseLayout);
  Vue.component('BaseLoading', BaseLoading);
  Vue.component('BasePage', BasePage);
  Vue.component('BaseTextBox', BaseTextBox);
}
