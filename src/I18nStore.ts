import { useState, useCallback } from "react";
import { createStore } from "simstate";
import { Definitions, Language, I18nContext } from "./types";
import { translate, loadLanguage } from "./utils";

// It is NOT recommended to specify the type of a simstate store
// since it can be automatically inferred when `useStore`.
// But this is used for documentation of simstate-i18n users.

/**
 * The type of an I18nStore instance
 */
export interface I18nStoreDef<D extends Definitions, T extends Language<D>> {

  /**
   * Current language.
   */
  currentLanguage: T;

  /**
   * The ID of the language the store is loading and switching to.
   */
  switchingToId: string | undefined;

  /**
   * Change the language to the language with specified id.
   * Since the target language might not be loaded, it returns a Promise which resolves when the language is switched.
   * @throws if the id does not match any language, or loading the new language fails when changing language.
   */
  changeLanguage: (id: string) => Promise<void>;

  /**
   * Translate the id to the text of current language,
   * optionally replacing the placeholders with replacement elements.
   *
   * Tip: If you are sure that the resulting element is just a string,
   *      just cast the result to string. (translate(root.test) as string)
   */
  translate: (id: string, replacements?: React.ReactNode[]) => React.ReactNode | string;

  /**
   * The original I18nContext.
   */
  context: I18nContext<D, T>;

}


/**
 * The StoreInit of I18nStore, which is used to control the language information of the whole application.
 * This function is intended to be used with [simstate](https://github.com/ddadaal/simstate) as the StoreInit of a global I18nStore instance.
 * @param context I18nContext instance
 */
export function I18nStore<D extends Definitions, T extends Language<D>>(
  context: I18nContext<D, T>,
): I18nStoreDef<D, T> {

  const [language, setLanguage] = useState(context.defaultLanguage);
  const [switchingToId, setSwitchingToId] = useState<string | undefined>();

  // throw if id is not of any language
  const changeLanguage = useCallback(async (id: string) => {
    const lang = context.getLanguage(id);

    if (lang) {
      try {
        setSwitchingToId(id);
        const loaded = await loadLanguage(lang);
        setLanguage(loaded);
      } catch (e) {
        throw e;
      } finally {
        setSwitchingToId(undefined);
      }
    } else {
      throw new Error(`${id} does not match any existing language.`);
    }
  }, []);

  return {
    currentLanguage: language,
    changeLanguage,
    switchingToId,
    translate: translate(language),
    context,
  };

}

/**
 * Helper function to create a I18nStore with `simstate`'s `createStore`.
 * Identical to call `createStore` with `I18nStore`.
 * @param context I18nContext instance
 * @returns a I18nStore instance.
 */
export function createI18nStore<D extends Definitions, T extends Language<D>>(
  context: I18nContext<D, T>,
) {
  return createStore(I18nStore, context);
}
