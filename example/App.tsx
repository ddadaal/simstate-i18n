import React, { useState } from 'react'
import { lang, i18nContext, allLanguages } from "./i18n"
import { createI18nStore, LocalizedString, useLocalized, I18nStore } from "../dist";
import { StoreProvider, useStore } from "simstate";

const root = lang.navbar;
const Navbar = () => {

  const homeText = useLocalized(root.home);

  return (
    <div>
      {homeText}
      <LocalizedString id={root.about} />
    </div>
  );
}



const ControlPanel = () => {
  const i18nStore = useStore(I18nStore);

  return (
    <div>
      <p>Current language: {i18nStore.language.name}</p>
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
const App = () => {
  return (
    <div>
      <Navbar />
      <LocalizedString id={lang.content} replacements={[Date.now()]} />
      <ControlPanel />
    </div>
  )
}

const Root = () => {
  const [i18nStore] = useState(() => createI18nStore(i18nContext));
  return (
    <StoreProvider stores={[i18nStore]}>
      <App />
    </StoreProvider>
  )
}

export default Root
