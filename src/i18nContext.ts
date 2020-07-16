/**
 * Definitions of a language.
 * The key of a string is composed by the all the parent keys joined by ,.
 * The value is the text of the id in the specified language.
 * @example {
 *   "navbar: {
 *     "home": "Home"
 *   },
 *   "footer": "Footer"
 * }
 *
 * The id (key) of the text "Home" is navbar.home.
 */
export type Definitions = { [key: string]: string | Definitions };

/**
 * Language.
 */
export interface Language<TDefinitions extends Definitions> {
  /**
   * The id of the language. Language tag is recommended, but any unique string is acceptable.
   */
  id: string;

  /**
   * Strings that can be used to uniquely present the language. Used in getLanguage function.
   */
  langStrings: string[];

  /**
   * The Definitions object of the language.
   */
  definitions: TDefinitions;
}

/**
 * The I18nContext object.
 */
export interface I18nContext<D extends Definitions, T extends Language<D>> {
  /**
   * All languages that are specified when creating the I18nContext instance.
   */
  allLanguages: T[];

  /**
   * Get a language by searchString, which can be the id of the language or any one string in the langStrings array.
   */
  getLanguage: (searchString: string) => T | undefined;

  /**
   * The accessor to get the id of a text in a strongly-typed manner.
   * This object has the same structure as the Definitions object,
   * but the values of the object is the id.
   * @example {
   *   "navbar: {
   *     "home": "Home"
   *   },
   *   "footer": "Footer"
   * }
   *
   * idAccessor.navbar.home returns the string "navbar.home".
   */
  idAccessor: D;
}

function makeIdAccessor(obj: {}, baselineLangSection: {}, baseKey: string) {
  for (const key in baselineLangSection) {
    const newKey = baseKey + key;
    switch (typeof baselineLangSection[key]) {
      case "string":
        obj[key] = newKey;
        break;
      case "object":
        obj[key] = {};
        makeIdAccessor(obj[key], baselineLangSection[key], newKey + ".");
        break;
      default:
        throw `Unexpected value in ${newKey}. string/object only`;
    }
  }
}


/**
 * Create a I18nContext which will be used for the I18nStore.
 * @param allLanguages All languages that will be available in the application. The Definitions object of all languages must have identical structure.
 * @returns I18nContext instance.
 */
export function createI18nContext<D extends Definitions, T extends Language<D>>(allLanguages: T[]): I18nContext<D, T> {
  if (allLanguages.length === 0) { throw new Error("At least one language should be available."); }

  const getLanguage = (searchString: string) => allLanguages.find((x) => x.id === searchString || x.langStrings.includes(searchString));

  // Recursively construct the idAccessor
  const idAccessor = {} as D;
  makeIdAccessor(idAccessor, allLanguages[0].definitions, "");

  return {
    allLanguages,
    getLanguage,
    idAccessor,
  }
}
