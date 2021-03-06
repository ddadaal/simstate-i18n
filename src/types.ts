/**
 * Definitions of a language.
 * The key of a string is composed by the all the parent keys joined by ,.
 * The value is the text of the id in the specified language.
 * @example
 * {
 *   "navbar: {
 *     "home": "Home"
 *   },
 *   "footer": "Footer"
 * }
 *
 * The id (key) of the text "Home" is navbar.home.
 */
export type Definitions = { [key: string]: string | object };

/**
 * Language.
 */
export interface Language<TDefinitions extends Definitions> {
  /**
   * The id of the language. Any unique string is acceptable.
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

  /**
   * The name of the language.
   */
  name: string;
}

export type AsyncLanguage<D extends Definitions, T extends Language<D>> = T | (() => Promise<T>);

/**
 * The I18nContext object.
 */
export interface I18nContext<D extends Definitions, T extends Language<D>> {

  /**
   * All langauges in the AsyncI18nContext.
   * The key is the language id,
   * And the value is either the language itself, or a function to load the language object.
  */
  languages: { [id: string]: AsyncLanguage<D, T> };

  /**
   * Get a language by id.
   * Since in an AsyncI18nContext, possibly not all languages are loaded,
   * so only can search
   */
  getLanguage: (searchString: string) => AsyncLanguage<D, T> | undefined;

  /**
   * The default language used to created the context.
   */
  defaultLanguage: T;

  /**
   * The accessor to get the id of a text in a strongly-typed manner.
   * This object has the same structure as the Definitions object,
   * but the values of the object is the id.
   * @example
   * {
   *   "navbar: {
   *     "home": "Home"
   *   },
   *   "footer": "Footer"
   * }
   *
   * idAccessor.navbar.home returns the string "navbar.home".
   */
  idAccessor: T["definitions"];
}


