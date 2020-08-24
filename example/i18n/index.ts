import cn from "./cn";
import { createI18nContext, I18nStoreDef, I18nStore } from "../../dist";
import { useStore } from "simstate";

const en = () => import("./en").then((x) => x.default);

export const allLanguages = [cn, en];

export type Language = typeof cn;

export const i18nContext = createI18nContext(cn, { en });

export const { getLanguage, idAccessor: lang } = i18nContext;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}



