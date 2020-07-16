# simstate-i18n

[![NPM](https://img.shields.io/npm/v/simstate-i18n.svg)](https://www.npmjs.com/package/simstate-i18n)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate-i18n)
[![Build Status](https://travis-ci.com/ddadaal/simstate-i18n.svg?branch=master)](https://travis-ci.com/ddadaal/simstate-i18n)

`simstate-i18n` is a strongly-typed React i18n library based on [simstate](https://github.com/ddadaal/simstate).

# Features

- Use text id in a **strongly-typed manner**
- Support nested text id
- Support placeholders on text definition
- Hot change languages without page reloading
- Hot change texts without restarting the application

# Install

```bash
npm install --save simstate-i18n
```

# Example

My blog [ddadaal.me](https://ddadaal.me) is created with simstate-i18n.

Try changing the language by the LanguageSelector.

# Usage

This library requires **setting up necessary files and folders** before using the components and store.

## Setup

Check out the [example](example) folder for recommended file structure.

```
.
├── App.tsx
└── i18n
    ├── cn.ts
    ├── en.ts
    └── index.ts
```

1. Create a folder `i18n` (or anything you want) on your `src` folder
2. Create a file (`{language}.ts`, for example `cn.ts`, `en.ts`) under `i18n` folder **for each language** to support with the following content:
    - Every such file defines a **language object** for one language
    - Language object contains the basic information (id, strings, names etc.) and the mappings from id to text
    - Every language objects should have **exactly identical** structure.

```typescript
// src/i18n/en.ts
// example: example/i18n/{en,cn}.ts

export default {
  // The id of the language. Any unique string is acceptable.
  id: "en",

  // Strings that can be used to uniquely present the language. Used in getLanguage function.
  langStrings: ["en", "en_US"],

  // The name of the language
  name: "English",

  // The definitions of id and text template.
  // Use "{}" as the placeholder for dynamically set text or React component.
  definitions: {
    navbar: {
      home: "Home",
      about: "About",
    },
    content: "Current time: {}. Thanks for using simstate-i18n."
  }
}
```

3. Create a `index.ts` under the `i18n` folder with the following content:

```typescript
// src/i18n/index.ts
// example: example/i18n/index.ts

// Imports
import cn from "./cn";
import en from "./en";
import { createI18nContext, I18nStoreDef, I18nStore } from "simstate-i18n";
import { useStore } from "simstate";

// List of all languages of the project
export const allLanguages = [cn, en];

// The actual Language type,
// might be useful when the Language object is extended and the extra properties are needed
export type Language = typeof en;

// Create the I18nContext with all the languages
export const i18nContext = createI18nContext([cn, en]);

// Destruct and export the members for easier usage
// Recommendation: rename the idAccessor to lang for shorter typing
const { getLanguage, idAccessor: lang } = i18nContext;
  export { getLanguage, lang };

// This function is shortcut to use I18nStore,
// and also specify the exact types of Language objects,
// which helps avoid type casting.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}
```

1. Create and inject a new global `simstate` store with the i18nContext instance.

```tsx
// example: example/App.tsx

import { i18nContext } from "./i18n";
import { createI18nStore } from "simstate-i18n";
import { StoreProvider } from "simstate";

const Root = () => {
  // Create global i18nStore instance.
  const [i18nStore] = useState(() => createI18nStore(i18nContext));
  return (
    <StoreProvider stores={[i18nStore]}>
      <App />
    </StoreProvider>
  )
}
```

## Usage

When the configurations are completed and the global I18nStore is injected, it is possible to use the provided components and store.

### LocalizedString component

`<LocalizedString />` component is used in place of raw texts to provide i18n capabilities to anywhere a React component can be. It shows the text of the specified id of the current language.

All LocalizedString components will be updated when the current language is changed.

Example:

```tsx
// import the idAccessor (renamed to lang) from i18n folder
// which is used to access the id of a text strongly-typedly.
import { lang } from "./i18n";
import { LocalizedString } from "simstate-i18n";

// Set the id of text as accessing properties of the lang object
// If the text has placeholders {},
// set the replacements prop with the replacement elements
// that will be inserted into the placeholders in order.
<LocalizedString id={lang.content} replacements={[Date.now()]} />
```

### useLocalized hook

This hook is used to suffice more advanced usage.

The following example behaves the same as the `LocalizedString` example above, and will also be updated when the current language is updated.

Example:

```tsx
import { lang } from "./i18n";
import { useLocalized } from "simstate-i18n";

const Component = () => {
  const content = useLocalized(lang.content, [Date.now()]);
  return content;
}
```

### I18nStore store

The I18nStore instance of current provider scope can be acquired with `useStore` function provided by `simstate`, which can be used to control the current language as well as getting some information.

Example:

```tsx
import { I18nStore } from "simstate-i18n";
import { useStore } from "simstate";

const ControlPanel = () => {
  const i18nStore = useStore(I18nStore);

  return (
    <div>
      <p>Current language: {i18nStore.currentLanguage.name}</p>
      <ul>
        {allLanguages.map((lang) => (
          <li key={lang.id}>
            <a onClick={() => i18nStore.changeLanguage(lang.id)}>
              {lang.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

# Related

[`simstate`](https://github.com/ddadaal/simstate): A Strongly-typed React State Management Tool Favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [TypeScript](https://www.typescriptlang.org/).

[Strongly Typed i18n with TypeScript](https://ddadaal.me/articles/strongly-typed-i18n-with-typescript) (English): This article of mine talks about the problems of using raw string as the text ids, and also introduces a proxy-based text id generation method which is now replaced with another method [(src/i18nContext.ts)](src/i18nContext.ts) which should have better performance.


# License

MIT © [ddadaal](https://github.com/ddadaal)
