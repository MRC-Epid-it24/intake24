/* Generated from Java with JSweet 3.0.0-RC3 - http://www.jsweet.org */

// @ts-nocheck

export class Metaphone3 {
  /**
   * Length of word sent in to be encoded, as
   * measured at beginning of encoding.
   */
  m_length: number;

  /**
   * Length of encoded key string.
   */
  m_metaphLength: number;

  /**
   * Flag whether or not to encode non-initial vowels.
   */
  m_encodeVowels: boolean;

  /**
   * Flag whether or not to encode consonants as exactly
   * as possible.
   */
  m_encodeExact: boolean;

  /**
   * Internal copy of word to be encoded, allocated separately
   * from string pointed to in incoming parameter.
   */
  m_inWord: string;

  /**
   * Running copy of primary key.
   */
  m_primary: { str: string, toString: Function };

  /**
   * Running copy of secondary key.
   */
  m_secondary: { str: string, toString: Function };

  /**
   * Index of character in m_inWord currently being
   * encoded.
   */
  m_current: number;

  /**
   * Index of last character in m_inWord.
   */
  m_last: number;

  /**
   * Flag that an AL inversion has already been done.
   */
  flag_AL_inversion: boolean;

  /**
   * Default size of key storage allocation
   */
  MAX_KEY_ALLOCATION: number = 32;

  /**
   * Default maximum length of encoded key.
   */
  DEFAULT_MAX_KEY_LENGTH: number = 8;

  public constructor(__in?: any) {
    if (((typeof __in === 'string') || __in === null)) {
      let __args = arguments;
      {
        let __args = arguments;
        if (this.m_length === undefined) this.m_length = 0;
        if (this.m_metaphLength === undefined) this.m_metaphLength = 0;
        if (this.m_encodeVowels === undefined) this.m_encodeVowels = false;
        if (this.m_encodeExact === undefined) this.m_encodeExact = false;
        if (this.m_inWord === undefined) this.m_inWord = null;
        if (this.m_primary === undefined) this.m_primary = null;
        if (this.m_secondary === undefined) this.m_secondary = null;
        if (this.m_current === undefined) this.m_current = 0;
        if (this.m_last === undefined) this.m_last = 0;
        if (this.flag_AL_inversion === undefined) this.flag_AL_inversion = false;
        this.MAX_KEY_ALLOCATION = 32;
        this.DEFAULT_MAX_KEY_LENGTH = 8;
        if (this.m_length === undefined) this.m_length = 0;
        if (this.m_metaphLength === undefined) this.m_metaphLength = 0;
        if (this.m_encodeVowels === undefined) this.m_encodeVowels = false;
        if (this.m_encodeExact === undefined) this.m_encodeExact = false;
        if (this.m_inWord === undefined) this.m_inWord = null;
        if (this.m_primary === undefined) this.m_primary = null;
        if (this.m_secondary === undefined) this.m_secondary = null;
        if (this.m_current === undefined) this.m_current = 0;
        if (this.m_last === undefined) this.m_last = 0;
        if (this.flag_AL_inversion === undefined) this.flag_AL_inversion = false;
        (() => {
          this.m_primary = {
            str: "", toString: function () {
              return this.str;
            }
          };
          this.m_secondary = {
            str: "", toString: function () {
              return this.str;
            }
          };
          this.m_metaphLength = this.DEFAULT_MAX_KEY_LENGTH;
          this.m_encodeVowels = false;
          this.m_encodeExact = false;
        })();
      }
      (() => {
        this.SetWord(__in);
      })();
    } else if (__in === undefined) {
      let __args = arguments;
      if (this.m_length === undefined) this.m_length = 0;
      if (this.m_metaphLength === undefined) this.m_metaphLength = 0;
      if (this.m_encodeVowels === undefined) this.m_encodeVowels = false;
      if (this.m_encodeExact === undefined) this.m_encodeExact = false;
      if (this.m_inWord === undefined) this.m_inWord = null;
      if (this.m_primary === undefined) this.m_primary = null;
      if (this.m_secondary === undefined) this.m_secondary = null;
      if (this.m_current === undefined) this.m_current = 0;
      if (this.m_last === undefined) this.m_last = 0;
      if (this.flag_AL_inversion === undefined) this.flag_AL_inversion = false;
      this.MAX_KEY_ALLOCATION = 32;
      this.DEFAULT_MAX_KEY_LENGTH = 8;
      if (this.m_length === undefined) this.m_length = 0;
      if (this.m_metaphLength === undefined) this.m_metaphLength = 0;
      if (this.m_encodeVowels === undefined) this.m_encodeVowels = false;
      if (this.m_encodeExact === undefined) this.m_encodeExact = false;
      if (this.m_inWord === undefined) this.m_inWord = null;
      if (this.m_primary === undefined) this.m_primary = null;
      if (this.m_secondary === undefined) this.m_secondary = null;
      if (this.m_current === undefined) this.m_current = 0;
      if (this.m_last === undefined) this.m_last = 0;
      if (this.flag_AL_inversion === undefined) this.flag_AL_inversion = false;
      (() => {
        this.m_primary = {
          str: "", toString: function () {
            return this.str;
          }
        };
        this.m_secondary = {
          str: "", toString: function () {
            return this.str;
          }
        };
        this.m_metaphLength = this.DEFAULT_MAX_KEY_LENGTH;
        this.m_encodeVowels = false;
        this.m_encodeExact = false;
      })();
    } else throw new Error('invalid overload');
  }

  /**
   * Sets word to be encoded.
   *
   * @param {string} in pointer to EXTERNALLY ALLOCATED char string of
   * the word to be encoded.
   */
  SetWord(__in: string) {
    this.m_inWord = __in.toUpperCase();
    this.m_length = this.m_inWord.length;
  }

  /**
   * Sets length allocated for output keys.
   * If incoming number is greater than maximum allowable
   * length returned by GetMaximumKeyLength(), set key length
   * to maximum key length and return false;  otherwise, set key
   * length to parameter value and return true.
   *
   * @param {number} inKeyLength new length of key.
   * @return {boolean} true if able to set key length to requested value.
   */
  SetKeyLength(inKeyLength: number): boolean {
    if (inKeyLength < 1) {
      inKeyLength = 1;
    }
    if (inKeyLength > this.MAX_KEY_ALLOCATION) {
      this.m_metaphLength = this.MAX_KEY_ALLOCATION;
      return false;
    }
    this.m_metaphLength = inKeyLength;
    return true;
  }

  MetaphAdd$java_lang_String(__in: string) {
    if (!(/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(__in, "A")) && (/* length */this.m_primary.str.length > 0) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(/* charAt */this.m_primary.str.charAt(/* length */this.m_primary.str.length - 1)) == 'A'.charCodeAt(0)))) {
      /* append */
      (sb => {
        sb.str = sb.str.concat(<any>__in);
        return sb;
      })(this.m_primary);
    }
    if (!(/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(__in, "A")) && (/* length */this.m_secondary.str.length > 0) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(/* charAt */this.m_secondary.str.charAt(/* length */this.m_secondary.str.length - 1)) == 'A'.charCodeAt(0)))) {
      /* append */
      (sb => {
        sb.str = sb.str.concat(<any>__in);
        return sb;
      })(this.m_secondary);
    }
  }

  public MetaphAdd$java_lang_String$java_lang_String(main: string, alt: string) {
    if (!(/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(main, "A")) && (/* length */this.m_primary.str.length > 0) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(/* charAt */this.m_primary.str.charAt(/* length */this.m_primary.str.length - 1)) == 'A'.charCodeAt(0)))) {
      /* append */
      (sb => {
        sb.str = sb.str.concat(<any>main);
        return sb;
      })(this.m_primary);
    }
    if (!(/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(alt, "A")) && (/* length */this.m_secondary.str.length > 0) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(/* charAt */this.m_secondary.str.charAt(/* length */this.m_secondary.str.length - 1)) == 'A'.charCodeAt(0)))) {
      if (!/* isEmpty */(alt.length === 0)) {
        /* append */
        (sb => {
          sb.str = sb.str.concat(<any>alt);
          return sb;
        })(this.m_secondary);
      }
    }
  }

  /**
   * Adds an encoding character to the encoded key value string - two parameter version
   *
   * @param {string} main primary encoding character to be added to encoded key string
   * @param {string} alt alternative encoding character to be added to encoded alternative key string
   */
  public MetaphAdd(main?: any, alt?: any): any {
    if (((typeof main === 'string') || main === null) && ((typeof alt === 'string') || alt === null)) {
      return <any>this.MetaphAdd$java_lang_String$java_lang_String(main, alt);
    } else if (((typeof main === 'string') || main === null) && alt === undefined) {
      return <any>this.MetaphAdd$java_lang_String(main);
    } else throw new Error('invalid overload');
  }

  public MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String(mainExact: string, altExact: string, main: string, alt: string) {
    if (this.m_encodeExact) {
      this.MetaphAdd$java_lang_String$java_lang_String(mainExact, altExact);
    } else {
      this.MetaphAdd$java_lang_String$java_lang_String(main, alt);
    }
  }

  /**
   * Adds an encoding character to the encoded key value string - Exact/Approx version
   *
   * @param {string} mainExact primary encoding character to be added to encoded key string if
   * m_encodeExact is set
   *
   * @param {string} altExact alternative encoding character to be added to encoded alternative
   * key string if m_encodeExact is set
   *
   * @param {string} main primary encoding character to be added to encoded key string
   *
   * @param {string} alt alternative encoding character to be added to encoded alternative key string
   */
  public MetaphAddExactApprox(mainExact?: any, altExact?: any, main?: any, alt?: any): any {
    if (((typeof mainExact === 'string') || mainExact === null) && ((typeof altExact === 'string') || altExact === null) && ((typeof main === 'string') || main === null) && ((typeof alt === 'string') || alt === null)) {
      return <any>this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String(mainExact, altExact, main, alt);
    } else if (((typeof mainExact === 'string') || mainExact === null) && ((typeof altExact === 'string') || altExact === null) && main === undefined && alt === undefined) {
      return <any>this.MetaphAddExactApprox$java_lang_String$java_lang_String(mainExact, altExact);
    } else throw new Error('invalid overload');
  }

  MetaphAddExactApprox$java_lang_String$java_lang_String(mainExact: string, main: string) {
    if (this.m_encodeExact) {
      this.MetaphAdd$java_lang_String(mainExact);
    } else {
      this.MetaphAdd$java_lang_String(main);
    }
  }

  /**
   * Retrieves maximum number of characters currently allocated for encoded key.
   *
   * @return {number} short integer representing the length allowed for the key.
   */
  GetKeyLength(): number {
    return this.m_metaphLength;
  }

  /**
   * Retrieves maximum number of characters allowed for encoded key.
   *
   * @return {number} short integer representing the length of allocated storage for the key.
   */
  GetMaximumKeyLength(): number {
    return (<number>this.MAX_KEY_ALLOCATION | 0);
  }

  /**
   * Sets flag that causes Metaphone3 to encode non-initial vowels. However, even
   * if there are more than one vowel sound in a vowel sequence (i.e.
   * vowel diphthong, etc.), only one 'A' will be encoded before the next consonant or the
   * end of the word.
   *
   * @param {boolean} inEncodeVowels Non-initial vowels encoded if true, not if false.
   */
  SetEncodeVowels(inEncodeVowels: boolean) {
    this.m_encodeVowels = inEncodeVowels;
  }

  /**
   * Retrieves setting determining whether or not non-initial vowels will be encoded.
   *
   * @return {boolean} true if the Metaphone3 object has been set to encode non-initial vowels, false if not.
   */
  GetEncodeVowels(): boolean {
    return this.m_encodeVowels;
  }

  /**
   * Sets flag that causes Metaphone3 to encode consonants as exactly as possible.
   * This does not include 'S' vs. 'Z', since americans will pronounce 'S' at the
   * at the end of many words as 'Z', nor does it include "CH" vs. "SH". It does cause
   * a distinction to be made between 'B' and 'P', 'D' and 'T', 'G' and 'K', and 'V'
   * and 'F'.
   *
   * @param {boolean} inEncodeExact consonants to be encoded "exactly" if true, not if false.
   */
  SetEncodeExact(inEncodeExact: boolean) {
    this.m_encodeExact = inEncodeExact;
  }

  /**
   * Retrieves setting determining whether or not consonants will be encoded "exactly".
   *
   * @return {boolean} true if the Metaphone3 object has been set to encode "exactly", false if not.
   */
  GetEncodeExact(): boolean {
    return this.m_encodeExact;
  }

  /**
   * Retrieves primary encoded key.
   *
   * @return {string} a character pointer to the primary encoded key
   */
  GetMetaph(): string {
    let primary: string = this.m_primary.str;
    return primary;
  }

  /**
   * Retrieves alternate encoded key, if any.
   *
   * @return {string} a character pointer to the alternate encoded key
   */
  GetAlternateMetaph(): string {
    let secondary: string = this.m_secondary.str;
    return secondary;
  }

  /**
   * Test for close front vowels
   *
   * @return {boolean} true if close front vowel
   * @param {number} at
   */
  Front_Vowel(at: number): boolean {
    if ((((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(at)) == 'E'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(at)) == 'I'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(at)) == 'Y'.charCodeAt(0)))) {
      return true;
    }
    return false;
  }

  /**
   * Detect names or words that begin with spellings
   * typical of german or slavic words, for the purpose
   * of choosing alternate pronunciations correctly
   * @return {boolean}
   */
  SlavoGermanic(): boolean {
    if (this.StringAt(0, 3, "SCH", "") || this.StringAt(0, 2, "SW", "") || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(0)) == 'J'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(0)) == 'W'.charCodeAt(0))) {
      return true;
    }
    return false;
  }

  public IsVowel$char(inChar: string): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'A'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'E'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'I'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'O'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'U'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == 'Y'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c0'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c1'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c2'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c3'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c4'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c5'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c6'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c8'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00c9'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00ca'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00cb'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00cc'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00cd'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00ce'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00cf'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d2'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d3'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d4'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d5'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d6'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u008c'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d8'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00d9'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00da'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00db'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00dc'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u00dd'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(inChar) == '\u009f'.charCodeAt(0))) {
      return true;
    }
    return false;
  }

  /**
   * Tests if character is a vowel
   *
   * @param {string} inChar character to be tested in string to be encoded
   * @return {boolean} true if character is a vowel, false if not
   */
  public IsVowel(inChar?: any): any {
    if (((typeof inChar === 'string') || inChar === null)) {
      return <any>this.IsVowel$char(inChar);
    } else if (((typeof inChar === 'number') || inChar === null)) {
      return <any>this.IsVowel$int(inChar);
    } else throw new Error('invalid overload');
  }

  IsVowel$int(at: number): boolean {
    if ((at < 0) || (at >= this.m_length)) {
      return false;
    }
    let it: string = this.CharAt(at);
    if (this.IsVowel$char(it)) {
      return true;
    }
    return false;
  }

  /**
   * Skips over vowels in a string. Has exceptions for skipping consonants that
   * will not be encoded.
   *
   * @param {number} at position, in string to be encoded, of character to start skipping from
   *
   * @return {number} position of next consonant in string to be encoded
   */
  SkipVowels(at: number): number {
    if (at < 0) {
      return 0;
    }
    if (at >= this.m_length) {
      return this.m_length;
    }
    let it: string = this.CharAt(at);
    while ((this.IsVowel$char(it) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(it) == 'W'.charCodeAt(0)))) {
      {
        if (this.StringAt(at, 4, "WICZ", "WITZ", "WIAK", "") || this.StringAt((at - 1), 5, "EWSKI", "EWSKY", "OWSKI", "OWSKY", "") || (this.StringAt(at, 5, "WICKI", "WACKI", "") && ((at + 4) === this.m_last))) {
          break;
        }
        at++;
        if ((((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(at - 1)) == 'W'.charCodeAt(0)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(at)) == 'H'.charCodeAt(0))) && !(this.StringAt(at, 3, "HOP", "") || this.StringAt(at, 4, "HIDE", "HARD", "HEAD", "HAWK", "HERD", "HOOK", "HAND", "HOLE", "") || this.StringAt(at, 5, "HEART", "HOUSE", "HOUND", "") || this.StringAt(at, 6, "HAMMER", ""))) {
          at++;
        }
        if (at > (this.m_length - 1)) {
          break;
        }
        it = this.CharAt(at);
      }
    }
    ;
    return at;
  }

  /**
   * Advanced counter m_current so that it indexes the next character to be encoded
   *
   * @param {number} ifNotEncodeVowels number of characters to advance if not encoding internal vowels
   * @param {number} ifEncodeVowels number of characters to advance if encoding internal vowels
   */
  AdvanceCounter(ifNotEncodeVowels: number, ifEncodeVowels: number) {
    if (!this.m_encodeVowels) {
      this.m_current += ifNotEncodeVowels;
    } else {
      this.m_current += ifEncodeVowels;
    }
  }

  /**
   * Subscript safe .charAt()
   *
   * @param {number} at index of character to access
   * @return {string} null if index out of bounds, .charAt() otherwise
   */
  CharAt(at: number): string {
    if ((at < 0) || (at > (this.m_length - 1))) {
      return '\u0000';
    }
    return this.m_inWord.charAt(at);
  }

  /**
   * Tests whether the word is the root or a regular english inflection
   * of it, e.g. "ache", "achy", "aches", "ached", "aching", "achingly"
   * This is for cases where we want to match only the root and corresponding
   * inflected forms, and not completely different words which may have the
   * same substring in them.
   * @param {string} inWord
   * @param {string} root
   * @return {boolean}
   */
  RootOrInflections(inWord: string, root: string): boolean {
    let len: number = root.length;
    let test: string;
    test = root + "S";
    if ((/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, root))) || (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test)))) {
      return true;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(root.charAt(len - 1)) != 'E'.charCodeAt(0)) {
      test = root + "ES";
    }
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test))) {
      return true;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(root.charAt(len - 1)) != 'E'.charCodeAt(0)) {
      test = root + "ED";
    } else {
      test = root + "D";
    }
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test))) {
      return true;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(root.charAt(len - 1)) == 'E'.charCodeAt(0)) {
      root = root.substring(0, len - 1);
    }
    test = root + "ING";
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test))) {
      return true;
    }
    test = root + "INGLY";
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test))) {
      return true;
    }
    test = root + "Y";
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })(inWord, test))) {
      return true;
    }
    return false;
  }

  /**
   * Determines if one of the substrings sent in is the same as
   * what is at the specified position in the string being encoded.
   *
   * @param {number} start
   * @param {number} length
   * @param {java.lang.String[]} compareStrings
   * @return
   * @return {boolean}
   */
  StringAt(start: number, length: number, ...compareStrings: string[]): boolean {
    if ((start < 0) || (start > (this.m_length - 1)) || ((start + length - 1) > (this.m_length - 1))) {
      return false;
    }
    let target: string = this.m_inWord.substring(start, (start + length));
    for (let index121 = 0; index121 < compareStrings.length; index121++) {
      let strFragment = compareStrings[index121];
      {
        if (/* equals */(<any>((o1: any, o2: any) => {
          if (o1 && o1.equals) {
            return o1.equals(o2);
          } else {
            return o1 === o2;
          }
        })(target, strFragment))) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Encodes input string to one or two key values according to Metaphone 3 rules.
   */
  Encode() {
    this.flag_AL_inversion = false;
    this.m_current = 0;
    /* setLength */
    ((sb, length) => sb.str = sb.str.substring(0, length))(this.m_primary, 0);
    /* setLength */
    ((sb, length) => sb.str = sb.str.substring(0, length))(this.m_secondary, 0);
    if (this.m_length < 1) {
      return;
    }
    this.m_last = this.m_length - 1;
    while ((!(/* length */this.m_primary.str.length > this.m_metaphLength) && !(/* length */this.m_secondary.str.length > this.m_metaphLength))) {
      {
        if (this.m_current >= this.m_length) {
          break;
        }
        switch ((this.CharAt(this.m_current)).charCodeAt(0)) {
          case 66 /* 'B' */
          :
            this.Encode_B();
            break;
          case 223 /* '\u00df' */
          :
          case 199 /* '\u00c7' */
          :
            this.MetaphAdd$java_lang_String("S");
            this.m_current++;
            break;
          case 67 /* 'C' */
          :
            this.Encode_C();
            break;
          case 68 /* 'D' */
          :
            this.Encode_D();
            break;
          case 70 /* 'F' */
          :
            this.Encode_F();
            break;
          case 71 /* 'G' */
          :
            this.Encode_G();
            break;
          case 72 /* 'H' */
          :
            this.Encode_H();
            break;
          case 74 /* 'J' */
          :
            this.Encode_J();
            break;
          case 75 /* 'K' */
          :
            this.Encode_K();
            break;
          case 76 /* 'L' */
          :
            this.Encode_L();
            break;
          case 77 /* 'M' */
          :
            this.Encode_M();
            break;
          case 78 /* 'N' */
          :
            this.Encode_N();
            break;
          case 209 /* '\u00d1' */
          :
            this.MetaphAdd$java_lang_String("N");
            this.m_current++;
            break;
          case 80 /* 'P' */
          :
            this.Encode_P();
            break;
          case 81 /* 'Q' */
          :
            this.Encode_Q();
            break;
          case 82 /* 'R' */
          :
            this.Encode_R();
            break;
          case 83 /* 'S' */
          :
            this.Encode_S();
            break;
          case 84 /* 'T' */
          :
            this.Encode_T();
            break;
          case 208 /* '\u00d0' */
          :
          case 222 /* '\u00de' */
          :
            this.MetaphAdd$java_lang_String("0");
            this.m_current++;
            break;
          case 86 /* 'V' */
          :
            this.Encode_V();
            break;
          case 87 /* 'W' */
          :
            this.Encode_W();
            break;
          case 88 /* 'X' */
          :
            this.Encode_X();
            break;
          case 138 /* '\u008a' */
          :
            this.MetaphAdd$java_lang_String("X");
            this.m_current++;
            break;
          case 142 /* '\u008e' */
          :
            this.MetaphAdd$java_lang_String("S");
            this.m_current++;
            break;
          case 90 /* 'Z' */
          :
            this.Encode_Z();
            break;
          default:
            if (this.IsVowel$char(this.CharAt(this.m_current))) {
              this.Encode_Vowels();
              break;
            }
            this.m_current++;
        }
      }
    }
    ;
    if (/* length */this.m_primary.str.length > this.m_metaphLength) {
      /* setLength */
      ((sb, length) => sb.str = sb.str.substring(0, length))(this.m_primary, this.m_metaphLength);
    }
    if (/* length */this.m_secondary.str.length > this.m_metaphLength) {
      /* setLength */
      ((sb, length) => sb.str = sb.str.substring(0, length))(this.m_secondary, this.m_metaphLength);
    }
    if (/* equals */(<any>((o1: any, o2: any) => {
      if (o1 && o1.equals) {
        return o1.equals(o2);
      } else {
        return o1 === o2;
      }
    })((/* toString */this.m_primary.str),/* toString */this.m_secondary.str))) {
      /* setLength */
      ((sb, length) => sb.str = sb.str.substring(0, length))(this.m_secondary, 0);
    }
  }

  /**
   * Encodes all initial vowels to A.
   *
   * Encodes non-initial vowels to A if m_encodeVowels is true
   *
   *
   */
  Encode_Vowels() {
    if (this.m_current === 0) {
      this.MetaphAdd$java_lang_String("A");
    } else if (this.m_encodeVowels) {
      if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current)) != 'E'.charCodeAt(0)) {
        if (this.Skip_Silent_UE()) {
          return;
        }
        if (this.O_Silent()) {
          this.m_current++;
          return;
        }
        this.MetaphAdd$java_lang_String("A");
      } else {
        this.Encode_E_Pronounced();
      }
    }
    if (!(!this.IsVowel$int(this.m_current - 2) && this.StringAt((this.m_current - 1), 4, "LEWA", "LEWO", "LEWI", ""))) {
      this.m_current = this.SkipVowels(this.m_current);
    } else {
      this.m_current++;
    }
  }

  /**
   * Encodes cases where non-initial 'e' is pronounced, taking
   * care to detect unusual cases from the greek.
   *
   * Only executed if non initial vowel encoding is turned on
   *
   *
   */
  Encode_E_Pronounced() {
    if ((this.StringAt(0, 4, "LAME", "SAKE", "PATE", "") && (this.m_length === 4)) || (this.StringAt(0, 5, "AGAPE", "") && (this.m_length === 5)) || ((this.m_current === 5) && this.StringAt(0, 6, "RESUME", ""))) {
      this.MetaphAdd$java_lang_String$java_lang_String("", "A");
      return;
    }
    if (this.StringAt(0, 4, "INGE", "") && (this.m_length === 4)) {
      this.MetaphAdd$java_lang_String$java_lang_String("A", "");
      return;
    }
    if ((this.m_current === 5) && this.StringAt(0, 7, "BLESSED", "LEARNED", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("D", "AD", "T", "AT");
      this.m_current += 2;
      return;
    }
    if ((!this.E_Silent() && !this.flag_AL_inversion && !this.Silent_Internal_E()) || this.E_Pronounced_Exceptions()) {
      this.MetaphAdd$java_lang_String("A");
    }
    this.flag_AL_inversion = false;
  }

  /**
   * Tests for cases where non-initial 'o' is not pronounced
   * Only executed if non initial vowel encoding is turned on
   *
   * @return {boolean} true if encoded as silent - no addition to m_metaph key
   */
  O_Silent(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current)) == 'O'.charCodeAt(0)) && this.StringAt((this.m_current - 2), 4, "IRON", "")) {
      if ((this.StringAt(0, 4, "IRON", "") || (this.StringAt((this.m_current - 2), 4, "IRON", "") && (this.m_last === (this.m_current + 1)))) && !this.StringAt((this.m_current - 2), 6, "IRONIC", "")) {
        return true;
      }
    }
    return false;
  }

  /**
   * Tests and encodes cases where non-initial 'e' is never pronounced
   * Only executed if non initial vowel encoding is turned on
   *
   * @return {boolean} true if encoded as silent - no addition to m_metaph key
   */
  E_Silent(): boolean {
    if (this.E_Pronounced_At_End()) {
      return false;
    }
    if ((this.m_current === this.m_last) || ((this.StringAt(this.m_last, 1, "S", "D", "") && (this.m_current > 1) && ((this.m_current + 1) === this.m_last) && !(this.StringAt((this.m_current - 1), 3, "TED", "SES", "CES", "") || this.StringAt(0, 9, "ANTIPODES", "ANOPHELES", "") || this.StringAt(0, 8, "MOHAMMED", "MUHAMMED", "MOUHAMED", "") || this.StringAt(0, 7, "MOHAMED", "") || this.StringAt(0, 6, "NORRED", "MEDVED", "MERCED", "ALLRED", "KHALED", "RASHED", "MASJED", "") || this.StringAt(0, 5, "JARED", "AHMED", "HAMED", "JAVED", "") || this.StringAt(0, 4, "ABED", "IMED", "")))) || (this.StringAt((this.m_current + 1), 4, "NESS", "LESS", "") && ((this.m_current + 4) === this.m_last)) || (this.StringAt((this.m_current + 1), 2, "LY", "") && ((this.m_current + 2) === this.m_last) && !this.StringAt(0, 6, "CICELY", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Tests for words where an 'E' at the end of the word
   * is pronounced
   *
   * special cases, mostly from the greek, spanish, japanese,
   * italian, and french words normally having an acute accent.
   * also, pronouns and articles
   *
   * Many Thanks to ali, QuentinCompson, JeffCO, ToonScribe, Xan,
   * Trafalz, and VictorLaszlo, all of them atriots from the Eschaton,
   * for all their fine contributions!
   *
   * @return {boolean} true if 'E' at end is pronounced
   *
   */
  E_Pronounced_At_End(): boolean {
    if ((this.m_current === this.m_last) && (this.StringAt((this.m_current - 6), 7, "STROPHE", "") || (this.m_length === 2) || ((this.m_length === 3) && !this.IsVowel$int(0)) || (this.StringAt((this.m_last - 2), 3, "BKE", "DKE", "FKE", "KKE", "LKE", "NKE", "MKE", "PKE", "TKE", "VKE", "ZKE", "") && !this.StringAt(0, 5, "FINKE", "FUNKE", "") && !this.StringAt(0, 6, "FRANKE", "")) || this.StringAt((this.m_last - 4), 5, "SCHKE", "") || (this.StringAt(0, 4, "ACME", "NIKE", "CAFE", "RENE", "LUPE", "JOSE", "ESME", "") && (this.m_length === 4)) || (this.StringAt(0, 5, "LETHE", "CADRE", "TILDE", "SIGNE", "POSSE", "LATTE", "ANIME", "DOLCE", "CROCE", "ADOBE", "OUTRE", "JESSE", "JAIME", "JAFFE", "BENGE", "RUNGE", "CHILE", "DESME", "CONDE", "URIBE", "LIBRE", "ANDRE", "") && (this.m_length === 5)) || (this.StringAt(0, 6, "HECATE", "PSYCHE", "DAPHNE", "PENSKE", "CLICHE", "RECIPE", "TAMALE", "SESAME", "SIMILE", "FINALE", "KARATE", "RENATE", "SHANTE", "OBERLE", "COYOTE", "KRESGE", "STONGE", "STANGE", "SWAYZE", "FUENTE", "SALOME", "URRIBE", "") && (this.m_length === 6)) || (this.StringAt(0, 7, "ECHIDNE", "ARIADNE", "MEINEKE", "PORSCHE", "ANEMONE", "EPITOME", "SYNCOPE", "SOUFFLE", "ATTACHE", "MACHETE", "KARAOKE", "BUKKAKE", "VICENTE", "ELLERBE", "VERSACE", "") && (this.m_length === 7)) || (this.StringAt(0, 8, "PENELOPE", "CALLIOPE", "CHIPOTLE", "ANTIGONE", "KAMIKAZE", "EURIDICE", "YOSEMITE", "FERRANTE", "") && (this.m_length === 8)) || (this.StringAt(0, 9, "HYPERBOLE", "GUACAMOLE", "XANTHIPPE", "") && (this.m_length === 9)) || (this.StringAt(0, 10, "SYNECDOCHE", "") && (this.m_length === 10)))) {
      return true;
    }
    return false;
  }

  /**
   * Detect internal silent 'E's e.g. "roseman",
   * "firestone"
   *
   * @return {boolean}
   */
  Silent_Internal_E(): boolean {
    if ((this.StringAt(0, 3, "OLE", "") && this.E_Silent_Suffix(3) && !this.E_Pronouncing_Suffix(3)) || (this.StringAt(0, 4, "BARE", "FIRE", "FORE", "GATE", "HAGE", "HAVE", "HAZE", "HOLE", "CAPE", "HUSE", "LACE", "LINE", "LIVE", "LOVE", "MORE", "MOSE", "MORE", "NICE", "RAKE", "ROBE", "ROSE", "SISE", "SIZE", "WARE", "WAKE", "WISE", "WINE", "") && this.E_Silent_Suffix(4) && !this.E_Pronouncing_Suffix(4)) || (this.StringAt(0, 5, "BLAKE", "BRAKE", "BRINE", "CARLE", "CLEVE", "DUNNE", "HEDGE", "HOUSE", "JEFFE", "LUNCE", "STOKE", "STONE", "THORE", "WEDGE", "WHITE", "") && this.E_Silent_Suffix(5) && !this.E_Pronouncing_Suffix(5)) || (this.StringAt(0, 6, "BRIDGE", "CHEESE", "") && this.E_Silent_Suffix(6) && !this.E_Pronouncing_Suffix(6)) || this.StringAt((this.m_current - 5), 7, "CHARLES", "")) {
      return true;
    }
    return false;
  }

  /**
   * Detect conditions required
   * for the 'E' not to be pronounced
   *
   * @param {number} at
   * @return {boolean}
   */
  E_Silent_Suffix(at: number): boolean {
    if ((this.m_current === (at - 1)) && (this.m_length > (at + 1)) && (this.IsVowel$int((at + 1)) || (this.StringAt(at, 2, "ST", "SL", "") && (this.m_length > (at + 2))))) {
      return true;
    }
    return false;
  }

  /**
   * Detect endings that will
   * cause the 'e' to be pronounced
   *
   * @param {number} at
   * @return {boolean}
   */
  E_Pronouncing_Suffix(at: number): boolean {
    if ((this.m_length === (at + 4)) && this.StringAt(at, 4, "WOOD", "")) {
      return true;
    }
    if ((this.m_length === (at + 5)) && this.StringAt(at, 5, "WATER", "WORTH", "")) {
      return true;
    }
    if ((this.m_length === (at + 3)) && this.StringAt(at, 3, "TTE", "LIA", "NOW", "ROS", "RAS", "")) {
      return true;
    }
    if ((this.m_length === (at + 2)) && this.StringAt(at, 2, "TA", "TT", "NA", "NO", "NE", "RS", "RE", "LA", "AU", "RO", "RA", "")) {
      return true;
    }
    if ((this.m_length === (at + 1)) && this.StringAt(at, 1, "T", "R", "")) {
      return true;
    }
    return false;
  }

  /**
   * Exceptions where 'E' is pronounced where it
   * usually wouldn't be, and also some cases
   * where 'LE' transposition rules don't apply
   * and the vowel needs to be encoded here
   *
   * @return {boolean} true if 'E' pronounced
   *
   */
  E_Pronounced_Exceptions(): boolean {
    if ((((this.m_current + 1) === this.m_last) && (this.StringAt((this.m_current - 3), 5, "OCLES", "ACLES", "AKLES", "") || this.StringAt(0, 4, "INES", "") || this.StringAt(0, 5, "LOPES", "ESTES", "GOMES", "NUNES", "ALVES", "ICKES", "INNES", "PERES", "WAGES", "NEVES", "BENES", "DONES", "") || this.StringAt(0, 6, "CORTES", "CHAVES", "VALDES", "ROBLES", "TORRES", "FLORES", "BORGES", "NIEVES", "MONTES", "SOARES", "VALLES", "GEDDES", "ANDRES", "VIAJES", "CALLES", "FONTES", "HERMES", "ACEVES", "BATRES", "MATHES", "") || this.StringAt(0, 7, "DELORES", "MORALES", "DOLORES", "ANGELES", "ROSALES", "MIRELES", "LINARES", "PERALES", "PAREDES", "BRIONES", "SANCHES", "CAZARES", "REVELES", "ESTEVES", "ALVARES", "MATTHES", "SOLARES", "CASARES", "CACERES", "STURGES", "RAMIRES", "FUNCHES", "BENITES", "FUENTES", "PUENTES", "TABARES", "HENTGES", "VALORES", "") || this.StringAt(0, 8, "GONZALES", "MERCEDES", "FAGUNDES", "JOHANNES", "GONSALES", "BERMUDES", "CESPEDES", "BETANCES", "TERRONES", "DIOGENES", "CORRALES", "CABRALES", "MARTINES", "GRAJALES", "") || this.StringAt(0, 9, "CERVANTES", "FERNANDES", "GONCALVES", "BENEVIDES", "CIFUENTES", "SIFUENTES", "SERVANTES", "HERNANDES", "BENAVIDES", "") || this.StringAt(0, 10, "ARCHIMEDES", "CARRIZALES", "MAGALLANES", ""))) || this.StringAt(this.m_current - 2, 4, "FRED", "DGES", "DRED", "GNES", "") || this.StringAt((this.m_current - 5), 7, "PROBLEM", "RESPLEN", "") || this.StringAt((this.m_current - 4), 6, "REPLEN", "") || this.StringAt((this.m_current - 3), 4, "SPLE", "")) {
      return true;
    }
    return false;
  }

  /**
   * Encodes "-UE".
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   */
  Skip_Silent_UE(): boolean {
    if ((this.StringAt((this.m_current - 1), 3, "QUE", "GUE", "") && !this.StringAt(0, 8, "BARBEQUE", "PALENQUE", "APPLIQUE", "") && !this.StringAt(0, 6, "RISQUE", "") && !this.StringAt((this.m_current - 3), 5, "ARGUE", "SEGUE", "") && !this.StringAt(0, 7, "PIROGUE", "ENRIQUE", "") && !this.StringAt(0, 10, "COMMUNIQUE", "")) && (this.m_current > 1) && (((this.m_current + 1) === this.m_last) || this.StringAt(0, 7, "JACQUES", ""))) {
      this.m_current = this.SkipVowels(this.m_current);
      return true;
    }
    return false;
  }

  /**
   * Encodes 'B'
   *
   */
  Encode_B() {
    if (this.Encode_Silent_B()) {
      return;
    }
    this.MetaphAddExactApprox$java_lang_String$java_lang_String("B", "P");
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'B'.charCodeAt(0)) || (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'P'.charCodeAt(0)) && ((this.m_current + 1 < this.m_last) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) != 'H'.charCodeAt(0))))) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encodes silent 'B' for cases not covered under "-mb-"
   *
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   */
  Encode_Silent_B(): boolean {
    if (this.StringAt((this.m_current - 2), 4, "DEBT", "") || this.StringAt((this.m_current - 2), 5, "SUBTL", "") || this.StringAt((this.m_current - 2), 6, "SUBTIL", "") || this.StringAt((this.m_current - 3), 5, "DOUBT", "")) {
      this.MetaphAdd$java_lang_String("T");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes 'C'
   *
   */
  Encode_C() {
    if (this.Encode_Silent_C_At_Beginning() || this.Encode_CA_To_S() || this.Encode_CO_To_S() || this.Encode_CH() || this.Encode_CCIA() || this.Encode_CC() || this.Encode_CK_CG_CQ() || this.Encode_C_Front_Vowel() || this.Encode_Silent_C() || this.Encode_CZ() || this.Encode_CS()) {
      return;
    }
    if (!this.StringAt((this.m_current - 1), 1, "C", "K", "G", "Q", "")) {
      this.MetaphAdd$java_lang_String("K");
    }
    if (this.StringAt((this.m_current + 1), 2, " C", " Q", " G", "")) {
      this.m_current += 2;
    } else {
      if (this.StringAt((this.m_current + 1), 1, "C", "K", "Q", "") && !this.StringAt((this.m_current + 1), 2, "CE", "CI", "")) {
        this.m_current += 2;
        if (this.StringAt((this.m_current), 1, "C", "K", "Q", "") && !this.StringAt((this.m_current + 1), 2, "CE", "CI", "")) {
          this.m_current++;
        }
      } else {
        this.m_current++;
      }
    }
  }

  /**
   * Encodes cases where 'C' is silent at beginning of word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_C_At_Beginning(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "CT", "CN", "")) {
      this.m_current += 1;
      return true;
    }
    return false;
  }

  /**
   * Encodes exceptions where "-CA-" should encode to S
   * instead of K including cases where the cedilla has not been used
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CA_To_S(): boolean {
    if (((this.m_current === 0) && this.StringAt(this.m_current, 4, "CAES", "CAEC", "CAEM", "")) || this.StringAt(0, 8, "FRANCAIS", "FRANCAIX", "LINGUICA", "") || this.StringAt(0, 6, "FACADE", "") || this.StringAt(0, 9, "GONCALVES", "PROVENCAL", "")) {
      this.MetaphAdd$java_lang_String("S");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encodes exceptions where "-CO-" encodes to S instead of K
   * including cases where the cedilla has not been used
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CO_To_S(): boolean {
    if ((this.StringAt(this.m_current, 4, "COEL", "") && (this.IsVowel$int(this.m_current + 4) || ((this.m_current + 3) === this.m_last))) || this.StringAt(this.m_current, 5, "COENA", "COENO", "") || this.StringAt(0, 8, "FRANCOIS", "MELANCON", "") || this.StringAt(0, 6, "GARCON", "")) {
      this.MetaphAdd$java_lang_String("S");
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-CH-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CH(): boolean {
    if (this.StringAt(this.m_current, 2, "CH", "")) {
      if (this.Encode_CHAE() || this.Encode_CH_To_H() || this.Encode_Silent_CH() || this.Encode_ARCH() || this.Encode_CH_To_X() || this.Encode_English_CH_To_K() || this.Encode_Germanic_CH_To_K() || this.Encode_Greek_CH_Initial() || this.Encode_Greek_CH_Non_Initial()) {
        return true;
      }
      if (this.m_current > 0) {
        if (this.StringAt(0, 2, "MC", "") && (this.m_current === 1)) {
          this.MetaphAdd$java_lang_String("K");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("X", "K");
        }
      } else {
        this.MetaphAdd$java_lang_String("X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes "-CHAE-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CHAE(): boolean {
    if (((this.m_current > 0) && this.StringAt((this.m_current + 2), 2, "AE", ""))) {
      if (this.StringAt(0, 7, "RACHAEL", "")) {
        this.MetaphAdd$java_lang_String("X");
      } else if (!this.StringAt((this.m_current - 1), 1, "C", "K", "G", "Q", "")) {
        this.MetaphAdd$java_lang_String("K");
      }
      this.AdvanceCounter(4, 2);
      return true;
    }
    return false;
  }

  /**
   * Encdoes transliterations from the hebrew where the
   * sound 'kh' is represented as "-CH-". The normal pronounciation
   * of this in english is either 'h' or 'kh', and alternate
   * spellings most often use "-H-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CH_To_H(): boolean {
    if (((this.m_current === 0) && (this.StringAt((this.m_current + 2), 3, "AIM", "ETH", "ELM", "") || this.StringAt((this.m_current + 2), 4, "ASID", "AZAN", "") || this.StringAt((this.m_current + 2), 5, "UPPAH", "UTZPA", "ALLAH", "ALUTZ", "AMETZ", "") || this.StringAt((this.m_current + 2), 6, "ESHVAN", "ADARIM", "ANUKAH", "") || this.StringAt((this.m_current + 2), 7, "ALLLOTH", "ANNUKAH", "AROSETH", ""))) || this.StringAt((this.m_current - 3), 7, "CLACHAN", "")) {
      this.MetaphAdd$java_lang_String("H");
      this.AdvanceCounter(3, 2);
      return true;
    }
    return false;
  }

  /**
   * Encodes cases where "-CH-" is not pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_CH(): boolean {
    if (this.StringAt((this.m_current - 2), 7, "FUCHSIA", "") || this.StringAt((this.m_current - 2), 5, "YACHT", "") || this.StringAt(0, 8, "STRACHAN", "") || this.StringAt(0, 8, "CRICHTON", "") || (this.StringAt((this.m_current - 3), 6, "DRACHM", "")) && !this.StringAt((this.m_current - 3), 7, "DRACHMA", "")) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes "-CH-" to X
   * English language patterns
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CH_To_X(): boolean {
    if ((this.StringAt((this.m_current - 2), 4, "OACH", "EACH", "EECH", "OUCH", "OOCH", "MUCH", "SUCH", "") && !this.StringAt((this.m_current - 3), 5, "JOACH", "")) || (((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current - 1), 4, "ACHA", "ACHO", "")) || (this.StringAt(this.m_current, 4, "CHOT", "CHOD", "CHAT", "") && ((this.m_current + 3) === this.m_last)) || ((this.StringAt((this.m_current - 1), 4, "OCHE", "") && ((this.m_current + 2) === this.m_last)) && !this.StringAt((this.m_current - 2), 5, "DOCHE", "")) || this.StringAt((this.m_current - 4), 6, "ATTACH", "DETACH", "KOVACH", "") || this.StringAt((this.m_current - 5), 7, "SPINACH", "") || this.StringAt(0, 6, "MACHAU", "") || this.StringAt((this.m_current - 4), 8, "PARACHUT", "") || this.StringAt((this.m_current - 5), 8, "MASSACHU", "") || (this.StringAt((this.m_current - 3), 5, "THACH", "") && !this.StringAt((this.m_current - 1), 4, "ACHE", "")) || this.StringAt((this.m_current - 2), 6, "VACHON", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes "-CH-" to K in contexts of
   * initial "A" or "E" follwed by "CH"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_English_CH_To_K(): boolean {
    if (((this.m_current === 1) && this.RootOrInflections(this.m_inWord, "ACHE")) || (((this.m_current > 3) && this.RootOrInflections(this.m_inWord.substring(this.m_current - 1), "ACHE")) && (this.StringAt(0, 3, "EAR", "") || this.StringAt(0, 4, "HEAD", "BACK", "") || this.StringAt(0, 5, "HEART", "BELLY", "TOOTH", ""))) || this.StringAt((this.m_current - 1), 4, "ECHO", "") || this.StringAt((this.m_current - 2), 7, "MICHEAL", "") || this.StringAt((this.m_current - 4), 7, "JERICHO", "") || this.StringAt((this.m_current - 5), 7, "LEPRECH", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("K", "X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes "-CH-" to K in mostly germanic context
   * of internal "-ACH-", with exceptions
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Germanic_CH_To_K(): boolean {
    if (((this.m_current > 1) && !this.IsVowel$int(this.m_current - 2) && this.StringAt((this.m_current - 1), 3, "ACH", "") && !this.StringAt((this.m_current - 2), 7, "MACHADO", "MACHUCA", "LACHANC", "LACHAPE", "KACHATU", "") && !this.StringAt((this.m_current - 3), 7, "KHACHAT", "") && (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) != 'I'.charCodeAt(0)) && (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) != 'E'.charCodeAt(0)) || this.StringAt((this.m_current - 2), 6, "BACHER", "MACHER", "MACHEN", "LACHER", ""))) || (this.StringAt((this.m_current + 2), 1, "T", "S", "") && !(this.StringAt(0, 11, "WHICHSOEVER", "") || this.StringAt(0, 9, "LUNCHTIME", ""))) || this.StringAt(0, 4, "SCHR", "") || ((this.m_current > 2) && this.StringAt((this.m_current - 2), 5, "MACHE", "")) || ((this.m_current === 2) && this.StringAt((this.m_current - 2), 4, "ZACH", "")) || this.StringAt((this.m_current - 4), 6, "SCHACH", "") || this.StringAt((this.m_current - 1), 5, "ACHEN", "") || this.StringAt((this.m_current - 3), 5, "SPICH", "ZURCH", "BUECH", "") || (this.StringAt((this.m_current - 3), 5, "KIRCH", "JOACH", "BLECH", "MALCH", "") && !(this.StringAt((this.m_current - 3), 8, "KIRCHNER", "") || ((this.m_current + 1) === this.m_last))) || (((this.m_current + 1) === this.m_last) && this.StringAt((this.m_current - 2), 4, "NICH", "LICH", "BACH", "")) || (((this.m_current + 1) === this.m_last) && this.StringAt((this.m_current - 3), 5, "URICH", "BRICH", "ERICH", "DRICH", "NRICH", "") && !this.StringAt((this.m_current - 5), 7, "ALDRICH", "") && !this.StringAt((this.m_current - 6), 8, "GOODRICH", "") && !this.StringAt((this.m_current - 7), 9, "GINGERICH", ""))) || (((this.m_current + 1) === this.m_last) && this.StringAt((this.m_current - 4), 6, "ULRICH", "LFRICH", "LLRICH", "EMRICH", "ZURICH", "EYRICH", "")) || ((this.StringAt((this.m_current - 1), 1, "A", "O", "U", "E", "") || (this.m_current === 0)) && this.StringAt((this.m_current + 2), 1, "L", "R", "N", "M", "B", "H", "F", "V", "W", " ", ""))) {
      if (this.StringAt((this.m_current + 2), 1, "R", "L", "") || this.SlavoGermanic()) {
        this.MetaphAdd$java_lang_String("K");
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("K", "X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-ARCH-". Some occurances are from greek roots and therefore encode
   * to 'K', others are from english words and therefore encode to 'X'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ARCH(): boolean {
    if (this.StringAt((this.m_current - 2), 4, "ARCH", "")) {
      if (((this.IsVowel$int(this.m_current + 2) && this.StringAt((this.m_current - 2), 5, "ARCHA", "ARCHI", "ARCHO", "ARCHU", "ARCHY", "")) || this.StringAt((this.m_current - 2), 6, "ARCHEA", "ARCHEG", "ARCHEO", "ARCHET", "ARCHEL", "ARCHES", "ARCHEP", "ARCHEM", "ARCHEN", "") || (this.StringAt((this.m_current - 2), 4, "ARCH", "") && (((this.m_current + 1) === this.m_last))) || this.StringAt(0, 7, "MENARCH", "")) && (!this.RootOrInflections(this.m_inWord, "ARCH") && !this.StringAt((this.m_current - 4), 6, "SEARCH", "POARCH", "") && !this.StringAt(0, 9, "ARCHENEMY", "ARCHIBALD", "ARCHULETA", "ARCHAMBAU", "") && !this.StringAt(0, 6, "ARCHER", "ARCHIE", "") && !((((this.StringAt((this.m_current - 3), 5, "LARCH", "MARCH", "PARCH", "") || this.StringAt((this.m_current - 4), 6, "STARCH", "")) && !(this.StringAt(0, 6, "EPARCH", "") || this.StringAt(0, 7, "NOMARCH", "") || this.StringAt(0, 8, "EXILARCH", "HIPPARCH", "MARCHESE", "") || this.StringAt(0, 9, "ARISTARCH", "") || this.StringAt(0, 9, "MARCHETTI", ""))) || this.RootOrInflections(this.m_inWord, "STARCH")) && (!this.StringAt((this.m_current - 2), 5, "ARCHU", "ARCHY", "") || this.StringAt(0, 7, "STARCHY", ""))))) {
        this.MetaphAdd$java_lang_String$java_lang_String("K", "X");
      } else {
        this.MetaphAdd$java_lang_String("X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-CH-" to K when from greek roots
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Greek_CH_Initial(): boolean {
    if ((this.StringAt(this.m_current, 6, "CHAMOM", "CHARAC", "CHARIS", "CHARTO", "CHARTU", "CHARYB", "CHRIST", "CHEMIC", "CHILIA", "") || (this.StringAt(this.m_current, 5, "CHEMI", "CHEMO", "CHEMU", "CHEMY", "CHOND", "CHONA", "CHONI", "CHOIR", "CHASM", "CHARO", "CHROM", "CHROI", "CHAMA", "CHALC", "CHALD", "CHAET", "CHIRO", "CHILO", "CHELA", "CHOUS", "CHEIL", "CHEIR", "CHEIM", "CHITI", "CHEOP", "") && !(this.StringAt(this.m_current, 6, "CHEMIN", "") || this.StringAt((this.m_current - 2), 8, "ANCHONDO", ""))) || (this.StringAt(this.m_current, 5, "CHISM", "CHELI", "") && !(this.StringAt(0, 8, "MACHISMO", "") || this.StringAt(0, 10, "REVANCHISM", "") || this.StringAt(0, 9, "RICHELIEU", "") || (this.StringAt(0, 5, "CHISM", "") && (this.m_length === 5)) || this.StringAt(0, 6, "MICHEL", ""))) || (this.StringAt(this.m_current, 4, "CHOR", "CHOL", "CHYM", "CHYL", "CHLO", "CHOS", "CHUS", "CHOE", "") && !this.StringAt(0, 6, "CHOLLO", "CHOLLA", "CHORIZ", "")) || (this.StringAt(this.m_current, 4, "CHAO", "") && ((this.m_current + 3) !== this.m_last)) || (this.StringAt(this.m_current, 4, "CHIA", "") && !(this.StringAt(0, 10, "APPALACHIA", "") || this.StringAt(0, 7, "CHIAPAS", ""))) || this.StringAt(this.m_current, 7, "CHIMERA", "CHIMAER", "CHIMERI", "") || ((this.m_current === 0) && this.StringAt(this.m_current, 5, "CHAME", "CHELO", "CHITO", "")) || ((((this.m_current + 4) === this.m_last) || ((this.m_current + 5) === this.m_last)) && this.StringAt((this.m_current - 1), 6, "OCHETE", ""))) && !((this.StringAt(0, 5, "CHORE", "CHOLO", "CHOLA", "") && (this.m_length === 5)) || this.StringAt(this.m_current, 5, "CHORT", "CHOSE", "") || this.StringAt((this.m_current - 3), 7, "CROCHET", "") || this.StringAt(0, 7, "CHEMISE", "CHARISE", "CHARISS", "CHAROLE", ""))) {
      if (this.StringAt((this.m_current + 2), 1, "R", "L", "")) {
        this.MetaphAdd$java_lang_String("K");
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("K", "X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode a variety of greek and some german roots where "-CH-" => K
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Greek_CH_Non_Initial(): boolean {
    if (this.StringAt((this.m_current - 2), 6, "ORCHID", "NICHOL", "MECHAN", "LICHEN", "MACHIC", "PACHEL", "RACHIF", "RACHID", "RACHIS", "RACHIC", "MICHAL", "") || this.StringAt((this.m_current - 3), 5, "MELCH", "GLOCH", "TRACH", "TROCH", "BRACH", "SYNCH", "PSYCH", "STICH", "PULCH", "EPOCH", "") || (this.StringAt((this.m_current - 3), 5, "TRICH", "") && !this.StringAt((this.m_current - 5), 7, "OSTRICH", "")) || (this.StringAt((this.m_current - 2), 4, "TYCH", "TOCH", "BUCH", "MOCH", "CICH", "DICH", "NUCH", "EICH", "LOCH", "DOCH", "ZECH", "WYCH", "") && !(this.StringAt((this.m_current - 4), 9, "INDOCHINA", "") || this.StringAt((this.m_current - 2), 6, "BUCHON", ""))) || this.StringAt((this.m_current - 2), 5, "LYCHN", "TACHO", "ORCHO", "ORCHI", "LICHO", "") || (this.StringAt((this.m_current - 1), 5, "OCHER", "ECHIN", "ECHID", "") && ((this.m_current === 1) || (this.m_current === 2))) || this.StringAt((this.m_current - 4), 6, "BRONCH", "STOICH", "STRYCH", "TELECH", "PLANCH", "CATECH", "MANICH", "MALACH", "BIANCH", "DIDACH", "") || (this.StringAt((this.m_current - 1), 4, "ICHA", "ICHN", "") && (this.m_current === 1)) || this.StringAt((this.m_current - 2), 8, "ORCHESTR", "") || this.StringAt((this.m_current - 4), 8, "BRANCHIO", "BRANCHIF", "") || (this.StringAt((this.m_current - 1), 5, "ACHAB", "ACHAD", "ACHAN", "ACHAZ", "") && !this.StringAt((this.m_current - 2), 7, "MACHADO", "LACHANC", "")) || this.StringAt((this.m_current - 1), 6, "ACHISH", "ACHILL", "ACHAIA", "ACHENE", "") || this.StringAt((this.m_current - 1), 7, "ACHAIAN", "ACHATES", "ACHIRAL", "ACHERON", "") || this.StringAt((this.m_current - 1), 8, "ACHILLEA", "ACHIMAAS", "ACHILARY", "ACHELOUS", "ACHENIAL", "ACHERNAR", "") || this.StringAt((this.m_current - 1), 9, "ACHALASIA", "ACHILLEAN", "ACHIMENES", "") || this.StringAt((this.m_current - 1), 10, "ACHIMELECH", "ACHITOPHEL", "") || (((this.m_current - 2) === 0) && (this.StringAt((this.m_current - 2), 6, "INCHOA", "") || this.StringAt(0, 4, "ISCH", ""))) || (((this.m_current + 1) === this.m_last) && this.StringAt((this.m_current - 1), 1, "A", "O", "U", "E", "") && !(this.StringAt(0, 7, "DEBAUCH", "") || this.StringAt((this.m_current - 2), 4, "MUCH", "SUCH", "KOCH", "") || this.StringAt((this.m_current - 5), 7, "OODRICH", "ALDRICH", "")))) {
      this.MetaphAdd$java_lang_String$java_lang_String("K", "X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes reliably italian "-CCIA-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CCIA(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "CIA", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-CC-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CC(): boolean {
    if (this.StringAt(this.m_current, 2, "CC", "") && !((this.m_current === 1) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(0)) == 'M'.charCodeAt(0)))) {
      if (this.StringAt((this.m_current - 3), 7, "FLACCID", "")) {
        this.MetaphAdd$java_lang_String("S");
        this.AdvanceCounter(3, 2);
        return true;
      }
      if ((((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current + 2), 1, "I", "")) || this.StringAt((this.m_current + 2), 2, "IO", "") || (((this.m_current + 4) === this.m_last) && this.StringAt((this.m_current + 2), 3, "INO", "INI", ""))) {
        this.MetaphAdd$java_lang_String("X");
        this.AdvanceCounter(3, 2);
        return true;
      }
      if (this.StringAt((this.m_current + 2), 1, "I", "E", "Y", "") && !(((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'H'.charCodeAt(0)) || this.StringAt((this.m_current - 2), 6, "SOCCER", ""))) {
        this.MetaphAdd$java_lang_String("KS");
        this.AdvanceCounter(3, 2);
        return true;
      } else {
        this.MetaphAdd$java_lang_String("K");
        this.m_current += 2;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode cases where the consonant following "C" is redundant
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CK_CG_CQ(): boolean {
    if (this.StringAt(this.m_current, 2, "CK", "CG", "CQ", "")) {
      if (this.StringAt(this.m_current, 3, "CKI", "CKY", "") && ((this.m_current + 2) === this.m_last) && (this.m_length > 6)) {
        this.MetaphAdd$java_lang_String$java_lang_String("K", "SK");
      } else {
        this.MetaphAdd$java_lang_String("K");
      }
      this.m_current += 2;
      if (this.StringAt(this.m_current, 1, "K", "G", "Q", "")) {
        this.m_current++;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "C" preceeds a front vowel such as "E", "I", or "Y".
   * These cases most likely => S or X
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_C_Front_Vowel(): boolean {
    if (this.StringAt(this.m_current, 2, "CI", "CE", "CY", "")) {
      if (this.Encode_British_Silent_CE() || this.Encode_CE() || this.Encode_CI() || this.Encode_Latinate_Suffixes()) {
        this.AdvanceCounter(2, 1);
        return true;
      }
      this.MetaphAdd$java_lang_String("S");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_British_Silent_CE(): boolean {
    if ((this.StringAt((this.m_current + 1), 5, "ESTER", "") && ((this.m_current + 5) === this.m_last)) || this.StringAt((this.m_current + 1), 10, "ESTERSHIRE", "")) {
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CE(): boolean {
    if ((this.StringAt((this.m_current + 1), 3, "EAN", "") && this.IsVowel$int(this.m_current - 1)) || (this.StringAt((this.m_current - 1), 4, "ACEA", "") && ((this.m_current + 2) === this.m_last) && !this.StringAt(0, 7, "PANACEA", "")) || this.StringAt((this.m_current + 1), 4, "ELLI", "ERTO", "EORL", "") || (this.StringAt((this.m_current - 3), 5, "CROCE", "") && ((this.m_current + 1) === this.m_last)) || this.StringAt((this.m_current - 3), 5, "DOLCE", "") || (this.StringAt((this.m_current + 1), 4, "ELLO", "") && ((this.m_current + 4) === this.m_last))) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CI(): boolean {
    if (((this.StringAt((this.m_current + 1), 3, "INI", "") && !this.StringAt(0, 7, "MANCINI", "")) && ((this.m_current + 3) === this.m_last)) || (this.StringAt((this.m_current - 1), 3, "ICI", "") && ((this.m_current + 1) === this.m_last)) || this.StringAt((this.m_current - 1), 5, "RCIAL", "NCIAL", "RCIAN", "UCIUS", "") || this.StringAt((this.m_current - 3), 6, "MARCIA", "") || this.StringAt((this.m_current - 2), 7, "ANCIENT", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      return true;
    }
    if (((this.StringAt(this.m_current, 3, "CIO", "CIE", "CIA", "") && this.IsVowel$int(this.m_current - 1)) || this.StringAt((this.m_current + 1), 3, "IAO", "")) && !this.StringAt((this.m_current - 4), 8, "COERCION", "")) {
      if ((this.StringAt(this.m_current, 4, "CIAN", "CIAL", "CIAO", "CIES", "CIOL", "CION", "") || this.StringAt((this.m_current - 3), 7, "GLACIER", "") || this.StringAt(this.m_current, 5, "CIENT", "CIENC", "CIOUS", "CIATE", "CIATI", "CIATO", "CIABL", "CIARY", "") || (((this.m_current + 2) === this.m_last) && this.StringAt(this.m_current, 3, "CIA", "CIO", "")) || (((this.m_current + 3) === this.m_last) && this.StringAt(this.m_current, 3, "CIAS", "CIOS", ""))) && !(this.StringAt((this.m_current - 4), 11, "ASSOCIATION", "") || this.StringAt(0, 4, "OCIE", "") || this.StringAt((this.m_current - 2), 5, "LUCIO", "") || this.StringAt((this.m_current - 2), 6, "MACIAS", "") || this.StringAt((this.m_current - 3), 6, "GRACIE", "GRACIA", "") || this.StringAt((this.m_current - 2), 7, "LUCIANO", "") || this.StringAt((this.m_current - 3), 8, "MARCIANO", "") || this.StringAt((this.m_current - 4), 7, "PALACIO", "") || this.StringAt((this.m_current - 4), 9, "FELICIANO", "") || this.StringAt((this.m_current - 5), 8, "MAURICIO", "") || this.StringAt((this.m_current - 7), 11, "ENCARNACION", "") || this.StringAt((this.m_current - 4), 8, "POLICIES", "") || this.StringAt((this.m_current - 2), 8, "HACIENDA", "") || this.StringAt((this.m_current - 6), 9, "ANDALUCIA", "") || this.StringAt((this.m_current - 2), 5, "SOCIO", "SOCIE", ""))) {
        this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("S", "X");
      }
      return true;
    }
    if (this.StringAt((this.m_current - 4), 8, "COERCION", "")) {
      this.MetaphAdd$java_lang_String("J");
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Latinate_Suffixes(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "EOUS", "IOUS", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      return true;
    }
    return false;
  }

  /**
   * Encodes some exceptions where "C" is silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_C(): boolean {
    if (this.StringAt((this.m_current + 1), 1, "T", "S", "")) {
      if (this.StringAt(0, 11, "CONNECTICUT", "") || this.StringAt(0, 6, "INDICT", "TUCSON", "")) {
        this.m_current++;
        return true;
      }
    }
    return false;
  }

  /**
   * Encodes slavic spellings or transliterations
   * written as "-CZ-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CZ(): boolean {
    if (this.StringAt((this.m_current + 1), 1, "Z", "") && !this.StringAt((this.m_current - 1), 6, "ECZEMA", "")) {
      if (this.StringAt(this.m_current, 4, "CZAR", "")) {
        this.MetaphAdd$java_lang_String("S");
      } else {
        this.MetaphAdd$java_lang_String("X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * "-CS" special cases
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_CS(): boolean {
    if (this.StringAt(0, 6, "KOVACS", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("KS", "X");
      this.m_current += 2;
      return true;
    }
    if (this.StringAt((this.m_current - 1), 3, "ACS", "") && ((this.m_current + 1) === this.m_last) && !this.StringAt((this.m_current - 4), 6, "ISAACS", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-D-"
   *
   */
  Encode_D() {
    if (this.Encode_DG() || this.Encode_DJ() || this.Encode_DT_DD() || this.Encode_D_To_J() || this.Encode_DOUS() || this.Encode_Silent_D()) {
      return;
    }
    if (this.m_encodeExact) {
      if ((this.m_current === this.m_last) && this.StringAt((this.m_current - 3), 4, "SSED", "")) {
        this.MetaphAdd$java_lang_String("T");
      } else {
        this.MetaphAdd$java_lang_String("D");
      }
    } else {
      this.MetaphAdd$java_lang_String("T");
    }
    this.m_current++;
  }

  /**
   * Encode "-DG-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_DG(): boolean {
    if (this.StringAt(this.m_current, 2, "DG", "")) {
      if (this.StringAt((this.m_current + 2), 1, "A", "O", "") || this.StringAt((this.m_current + 1), 3, "GUN", "GUT", "") || this.StringAt((this.m_current + 1), 4, "GEAR", "GLAS", "GRIP", "GREN", "GILL", "GRAF", "") || this.StringAt((this.m_current + 1), 5, "GUARD", "GUILT", "GRAVE", "GRASS", "") || this.StringAt((this.m_current + 1), 6, "GROUSE", "")) {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String("DG", "TK");
      } else {
        this.MetaphAdd$java_lang_String("J");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-DJ-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_DJ(): boolean {
    if (this.StringAt(this.m_current, 2, "DJ", "")) {
      this.MetaphAdd$java_lang_String("J");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-DD-" and "-DT-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_DT_DD(): boolean {
    if (this.StringAt(this.m_current, 2, "DT", "DD", "")) {
      if (this.StringAt(this.m_current, 3, "DTH", "")) {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String("D0", "T0");
        this.m_current += 3;
      } else {
        if (this.m_encodeExact) {
          if (this.StringAt(this.m_current, 2, "DT", "")) {
            this.MetaphAdd$java_lang_String("T");
          } else {
            this.MetaphAdd$java_lang_String("D");
          }
        } else {
          this.MetaphAdd$java_lang_String("T");
        }
        this.m_current += 2;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "-DU-" "-DI-", and "-DI-" => J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_D_To_J(): boolean {
    if ((this.StringAt(this.m_current, 3, "DUL", "") && (this.IsVowel$int(this.m_current - 1) && this.IsVowel$int(this.m_current + 3))) || (((this.m_current + 3) === this.m_last) && this.StringAt((this.m_current - 1), 5, "LDIER", "NDEUR", "EDURE", "RDURE", "")) || this.StringAt((this.m_current - 3), 7, "CORDIAL", "") || this.StringAt((this.m_current - 1), 5, "NDULA", "NDULU", "EDUCA", "") || this.StringAt((this.m_current - 1), 4, "ADUA", "IDUA", "IDUU", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "D", "J", "T");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode latinate suffix "-DOUS" where 'D' is pronounced as J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_DOUS(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "UOUS", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "D", "J", "T");
      this.AdvanceCounter(4, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode silent "-D-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_D(): boolean {
    if (this.StringAt((this.m_current - 2), 9, "WEDNESDAY", "") || this.StringAt((this.m_current - 3), 7, "HANDKER", "HANDSOM", "WINDSOR", "") || this.StringAt((this.m_current - 5), 6, "PERNOD", "ARTAUD", "RENAUD", "") || this.StringAt((this.m_current - 6), 7, "RIMBAUD", "MICHAUD", "BICHAUD", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-F-"
   *
   */
  Encode_F() {
    if (this.StringAt((this.m_current - 1), 5, "OFTEN", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("F", "FT");
      this.m_current += 2;
      return;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'F'.charCodeAt(0)) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    this.MetaphAdd$java_lang_String("F");
  }

  /**
   * Encode "-G-"
   *
   */
  Encode_G() {
    if (this.Encode_Silent_G_At_Beginning() || this.Encode_GG() || this.Encode_GK() || this.Encode_GH() || this.Encode_Silent_G() || this.Encode_GN() || this.Encode_GL() || this.Encode_Initial_G_Front_Vowel() || this.Encode_NGER() || this.Encode_GER() || this.Encode_GEL() || this.Encode_Non_Initial_G_Front_Vowel() || this.Encode_GA_To_J()) {
      return;
    }
    if (!this.StringAt((this.m_current - 1), 1, "C", "K", "G", "Q", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
    }
    this.m_current++;
  }

  /**
   * Encode cases where 'G' is silent at beginning of word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_G_At_Beginning(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "GN", "")) {
      this.m_current += 1;
      return true;
    }
    return false;
  }

  /**
   * Encode "-GG-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GG(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'G'.charCodeAt(0)) {
      if (this.StringAt((this.m_current - 1), 5, "AGGIA", "OGGIA", "AGGIO", "EGGIO", "EGGIA", "IGGIO", "") || (this.StringAt((this.m_current - 1), 5, "UGGIE", "") && !(((this.m_current + 3) === this.m_last) || ((this.m_current + 4) === this.m_last))) || (((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current - 1), 4, "AGGI", "OGGI", "")) || this.StringAt((this.m_current - 2), 6, "SUGGES", "XAGGER", "REGGIE", "")) {
        if (this.StringAt((this.m_current - 2), 7, "SUGGEST", "")) {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        }
        this.MetaphAdd$java_lang_String("J");
        this.AdvanceCounter(3, 2);
      } else {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        this.m_current += 2;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode "-GK-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GK(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'K'.charCodeAt(0)) {
      this.MetaphAdd$java_lang_String("K");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-GH-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'H'.charCodeAt(0)) {
      if (this.Encode_GH_After_Consonant() || this.Encode_Initial_GH() || this.Encode_GH_To_J() || this.Encode_GH_To_H() || this.Encode_UGHT() || this.Encode_GH_H_Part_Of_Other_Word() || this.Encode_Silent_GH() || this.Encode_GH_To_F()) {
        return true;
      }
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_After_Consonant(): boolean {
    if ((this.m_current > 0) && !this.IsVowel$int(this.m_current - 1) && !(this.StringAt((this.m_current - 3), 5, "HALGH", "") && ((this.m_current + 1) === this.m_last))) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_GH(): boolean {
    if (this.m_current < 3) {
      if (this.m_current === 0) {
        if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'I'.charCodeAt(0)) {
          this.MetaphAdd$java_lang_String("J");
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        }
        this.m_current += 2;
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_To_J(): boolean {
    if (this.StringAt((this.m_current - 2), 4, "ALGH", "") && ((this.m_current + 1) === this.m_last)) {
      this.MetaphAdd$java_lang_String$java_lang_String("J", "");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_To_H(): boolean {
    if ((this.StringAt((this.m_current - 4), 4, "DONO", "DONA", "") && this.IsVowel$int(this.m_current + 2)) || this.StringAt((this.m_current - 5), 9, "CALLAGHAN", "")) {
      this.MetaphAdd$java_lang_String("H");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_UGHT(): boolean {
    if (this.StringAt((this.m_current - 1), 4, "UGHT", "")) {
      if ((this.StringAt((this.m_current - 3), 5, "LAUGH", "") && !(this.StringAt((this.m_current - 4), 7, "SLAUGHT", "") || this.StringAt((this.m_current - 3), 7, "LAUGHTO", ""))) || this.StringAt((this.m_current - 4), 6, "DRAUGH", "")) {
        this.MetaphAdd$java_lang_String("FT");
      } else {
        this.MetaphAdd$java_lang_String("T");
      }
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_H_Part_Of_Other_Word(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "HOUS", "HEAD", "HOLE", "HORN", "HARN", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_GH(): boolean {
    if (((((this.m_current > 1) && this.StringAt((this.m_current - 2), 1, "B", "H", "D", "G", "L", "")) || ((this.m_current > 2) && this.StringAt((this.m_current - 3), 1, "B", "H", "D", "K", "W", "N", "P", "V", "") && !this.StringAt(0, 6, "ENOUGH", "")) || ((this.m_current > 3) && this.StringAt((this.m_current - 4), 1, "B", "H", "")) || ((this.m_current > 3) && this.StringAt((this.m_current - 4), 2, "PL", "SL", "")) || ((this.m_current > 0) && (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current - 1)) == 'I'.charCodeAt(0)) || this.StringAt(0, 4, "PUGH", "") || (this.StringAt((this.m_current - 1), 3, "AGH", "") && ((this.m_current + 1) === this.m_last)) || this.StringAt((this.m_current - 4), 6, "GERAGH", "DRAUGH", "") || (this.StringAt((this.m_current - 3), 5, "GAUGH", "GEOGH", "MAUGH", "") && !this.StringAt(0, 9, "MCGAUGHEY", "")) || (this.StringAt((this.m_current - 2), 4, "OUGH", "") && (this.m_current > 3) && !this.StringAt((this.m_current - 4), 6, "CCOUGH", "ENOUGH", "TROUGH", "CLOUGH", ""))))) && (this.StringAt((this.m_current - 3), 5, "VAUGH", "FEIGH", "LEIGH", "") || this.StringAt((this.m_current - 2), 4, "HIGH", "TIGH", "") || ((this.m_current + 1) === this.m_last) || (this.StringAt((this.m_current + 2), 2, "IE", "EY", "ES", "ER", "ED", "TY", "") && ((this.m_current + 3) === this.m_last) && !this.StringAt((this.m_current - 5), 9, "GALLAGHER", "")) || (this.StringAt((this.m_current + 2), 1, "Y", "") && ((this.m_current + 2) === this.m_last)) || (this.StringAt((this.m_current + 2), 3, "ING", "OUT", "") && ((this.m_current + 4) === this.m_last)) || (this.StringAt((this.m_current + 2), 4, "ERTY", "") && ((this.m_current + 5) === this.m_last)) || (!this.IsVowel$int(this.m_current + 2) || this.StringAt((this.m_current - 3), 5, "GAUGH", "GEOGH", "MAUGH", "") || this.StringAt((this.m_current - 4), 8, "BROUGHAM", "")))) && !(this.StringAt(0, 6, "BALOGH", "SABAGH", "") || this.StringAt((this.m_current - 2), 7, "BAGHDAD", "") || this.StringAt((this.m_current - 3), 5, "WHIGH", "") || this.StringAt((this.m_current - 5), 7, "SABBAGH", "AKHLAGH", ""))) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_Special_Cases(): boolean {
    let handled: boolean = false;
    if (this.StringAt((this.m_current - 6), 8, "HICCOUGH", "")) {
      this.MetaphAdd$java_lang_String("P");
      handled = true;
    } else if (this.StringAt(0, 5, "LOUGH", "")) {
      this.MetaphAdd$java_lang_String("K");
      handled = true;
    } else if (this.StringAt(0, 6, "BALOGH", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "", "K", "");
      handled = true;
    } else if (this.StringAt((this.m_current - 3), 8, "LAUGHLIN", "COUGHLAN", "LOUGHLIN", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("K", "F");
      handled = true;
    } else if (this.StringAt((this.m_current - 3), 5, "GOUGH", "") || this.StringAt((this.m_current - 7), 9, "COLCLOUGH", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("", "F");
      handled = true;
    }
    if (handled) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GH_To_F(): boolean {
    if (this.Encode_GH_Special_Cases()) {
      return true;
    } else {
      if ((this.m_current > 2) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current - 1)) == 'U'.charCodeAt(0)) && this.IsVowel$int(this.m_current - 2) && this.StringAt((this.m_current - 3), 1, "C", "G", "L", "R", "T", "N", "S", "") && !this.StringAt((this.m_current - 4), 8, "BREUGHEL", "FLAUGHER", "")) {
        this.MetaphAdd$java_lang_String("F");
        this.m_current += 2;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode some contexts where "g" is silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_G(): boolean {
    if ((((this.m_current + 1) === this.m_last) && (this.StringAt((this.m_current - 1), 3, "EGM", "IGM", "AGM", "") || this.StringAt(this.m_current, 2, "GT", ""))) || (this.StringAt(0, 5, "HUGES", "") && (this.m_length === 5))) {
      this.m_current++;
      return true;
    }
    if (this.StringAt(0, 2, "NG", "") && (this.m_current !== this.m_last)) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * ENcode "-GN-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GN(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'N'.charCodeAt(0)) {
      if (((this.m_current > 1) && ((this.StringAt((this.m_current - 1), 1, "I", "U", "E", "") || this.StringAt((this.m_current - 3), 9, "LORGNETTE", "") || this.StringAt((this.m_current - 2), 9, "LAGNIAPPE", "") || this.StringAt((this.m_current - 2), 6, "COGNAC", "") || this.StringAt((this.m_current - 3), 7, "CHAGNON", "") || this.StringAt((this.m_current - 5), 9, "COMPAGNIE", "") || this.StringAt((this.m_current - 4), 6, "BOLOGN", "")) && !(this.StringAt((this.m_current + 2), 5, "ATION", "") || this.StringAt((this.m_current + 2), 4, "ATOR", "") || this.StringAt((this.m_current + 2), 3, "ATE", "ITY", "") || (this.StringAt((this.m_current + 2), 2, "AN", "AC", "IA", "UM", "") && !(this.StringAt((this.m_current - 3), 8, "POIGNANT", "") || this.StringAt((this.m_current - 2), 6, "COGNAC", ""))) || this.StringAt(0, 7, "SPIGNER", "STEGNER", "") || (this.StringAt(0, 5, "SIGNE", "") && (this.m_length === 5)) || this.StringAt((this.m_current - 2), 5, "LIGNI", "LIGNO", "REGNA", "DIGNI", "WEGNE", "TIGNE", "RIGNE", "REGNE", "TIGNO", "") || this.StringAt((this.m_current - 2), 6, "SIGNAL", "SIGNIF", "SIGNAT", "") || this.StringAt((this.m_current - 1), 5, "IGNIT", "")) && !this.StringAt((this.m_current - 2), 6, "SIGNET", "LIGNEO", ""))) || (((this.m_current + 2) === this.m_last) && this.StringAt(this.m_current, 3, "GNE", "GNA", "") && !this.StringAt((this.m_current - 2), 5, "SIGNA", "MAGNA", "SIGNE", ""))) {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("N", "GN", "N", "KN");
      } else {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String("GN", "KN");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-GL-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GL(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "LIA", "LIO", "LIE", "") && this.IsVowel$int(this.m_current - 1)) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("L", "GL", "L", "KL");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Initial_G_Soft(): boolean {
    if (((this.StringAt((this.m_current + 1), 2, "EL", "EM", "EN", "EO", "ER", "ES", "IA", "IN", "IO", "IP", "IU", "YM", "YN", "YP", "YR", "EE", "") || this.StringAt((this.m_current + 1), 3, "IRA", "IRO", "")) && !(this.StringAt((this.m_current + 1), 3, "ELD", "ELT", "ERT", "INZ", "ERH", "ITE", "ERD", "ERL", "ERN", "INT", "EES", "EEK", "ELB", "EER", "") || this.StringAt((this.m_current + 1), 4, "ERSH", "ERST", "INSB", "INGR", "EROW", "ERKE", "EREN", "") || this.StringAt((this.m_current + 1), 5, "ELLER", "ERDIE", "ERBER", "ESUND", "ESNER", "INGKO", "INKGO", "IPPER", "ESELL", "IPSON", "EEZER", "ERSON", "ELMAN", "") || this.StringAt((this.m_current + 1), 6, "ESTALT", "ESTAPO", "INGHAM", "ERRITY", "ERRISH", "ESSNER", "ENGLER", "") || this.StringAt((this.m_current + 1), 7, "YNAECOL", "YNECOLO", "ENTHNER", "ERAGHTY", "") || this.StringAt((this.m_current + 1), 8, "INGERICH", "EOGHEGAN", ""))) || (this.IsVowel$int(this.m_current + 1) && (this.StringAt((this.m_current + 1), 3, "EE ", "EEW", "") || (this.StringAt((this.m_current + 1), 3, "IGI", "IRA", "IBE", "AOL", "IDE", "IGL", "") && !this.StringAt((this.m_current + 1), 5, "IDEON", "")) || this.StringAt((this.m_current + 1), 4, "ILES", "INGI", "ISEL", "") || (this.StringAt((this.m_current + 1), 5, "INGER", "") && !this.StringAt((this.m_current + 1), 8, "INGERICH", "")) || this.StringAt((this.m_current + 1), 5, "IBBER", "IBBET", "IBLET", "IBRAN", "IGOLO", "IRARD", "IGANT", "") || this.StringAt((this.m_current + 1), 6, "IRAFFE", "EEWHIZ", "") || this.StringAt((this.m_current + 1), 7, "ILLETTE", "IBRALTA", "")))) {
      return true;
    }
    return false;
  }

  /**
   * Encode cases where 'G' is at start of word followed
   * by a "front" vowel e.g. 'E', 'I', 'Y'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_G_Front_Vowel(): boolean {
    if ((this.m_current === 0) && this.Front_Vowel(this.m_current + 1)) {
      if (this.StringAt((this.m_current + 1), 3, "ILA", "") && (this.m_length === 4)) {
        this.MetaphAdd$java_lang_String("H");
      } else if (this.Initial_G_Soft()) {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
      } else {
        if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.m_inWord.charAt(this.m_current + 1)) == 'E'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.m_inWord.charAt(this.m_current + 1)) == 'I'.charCodeAt(0))) {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        }
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-NGER-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_NGER(): boolean {
    if ((this.m_current > 1) && this.StringAt((this.m_current - 1), 4, "NGER", "")) {
      if (!(this.RootOrInflections(this.m_inWord, "ANGER") || this.RootOrInflections(this.m_inWord, "LINGER") || this.RootOrInflections(this.m_inWord, "MALINGER") || this.RootOrInflections(this.m_inWord, "FINGER") || (this.StringAt((this.m_current - 3), 4, "HUNG", "FING", "BUNG", "WING", "RING", "DING", "ZENG", "ZING", "JUNG", "LONG", "PING", "CONG", "MONG", "BANG", "GANG", "HANG", "LANG", "SANG", "SING", "WANG", "ZANG", "") && !(this.StringAt((this.m_current - 6), 7, "BOULANG", "SLESING", "KISSING", "DERRING", "") || this.StringAt((this.m_current - 8), 9, "SCHLESING", "") || this.StringAt((this.m_current - 5), 6, "SALING", "BELANG", "") || this.StringAt((this.m_current - 6), 7, "BARRING", "") || this.StringAt((this.m_current - 6), 9, "PHALANGER", "") || this.StringAt((this.m_current - 4), 5, "CHANG", ""))) || this.StringAt((this.m_current - 4), 5, "STING", "YOUNG", "") || this.StringAt((this.m_current - 5), 6, "STRONG", "") || this.StringAt(0, 3, "UNG", "ENG", "ING", "") || this.StringAt(this.m_current, 6, "GERICH", "") || this.StringAt(0, 6, "SENGER", "") || this.StringAt((this.m_current - 3), 6, "WENGER", "MUNGER", "SONGER", "KINGER", "") || this.StringAt((this.m_current - 4), 7, "FLINGER", "SLINGER", "STANGER", "STENGER", "KLINGER", "CLINGER", "") || this.StringAt((this.m_current - 5), 8, "SPRINGER", "SPRENGER", "") || this.StringAt((this.m_current - 3), 7, "LINGERF", "") || this.StringAt((this.m_current - 2), 7, "ANGERLY", "ANGERBO", "INGERSO", ""))) {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
      } else {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-GER-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GER(): boolean {
    if ((this.m_current > 0) && this.StringAt((this.m_current + 1), 2, "ER", "")) {
      if ((((this.m_current === 2) && this.IsVowel$int(this.m_current - 1) && !this.IsVowel$int(this.m_current - 2) && !(this.StringAt((this.m_current - 2), 5, "PAGER", "WAGER", "NIGER", "ROGER", "LEGER", "CAGER", "")) || this.StringAt((this.m_current - 2), 5, "AUGER", "EAGER", "INGER", "YAGER", "")) || this.StringAt((this.m_current - 3), 6, "SEEGER", "JAEGER", "GEIGER", "KRUGER", "SAUGER", "BURGER", "MEAGER", "MARGER", "RIEGER", "YAEGER", "STEGER", "PRAGER", "SWIGER", "YERGER", "TORGER", "FERGER", "HILGER", "ZEIGER", "YARGER", "COWGER", "CREGER", "KROGER", "KREGER", "GRAGER", "STIGER", "BERGER", "") || (this.StringAt((this.m_current - 3), 6, "BERGER", "") && ((this.m_current + 2) === this.m_last)) || this.StringAt((this.m_current - 4), 7, "KREIGER", "KRUEGER", "METZGER", "KRIEGER", "KROEGER", "STEIGER", "DRAEGER", "BUERGER", "BOERGER", "FIBIGER", "") || (this.StringAt((this.m_current - 3), 6, "BARGER", "") && (this.m_current > 4)) || (this.StringAt(this.m_current, 6, "GERBER", "") && (this.m_current > 0)) || this.StringAt((this.m_current - 5), 8, "SCHWAGER", "LYBARGER", "SPRENGER", "GALLAGER", "WILLIGER", "") || this.StringAt(0, 4, "HARGER", "") || (this.StringAt(0, 4, "AGER", "EGER", "") && (this.m_length === 4)) || this.StringAt((this.m_current - 1), 6, "YGERNE", "") || this.StringAt((this.m_current - 6), 9, "SCHWEIGER", "")) && !(this.StringAt((this.m_current - 5), 10, "BELLIGEREN", "") || this.StringAt(0, 7, "MARGERY", "") || this.StringAt((this.m_current - 3), 8, "BERGERAC", ""))) {
        if (this.SlavoGermanic()) {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
        }
      } else {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * ENcode "-GEL-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GEL(): boolean {
    if (this.StringAt((this.m_current + 1), 2, "EL", "") && (this.m_current > 0)) {
      if (((this.m_length === 5) && this.IsVowel$int(this.m_current - 1) && !this.IsVowel$int(this.m_current - 2) && !this.StringAt((this.m_current - 2), 5, "NIGEL", "RIGEL", "")) || this.StringAt((this.m_current - 2), 5, "ENGEL", "HEGEL", "NAGEL", "VOGEL", "") || this.StringAt((this.m_current - 3), 6, "MANGEL", "WEIGEL", "FLUGEL", "RANGEL", "HAUGEN", "RIEGEL", "VOEGEL", "") || this.StringAt((this.m_current - 4), 7, "SPEIGEL", "STEIGEL", "WRANGEL", "SPIEGEL", "") || this.StringAt((this.m_current - 4), 8, "DANEGELD", "")) {
        if (this.SlavoGermanic()) {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
        }
      } else {
        this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-G-" followed by a vowel when non-initial leter.
   * Default for this is a 'J' sound, so check exceptions where
   * it is pronounced 'G'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Non_Initial_G_Front_Vowel(): boolean {
    if (this.StringAt((this.m_current + 1), 1, "E", "I", "Y", "")) {
      if (this.StringAt(this.m_current, 2, "GE", "") && (this.m_current === (this.m_last - 1))) {
        if (this.Hard_GE_At_End()) {
          if (this.SlavoGermanic()) {
            this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
          } else {
            this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
          }
        } else {
          this.MetaphAdd$java_lang_String("J");
        }
      } else {
        if (this.Internal_Hard_G()) {
          if (!((this.m_current === 2) && this.StringAt(0, 2, "MC", "")) || ((this.m_current === 3) && this.StringAt(0, 3, "MAC", ""))) {
            if (this.SlavoGermanic()) {
              this.MetaphAddExactApprox$java_lang_String$java_lang_String("G", "K");
            } else {
              this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("G", "J", "K", "J");
            }
          }
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
        }
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  Hard_GE_At_End(): boolean {
    if (this.StringAt(0, 6, "RENEGE", "STONGE", "STANGE", "PRANGE", "KRESGE", "") || this.StringAt(0, 5, "BYRGE", "BIRGE", "BERGE", "HAUGE", "") || this.StringAt(0, 4, "HAGE", "") || this.StringAt(0, 5, "LANGE", "SYNGE", "BENGE", "RUNGE", "HELGE", "") || this.StringAt(0, 4, "INGE", "LAGE", "")) {
      return true;
    }
    return false;
  }

  /**
   * Exceptions to default encoding to 'J':
   * encode "-G-" to 'G' in "-g<frontvowel>-" words
   * where we are not at "-GE" at the end of the word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Internal_Hard_G(): boolean {
    if (!(((this.m_current + 1) === this.m_last) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'E'.charCodeAt(0))) && (this.Internal_Hard_NG() || this.Internal_Hard_GEN_GIN_GET_GIT() || this.Internal_Hard_G_Open_Syllable() || this.Internal_Hard_G_Other())) {
      return true;
    }
    return false;
  }

  /**
   * Detect words where "-ge-" or "-gi-" get a 'hard' 'g'
   * even though this is usually a 'soft' 'g' context
   *
   * @return {boolean} true if 'hard' 'g' detected
   *
   */
  Internal_Hard_G_Other(): boolean {
    if ((this.StringAt(this.m_current, 4, "GETH", "GEAR", "GEIS", "GIRL", "GIVI", "GIVE", "GIFT", "GIRD", "GIRT", "GILV", "GILD", "GELD", "") && !this.StringAt((this.m_current - 3), 6, "GINGIV", "")) || (this.StringAt((this.m_current + 1), 3, "ISH", "") && (this.m_current > 0) && !this.StringAt(0, 4, "LARG", "")) || (this.StringAt((this.m_current - 2), 5, "MAGED", "MEGID", "") && !((this.m_current + 2) === this.m_last)) || this.StringAt(this.m_current, 3, "GEZ", "") || this.StringAt(0, 4, "WEGE", "HAGE", "") || (this.StringAt((this.m_current - 2), 6, "ONGEST", "UNGEST", "") && ((this.m_current + 3) === this.m_last) && !this.StringAt((this.m_current - 3), 7, "CONGEST", "")) || this.StringAt(0, 5, "VOEGE", "BERGE", "HELGE", "") || (this.StringAt(0, 4, "ENGE", "BOGY", "") && (this.m_length === 4)) || this.StringAt(this.m_current, 6, "GIBBON", "") || this.StringAt(0, 10, "CORREGIDOR", "") || this.StringAt(0, 8, "INGEBORG", "") || (this.StringAt(this.m_current, 4, "GILL", "") && (((this.m_current + 3) === this.m_last) || ((this.m_current + 4) === this.m_last)) && !this.StringAt(0, 8, "STURGILL", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Detect words where "-gy-", "-gie-", "-gee-",
   * or "-gio-" get a 'hard' 'g' even though this is
   * usually a 'soft' 'g' context
   *
   * @return {boolean} true if 'hard' 'g' detected
   *
   */
  Internal_Hard_G_Open_Syllable(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "EYE", "") || this.StringAt((this.m_current - 2), 4, "FOGY", "POGY", "YOGI", "") || this.StringAt((this.m_current - 2), 5, "MAGEE", "MCGEE", "HAGIO", "") || this.StringAt((this.m_current - 1), 4, "RGEY", "OGEY", "") || this.StringAt((this.m_current - 3), 5, "HOAGY", "STOGY", "PORGY", "") || this.StringAt((this.m_current - 5), 8, "CARNEGIE", "") || (this.StringAt((this.m_current - 1), 4, "OGEY", "OGIE", "") && ((this.m_current + 2) === this.m_last))) {
      return true;
    }
    return false;
  }

  /**
   * Detect a number of contexts, mostly german names, that
   * take a 'hard' 'g'.
   *
   * @return {boolean} true if 'hard' 'g' detected, false if not
   *
   */
  Internal_Hard_GEN_GIN_GET_GIT(): boolean {
    if ((this.StringAt((this.m_current - 3), 6, "FORGET", "TARGET", "MARGIT", "MARGET", "TURGEN", "BERGEN", "MORGEN", "JORGEN", "HAUGEN", "JERGEN", "JURGEN", "LINGEN", "BORGEN", "LANGEN", "KLAGEN", "STIGER", "BERGER", "") && !this.StringAt(this.m_current, 7, "GENETIC", "GENESIS", "") && !this.StringAt((this.m_current - 4), 8, "PLANGENT", "")) || (this.StringAt((this.m_current - 3), 6, "BERGIN", "FEAGIN", "DURGIN", "") && ((this.m_current + 2) === this.m_last)) || (this.StringAt((this.m_current - 2), 5, "ENGEN", "") && !this.StringAt((this.m_current + 3), 3, "DER", "ETI", "ESI", "")) || this.StringAt((this.m_current - 4), 7, "JUERGEN", "") || this.StringAt(0, 5, "NAGIN", "MAGIN", "HAGIN", "") || (this.StringAt(0, 5, "ENGIN", "DEGEN", "LAGEN", "MAGEN", "NAGIN", "") && (this.m_length === 5)) || (this.StringAt((this.m_current - 2), 5, "BEGET", "BEGIN", "HAGEN", "FAGIN", "BOGEN", "WIGIN", "NTGEN", "EIGEN", "WEGEN", "WAGEN", "") && !this.StringAt((this.m_current - 5), 8, "OSPHAGEN", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Detect a number of contexts of '-ng-' that will
   * take a 'hard' 'g' despite being followed by a
   * front vowel.
   *
   * @return {boolean} true if 'hard' 'g' detected, false if not
   *
   */
  Internal_Hard_NG(): boolean {
    if ((this.StringAt((this.m_current - 3), 4, "DANG", "FANG", "SING", "") && !this.StringAt((this.m_current - 5), 8, "DISINGEN", "")) || this.StringAt(0, 5, "INGEB", "ENGEB", "") || (this.StringAt((this.m_current - 3), 4, "RING", "WING", "HANG", "LONG", "") && !(this.StringAt((this.m_current - 4), 5, "CRING", "FRING", "ORANG", "TWING", "CHANG", "PHANG", "") || this.StringAt((this.m_current - 5), 6, "SYRING", "") || this.StringAt((this.m_current - 3), 7, "RINGENC", "RINGENT", "LONGITU", "LONGEVI", "") || (this.StringAt(this.m_current, 4, "GELO", "GINO", "") && ((this.m_current + 3) === this.m_last)))) || (this.StringAt((this.m_current - 1), 3, "NGY", "") && !(this.StringAt((this.m_current - 3), 5, "RANGY", "MANGY", "MINGY", "") || this.StringAt((this.m_current - 4), 6, "SPONGY", "STINGY", "")))) {
      return true;
    }
    return false;
  }

  /**
   * Encode special case where "-GA-" => J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_GA_To_J(): boolean {
    if ((this.StringAt((this.m_current - 3), 7, "MARGARY", "MARGARI", "") && !this.StringAt((this.m_current - 3), 8, "MARGARIT", "")) || this.StringAt(0, 4, "GAOL", "") || this.StringAt((this.m_current - 2), 5, "ALGAE", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("J", "G", "J", "K");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode 'H'
   *
   *
   */
  Encode_H() {
    if (this.Encode_Initial_Silent_H() || this.Encode_Initial_HS() || this.Encode_Initial_HU_HW() || this.Encode_Non_Initial_Silent_H()) {
      return;
    }
    if (!this.Encode_H_Pronounced()) {
      this.m_current++;
    }
  }

  /**
   * Encode cases where initial 'H' is not pronounced (in American)
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_Silent_H(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "OUR", "ERB", "EIR", "") || this.StringAt((this.m_current + 1), 4, "ONOR", "") || this.StringAt((this.m_current + 1), 5, "ONOUR", "ONEST", "")) {
      if ((this.m_current === 0) && this.StringAt(this.m_current, 4, "HERB", "")) {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String$java_lang_String("HA", "A");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("H", "A");
        }
      } else if ((this.m_current === 0) || this.m_encodeVowels) {
        this.MetaphAdd$java_lang_String("A");
      }
      this.m_current++;
      this.m_current = this.SkipVowels(this.m_current);
      return true;
    }
    return false;
  }

  /**
   * Encode "HS-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_HS(): boolean {
    if ((this.m_current === 0) && this.StringAt(0, 2, "HS", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "HU-" is pronounced as part of a vowel dipthong
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_HU_HW(): boolean {
    if (this.StringAt(0, 3, "HUA", "HUE", "HWA", "")) {
      if (!this.StringAt(this.m_current, 4, "HUEY", "")) {
        this.MetaphAdd$java_lang_String("A");
        if (!this.m_encodeVowels) {
          this.m_current += 3;
        } else {
          this.m_current++;
          while ((this.IsVowel$int(this.m_current) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current)) == 'W'.charCodeAt(0)))) {
            {
              this.m_current++;
            }
          }
          ;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Encode cases where 'H' is silent between vowels
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Non_Initial_Silent_H(): boolean {
    if (this.StringAt((this.m_current - 2), 5, "NIHIL", "VEHEM", "LOHEN", "NEHEM", "MAHON", "MAHAN", "COHEN", "GAHAN", "") || this.StringAt((this.m_current - 3), 6, "GRAHAM", "PROHIB", "FRAHER", "TOOHEY", "TOUHEY", "") || this.StringAt((this.m_current - 3), 5, "TOUHY", "") || this.StringAt(0, 9, "CHIHUAHUA", "")) {
      if (!this.m_encodeVowels) {
        this.m_current += 2;
      } else {
        this.m_current++;
        this.m_current = this.SkipVowels(this.m_current);
      }
      return true;
    }
    return false;
  }

  /**
   * Encode cases where 'H' is pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_H_Pronounced(): boolean {
    if ((((this.m_current === 0) || this.IsVowel$int(this.m_current - 1) || ((this.m_current > 0) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current - 1)) == 'W'.charCodeAt(0)))) && this.IsVowel$int(this.m_current + 1)) || (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'H'.charCodeAt(0)) && this.IsVowel$int(this.m_current + 2))) {
      this.MetaphAdd$java_lang_String("H");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode 'J'
   *
   */
  Encode_J() {
    if (this.Encode_Spanish_J() || this.Encode_Spanish_OJ_UJ()) {
      return;
    }
    this.Encode_Other_J();
  }

  /**
   * Encode cases where initial or medial "j" is in a spanish word or name
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Spanish_J(): boolean {
    if ((this.StringAt((this.m_current + 1), 3, "UAN", "ACI", "ALI", "EFE", "ICA", "IME", "OAQ", "UAR", "") && !this.StringAt(this.m_current, 8, "JIMERSON", "JIMERSEN", "")) || (this.StringAt((this.m_current + 1), 3, "OSE", "") && ((this.m_current + 3) === this.m_last)) || this.StringAt((this.m_current + 1), 4, "EREZ", "UNTA", "AIME", "AVIE", "AVIA", "") || this.StringAt((this.m_current + 1), 6, "IMINEZ", "ARAMIL", "") || (((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current - 2), 5, "MEJIA", "")) || this.StringAt((this.m_current - 2), 5, "TEJED", "TEJAD", "LUJAN", "FAJAR", "BEJAR", "BOJOR", "CAJIG", "DEJAS", "DUJAR", "DUJAN", "MIJAR", "MEJOR", "NAJAR", "NOJOS", "RAJED", "RIJAL", "REJON", "TEJAN", "UIJAN", "") || this.StringAt((this.m_current - 3), 8, "ALEJANDR", "GUAJARDO", "TRUJILLO", "") || (this.StringAt((this.m_current - 2), 5, "RAJAS", "") && (this.m_current > 2)) || (this.StringAt((this.m_current - 2), 5, "MEJIA", "") && !this.StringAt((this.m_current - 2), 6, "MEJIAN", "")) || this.StringAt((this.m_current - 1), 5, "OJEDA", "") || this.StringAt((this.m_current - 3), 5, "LEIJA", "MINJA", "") || this.StringAt((this.m_current - 3), 6, "VIAJES", "GRAJAL", "") || this.StringAt(this.m_current, 8, "JAUREGUI", "") || this.StringAt((this.m_current - 4), 8, "HINOJOSA", "") || this.StringAt(0, 4, "SAN ", "") || (((this.m_current + 1) === this.m_last) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'O'.charCodeAt(0)) && !(this.StringAt(0, 4, "TOJO", "") || this.StringAt(0, 5, "BANJO", "") || this.StringAt(0, 6, "MARYJO", "")))) {
      if (!(this.StringAt(this.m_current, 4, "JUAN", "") || this.StringAt(this.m_current, 4, "JOAQ", ""))) {
        this.MetaphAdd$java_lang_String("H");
      } else {
        if (this.m_current === 0) {
          this.MetaphAdd$java_lang_String("A");
        }
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    if (this.StringAt((this.m_current + 1), 4, "ORGE", "ULIO", "ESUS", "") && !this.StringAt(0, 6, "JORGEN", "")) {
      if (((this.m_current + 4) === this.m_last) && this.StringAt((this.m_current + 1), 4, "ORGE", "")) {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String$java_lang_String("JARJ", "HARHA");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("JRJ", "HRH");
        }
        this.AdvanceCounter(5, 5);
        return true;
      }
      this.MetaphAdd$java_lang_String$java_lang_String("J", "H");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode cases where 'J' is clearly in a german word or name
   * that americans pronounce in the german fashion
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_German_J(): boolean {
    if (this.StringAt((this.m_current + 1), 2, "AH", "") || (this.StringAt((this.m_current + 1), 5, "OHANN", "") && ((this.m_current + 5) === this.m_last)) || (this.StringAt((this.m_current + 1), 3, "UNG", "") && !this.StringAt((this.m_current + 1), 4, "UNGL", "")) || this.StringAt((this.m_current + 1), 3, "UGO", "")) {
      this.MetaphAdd$java_lang_String("A");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-JOJ-" and "-JUJ-" as spanish words
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Spanish_OJ_UJ(): boolean {
    if (this.StringAt((this.m_current + 1), 5, "OJOBA", "UJUY ", "")) {
      if (this.m_encodeVowels) {
        this.MetaphAdd$java_lang_String("HAH");
      } else {
        this.MetaphAdd$java_lang_String("HH");
      }
      this.AdvanceCounter(4, 3);
      return true;
    }
    return false;
  }

  /**
   * Encode 'J' => J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_J_To_J(): boolean {
    if (this.IsVowel$int(this.m_current + 1)) {
      if ((this.m_current === 0) && this.Names_Beginning_With_J_That_Get_Alt_Y()) {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String$java_lang_String("JA", "A");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("J", "A");
        }
      } else {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String("JA");
        } else {
          this.MetaphAdd$java_lang_String("J");
        }
      }
      this.m_current++;
      this.m_current = this.SkipVowels(this.m_current);
      return false;
    } else {
      this.MetaphAdd$java_lang_String("J");
      this.m_current++;
      return true;
    }
  }

  /**
   * Encode 'J' toward end in spanish words
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Spanish_J_2(): boolean {
    if ((((this.m_current - 2) === 0) && this.StringAt((this.m_current - 2), 4, "BOJA", "BAJA", "BEJA", "BOJO", "MOJA", "MOJI", "MEJI", "")) || (((this.m_current - 3) === 0) && this.StringAt((this.m_current - 3), 5, "FRIJO", "BRUJO", "BRUJA", "GRAJE", "GRIJA", "LEIJA", "QUIJA", "")) || (((this.m_current + 3) === this.m_last) && this.StringAt((this.m_current - 1), 5, "AJARA", "")) || (((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current - 1), 4, "AJOS", "EJOS", "OJAS", "OJOS", "UJON", "AJOZ", "AJAL", "UJAR", "EJON", "EJAN", "")) || (((this.m_current + 1) === this.m_last) && (this.StringAt((this.m_current - 1), 3, "OJA", "EJA", "") && !this.StringAt(0, 4, "DEJA", "")))) {
      this.MetaphAdd$java_lang_String("H");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode 'J' as vowel in some exception cases
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_J_As_Vowel(): boolean {
    if (this.StringAt(this.m_current, 5, "JEWSK", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("J", "");
      return true;
    }
    if ((this.StringAt((this.m_current + 1), 1, "L", "T", "K", "S", "N", "M", "") && !this.StringAt((this.m_current + 2), 1, "A", "")) || this.StringAt(0, 9, "HALLELUJA", "LJUBLJANA", "") || this.StringAt(0, 4, "LJUB", "BJOR", "") || this.StringAt(0, 5, "HAJEK", "") || this.StringAt(0, 3, "WOJ", "") || this.StringAt(0, 2, "FJ", "") || this.StringAt(this.m_current, 5, "JAVIK", "JEVIC", "") || (((this.m_current + 1) === this.m_last) && this.StringAt(0, 5, "SONJA", "TANJA", "TONJA", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Call routines to encode 'J', in proper order
   *
   */
  Encode_Other_J() {
    if (this.m_current === 0) {
      if (this.Encode_German_J()) {
        return;
      } else {
        if (this.Encode_J_To_J()) {
          return;
        }
      }
    } else {
      if (this.Encode_Spanish_J_2()) {
        return;
      } else if (!this.Encode_J_As_Vowel()) {
        this.MetaphAdd$java_lang_String("J");
      }
      if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'J'.charCodeAt(0)) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
    }
  }

  /**
   * Encode 'K'
   *
   *
   */
  Encode_K() {
    if (!this.Encode_Silent_K()) {
      this.MetaphAdd$java_lang_String("K");
      if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'K'.charCodeAt(0)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'Q'.charCodeAt(0))) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
    }
  }

  /**
   * Encode cases where 'K' is not pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_K(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "KN", "")) {
      if (!(this.StringAt((this.m_current + 2), 5, "ESSET", "IEVEL", "") || this.StringAt((this.m_current + 2), 3, "ISH", ""))) {
        this.m_current += 1;
        return true;
      }
    }
    if ((this.StringAt((this.m_current + 1), 3, "NOW", "NIT", "NOT", "NOB", "") && !this.StringAt(0, 8, "BANKNOTE", "")) || this.StringAt((this.m_current + 1), 4, "NOCK", "NUCK", "NIFE", "NACK", "") || this.StringAt((this.m_current + 1), 5, "NIGHT", "")) {
      if ((this.m_current > 0) && (c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current - 1)) == 'N'.charCodeAt(0)) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode 'L'
   *
   * Includes special vowel transposition
   * encoding, where 'LE' => AL
   *
   */
  Encode_L() {
    let save_current: number = this.m_current;
    this.Interpolate_Vowel_When_Cons_L_At_End();
    if (this.Encode_LELY_To_L() || this.Encode_COLONEL() || this.Encode_French_AULT() || this.Encode_French_EUIL() || this.Encode_French_OULX() || this.Encode_Silent_L_In_LM() || this.Encode_Silent_L_In_LK_LV() || this.Encode_Silent_L_In_OULD()) {
      return;
    }
    if (this.Encode_LL_As_Vowel_Cases()) {
      return;
    }
    this.Encode_LE_Cases(save_current);
  }

  /**
   * Cases where an L follows D, G, or T at the
   * end have a schwa pronounced before the L
   *
   */
  Interpolate_Vowel_When_Cons_L_At_End() {
    if (this.m_encodeVowels === true) {
      if ((this.m_current === this.m_last) && this.StringAt((this.m_current - 1), 1, "D", "G", "T", "")) {
        this.MetaphAdd$java_lang_String("A");
      }
    }
  }

  /**
   * Catch cases where 'L' spelled twice but pronounced
   * once, e.g., 'DOCILELY' => TSL
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_LELY_To_L(): boolean {
    if (this.StringAt((this.m_current - 1), 5, "ILELY", "") && ((this.m_current + 3) === this.m_last)) {
      this.MetaphAdd$java_lang_String("L");
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode special case "colonel" => KRNL. Can somebody tell
   * me how this pronounciation came to be?
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_COLONEL(): boolean {
    if (this.StringAt((this.m_current - 2), 7, "COLONEL", "")) {
      this.MetaphAdd$java_lang_String("R");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-AULT-", found in a french names
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_French_AULT(): boolean {
    if ((this.m_current > 3) && (this.StringAt((this.m_current - 3), 5, "RAULT", "NAULT", "BAULT", "SAULT", "GAULT", "CAULT", "") || this.StringAt((this.m_current - 4), 6, "REAULT", "RIAULT", "NEAULT", "BEAULT", "")) && !(this.RootOrInflections(this.m_inWord, "ASSAULT") || this.StringAt((this.m_current - 8), 10, "SOMERSAULT", "") || this.StringAt((this.m_current - 9), 11, "SUMMERSAULT", ""))) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-EUIL-", always found in a french word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_French_EUIL(): boolean {
    if (this.StringAt((this.m_current - 3), 4, "EUIL", "") && (this.m_current === this.m_last)) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-OULX", always found in a french word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_French_OULX(): boolean {
    if (this.StringAt((this.m_current - 2), 4, "OULX", "") && ((this.m_current + 1) === this.m_last)) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encodes contexts where 'L' is not pronounced in "-LM-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_L_In_LM(): boolean {
    if (this.StringAt(this.m_current, 2, "LM", "LN", "")) {
      if ((this.StringAt((this.m_current - 2), 4, "COLN", "CALM", "BALM", "MALM", "PALM", "") || (this.StringAt((this.m_current - 1), 3, "OLM", "") && ((this.m_current + 1) === this.m_last)) || this.StringAt((this.m_current - 3), 5, "PSALM", "QUALM", "") || this.StringAt((this.m_current - 2), 6, "SALMON", "HOLMES", "") || this.StringAt((this.m_current - 1), 6, "ALMOND", "") || ((this.m_current === 1) && this.StringAt((this.m_current - 1), 4, "ALMS", ""))) && (!this.StringAt((this.m_current + 2), 1, "A", "") && !this.StringAt((this.m_current - 2), 5, "BALMO", "") && !this.StringAt((this.m_current - 2), 6, "PALMER", "PALMOR", "BALMER", "") && !this.StringAt((this.m_current - 3), 5, "THALM", ""))) {
        this.m_current++;
        return true;
      } else {
        this.MetaphAdd$java_lang_String("L");
        this.m_current++;
        return true;
      }
    }
    return false;
  }

  /**
   * Encodes contexts where '-L-' is silent in 'LK', 'LV'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_L_In_LK_LV(): boolean {
    if ((this.StringAt((this.m_current - 2), 4, "WALK", "YOLK", "FOLK", "HALF", "TALK", "CALF", "BALK", "CALK", "") || (this.StringAt((this.m_current - 2), 4, "POLK", "") && !this.StringAt((this.m_current - 2), 5, "POLKA", "WALKO", "")) || (this.StringAt((this.m_current - 2), 4, "HALV", "") && !this.StringAt((this.m_current - 2), 5, "HALVA", "HALVO", "")) || (this.StringAt((this.m_current - 3), 5, "CAULK", "CHALK", "BAULK", "FAULK", "") && !this.StringAt((this.m_current - 4), 6, "SCHALK", "")) || (this.StringAt((this.m_current - 2), 5, "SALVE", "CALVE", "") || this.StringAt((this.m_current - 2), 6, "SOLDER", "")) && !this.StringAt((this.m_current - 2), 6, "SALVER", "CALVER", "")) && !this.StringAt((this.m_current - 5), 9, "GONSALVES", "GONCALVES", "") && !this.StringAt((this.m_current - 2), 6, "BALKAN", "TALKAL", "") && !this.StringAt((this.m_current - 3), 5, "PAULK", "CHALF", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode 'L' in contexts of "-OULD-" where it is silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_L_In_OULD(): boolean {
    if (this.StringAt((this.m_current - 3), 5, "WOULD", "COULD", "") || (this.StringAt((this.m_current - 4), 6, "SHOULD", "") && !this.StringAt((this.m_current - 4), 8, "SHOULDER", ""))) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("D", "T");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-ILLA-" and "-ILLE-" in spanish and french
   * contexts were americans know to pronounce it as a 'Y'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_LL_As_Vowel_Special_Cases(): boolean {
    if (this.StringAt((this.m_current - 5), 8, "TORTILLA", "") || this.StringAt((this.m_current - 8), 11, "RATATOUILLE", "") || (this.StringAt(0, 5, "GUILL", "VEILL", "GAILL", "") && !(this.StringAt((this.m_current - 3), 7, "GUILLOT", "GUILLOR", "GUILLEN", "") || (this.StringAt(0, 5, "GUILL", "") && (this.m_length === 5)))) || this.StringAt(0, 7, "BROUILL", "GREMILL", "ROBILL", "") || (this.StringAt((this.m_current - 2), 5, "EILLE", "") && ((this.m_current + 2) === this.m_last) && !this.StringAt((this.m_current - 5), 8, "REVEILLE", ""))) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode other spanish cases where "-LL-" is pronounced as 'Y'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_LL_As_Vowel(): boolean {
    if ((((this.m_current + 3) === this.m_length) && this.StringAt((this.m_current - 1), 4, "ILLO", "ILLA", "ALLE", "")) || (((this.StringAt((this.m_last - 1), 2, "AS", "OS", "") || this.StringAt(this.m_last, 2, "AS", "OS", "") || this.StringAt(this.m_last, 1, "A", "O", "")) && this.StringAt((this.m_current - 1), 2, "AL", "IL", "")) && !this.StringAt((this.m_current - 1), 4, "ALLA", "")) || this.StringAt(0, 5, "VILLE", "VILLA", "") || this.StringAt(0, 8, "GALLARDO", "VALLADAR", "MAGALLAN", "CAVALLAR", "BALLASTE", "") || this.StringAt(0, 3, "LLA", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("L", "");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Call routines to encode "-LL-", in proper order
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_LL_As_Vowel_Cases(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'L'.charCodeAt(0)) {
      if (this.Encode_LL_As_Vowel_Special_Cases()) {
        return true;
      } else if (this.Encode_LL_As_Vowel()) {
        return true;
      }
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    return false;
  }

  /**
   * Encode vowel-encoding cases where "-LE-" is pronounced "-EL-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   * @param {number} save_current
   */
  Encode_Vowel_LE_Transposition(save_current: number): boolean {
    if (this.m_encodeVowels && (save_current > 1) && !this.IsVowel$int(save_current - 1) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current + 1)) == 'E'.charCodeAt(0)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current - 1)) != 'L'.charCodeAt(0)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current - 1)) != 'R'.charCodeAt(0)) && !this.IsVowel$int(save_current + 2) && !this.StringAt(0, 7, "ECCLESI", "COMPLEC", "COMPLEJ", "ROBLEDO", "") && !this.StringAt(0, 5, "MCCLE", "MCLEL", "") && !this.StringAt(0, 6, "EMBLEM", "KADLEC", "") && !(((save_current + 2) === this.m_last) && this.StringAt(save_current, 3, "LET", "")) && !this.StringAt(save_current, 7, "LETTING", "") && !this.StringAt(save_current, 6, "LETELY", "LETTER", "LETION", "LETIAN", "LETING", "LETORY", "") && !this.StringAt(save_current, 5, "LETUS", "LETIV", "") && !this.StringAt(save_current, 4, "LESS", "LESQ", "LECT", "LEDG", "LETE", "LETH", "LETS", "LETT", "") && !this.StringAt(save_current, 3, "LEG", "LER", "LEX", "") && !(this.StringAt(save_current, 6, "LEMENT", "") && !(this.StringAt((this.m_current - 5), 6, "BATTLE", "TANGLE", "PUZZLE", "RABBLE", "BABBLE", "") || this.StringAt((this.m_current - 4), 5, "TABLE", ""))) && !(((save_current + 2) === this.m_last) && this.StringAt((save_current - 2), 5, "OCLES", "ACLES", "AKLES", "")) && !this.StringAt((save_current - 3), 5, "LISLE", "AISLE", "") && !this.StringAt(0, 4, "ISLE", "") && !this.StringAt(0, 6, "ROBLES", "") && !this.StringAt((save_current - 4), 7, "PROBLEM", "RESPLEN", "") && !this.StringAt((save_current - 3), 6, "REPLEN", "") && !this.StringAt((save_current - 2), 4, "SPLE", "") && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current - 1)) != 'H'.charCodeAt(0)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current - 1)) != 'W'.charCodeAt(0))) {
      this.MetaphAdd$java_lang_String("AL");
      this.flag_AL_inversion = true;
      if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current + 2)) == 'L'.charCodeAt(0)) {
        this.m_current = save_current + 3;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode special vowel-encoding cases where 'E' is not
   * silent at the end of a word as is the usual case
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   * @param {number} save_current
   */
  Encode_Vowel_Preserve_Vowel_After_L(save_current: number): boolean {
    if (this.m_encodeVowels && !this.IsVowel$int(save_current - 1) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(save_current + 1)) == 'E'.charCodeAt(0)) && (save_current > 1) && ((save_current + 1) !== this.m_last) && !(this.StringAt((save_current + 1), 2, "ES", "ED", "") && ((save_current + 2) === this.m_last)) && !this.StringAt((save_current - 1), 5, "RLEST", "")) {
      this.MetaphAdd$java_lang_String("LA");
      this.m_current = this.SkipVowels(this.m_current);
      return true;
    }
    return false;
  }

  /**
   * Call routines to encode "-LE-", in proper order
   *
   * @param {number} save_current index of actual current letter
   */
  Encode_LE_Cases(save_current: number) {
    if (this.Encode_Vowel_LE_Transposition(save_current)) {
      return;
    } else {
      if (this.Encode_Vowel_Preserve_Vowel_After_L(save_current)) {
        return;
      } else {
        this.MetaphAdd$java_lang_String("L");
      }
    }
  }

  /**
   * Encode "-M-"
   *
   */
  Encode_M() {
    if (this.Encode_Silent_M_At_Beginning() || this.Encode_MR_And_MRS() || this.Encode_MAC() || this.Encode_MPT()) {
      return;
    }
    this.Encode_MB();
    this.MetaphAdd$java_lang_String("M");
  }

  /**
   * Encode cases where 'M' is silent at beginning of word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_M_At_Beginning(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "MN", "")) {
      this.m_current += 1;
      return true;
    }
    return false;
  }

  /**
   * Encode special cases "Mr." and "Mrs."
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_MR_And_MRS(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "MR", "")) {
      if ((this.m_length === 2) && this.StringAt(this.m_current, 2, "MR", "")) {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String("MASTAR");
        } else {
          this.MetaphAdd$java_lang_String("MSTR");
        }
        this.m_current += 2;
        return true;
      } else if ((this.m_length === 3) && this.StringAt(this.m_current, 3, "MRS", "")) {
        if (this.m_encodeVowels) {
          this.MetaphAdd$java_lang_String("MASAS");
        } else {
          this.MetaphAdd$java_lang_String("MSS");
        }
        this.m_current += 3;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode "Mac-" and "Mc-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_MAC(): boolean {
    if ((this.m_current === 0) && (this.StringAt(0, 7, "MACIVER", "MACEWEN", "") || this.StringAt(0, 8, "MACELROY", "MACILROY", "") || this.StringAt(0, 9, "MACINTOSH", "") || this.StringAt(0, 2, "MC", ""))) {
      if (this.m_encodeVowels) {
        this.MetaphAdd$java_lang_String("MAK");
      } else {
        this.MetaphAdd$java_lang_String("MK");
      }
      if (this.StringAt(0, 2, "MC", "")) {
        if (this.StringAt((this.m_current + 2), 1, "K", "G", "Q", "") && !this.StringAt((this.m_current + 2), 4, "GEOR", "")) {
          this.m_current += 3;
        } else {
          this.m_current += 2;
        }
      } else {
        this.m_current += 3;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode silent 'M' in context of "-MPT-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_MPT(): boolean {
    if (this.StringAt((this.m_current - 2), 8, "COMPTROL", "") || this.StringAt((this.m_current - 4), 7, "ACCOMPT", "")) {
      this.MetaphAdd$java_lang_String("N");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Test if 'B' is silent in these contexts
   *
   * @return {boolean} true if 'B' is silent in this context
   *
   */
  Test_Silent_MB_1(): boolean {
    if (((this.m_current === 3) && this.StringAt((this.m_current - 3), 5, "THUMB", "")) || ((this.m_current === 2) && this.StringAt((this.m_current - 2), 4, "DUMB", "BOMB", "DAMN", "LAMB", "NUMB", "TOMB", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Test if 'B' is pronounced in this context
   *
   * @return {boolean} true if 'B' is pronounced in this context
   *
   */
  Test_Pronounced_MB(): boolean {
    if (this.StringAt((this.m_current - 2), 6, "NUMBER", "") || (this.StringAt((this.m_current + 2), 1, "A", "") && !this.StringAt((this.m_current - 2), 7, "DUMBASS", "")) || this.StringAt((this.m_current + 2), 1, "O", "") || this.StringAt((this.m_current - 2), 6, "LAMBEN", "LAMBER", "LAMBET", "TOMBIG", "LAMBRE", "")) {
      return true;
    }
    return false;
  }

  /**
   * Test whether "-B-" is silent in these contexts
   *
   * @return {boolean} true if 'B' is silent in this context
   *
   */
  Test_Silent_MB_2(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'B'.charCodeAt(0)) && (this.m_current > 1) && (((this.m_current + 1) === this.m_last) || this.StringAt((this.m_current + 2), 3, "ING", "ABL", "") || this.StringAt((this.m_current + 2), 4, "LIKE", "") || (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'S'.charCodeAt(0)) && ((this.m_current + 2) === this.m_last)) || this.StringAt((this.m_current - 5), 7, "BUNCOMB", "") || (this.StringAt((this.m_current + 2), 2, "ED", "ER", "") && ((this.m_current + 3) === this.m_last) && (this.StringAt(0, 5, "CLIMB", "PLUMB", "") || !this.StringAt((this.m_current - 1), 5, "IMBER", "AMBER", "EMBER", "UMBER", "")) && !this.StringAt((this.m_current - 2), 6, "CUMBER", "SOMBER", "")))) {
      return true;
    }
    return false;
  }

  /**
   * Test if 'B' is pronounced in these "-MB-" contexts
   *
   * @return {boolean} true if "-B-" is pronounced in these contexts
   *
   */
  Test_Pronounced_MB_2(): boolean {
    if (this.StringAt((this.m_current - 1), 5, "OMBAS", "OMBAD", "UMBRA", "") || this.StringAt((this.m_current - 3), 4, "FLAM", "")) {
      return true;
    }
    return false;
  }

  /**
   * Tests for contexts where "-N-" is silent when after "-M-"
   *
   * @return {boolean} true if "-N-" is silent in these contexts
   *
   */
  Test_MN(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'N'.charCodeAt(0)) && (((this.m_current + 1) === this.m_last) || (this.StringAt((this.m_current + 2), 3, "ING", "EST", "") && ((this.m_current + 4) === this.m_last)) || (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'S'.charCodeAt(0)) && ((this.m_current + 2) === this.m_last)) || (this.StringAt((this.m_current + 2), 2, "LY", "ER", "ED", "") && ((this.m_current + 3) === this.m_last)) || this.StringAt((this.m_current - 2), 9, "DAMNEDEST", "") || this.StringAt((this.m_current - 5), 9, "GODDAMNIT", ""))) {
      return true;
    }
    return false;
  }

  /**
   * Call routines to encode "-MB-", in proper order
   *
   */
  Encode_MB() {
    if (this.Test_Silent_MB_1()) {
      if (this.Test_Pronounced_MB()) {
        this.m_current++;
      } else {
        this.m_current += 2;
      }
    } else if (this.Test_Silent_MB_2()) {
      if (this.Test_Pronounced_MB_2()) {
        this.m_current++;
      } else {
        this.m_current += 2;
      }
    } else if (this.Test_MN()) {
      this.m_current += 2;
    } else {
      if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'M'.charCodeAt(0)) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
    }
  }

  /**
   * Encode "-N-"
   *
   */
  Encode_N() {
    if (this.Encode_NCE()) {
      return;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'N'.charCodeAt(0)) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    if (!this.StringAt((this.m_current - 3), 8, "MONSIEUR", "") && !this.StringAt((this.m_current - 3), 6, "NENESS", "")) {
      this.MetaphAdd$java_lang_String("N");
    }
  }

  /**
   * Encode "-NCE-" and "-NSE-"
   * "entrance" is pronounced exactly the same as "entrants"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_NCE(): boolean {
    if (this.StringAt((this.m_current + 1), 1, "C", "S", "") && this.StringAt((this.m_current + 2), 1, "E", "Y", "I", "") && (((this.m_current + 2) === this.m_last) || (((this.m_current + 3) === this.m_last)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 3)) == 'S'.charCodeAt(0)))) {
      this.MetaphAdd$java_lang_String("NTS");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-P-"
   *
   */
  Encode_P() {
    if (this.Encode_Silent_P_At_Beginning() || this.Encode_PT() || this.Encode_PH() || this.Encode_PPH() || this.Encode_RPS() || this.Encode_COUP() || this.Encode_PNEUM() || this.Encode_PSYCH() || this.Encode_PSALM()) {
      return;
    }
    this.Encode_PB();
    this.MetaphAdd$java_lang_String("P");
  }

  /**
   * Encode cases where "-P-" is silent at the start of a word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_P_At_Beginning(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "PN", "PF", "PS", "PT", "")) {
      this.m_current += 1;
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "-P-" is silent before "-T-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PT(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'T'.charCodeAt(0))) {
      if (((this.m_current === 0) && this.StringAt(this.m_current, 5, "PTERO", "")) || this.StringAt((this.m_current - 5), 7, "RECEIPT", "") || this.StringAt((this.m_current - 4), 8, "ASYMPTOT", "")) {
        this.MetaphAdd$java_lang_String("T");
        this.m_current += 2;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode "-PH-", usually as F, with exceptions for
   * cases where it is silent, or where the 'P' and 'T'
   * are pronounced seperately because they belong to
   * two different words in a combining form
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PH(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'H'.charCodeAt(0)) {
      if (this.StringAt(this.m_current, 9, "PHTHALEIN", "") || ((this.m_current === 0) && this.StringAt(this.m_current, 4, "PHTH", "")) || this.StringAt((this.m_current - 3), 10, "APOPHTHEGM", "")) {
        this.MetaphAdd$java_lang_String("0");
        this.m_current += 4;
      } else if ((this.m_current > 0) && (this.StringAt((this.m_current + 2), 3, "EAD", "OLE", "ELD", "ILL", "OLD", "EAP", "ERD", "ARD", "ANG", "ORN", "EAV", "ART", "") || this.StringAt((this.m_current + 2), 4, "OUSE", "") || (this.StringAt((this.m_current + 2), 2, "AM", "") && !this.StringAt((this.m_current - 1), 5, "LPHAM", "")) || this.StringAt((this.m_current + 2), 5, "AMMER", "AZARD", "UGGER", "") || this.StringAt((this.m_current + 2), 6, "OLSTER", "")) && !this.StringAt((this.m_current - 3), 5, "LYMPH", "NYMPH", "")) {
        this.MetaphAdd$java_lang_String("P");
        this.AdvanceCounter(3, 2);
      } else {
        this.MetaphAdd$java_lang_String("F");
        this.m_current += 2;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode "-PPH-". I don't know why the greek poet's
   * name is transliterated this way...
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PPH(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'P'.charCodeAt(0)) && ((this.m_current + 2) < this.m_length) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'H'.charCodeAt(0))) {
      this.MetaphAdd$java_lang_String("F");
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode "-CORPS-" where "-PS-" not pronounced
   * since the cognate is here from the french
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_RPS(): boolean {
    if (this.StringAt((this.m_current - 3), 5, "CORPS", "") && !this.StringAt((this.m_current - 3), 6, "CORPSE", "")) {
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-COUP-" where "-P-" is not pronounced
   * since the word is from the french
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_COUP(): boolean {
    if ((this.m_current === this.m_last) && this.StringAt((this.m_current - 3), 4, "COUP", "") && !this.StringAt((this.m_current - 5), 6, "RECOUP", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode 'P' in non-initial contexts of "-PNEUM-"
   * where is also silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PNEUM(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "NEUM", "")) {
      this.MetaphAdd$java_lang_String("N");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode special case "-PSYCH-" where two encodings need to be
   * accounted for in one syllable, one for the 'PS' and one for
   * the 'CH'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PSYCH(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "SYCH", "")) {
      if (this.m_encodeVowels) {
        this.MetaphAdd$java_lang_String("SAK");
      } else {
        this.MetaphAdd$java_lang_String("SK");
      }
      this.m_current += 5;
      return true;
    }
    return false;
  }

  /**
   * Encode 'P' in context of "-PSALM-", where it has
   * become silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_PSALM(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "SALM", "")) {
      if (this.m_encodeVowels) {
        this.MetaphAdd$java_lang_String("SAM");
      } else {
        this.MetaphAdd$java_lang_String("SM");
      }
      this.m_current += 5;
      return true;
    }
    return false;
  }

  /**
   * Eat redundant 'B' or 'P'
   */
  Encode_PB() {
    if (this.StringAt((this.m_current + 1), 1, "P", "B", "")) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encode "-Q-"
   *
   */
  Encode_Q() {
    if (this.StringAt(this.m_current, 3, "QIN", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current++;
      return;
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'Q'.charCodeAt(0)) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    this.MetaphAdd$java_lang_String("K");
  }

  /**
   * Encode "-R-"
   *
   */
  Encode_R() {
    if (this.Encode_RZ()) {
      return;
    }
    if (!this.Test_Silent_R()) {
      if (!this.Encode_Vowel_RE_Transposition()) {
        this.MetaphAdd$java_lang_String("R");
      }
    }
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'R'.charCodeAt(0)) || this.StringAt((this.m_current - 6), 8, "POITIERS", "")) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encode "-RZ-" according
   * to american and polish pronunciations
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_RZ(): boolean {
    if (this.StringAt((this.m_current - 2), 4, "GARZ", "KURZ", "MARZ", "MERZ", "HERZ", "PERZ", "WARZ", "") || this.StringAt(this.m_current, 5, "RZANO", "RZOLA", "") || this.StringAt((this.m_current - 1), 4, "ARZA", "ARZN", "")) {
      return false;
    }
    if (this.StringAt((this.m_current - 4), 11, "YASTRZEMSKI", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("R", "X");
      this.m_current += 2;
      return true;
    }
    if (this.StringAt((this.m_current - 1), 10, "BRZEZINSKI", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("RS", "RJ");
      this.m_current += 4;
      return true;
    } else if (this.StringAt((this.m_current - 1), 3, "TRZ", "PRZ", "KRZ", "") || (this.StringAt(this.m_current, 2, "RZ", "") && (this.IsVowel$int(this.m_current - 1) || (this.m_current === 0)))) {
      this.MetaphAdd$java_lang_String$java_lang_String("RS", "X");
      this.m_current += 2;
      return true;
    } else if (this.StringAt((this.m_current - 1), 3, "BRZ", "DRZ", "GRZ", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("RS", "J");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Test whether 'R' is silent in this context
   *
   * @return {boolean} true if 'R' is silent in this context
   *
   */
  Test_Silent_R(): boolean {
    if (((this.m_current === this.m_last) && this.StringAt((this.m_current - 2), 3, "IER", "") && (this.StringAt((this.m_current - 5), 3, "MET", "VIV", "LUC", "") || this.StringAt((this.m_current - 6), 4, "CART", "DOSS", "FOUR", "OLIV", "BUST", "DAUM", "ATEL", "SONN", "CORM", "MERC", "PELT", "POIR", "BERN", "FORT", "GREN", "SAUC", "GAGN", "GAUT", "GRAN", "FORC", "MESS", "LUSS", "MEUN", "POTH", "HOLL", "CHEN", "") || this.StringAt((this.m_current - 7), 5, "CROUP", "TORCH", "CLOUT", "FOURN", "GAUTH", "TROTT", "DEROS", "CHART", "") || this.StringAt((this.m_current - 8), 6, "CHEVAL", "LAVOIS", "PELLET", "SOMMEL", "TREPAN", "LETELL", "COLOMB", "") || this.StringAt((this.m_current - 9), 7, "CHARCUT", "") || this.StringAt((this.m_current - 10), 8, "CHARPENT", ""))) || this.StringAt((this.m_current - 2), 7, "SURBURB", "WORSTED", "") || this.StringAt((this.m_current - 2), 9, "WORCESTER", "") || this.StringAt((this.m_current - 7), 8, "MONSIEUR", "") || this.StringAt((this.m_current - 6), 8, "POITIERS", "")) {
      return true;
    }
    return false;
  }

  /**
   * Encode '-re-" as 'AR' in contexts
   * where this is the correct pronunciation
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Vowel_RE_Transposition(): boolean {
    if ((this.m_encodeVowels) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'E'.charCodeAt(0)) && (this.m_length > 3) && !this.StringAt(0, 5, "OUTRE", "LIBRE", "ANDRE", "") && !(this.StringAt(0, 4, "FRED", "TRES", "") && (this.m_length === 4)) && !this.StringAt((this.m_current - 2), 5, "LDRED", "LFRED", "NDRED", "NFRED", "NDRES", "TRES", "IFRED", "") && !this.IsVowel$int(this.m_current - 1) && (((this.m_current + 1) === this.m_last) || (((this.m_current + 2) === this.m_last) && this.StringAt((this.m_current + 2), 1, "D", "S", "")))) {
      this.MetaphAdd$java_lang_String("AR");
      return true;
    }
    return false;
  }

  /**
   * Encode "-S-"
   *
   */
  Encode_S() {
    if (this.Encode_SKJ() || this.Encode_Special_SW() || this.Encode_SJ() || this.Encode_Silent_French_S_Final() || this.Encode_Silent_French_S_Internal() || this.Encode_ISL() || this.Encode_STL() || this.Encode_Christmas() || this.Encode_STHM() || this.Encode_ISTEN() || this.Encode_Sugar() || this.Encode_SH() || this.Encode_SCH() || this.Encode_SUR() || this.Encode_SU() || this.Encode_SSIO() || this.Encode_SS() || this.Encode_SIA() || this.Encode_SIO() || this.Encode_Anglicisations() || this.Encode_SC() || this.Encode_SEA_SUI_SIER() || this.Encode_SEA()) {
      return;
    }
    this.MetaphAdd$java_lang_String("S");
    if (this.StringAt((this.m_current + 1), 1, "S", "Z", "") && !this.StringAt((this.m_current + 1), 2, "SH", "")) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encode a couple of contexts where scandinavian, slavic
   * or german names should get an alternate, native
   * pronunciation of 'SV' or 'XV'
   *
   * @return {boolean} true if handled
   *
   */
  Encode_Special_SW(): boolean {
    if (this.m_current === 0) {
      if (this.Names_Beginning_With_SW_That_Get_Alt_SV()) {
        this.MetaphAdd$java_lang_String$java_lang_String("S", "SV");
        this.m_current += 2;
        return true;
      }
      if (this.Names_Beginning_With_SW_That_Get_Alt_XV()) {
        this.MetaphAdd$java_lang_String$java_lang_String("S", "XV");
        this.m_current += 2;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode "-SKJ-" as X ("sh"), since americans pronounce
   * the name Dag Hammerskjold as "hammer-shold"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SKJ(): boolean {
    if (this.StringAt(this.m_current, 4, "SKJO", "SKJU", "") && this.IsVowel$int(this.m_current + 3)) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode initial swedish "SJ-" as X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SJ(): boolean {
    if (this.StringAt(0, 2, "SJ", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode final 'S' in words from the french, where they
   * are not pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_French_S_Final(): boolean {
    if (this.StringAt(0, 5, "LOUIS", "") && (this.m_current === this.m_last)) {
      this.MetaphAdd$java_lang_String$java_lang_String("S", "");
      this.m_current++;
      return true;
    }
    if ((this.m_current === this.m_last) && (this.StringAt(0, 4, "YVES", "") || (this.StringAt(0, 4, "HORS", "") && (this.m_current === 3)) || this.StringAt((this.m_current - 4), 5, "CAMUS", "YPRES", "") || this.StringAt((this.m_current - 5), 6, "MESNES", "DEBRIS", "BLANCS", "INGRES", "CANNES", "") || this.StringAt((this.m_current - 6), 7, "CHABLIS", "APROPOS", "JACQUES", "ELYSEES", "OEUVRES", "GEORGES", "DESPRES", "") || this.StringAt(0, 8, "ARKANSAS", "FRANCAIS", "CRUDITES", "BRUYERES", "") || this.StringAt(0, 9, "DESCARTES", "DESCHUTES", "DESCHAMPS", "DESROCHES", "DESCHENES", "") || this.StringAt(0, 10, "RENDEZVOUS", "") || this.StringAt(0, 11, "CONTRETEMPS", "DESLAURIERS", "")) || ((this.m_current === this.m_last) && this.StringAt((this.m_current - 2), 2, "AI", "OI", "UI", "") && !this.StringAt(0, 4, "LOIS", "LUIS", ""))) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode non-final 'S' in words from the french where they
   * are not pronounced.
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   */
  Encode_Silent_French_S_Internal(): boolean {
    if (this.StringAt((this.m_current - 2), 9, "DESCARTES", "") || this.StringAt((this.m_current - 2), 7, "DESCHAM", "DESPRES", "DESROCH", "DESROSI", "DESJARD", "DESMARA", "DESCHEN", "DESHOTE", "DESLAUR", "") || this.StringAt((this.m_current - 2), 6, "MESNES", "") || this.StringAt((this.m_current - 5), 8, "DUQUESNE", "DUCHESNE", "") || this.StringAt((this.m_current - 7), 10, "BEAUCHESNE", "") || this.StringAt((this.m_current - 3), 7, "FRESNEL", "") || this.StringAt((this.m_current - 3), 9, "GROSVENOR", "") || this.StringAt((this.m_current - 4), 10, "LOUISVILLE", "") || this.StringAt((this.m_current - 7), 10, "ILLINOISAN", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode silent 'S' in context of "-ISL-"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ISL(): boolean {
    if ((this.StringAt((this.m_current - 2), 4, "LISL", "LYSL", "AISL", "") && !this.StringAt((this.m_current - 3), 7, "PAISLEY", "BAISLEY", "ALISLAM", "ALISLAH", "ALISLAA", "")) || ((this.m_current === 1) && ((this.StringAt((this.m_current - 1), 4, "ISLE", "") || this.StringAt((this.m_current - 1), 5, "ISLAN", "")) && !this.StringAt((this.m_current - 1), 5, "ISLEY", "ISLER", "")))) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-STL-" in contexts where the 'T' is silent. Also
   * encode "-USCLE-" in contexts where the 'C' is silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_STL(): boolean {
    if ((this.StringAt(this.m_current, 4, "STLE", "STLI", "") && !this.StringAt((this.m_current + 2), 4, "LESS", "LIKE", "LINE", "")) || this.StringAt((this.m_current - 3), 7, "THISTLY", "BRISTLY", "GRISTLY", "") || this.StringAt((this.m_current - 1), 5, "USCLE", "")) {
      if (this.StringAt(0, 7, "KRISTEN", "KRYSTLE", "CRYSTLE", "KRISTLE", "") || this.StringAt(0, 11, "CHRISTENSEN", "CHRISTENSON", "") || this.StringAt((this.m_current - 3), 9, "FIRSTLING", "") || this.StringAt((this.m_current - 2), 8, "NESTLING", "WESTLING", "")) {
        this.MetaphAdd$java_lang_String("ST");
        this.m_current += 2;
      } else {
        if (this.m_encodeVowels && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 3)) == 'E'.charCodeAt(0)) && ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 4)) != 'R'.charCodeAt(0)) && !this.StringAt((this.m_current + 3), 4, "ETTE", "ETTA", "") && !this.StringAt((this.m_current + 3), 2, "EY", "")) {
          this.MetaphAdd$java_lang_String("SAL");
          this.flag_AL_inversion = true;
        } else {
          this.MetaphAdd$java_lang_String("SL");
        }
        this.m_current += 3;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode "christmas". Americans always pronounce this as "krissmuss"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Christmas(): boolean {
    if (this.StringAt((this.m_current - 4), 8, "CHRISTMA", "")) {
      this.MetaphAdd$java_lang_String("SM");
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode "-STHM-" in contexts where the 'TH'
   * is silent.
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_STHM(): boolean {
    if (this.StringAt(this.m_current, 4, "STHM", "")) {
      this.MetaphAdd$java_lang_String("SM");
      this.m_current += 4;
      return true;
    }
    return false;
  }

  /**
   * Encode "-ISTEN-" and "-STNT-" in contexts
   * where the 'T' is silent
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ISTEN(): boolean {
    if (this.StringAt(0, 8, "CHRISTEN", "")) {
      if (this.RootOrInflections(this.m_inWord, "CHRISTEN") || this.StringAt(0, 11, "CHRISTENDOM", "")) {
        this.MetaphAdd$java_lang_String$java_lang_String("S", "ST");
      } else {
        this.MetaphAdd$java_lang_String("ST");
      }
      this.m_current += 2;
      return true;
    }
    if (this.StringAt((this.m_current - 2), 6, "LISTEN", "RISTEN", "HASTEN", "FASTEN", "MUSTNT", "") || this.StringAt((this.m_current - 3), 7, "MOISTEN", "")) {
      this.MetaphAdd$java_lang_String("S");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode special case "sugar"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Sugar(): boolean {
    if (this.StringAt(this.m_current, 5, "SUGAR", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-SH-" as X ("sh"), except in cases
   * where the 'S' and 'H' belong to different combining
   * roots and are therefore pronounced seperately
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SH(): boolean {
    if (this.StringAt(this.m_current, 2, "SH", "")) {
      if (this.StringAt((this.m_current - 2), 8, "CASHMERE", "")) {
        this.MetaphAdd$java_lang_String("J");
        this.m_current += 2;
        return true;
      }
      if ((this.m_current > 0) && ((this.StringAt((this.m_current + 1), 3, "HAP", "") && ((this.m_current + 3) === this.m_last)) || this.StringAt((this.m_current + 1), 4, "HEIM", "HOEK", "HOLM", "HOLZ", "HOOD", "HEAD", "HEID", "HAAR", "HORS", "HOLE", "HUND", "HELM", "HAWK", "HILL", "") || this.StringAt((this.m_current + 1), 5, "HEART", "HATCH", "HOUSE", "HOUND", "HONOR", "") || (this.StringAt((this.m_current + 2), 3, "EAR", "") && ((this.m_current + 4) === this.m_last)) || (this.StringAt((this.m_current + 2), 3, "ORN", "") && !this.StringAt((this.m_current - 2), 7, "UNSHORN", "")) || (this.StringAt((this.m_current + 1), 4, "HOUR", "") && !(this.StringAt(0, 7, "BASHOUR", "") || this.StringAt(0, 8, "MANSHOUR", "") || this.StringAt(0, 6, "ASHOUR", ""))) || this.StringAt((this.m_current + 2), 5, "ARMON", "ONEST", "ALLOW", "OLDER", "OPPER", "EIMER", "ANDLE", "ONOUR", "") || this.StringAt((this.m_current + 2), 6, "ABILLE", "UMANCE", "ABITUA", ""))) {
        if (!this.StringAt((this.m_current - 1), 1, "S", "")) this.MetaphAdd$java_lang_String("S");
      } else {
        this.MetaphAdd$java_lang_String("X");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-SCH-" in cases where the 'S' is pronounced
   * seperately from the "CH", in words from the dutch, italian,
   * and greek where it can be pronounced SK, and german words
   * where it is pronounced X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SCH(): boolean {
    if (this.StringAt((this.m_current + 1), 2, "CH", "")) {
      if ((this.m_current > 0) && (this.StringAt((this.m_current + 3), 3, "IEF", "EAT", "") || this.StringAt((this.m_current + 3), 4, "ANCE", "ARGE", "") || this.StringAt(0, 6, "ESCHEW", ""))) {
        this.MetaphAdd$java_lang_String("S");
        this.m_current++;
        return true;
      }
      if ((this.StringAt((this.m_current + 3), 2, "OO", "ER", "EN", "UY", "ED", "EM", "IA", "IZ", "IS", "OL", "") && !this.StringAt(this.m_current, 6, "SCHOLT", "SCHISL", "SCHERR", "")) || this.StringAt((this.m_current + 3), 3, "ISZ", "") || (this.StringAt((this.m_current - 1), 6, "ESCHAT", "ASCHIN", "ASCHAL", "ISCHAE", "ISCHIA", "") && !this.StringAt((this.m_current - 2), 8, "FASCHING", "")) || (this.StringAt((this.m_current - 1), 5, "ESCHI", "") && ((this.m_current + 3) === this.m_last)) || ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 3)) == 'Y'.charCodeAt(0))) {
        if (this.StringAt((this.m_current + 3), 2, "ER", "EN", "IS", "") && (((this.m_current + 4) === this.m_last) || this.StringAt((this.m_current + 3), 3, "ENK", "ENB", "IST", ""))) {
          this.MetaphAdd$java_lang_String$java_lang_String("X", "SK");
        } else {
          this.MetaphAdd$java_lang_String("SK");
        }
        this.m_current += 3;
        return true;
      } else {
        this.MetaphAdd$java_lang_String("X");
        this.m_current += 3;
        return true;
      }
    }
    return false;
  }

  /**
   * Encode "-SUR<E,A,Y>-" to J, unless it is at the beginning,
   * or preceeded by 'N', 'K', or "NO"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SUR(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "URE", "URA", "URY", "")) {
      if ((this.m_current === 0) || this.StringAt((this.m_current - 1), 1, "N", "K", "") || this.StringAt((this.m_current - 2), 2, "NO", "")) {
        this.MetaphAdd$java_lang_String("X");
      } else {
        this.MetaphAdd$java_lang_String("J");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-SU<O,A>-" to X ("sh") unless it is preceeded by
   * an 'R', in which case it is encoded to S, or it is
   * preceeded by a vowel, in which case it is encoded to J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SU(): boolean {
    if (this.StringAt((this.m_current + 1), 2, "UO", "UA", "") && (this.m_current !== 0)) {
      if (this.StringAt((this.m_current - 1), 4, "RSUA", "")) {
        this.MetaphAdd$java_lang_String("S");
      } else if (this.IsVowel$int(this.m_current - 1)) {
        this.MetaphAdd$java_lang_String$java_lang_String("J", "S");
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      }
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encodes "-SSIO-" in contexts where it is pronounced
   * either J or X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SSIO(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "SION", "")) {
      if (this.StringAt((this.m_current - 2), 2, "CI", "")) {
        this.MetaphAdd$java_lang_String("J");
      } else {
        if (this.IsVowel$int(this.m_current - 1)) {
          this.MetaphAdd$java_lang_String("X");
        }
      }
      this.AdvanceCounter(4, 2);
      return true;
    }
    return false;
  }

  /**
   * Encode "-SS-" in contexts where it is pronounced X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SS(): boolean {
    if (this.StringAt((this.m_current - 1), 5, "USSIA", "ESSUR", "ISSUR", "ISSUE", "") || this.StringAt((this.m_current - 1), 6, "ESSIAN", "ASSURE", "ASSURA", "ISSUAB", "ISSUAN", "ASSIUS", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.AdvanceCounter(3, 2);
      return true;
    }
    return false;
  }

  /**
   * Encodes "-SIA-" in contexts where it is pronounced
   * as X ("sh"), J, or S
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SIA(): boolean {
    if (this.StringAt((this.m_current - 2), 5, "CHSIA", "") || this.StringAt((this.m_current - 1), 5, "RSIAL", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.AdvanceCounter(3, 1);
      return true;
    }
    if ((this.StringAt(0, 6, "ALESIA", "ALYSIA", "ALISIA", "STASIA", "") && (this.m_current === 3) && !this.StringAt(0, 9, "ANASTASIA", "")) || this.StringAt((this.m_current - 5), 9, "DIONYSIAN", "") || this.StringAt((this.m_current - 5), 8, "THERESIA", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "S");
      this.AdvanceCounter(3, 1);
      return true;
    }
    if ((this.StringAt(this.m_current, 3, "SIA", "") && ((this.m_current + 2) === this.m_last)) || (this.StringAt(this.m_current, 4, "SIAN", "") && ((this.m_current + 3) === this.m_last)) || this.StringAt((this.m_current - 5), 9, "AMBROSIAL", "")) {
      if ((this.IsVowel$int(this.m_current - 1) || this.StringAt((this.m_current - 1), 1, "R", "")) && !(this.StringAt(0, 5, "JAMES", "NICOS", "PEGAS", "PEPYS", "") || this.StringAt(0, 6, "HOBBES", "HOLMES", "JAQUES", "KEYNES", "") || this.StringAt(0, 7, "MALTHUS", "HOMOOUS", "") || this.StringAt(0, 8, "MAGLEMOS", "HOMOIOUS", "") || this.StringAt(0, 9, "LEVALLOIS", "TARDENOIS", "") || this.StringAt((this.m_current - 4), 5, "ALGES", ""))) {
        this.MetaphAdd$java_lang_String("J");
      } else {
        this.MetaphAdd$java_lang_String("S");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encodes "-SIO-" in contexts where it is pronounced
   * as J or X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SIO(): boolean {
    if (this.StringAt(0, 7, "SIOBHAN", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.AdvanceCounter(3, 1);
      return true;
    }
    if (this.StringAt((this.m_current + 1), 3, "ION", "")) {
      if (this.IsVowel$int(this.m_current - 1) || this.StringAt((this.m_current - 2), 2, "ER", "UR", "")) {
        this.MetaphAdd$java_lang_String("J");
      } else {
        this.MetaphAdd$java_lang_String("X");
      }
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "-S-" might well be from a german name
   * and add encoding of german pronounciation in alternate m_metaph
   * so that it can be found in a genealogical search
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Anglicisations(): boolean {
    if (((this.m_current === 0) && this.StringAt((this.m_current + 1), 1, "M", "N", "L", "")) || this.StringAt((this.m_current + 1), 1, "Z", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("S", "X");
      if (this.StringAt((this.m_current + 1), 1, "Z", "")) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode "-SC<vowel>-" in contexts where it is silent,
   * or pronounced as X ("sh"), S, or SK
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SC(): boolean {
    if (this.StringAt(this.m_current, 2, "SC", "")) {
      if (this.StringAt((this.m_current - 2), 8, "VISCOUNT", "")) {
        this.m_current += 1;
        return true;
      }
      if (this.StringAt((this.m_current + 2), 1, "I", "E", "Y", "")) {
        if (this.StringAt((this.m_current + 2), 4, "IOUS", "") || this.StringAt((this.m_current + 2), 3, "IUT", "") || this.StringAt((this.m_current - 4), 9, "OMNISCIEN", "") || this.StringAt((this.m_current - 3), 8, "CONSCIEN", "CRESCEND", "CONSCION", "") || this.StringAt((this.m_current - 2), 6, "FASCIS", "")) {
          this.MetaphAdd$java_lang_String("X");
        } else if (this.StringAt(this.m_current, 7, "SCEPTIC", "SCEPSIS", "") || this.StringAt(this.m_current, 5, "SCIVV", "SCIRO", "") || this.StringAt(this.m_current, 6, "SCIPIO", "") || this.StringAt((this.m_current - 2), 10, "PISCITELLI", "")) {
          this.MetaphAdd$java_lang_String("SK");
        } else {
          this.MetaphAdd$java_lang_String("S");
        }
        this.m_current += 2;
        return true;
      }
      this.MetaphAdd$java_lang_String("SK");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-S<EA,UI,IER>-" in contexts where it is pronounced
   * as J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SEA_SUI_SIER(): boolean {
    if ((this.StringAt((this.m_current - 3), 6, "NAUSEA", "") && ((this.m_current + 2) === this.m_last)) || this.StringAt((this.m_current - 2), 5, "CASUI", "") || (this.StringAt((this.m_current - 1), 5, "OSIER", "ASIER", "") && !(this.StringAt(0, 6, "EASIER", "") || this.StringAt(0, 5, "OSIER", "") || this.StringAt((this.m_current - 2), 6, "ROSIER", "MOSIER", "")))) {
      this.MetaphAdd$java_lang_String$java_lang_String("J", "X");
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "-SE-" is pronounced as X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_SEA(): boolean {
    if ((this.StringAt(0, 4, "SEAN", "") && ((this.m_current + 3) === this.m_last)) || (this.StringAt((this.m_current - 3), 6, "NAUSEO", "") && !this.StringAt((this.m_current - 3), 7, "NAUSEAT", ""))) {
      this.MetaphAdd$java_lang_String("X");
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-T-"
   *
   */
  Encode_T() {
    if (this.Encode_T_Initial() || this.Encode_TCH() || this.Encode_Silent_French_T() || this.Encode_TUN_TUL_TUA_TUO() || this.Encode_TUE_TEU_TEOU_TUL_TIE() || this.Encode_TUR_TIU_Suffixes() || this.Encode_TI() || this.Encode_TIENT() || this.Encode_TSCH() || this.Encode_TZSCH() || this.Encode_TH_Pronounced_Separately() || this.Encode_TTH() || this.Encode_TH()) {
      return;
    }
    if (this.StringAt((this.m_current + 1), 1, "T", "D", "")) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    this.MetaphAdd$java_lang_String("T");
  }

  /**
   * Encode some exceptions for initial 'T'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_T_Initial(): boolean {
    if (this.m_current === 0) {
      if (this.StringAt((this.m_current + 1), 3, "SAR", "ZAR", "")) {
        this.m_current++;
        return true;
      }
      if (((this.m_length === 3) && this.StringAt((this.m_current + 1), 2, "SO", "SA", "SU", "")) || ((this.m_length === 4) && this.StringAt((this.m_current + 1), 3, "SAO", "SAI", "")) || ((this.m_length === 5) && this.StringAt((this.m_current + 1), 4, "SING", "SANG", ""))) {
        this.MetaphAdd$java_lang_String("X");
        this.AdvanceCounter(3, 2);
        return true;
      }
      if (this.StringAt((this.m_current + 1), 1, "S", "") && this.IsVowel$int(this.m_current + 2)) {
        this.MetaphAdd$java_lang_String$java_lang_String("TS", "S");
        this.AdvanceCounter(3, 2);
        return true;
      }
      if (this.StringAt((this.m_current + 1), 1, "J", "")) {
        this.MetaphAdd$java_lang_String("X");
        this.AdvanceCounter(3, 2);
        return true;
      }
      if ((this.StringAt((this.m_current + 1), 2, "HU", "") && (this.m_length === 3)) || this.StringAt((this.m_current + 1), 3, "HAI", "HUY", "HAO", "") || this.StringAt((this.m_current + 1), 4, "HYME", "HYMY", "HANH", "") || this.StringAt((this.m_current + 1), 5, "HERES", "")) {
        this.MetaphAdd$java_lang_String("T");
        this.AdvanceCounter(3, 2);
        return true;
      }
    }
    return false;
  }

  /**
   * Encode "-TCH-", reliably X ("sh", or in this case, "ch")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TCH(): boolean {
    if (this.StringAt((this.m_current + 1), 2, "CH", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode the many cases where americans are aware that a certain word is
   * french and know to not pronounce the 'T'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   * TOUCHET CHABOT BENOIT
   */
  Encode_Silent_French_T(): boolean {
    if (((this.m_current === this.m_last) && this.StringAt((this.m_current - 4), 5, "MONET", "GENET", "CHAUT", "")) || this.StringAt((this.m_current - 2), 9, "POTPOURRI", "") || this.StringAt((this.m_current - 3), 9, "BOATSWAIN", "") || this.StringAt((this.m_current - 3), 8, "MORTGAGE", "") || (this.StringAt((this.m_current - 4), 5, "BERET", "BIDET", "FILET", "DEBUT", "DEPOT", "PINOT", "TAROT", "") || this.StringAt((this.m_current - 5), 6, "BALLET", "BUFFET", "CACHET", "CHALET", "ESPRIT", "RAGOUT", "GOULET", "CHABOT", "BENOIT", "") || this.StringAt((this.m_current - 6), 7, "GOURMET", "BOUQUET", "CROCHET", "CROQUET", "PARFAIT", "PINCHOT", "CABARET", "PARQUET", "RAPPORT", "TOUCHET", "COURBET", "DIDEROT", "") || this.StringAt((this.m_current - 7), 8, "ENTREPOT", "CABERNET", "DUBONNET", "MASSENET", "MUSCADET", "RICOCHET", "ESCARGOT", "") || this.StringAt((this.m_current - 8), 9, "SOBRIQUET", "CABRIOLET", "CASSOULET", "OUBRIQUET", "CAMEMBERT", "")) && !this.StringAt((this.m_current + 1), 2, "AN", "RY", "IC", "OM", "IN", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-TU<N,L,A,O>-" in cases where it is pronounced
   * X ("sh", or in this case, "ch")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TUN_TUL_TUA_TUO(): boolean {
    if (this.StringAt((this.m_current - 3), 6, "FORTUN", "") || (this.StringAt(this.m_current, 3, "TUL", "") && (this.IsVowel$int(this.m_current - 1) && this.IsVowel$int(this.m_current + 3))) || this.StringAt((this.m_current - 2), 5, "BITUA", "BITUE", "") || ((this.m_current > 1) && this.StringAt(this.m_current, 3, "TUA", "TUO", ""))) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "T");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-T<vowel>-" forms where 'T' is pronounced as X
   * ("sh", or in this case "ch")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TUE_TEU_TEOU_TUL_TIE(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "UENT", "") || this.StringAt((this.m_current - 4), 9, "RIGHTEOUS", "") || this.StringAt((this.m_current - 3), 7, "STATUTE", "") || this.StringAt((this.m_current - 3), 7, "AMATEUR", "") || (this.StringAt((this.m_current - 1), 5, "NTULE", "NTULA", "STULE", "STULA", "STEUR", "")) || (((this.m_current + 2) === this.m_last) && this.StringAt(this.m_current, 3, "TUE", "")) || this.StringAt(this.m_current, 5, "TUENC", "") || this.StringAt((this.m_current - 3), 8, "STATUTOR", "") || (((this.m_current + 5) === this.m_last) && this.StringAt(this.m_current, 6, "TIENCE", ""))) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "T");
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-TU-" forms in suffixes where it is usually
   * pronounced as X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TUR_TIU_Suffixes(): boolean {
    if ((this.m_current > 0) && this.StringAt((this.m_current + 1), 3, "URE", "URA", "URI", "URY", "URO", "IUS", "")) {
      if ((this.StringAt((this.m_current + 1), 3, "URA", "URO", "") && ((this.m_current + 3) === this.m_last)) && !this.StringAt((this.m_current - 3), 7, "VENTURA", "") || this.StringAt((this.m_current + 1), 4, "URIA", "")) {
        this.MetaphAdd$java_lang_String("T");
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("X", "T");
      }
      this.AdvanceCounter(2, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-TI<O,A,U>-" as X ("sh"), except
   * in cases where it is part of a combining form,
   * or as J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TI(): boolean {
    if ((this.StringAt((this.m_current + 1), 2, "IO", "") && !this.StringAt((this.m_current - 1), 5, "ETIOL", "")) || this.StringAt((this.m_current + 1), 3, "IAL", "") || this.StringAt((this.m_current - 1), 5, "RTIUM", "ATIUM", "") || ((this.StringAt((this.m_current + 1), 3, "IAN", "") && (this.m_current > 0)) && !(this.StringAt((this.m_current - 4), 8, "FAUSTIAN", "") || this.StringAt((this.m_current - 5), 9, "PROUSTIAN", "") || this.StringAt((this.m_current - 2), 7, "TATIANA", "") || (this.StringAt((this.m_current - 3), 7, "KANTIAN", "GENTIAN", "") || this.StringAt((this.m_current - 8), 12, "ROOSEVELTIAN", ""))) || (((this.m_current + 2) === this.m_last) && this.StringAt(this.m_current, 3, "TIA", "") && !(this.StringAt((this.m_current - 3), 6, "HESTIA", "MASTIA", "") || this.StringAt((this.m_current - 2), 5, "OSTIA", "") || this.StringAt(0, 3, "TIA", "") || this.StringAt((this.m_current - 5), 8, "IZVESTIA", ""))) || this.StringAt((this.m_current + 1), 4, "IATE", "IATI", "IABL", "IATO", "IARY", "") || this.StringAt((this.m_current - 5), 9, "CHRISTIAN", ""))) {
      if (((this.m_current === 2) && this.StringAt(0, 4, "ANTI", "")) || this.StringAt(0, 5, "PATIO", "PITIA", "DUTIA", "")) {
        this.MetaphAdd$java_lang_String("T");
      } else if (this.StringAt((this.m_current - 4), 8, "EQUATION", "")) {
        this.MetaphAdd$java_lang_String("J");
      } else {
        if (this.StringAt(this.m_current, 4, "TION", "")) {
          this.MetaphAdd$java_lang_String("X");
        } else if (this.StringAt(0, 5, "KATIA", "LATIA", "")) {
          this.MetaphAdd$java_lang_String$java_lang_String("T", "X");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("X", "T");
        }
      }
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-TIENT-" where "TI" is pronounced X ("sh")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TIENT(): boolean {
    if (this.StringAt((this.m_current + 1), 4, "IENT", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("X", "T");
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode "-TSCH-" as X ("ch")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TSCH(): boolean {
    if (this.StringAt(this.m_current, 4, "TSCH", "") && !this.StringAt((this.m_current - 3), 4, "WELT", "KLAT", "FEST", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 4;
      return true;
    }
    return false;
  }

  /**
   * Encode "-TZSCH-" as X ("ch")
   *
   * "Neitzsche is peachy"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TZSCH(): boolean {
    if (this.StringAt(this.m_current, 5, "TZSCH", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current += 5;
      return true;
    }
    return false;
  }

  /**
   * Encodes cases where the 'H' in "-TH-" is the beginning of
   * another word in a combining form, special cases where it is
   * usually pronounced as 'T', and a special case where it has
   * become pronounced as X ("sh", in this case "ch")
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TH_Pronounced_Separately(): boolean {
    if (((this.m_current > 0) && this.StringAt((this.m_current + 1), 4, "HOOD", "HEAD", "HEID", "HAND", "HILL", "HOLD", "HAWK", "HEAP", "HERD", "HOLE", "HOOK", "HUNT", "HUMO", "HAUS", "HOFF", "HARD", "") && !this.StringAt((this.m_current - 3), 5, "SOUTH", "NORTH", "")) || this.StringAt((this.m_current + 1), 5, "HOUSE", "HEART", "HASTE", "HYPNO", "HEQUE", "") || (this.StringAt((this.m_current + 1), 4, "HALL", "") && ((this.m_current + 4) === this.m_last) && !this.StringAt((this.m_current - 3), 5, "SOUTH", "NORTH", "")) || (this.StringAt((this.m_current + 1), 3, "HAM", "") && ((this.m_current + 3) === this.m_last) && !(this.StringAt(0, 6, "GOTHAM", "WITHAM", "LATHAM", "") || this.StringAt(0, 7, "BENTHAM", "WALTHAM", "WORTHAM", "") || this.StringAt(0, 8, "GRANTHAM", ""))) || (this.StringAt((this.m_current + 1), 5, "HATCH", "") && !((this.m_current === 0) || this.StringAt((this.m_current - 2), 8, "UNTHATCH", ""))) || this.StringAt((this.m_current - 3), 7, "WARTHOG", "") || this.StringAt((this.m_current - 2), 6, "ESTHER", "") || this.StringAt((this.m_current - 3), 6, "GOETHE", "") || this.StringAt((this.m_current - 2), 8, "NATHALIE", "")) {
      if (this.StringAt((this.m_current - 3), 7, "POSTHUM", "")) {
        this.MetaphAdd$java_lang_String("X");
      } else {
        this.MetaphAdd$java_lang_String("T");
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode the "-TTH-" in "matthew", eating the redundant 'T'
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TTH(): boolean {
    if (this.StringAt(this.m_current, 3, "TTH", "")) {
      if (this.StringAt((this.m_current - 2), 5, "MATTH", "")) {
        this.MetaphAdd$java_lang_String("0");
      } else {
        this.MetaphAdd$java_lang_String("T0");
      }
      this.m_current += 3;
      return true;
    }
    return false;
  }

  /**
   * Encode "-TH-". 0 (zero) is used in Metaphone to encode this sound
   * when it is pronounced as a dipthong, either voiced or unvoiced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_TH(): boolean {
    if (this.StringAt(this.m_current, 2, "TH", "")) {
      if (this.StringAt((this.m_current - 3), 7, "CLOTHES", "")) {
        this.m_current += 3;
        return true;
      }
      if (this.StringAt((this.m_current + 2), 4, "OMAS", "OMPS", "OMPK", "OMSO", "OMSE", "AMES", "OVEN", "OFEN", "ILDA", "ILDE", "") || (this.StringAt(0, 4, "THOM", "") && (this.m_length === 4)) || (this.StringAt(0, 5, "THOMS", "") && (this.m_length === 5)) || this.StringAt(0, 4, "VAN ", "VON ", "") || this.StringAt(0, 3, "SCH", "")) {
        this.MetaphAdd$java_lang_String("T");
      } else {
        if (this.StringAt(0, 2, "SM", "")) {
          this.MetaphAdd$java_lang_String$java_lang_String("0", "T");
        } else {
          this.MetaphAdd$java_lang_String("0");
        }
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-V-"
   *
   */
  Encode_V() {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'V'.charCodeAt(0)) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
    this.MetaphAddExactApprox$java_lang_String$java_lang_String("V", "F");
  }

  /**
   * Encode "-W-"
   *
   */
  Encode_W() {
    if (this.Encode_Silent_W_At_Beginning() || this.Encode_WITZ_WICZ() || this.Encode_WR() || this.Encode_Initial_W_Vowel() || this.Encode_WH() || this.Encode_Eastern_European_W()) {
      return;
    }
    if (this.m_encodeVowels && this.StringAt(this.m_current, 2, "WE", "") && ((this.m_current + 1) === this.m_last)) {
      this.MetaphAdd$java_lang_String("A");
    }
    this.m_current++;
  }

  /**
   * Encode cases where 'W' is silent at beginning of word
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Silent_W_At_Beginning(): boolean {
    if ((this.m_current === 0) && this.StringAt(this.m_current, 2, "WR", "")) {
      this.m_current += 1;
      return true;
    }
    return false;
  }

  /**
   * Encode polish patronymic suffix, mapping
   * alternate spellings to the same encoding,
   * and including easern european pronounciation
   * to the american so that both forms can
   * be found in a genealogy search
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_WITZ_WICZ(): boolean {
    if (((this.m_current + 3) === this.m_last) && this.StringAt(this.m_current, 4, "WICZ", "WITZ", "")) {
      if (this.m_encodeVowels) {
        if ((/* length */this.m_primary.str.length > 0) && (c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(/* charAt */this.m_primary.str.charAt(/* length */this.m_primary.str.length - 1)) == 'A'.charCodeAt(0)) {
          this.MetaphAdd$java_lang_String$java_lang_String("TS", "FAX");
        } else {
          this.MetaphAdd$java_lang_String$java_lang_String("ATS", "FAX");
        }
      } else {
        this.MetaphAdd$java_lang_String$java_lang_String("TS", "FX");
      }
      this.m_current += 4;
      return true;
    }
    return false;
  }

  /**
   * Encode "-WR-" as R ('W' always effectively silent)
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_WR(): boolean {
    if (this.StringAt(this.m_current, 2, "WR", "")) {
      this.MetaphAdd$java_lang_String("R");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "W-", adding central and eastern european
   * pronounciations so that both forms can be found
   * in a genealogy search
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_W_Vowel(): boolean {
    if ((this.m_current === 0) && this.IsVowel$int(this.m_current + 1)) {
      if (this.Germanic_Or_Slavic_Name_Beginning_With_W()) {
        if (this.m_encodeVowels) {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("A", "VA", "A", "FA");
        } else {
          this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("A", "V", "A", "F");
        }
      } else {
        this.MetaphAdd$java_lang_String("A");
      }
      this.m_current++;
      this.m_current = this.SkipVowels(this.m_current);
      return true;
    }
    return false;
  }

  /**
   * Encode "-WH-" either as H, or close enough to 'U' to be
   * considered a vowel
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_WH(): boolean {
    if (this.StringAt(this.m_current, 2, "WH", "")) {
      if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 2)) == 'O'.charCodeAt(0)) && !(this.StringAt((this.m_current + 2), 4, "OOSH", "") || this.StringAt((this.m_current + 2), 3, "OOP", "OMP", "ORL", "ORT", "") || this.StringAt((this.m_current + 2), 2, "OA", "OP", ""))) {
        this.MetaphAdd$java_lang_String("H");
        this.AdvanceCounter(3, 2);
        return true;
      } else {
        if (this.StringAt((this.m_current + 2), 3, "IDE", "ARD", "EAD", "AWK", "ERD", "OOK", "AND", "OLE", "OOD", "") || this.StringAt((this.m_current + 2), 4, "EART", "OUSE", "OUND", "") || this.StringAt((this.m_current + 2), 5, "AMMER", "")) {
          this.MetaphAdd$java_lang_String("H");
          this.m_current += 2;
          return true;
        } else if (this.m_current === 0) {
          this.MetaphAdd$java_lang_String("A");
          this.m_current += 2;
          this.m_current = this.SkipVowels(this.m_current);
          return true;
        }
      }
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode "-W-" when in eastern european names, adding
   * the eastern european pronounciation to the american so
   * that both forms can be found in a genealogy search
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Eastern_European_W(): boolean {
    if (((this.m_current === this.m_last) && this.IsVowel$int(this.m_current - 1)) || this.StringAt((this.m_current - 1), 5, "EWSKI", "EWSKY", "OWSKI", "OWSKY", "") || (this.StringAt(this.m_current, 5, "WICKI", "WACKI", "") && ((this.m_current + 4) === this.m_last)) || this.StringAt(this.m_current, 4, "WIAK", "") && ((this.m_current + 3) === this.m_last) || this.StringAt(0, 3, "SCH", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String$java_lang_String$java_lang_String("", "V", "", "F");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-X-"
   *
   */
  Encode_X() {
    if (this.Encode_Initial_X() || this.Encode_Greek_X() || this.Encode_X_Special_Cases() || this.Encode_X_To_H() || this.Encode_X_Vowel() || this.Encode_French_X_Final()) {
      return;
    }
    if (this.StringAt((this.m_current + 1), 1, "X", "Z", "S", "") || this.StringAt((this.m_current + 1), 2, "CI", "CE", "")) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encode initial X where it is usually pronounced as S
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Initial_X(): boolean {
    if (this.StringAt(0, 3, "XIA", "XIO", "XIE", "") || this.StringAt(0, 2, "XU", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current++;
      return true;
    }
    if ((this.m_current === 0)) {
      this.MetaphAdd$java_lang_String("S");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode X when from greek roots where it is usually pronounced as S
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_Greek_X(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "YLO", "YLE", "ENO", "") || this.StringAt((this.m_current + 1), 4, "ANTH", "")) {
      this.MetaphAdd$java_lang_String("S");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode special cases, "LUXUR-", "Texeira"
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_X_Special_Cases(): boolean {
    if (this.StringAt((this.m_current - 2), 5, "LUXUR", "")) {
      this.MetaphAddExactApprox$java_lang_String$java_lang_String("GJ", "KJ");
      this.m_current++;
      return true;
    }
    if (this.StringAt(0, 7, "TEXEIRA", "") || this.StringAt(0, 8, "TEIXEIRA", "")) {
      this.MetaphAdd$java_lang_String("X");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode special case where americans know the
   * proper mexican indian pronounciation of this name
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_X_To_H(): boolean {
    if (this.StringAt((this.m_current - 2), 6, "OAXACA", "") || this.StringAt((this.m_current - 3), 7, "QUIXOTE", "")) {
      this.MetaphAdd$java_lang_String("H");
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-X-" in vowel contexts where it is usually
   * pronounced KX ("ksh")
   * account also for BBC pronounciation of => KS
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_X_Vowel(): boolean {
    if (this.StringAt((this.m_current + 1), 3, "UAL", "ION", "IOU", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("KX", "KS");
      this.AdvanceCounter(3, 1);
      return true;
    }
    return false;
  }

  /**
   * Encode cases of "-X", encoding as silent when part
   * of a french word where it is not pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_French_X_Final(): boolean {
    if (!((this.m_current === this.m_last) && (this.StringAt((this.m_current - 3), 3, "IAU", "EAU", "IEU", "") || this.StringAt((this.m_current - 2), 2, "AI", "AU", "OU", "OI", "EU", "")))) {
      this.MetaphAdd$java_lang_String("KS");
    }
    return false;
  }

  /**
   * Encode "-Z-"
   *
   */
  Encode_Z() {
    if (this.Encode_ZZ() || this.Encode_ZU_ZIER_ZS() || this.Encode_French_EZ() || this.Encode_German_Z()) {
      return;
    }
    if (this.Encode_ZH()) {
      return;
    } else {
      this.MetaphAdd$java_lang_String("S");
    }
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'Z'.charCodeAt(0)) {
      this.m_current += 2;
    } else {
      this.m_current++;
    }
  }

  /**
   * Encode cases of "-ZZ-" where it is obviously part
   * of an italian word where "-ZZ-" is pronounced as TS
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ZZ(): boolean {
    if (((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'Z'.charCodeAt(0)) && ((this.StringAt((this.m_current + 2), 1, "I", "O", "A", "") && ((this.m_current + 2) === this.m_last)) || this.StringAt((this.m_current - 2), 9, "MOZZARELL", "PIZZICATO", "PUZZONLAN", ""))) {
      this.MetaphAdd$java_lang_String$java_lang_String("TS", "S");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Encode special cases where "-Z-" is pronounced as J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ZU_ZIER_ZS(): boolean {
    if (((this.m_current === 1) && this.StringAt((this.m_current - 1), 4, "AZUR", "")) || (this.StringAt(this.m_current, 4, "ZIER", "") && !this.StringAt((this.m_current - 2), 6, "VIZIER", "")) || this.StringAt(this.m_current, 3, "ZSA", "")) {
      this.MetaphAdd$java_lang_String$java_lang_String("J", "S");
      if (this.StringAt(this.m_current, 3, "ZSA", "")) {
        this.m_current += 2;
      } else {
        this.m_current++;
      }
      return true;
    }
    return false;
  }

  /**
   * Encode cases where americans recognize "-EZ" as part
   * of a french word where Z not pronounced
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_French_EZ(): boolean {
    if (((this.m_current === 3) && this.StringAt((this.m_current - 3), 4, "CHEZ", "")) || this.StringAt((this.m_current - 5), 6, "RENDEZ", "")) {
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode cases where "-Z-" is in a german word
   * where Z => TS in german
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_German_Z(): boolean {
    if (((this.m_current === 2) && ((this.m_current + 1) === this.m_last) && this.StringAt((this.m_current - 2), 4, "NAZI", "")) || this.StringAt((this.m_current - 2), 6, "NAZIFY", "MOZART", "") || this.StringAt((this.m_current - 3), 4, "HOLZ", "HERZ", "MERZ", "FITZ", "") || (this.StringAt((this.m_current - 3), 4, "GANZ", "") && !this.IsVowel$int(this.m_current + 1)) || this.StringAt((this.m_current - 4), 5, "STOLZ", "PRINZ", "") || this.StringAt((this.m_current - 4), 7, "VENEZIA", "") || this.StringAt((this.m_current - 3), 6, "HERZOG", "") || (/* contains */(this.m_inWord.indexOf("SCH") != -1) && !(this.StringAt((this.m_last - 2), 3, "IZE", "OZE", "ZEL", ""))) || ((this.m_current > 0) && this.StringAt(this.m_current, 4, "ZEIT", "")) || this.StringAt((this.m_current - 3), 4, "WEIZ", "")) {
      if ((this.m_current > 0) && (c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.m_inWord.charAt(this.m_current - 1)) == 'T'.charCodeAt(0)) {
        this.MetaphAdd$java_lang_String("S");
      } else {
        this.MetaphAdd$java_lang_String("TS");
      }
      this.m_current++;
      return true;
    }
    return false;
  }

  /**
   * Encode "-ZH-" as J
   *
   * @return {boolean} true if encoding handled in this routine, false if not
   *
   */
  Encode_ZH(): boolean {
    if ((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(this.CharAt(this.m_current + 1)) == 'H'.charCodeAt(0)) {
      this.MetaphAdd$java_lang_String("J");
      this.m_current += 2;
      return true;
    }
    return false;
  }

  /**
   * Test for names derived from the swedish,
   * dutch, or slavic that should get an alternate
   * pronunciation of 'SV' to match the native
   * version
   *
   * @return {boolean} true if swedish, dutch, or slavic derived name
   */
  Names_Beginning_With_SW_That_Get_Alt_SV(): boolean {
    if (this.StringAt(0, 7, "SWANSON", "SWENSON", "SWINSON", "SWENSEN", "SWOBODA", "") || this.StringAt(0, 9, "SWIDERSKI", "SWARTHOUT", "") || this.StringAt(0, 10, "SWEARENGIN", "")) {
      return true;
    }
    return false;
  }

  /**
   * Test for names derived from the german
   * that should get an alternate pronunciation
   * of 'XV' to match the german version spelled
   * "schw-"
   *
   * @return {boolean} true if german derived name
   */
  Names_Beginning_With_SW_That_Get_Alt_XV(): boolean {
    if (this.StringAt(0, 5, "SWART", "") || this.StringAt(0, 6, "SWARTZ", "SWARTS", "SWIGER", "") || this.StringAt(0, 7, "SWITZER", "SWANGER", "SWIGERT", "SWIGART", "SWIHART", "") || this.StringAt(0, 8, "SWEITZER", "SWATZELL", "SWINDLER", "") || this.StringAt(0, 9, "SWINEHART", "") || this.StringAt(0, 10, "SWEARINGEN", "")) {
      return true;
    }
    return false;
  }

  /**
   * Test whether the word in question
   * is a name of germanic or slavic origin, for
   * the purpose of determining whether to add an
   * alternate encoding of 'V'
   *
   * @return {boolean} true if germanic or slavic name
   */
  Germanic_Or_Slavic_Name_Beginning_With_W(): boolean {
    if (this.StringAt(0, 3, "WEE", "WIX", "WAX", "") || this.StringAt(0, 4, "WOLF", "WEIS", "WAHL", "WALZ", "WEIL", "WERT", "WINE", "WILK", "WALT", "WOLL", "WADA", "WULF", "WEHR", "WURM", "WYSE", "WENZ", "WIRT", "WOLK", "WEIN", "WYSS", "WASS", "WANN", "WINT", "WINK", "WILE", "WIKE", "WIER", "WELK", "WISE", "") || this.StringAt(0, 5, "WIRTH", "WIESE", "WITTE", "WENTZ", "WOLFF", "WENDT", "WERTZ", "WILKE", "WALTZ", "WEISE", "WOOLF", "WERTH", "WEESE", "WURTH", "WINES", "WARGO", "WIMER", "WISER", "WAGER", "WILLE", "WILDS", "WAGAR", "WERTS", "WITTY", "WIENS", "WIEBE", "WIRTZ", "WYMER", "WULFF", "WIBLE", "WINER", "WIEST", "WALKO", "WALLA", "WEBRE", "WEYER", "WYBLE", "WOMAC", "WILTZ", "WURST", "WOLAK", "WELKE", "WEDEL", "WEIST", "WYGAN", "WUEST", "WEISZ", "WALCK", "WEITZ", "WYDRA", "WANDA", "WILMA", "WEBER", "") || this.StringAt(0, 6, "WETZEL", "WEINER", "WENZEL", "WESTER", "WALLEN", "WENGER", "WALLIN", "WEILER", "WIMMER", "WEIMER", "WYRICK", "WEGNER", "WINNER", "WESSEL", "WILKIE", "WEIGEL", "WOJCIK", "WENDEL", "WITTER", "WIENER", "WEISER", "WEXLER", "WACKER", "WISNER", "WITMER", "WINKLE", "WELTER", "WIDMER", "WITTEN", "WINDLE", "WASHER", "WOLTER", "WILKEY", "WIDNER", "WARMAN", "WEYANT", "WEIBEL", "WANNER", "WILKEN", "WILTSE", "WARNKE", "WALSER", "WEIKEL", "WESNER", "WITZEL", "WROBEL", "WAGNON", "WINANS", "WENNER", "WOLKEN", "WILNER", "WYSONG", "WYCOFF", "WUNDER", "WINKEL", "WIDMAN", "WELSCH", "WEHNER", "WEIGLE", "WETTER", "WUNSCH", "WHITTY", "WAXMAN", "WILKER", "WILHAM", "WITTIG", "WITMAN", "WESTRA", "WEHRLE", "WASSER", "WILLER", "WEGMAN", "WARFEL", "WYNTER", "WERNER", "WAGNER", "WISSER", "") || this.StringAt(0, 7, "WISEMAN", "WINKLER", "WILHELM", "WELLMAN", "WAMPLER", "WACHTER", "WALTHER", "WYCKOFF", "WEIDNER", "WOZNIAK", "WEILAND", "WILFONG", "WIEGAND", "WILCHER", "WIELAND", "WILDMAN", "WALDMAN", "WORTMAN", "WYSOCKI", "WEIDMAN", "WITTMAN", "WIDENER", "WOLFSON", "WENDELL", "WEITZEL", "WILLMAN", "WALDRUP", "WALTMAN", "WALCZAK", "WEIGAND", "WESSELS", "WIDEMAN", "WOLTERS", "WIREMAN", "WILHOIT", "WEGENER", "WOTRING", "WINGERT", "WIESNER", "WAYMIRE", "WHETZEL", "WENTZEL", "WINEGAR", "WESTMAN", "WYNKOOP", "WALLICK", "WURSTER", "WINBUSH", "WILBERT", "WALLACH", "WYNKOOP", "WALLICK", "WURSTER", "WINBUSH", "WILBERT", "WALLACH", "WEISSER", "WEISNER", "WINDERS", "WILLMON", "WILLEMS", "WIERSMA", "WACHTEL", "WARNICK", "WEIDLER", "WALTRIP", "WHETSEL", "WHELESS", "WELCHER", "WALBORN", "WILLSEY", "WEINMAN", "WAGAMAN", "WOMMACK", "WINGLER", "WINKLES", "WIEDMAN", "WHITNER", "WOLFRAM", "WARLICK", "WEEDMAN", "WHISMAN", "WINLAND", "WEESNER", "WARTHEN", "WETZLER", "WENDLER", "WALLNER", "WOLBERT", "WITTMER", "WISHART", "WILLIAM", "") || this.StringAt(0, 8, "WESTPHAL", "WICKLUND", "WEISSMAN", "WESTLUND", "WOLFGANG", "WILLHITE", "WEISBERG", "WALRAVEN", "WOLFGRAM", "WILHOITE", "WECHSLER", "WENDLING", "WESTBERG", "WENDLAND", "WININGER", "WHISNANT", "WESTRICK", "WESTLING", "WESTBURY", "WEITZMAN", "WEHMEYER", "WEINMANN", "WISNESKI", "WHELCHEL", "WEISHAAR", "WAGGENER", "WALDROUP", "WESTHOFF", "WIEDEMAN", "WASINGER", "WINBORNE", "") || this.StringAt(0, 9, "WHISENANT", "WEINSTEIN", "WESTERMAN", "WASSERMAN", "WITKOWSKI", "WEINTRAUB", "WINKELMAN", "WINKFIELD", "WANAMAKER", "WIECZOREK", "WIECHMANN", "WOJTOWICZ", "WALKOWIAK", "WEINSTOCK", "WILLEFORD", "WARKENTIN", "WEISINGER", "WINKLEMAN", "WILHEMINA", "") || this.StringAt(0, 10, "WISNIEWSKI", "WUNDERLICH", "WHISENHUNT", "WEINBERGER", "WROBLEWSKI", "WAGUESPACK", "WEISGERBER", "WESTERVELT", "WESTERLUND", "WASILEWSKI", "WILDERMUTH", "WESTENDORF", "WESOLOWSKI", "WEINGARTEN", "WINEBARGER", "WESTERBERG", "WANNAMAKER", "WEISSINGER", "") || this.StringAt(0, 11, "WALDSCHMIDT", "WEINGARTNER", "WINEBRENNER", "") || this.StringAt(0, 12, "WOLFENBARGER", "") || this.StringAt(0, 13, "WOJCIECHOWSKI", "")) {
      return true;
    }
    return false;
  }

  /**
   * Test whether the word in question
   * is a name starting with 'J' that should
   * match names starting with a 'Y' sound.
   * All forms of 'John', 'Jane', etc, get
   * and alt to match e.g. 'Ian', 'Yana'. Joelle
   * should match 'Yael', 'Joseph' should match
   * 'Yusef'. German and slavic last names are
   * also included.
   *
   * @return {boolean} true if name starting with 'J' that
   * should get an alternate encoding as a vowel
   */
  Names_Beginning_With_J_That_Get_Alt_Y(): boolean {
    if (this.StringAt(0, 3, "JAN", "JON", "JAN", "JIN", "JEN", "") || this.StringAt(0, 4, "JUHL", "JULY", "JOEL", "JOHN", "JOSH", "JUDE", "JUNE", "JONI", "JULI", "JENA", "JUNG", "JINA", "JANA", "JENI", "JOEL", "JANN", "JONA", "JENE", "JULE", "JANI", "JONG", "JOHN", "JEAN", "JUNG", "JONE", "JARA", "JUST", "JOST", "JAHN", "JACO", "JANG", "JUDE", "JONE", "") || this.StringAt(0, 5, "JOANN", "JANEY", "JANAE", "JOANA", "JUTTA", "JULEE", "JANAY", "JANEE", "JETTA", "JOHNA", "JOANE", "JAYNA", "JANES", "JONAS", "JONIE", "JUSTA", "JUNIE", "JUNKO", "JENAE", "JULIO", "JINNY", "JOHNS", "JACOB", "JETER", "JAFFE", "JESKE", "JANKE", "JAGER", "JANIK", "JANDA", "JOSHI", "JULES", "JANTZ", "JEANS", "JUDAH", "JANUS", "JENNY", "JENEE", "JONAH", "JONAS", "JACOB", "JOSUE", "JOSEF", "JULES", "JULIE", "JULIA", "JANIE", "JANIS", "JENNA", "JANNA", "JEANA", "JENNI", "JEANE", "JONNA", "") || this.StringAt(0, 6, "JORDAN", "JORDON", "JOSEPH", "JOSHUA", "JOSIAH", "JOSPEH", "JUDSON", "JULIAN", "JULIUS", "JUNIOR", "JUDITH", "JOESPH", "JOHNIE", "JOANNE", "JEANNE", "JOANNA", "JOSEFA", "JULIET", "JANNIE", "JANELL", "JASMIN", "JANINE", "JOHNNY", "JEANIE", "JEANNA", "JOHNNA", "JOELLE", "JOVITA", "JOSEPH", "JONNIE", "JANEEN", "JANINA", "JOANIE", "JAZMIN", "JOHNIE", "JANENE", "JOHNNY", "JONELL", "JENELL", "JANETT", "JANETH", "JENINE", "JOELLA", "JOEANN", "JULIAN", "JOHANA", "JENICE", "JANNET", "JANISE", "JULENE", "JOSHUA", "JANEAN", "JAIMEE", "JOETTE", "JANYCE", "JENEVA", "JORDAN", "JACOBS", "JENSEN", "JOSEPH", "JANSEN", "JORDON", "JULIAN", "JAEGER", "JACOBY", "JENSON", "JARMAN", "JOSLIN", "JESSEN", "JAHNKE", "JACOBO", "JULIEN", "JOSHUA", "JEPSON", "JULIUS", "JANSON", "JACOBI", "JUDSON", "JARBOE", "JOHSON", "JANZEN", "JETTON", "JUNKER", "JONSON", "JAROSZ", "JENNER", "JAGGER", "JASMIN", "JEPSEN", "JORDEN", "JANNEY", "JUHASZ", "JERGEN", "JAKOB", "") || this.StringAt(0, 7, "JOHNSON", "JOHNNIE", "JASMINE", "JEANNIE", "JOHANNA", "JANELLE", "JANETTE", "JULIANA", "JUSTINA", "JOSETTE", "JOELLEN", "JENELLE", "JULIETA", "JULIANN", "JULISSA", "JENETTE", "JANETTA", "JOSELYN", "JONELLE", "JESENIA", "JANESSA", "JAZMINE", "JEANENE", "JOANNIE", "JADWIGA", "JOLANDA", "JULIANE", "JANUARY", "JEANICE", "JANELLA", "JEANETT", "JENNINE", "JOHANNE", "JOHNSIE", "JANIECE", "JOHNSON", "JENNELL", "JAMISON", "JANSSEN", "JOHNSEN", "JARDINE", "JAGGERS", "JURGENS", "JOURDAN", "JULIANO", "JOSEPHS", "JHONSON", "JOZWIAK", "JANICKI", "JELINEK", "JANSSON", "JOACHIM", "JANELLE", "JACOBUS", "JENNING", "JANTZEN", "JOHNNIE", "") || this.StringAt(0, 8, "JOSEFINA", "JEANNINE", "JULIANNE", "JULIANNA", "JONATHAN", "JONATHON", "JEANETTE", "JANNETTE", "JEANETTA", "JOHNETTA", "JENNEFER", "JULIENNE", "JOSPHINE", "JEANELLE", "JOHNETTE", "JULIEANN", "JOSEFINE", "JULIETTA", "JOHNSTON", "JACOBSON", "JACOBSEN", "JOHANSEN", "JOHANSON", "JAWORSKI", "JENNETTE", "JELLISON", "JOHANNES", "JASINSKI", "JUERGENS", "JARNAGIN", "JEREMIAH", "JEPPESEN", "JARNIGAN", "JANOUSEK", "") || this.StringAt(0, 9, "JOHNATHAN", "JOHNATHON", "JORGENSEN", "JEANMARIE", "JOSEPHINA", "JEANNETTE", "JOSEPHINE", "JEANNETTA", "JORGENSON", "JANKOWSKI", "JOHNSTONE", "JABLONSKI", "JOSEPHSON", "JOHANNSEN", "JURGENSEN", "JIMMERSON", "JOHANSSON", "") || this.StringAt(0, 10, "JAKUBOWSKI", "")) {
      return true;
    }
    return false;
  }

  /**
   * @param {java.lang.String[]} args
   */
  public static main(args: string[]) {
    let m3: Metaphone3 = new Metaphone3();
    m3.SetWord("iron");
    m3.Encode();
    console.info("iron : " + m3.GetMetaph());
    console.info("iron : (alt) " + m3.GetAlternateMetaph());
    m3.SetWord("witz");
    m3.Encode();
    console.info("witz : " + m3.GetMetaph());
    console.info("witz : (alt) " + m3.GetAlternateMetaph());
    m3.SetWord("");
    m3.Encode();
    console.info("BLANK : " + m3.GetMetaph());
    console.info("BLANK : (alt) " + m3.GetAlternateMetaph());
    m3.SetEncodeExact(true);
    m3.SetEncodeVowels(true);
    let test: string = <string>new String("Guillermo");
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "VILLASENOR";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "GUILLERMINA";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "PADILLA";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "BJORK";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "belle";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "ERICH";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "CROCE";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "GLOWACKI";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "qing";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
    test = "tsing";
    m3.SetWord(test);
    m3.Encode();
    console.info(test + " : " + m3.GetMetaph());
    console.info(test + " : (alt) " + m3.GetAlternateMetaph());
  }
};
