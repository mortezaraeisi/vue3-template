import { createI18n } from 'vue-i18n';

import * as fa from './fa-ir';
import * as en from './en-uk';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    fa,
    en,
  },
});

export function swapLocale({ lang }) {
  i18n.global.locale = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}
