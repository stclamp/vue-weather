import { createI18n } from 'vue-i18n'
import ua from './locales/ua.json'

import type { LocaleMessages } from 'vue-i18n/dist/vue-i18n.js'

export default createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  silentTranslationWarn: true,
  messages: { ua: ua as LocaleMessages }
})
