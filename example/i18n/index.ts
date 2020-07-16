import cn from "./cn";
import en from "./en";
import { createI18nContext, I18nStoreDef, I18nStore } from "../../dist";
import { useStore } from "simstate";

export const allLanguages = [cn, en];

export type Language = typeof en;

export const i18nContext = createI18nContext([cn, en]);

const { getLanguage, idAccessor: lang } = i18nContext;

export { getLanguage, lang };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}



