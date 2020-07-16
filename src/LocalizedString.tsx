import React, { useMemo } from "react";

import { useStore } from "simstate";
import { I18nStore } from "./I18nStore";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
}

export const LocalizedString: React.FC<Props> = ({ id, replacements }) => {

  const i18nStore = useStore(I18nStore);

  return useMemo(
    () => i18nStore.translate(id, replacements) as unknown as React.ReactElement,
    [i18nStore.currentLanguage, id, ...replacements || []]);

};
