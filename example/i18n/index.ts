import cn from "./cn";
import en from "./en";
import { createI18nContext } from "../../dist";

const allLanguages = [cn, en];

type Language = typeof en;

const i18nContext = createI18nContext([cn, en]);

const { getLanguage, idAccessor: lang } = i18nContext;

export { i18nContext, getLanguage, lang, allLanguages, Language };


