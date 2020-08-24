/**
 * Recursively create the ID accessor object from a baseline language definition object.
 * @param obj The ID accessor object
 * @param baselineLangSection One section of the baseline language to recurse
 * @param baseKey the key of the section.
 */
export function makeIdAccessor(obj: {}, baselineLangSection: {}, baseKey: string) {
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

