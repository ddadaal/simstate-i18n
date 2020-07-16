import React from 'react'
import LocalizedString from "../../dist/LocalizedString"
import { lang } from "./i18n"

const App = () => {
  return (
    <div>
      <div>
        <LocalizedString id={lang.navbar.home} />
      </div>
    </div>
  )
}

export default App
