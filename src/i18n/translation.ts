import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import type { LocaleMessages } from 'vue-i18n/dist/vue-i18n.js'
import { nextTick } from 'vue'
import i18n from '@/i18n'

const Translation = {
  get defaultLocale() {
    return import.meta.env.VITE_DEFAULT_LOCALE
  },

  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(',')
  },

  get currentLocale() {
    return i18n.global.locale.value
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  async switchLanguage(newLocale: string) {
    await Translation.loadLocaleMessages(newLocale)
    Translation.currentLocale = newLocale
    document.querySelector('html')?.setAttribute('lang', newLocale)
    localStorage.setItem('language', newLocale)
  },

  async loadLocaleMessages(locale: string) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = (await import(`@/i18n/locales/${locale}.json`)) as LocaleMessages
      i18n.global.setLocaleMessage(locale, messages.default)
    }

    return nextTick()
  },

  isLocaleSupported(locale: string) {
    return Translation.supportedLocales.includes(locale)
  },

  getUserLocale() {
    const locale = window.navigator.language || Translation.defaultLocale

    return {
      locale: locale,
      localeNoRegion: locale.split('-')[0]
    }
  },

  getPersistedLocale() {
    const persistedLocale = localStorage.getItem('language')
    if (persistedLocale) {
      if (Translation.isLocaleSupported(persistedLocale)) {
        return persistedLocale
      } else {
        return null
      }
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = Translation.getPersistedLocale()
    if (userPersistedLocale) {
      return userPersistedLocale
    }

    const userPreferredLocale = Translation.getUserLocale()

    if (Translation.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale
    }

    if (Translation.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion
    }

    return Translation.defaultLocale
  },

  async routeMiddleware(
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) {
    const paramLocale = to.params.locale
    if (typeof paramLocale === 'string') {
      if (!Translation.isLocaleSupported(paramLocale)) {
        return next(Translation.guessDefaultLocale())
      }

      await Translation.switchLanguage(paramLocale)

      return next()
    }
  },

  i18nRoute(to: any) {
    return {
      ...to,
      params: {
        locale: Translation.currentLocale,
        ...to.params
      }
    }
  }
}

export default Translation
