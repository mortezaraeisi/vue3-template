import { createI18n } from 'vue-i18n';

import * as faIR from './fa-ir';
import * as enUK from './en-uk';

export const i18n = createI18n({
  locale: 'enUK',
  fallbackLocale: 'enUK',
  messages: {
    faIR,
    enUK,
  },
});
