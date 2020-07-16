import cn from "./cn";
import en from "./en";
import { createI18nContext } from "../../../dist";

const { getLanguage, idAccessor: lang } = createI18nContext([cn, en]);

export { getLanguage, lang };

