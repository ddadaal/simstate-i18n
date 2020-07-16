import React from "react";
import { useStore } from "simstate";
import { I18nStore } from "./I18nStore";

export const useLocalized = (id: string, replacements?: React.ReactNode[]) => {
  const i18nStore = useStore(I18nStore);

  return i18nStore.translate(id, replacements);
}
