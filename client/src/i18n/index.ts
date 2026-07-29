import en from './en'
import sw from './sw'

export type TranslationKey = keyof typeof en

const translations: Record<string, typeof en> = { en, sw }

export const t = (key: string, lang: 'en' | 'sw' = 'en'): string => {
  const keys = key.split('.')
  let value: any = translations[lang]
  for (const k of keys) {
    value = value?.[k]
  }
  return value ?? key
}

export const useTranslation = (lang: 'en' | 'sw') => {
  return { t: (key: string) => t(key, lang), lang }
}

export default translations
