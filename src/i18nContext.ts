import { makeIdAccessor } from "./makeIdAccessor";
import { Definitions, Language, AsyncLanguage, I18nContext } from "./types";

/**
 * Create a AsyncI18nContext which will be used for the AsyncI18nStore.
 * @param defaultLanguage The default language which will be always loaded.
 * @param otherLanguagesMap All other languages. Key is the id of the language.
 * @returns I18nContext instance.
 */
export function createI18nContext<D extends Definitions, T extends Language<D>>(
  defaultLanguage: T,
  otherLanguagesMap: { [id: string]: AsyncLanguage<D, T>}
  ): I18nContext<D, T> {

  const getLanguage = (id: string) => {
    if (id === defaultLanguage.id) { return defaultLanguage; }
    return otherLanguagesMap[id];
  }

  // Recursively construct the idAccessor
  const idAccessor = {} as T["definitions"];
  makeIdAccessor(idAccessor, defaultLanguage.definitions, "");

  return {
    languages: {...otherLanguagesMap, [defaultLanguage.id]: defaultLanguage },
    getLanguage,
    idAccessor,
    defaultLanguage,
  };
}


