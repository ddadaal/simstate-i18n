import { useState, useCallback } from "react";
import { I18nContext, Definitions, Language } from "./i18nContext";
import { createStore } from "simstate";

const splitter = /(\{\})/;

function replacePlaceholders(definition: string, replacements: React.ReactNode[]): React.ReactNode | string {
  const array = definition.split(splitter) as React.ReactNode[];
  let ri = 0;

  let containsNonPrimitive = false;

  for (let i = 1; i < array.length; i += 2) {
    if (typeof replacements[ri] === "object") {
      containsNonPrimitive = true;
    }
    array[i] = replacements[ri++];
  }

  if (!containsNonPrimitive) {
    return array.join("");
  }

  return array;
}

/**
 * The StoreInit of I18nStore, which is used to control the language information of the whole application.
 * This function is intended to be used with [simstate](https://github.com/ddadaal/simstate) as the StoreInit of a global I18nStore instance.
 * @param i18nContext I18nContext instance
 * @param initialLanguage The initial language. If not specified, the first language in the context will be used.
 */
export function I18nStore<D extends Definitions, T extends Language<D>>(i18nContext: I18nContext<D, T>, initialLanguage?: T) {
  const [language, setLanguage] = useState(initialLanguage || i18nContext.allLanguages[0]);

  // throw if langString is not of any language
  const changeLanguage = useCallback((searchString: string) => {
    const lang = i18nContext.getLanguage(searchString);
    if (lang) {
      setLanguage(lang);
    } else {
      throw new Error(`${searchString} does not match any existing language.`);
    }
  }, []);

  const getDefinition = useCallback((id: string): string => {
    let content = language.definitions;
    for (const key of id.split(".")) {
      if (typeof content === "undefined") {
        throw new RangeError(`unidentified id ${id}`);
      }
      // I know what I am doing. Trust me :)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content = content[key] as any;
    }
    if (typeof content !== "string") {
      throw new RangeError(`id ${id} does not refer to a string. actual value: ${content}`);
    }
    return content;
  }, [language]);

  const translate = useCallback((id: string, replacements?: React.ReactNode[]): React.ReactNode | string => {

    const def = getDefinition(id);
    if (!replacements || replacements.length === 0) {
      return def;
    }
    return replacePlaceholders(def, replacements);
  }, [getDefinition]);

  return { language, changeLanguage, translate };

}

/**
 * Helper function to create a I18nStore with `simstate`'s `createStore`.
 * Identical to call `createStore` with `I18nStore`.
 * @param i18nContext I18nContext instance
 * @param initialLanguage The initial language. If not specified, the first language in the context will be used.
 * @returns a I18nStore instance.
 */
export function createI18nStore<D extends Definitions, T extends Language<D>>(i18nContext: I18nContext<D, T>, initialLanguage?: T) {
  return createStore(I18nStore, i18nContext, initialLanguage);
}
