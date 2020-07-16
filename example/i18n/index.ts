import cn from "./cn";
import en from "./en";
import { createI18nContext } from "../../dist";

const i18nContext = createI18nContext([cn, en]);

const { getLanguage, allLanguages, idAccessor: lang } = i18nContext;

export { i18nContext, allLanguages, getLanguage, lang };

