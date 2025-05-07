declare module 'talisman/phonetics/double-metaphone' {
  /**
   * Computes the Double Metaphone codes for an input string.
   * @param {string} word — the word to encode
   * @returns {[string, string]} a tuple of [primaryCode, secondaryCode]
   */
  export default function doubleMetaphone(
    word: string
  ): [string, string];
}
