import type { LocaleMessageObject } from 'vue-i18n';

const attributes: LocaleMessageObject = {
  array: {
    _: '{attribute} must be an array.',
    min: '{attribute} must be an array (min: {min}).',
    max: '{attribute} must be an array (max: {max}).',
    minMax: '{attribute} must be an array (min: {min}, max: {max}).',
    number: '{attribute} must be an array of numbers.',
    string: '{attribute} must be an array of string.',
    colors: '{attribute} must be an array of colors.',
  },
  boolean: {
    _: '{attribute} must be a boolean (true/false).',
  },
  cron: {
    _: '{attribute} must be a cron entry.',
  },
  date: {
    _: '{attribute} must be a date.',
  },
  duplicate: {
    _: `{attribute} can't have duplicate items.`,
  },
  float: {
    _: '{attribute} must be a floating number.',
    min: '{attribute} must be a floating number (min: {min}).',
    max: '{attribute} must be a floating number (max: {max}).',
    minMax: '{attribute} must be a floating number (min: {min}, max: {max}).',
  },
  exists: {
    _: '{attribute} must be existing database record.',
  },
  either: {
    _: 'Either {one} or {two} must be filled in.',
  },
  email: {
    _: '{attribute} must be a valid email address.',
  },
  file: {
    _: '{attribute} must be a file.',
    ext: '{attribute} has invalid file extension, expected: {ext}',
    mime: '{attribute} has invalid mime type, expected: {mime}',
  },
  in: {
    _: '{attribute} must be allowed value.',
    options: '{attribute} must be one of the values: {options}.',
  },
  int: {
    _: '{attribute} must be an integer.',
    min: '{attribute} must be an integer (min: {min}).',
    max: '{attribute} must be an integer (max: {max}).',
    minMax: '{attribute} must be an integer (min: {min}, max: {max}).',
  },
  jwt: {
    _: '{attribute} must be a valid JWT.',
  },
  locale: {
    _: '{attribute} must be a valid locale code.',
  },
  match: {
    _: '{attribute} must match with {match} value.',
  },
  object: {
    _: '{attribute} must be an object.',
  },
  password: {
    _: 'Password must contain at least 10 chars of lower/upper chars and numbers.',
  },
  phone: {
    _: '{attribute} must be a valid telephone number.',
  },
  regEx: {
    _: `{attribute} is invalid.`,
  },
  safeChars: {
    _: `{attribute} must be unique code (charset [a-zA-Z0-9-_]).`,
  },
  string: {
    _: '{attribute} must be filled in.',
    max: '{attribute} maximum length is {max}.',
    minMax: '{attribute} must be a filled in (min: {min}, max: {max}).',
    or: {
      array: '{attribute} must be a string or an array.',
    },
    unique: '{attribute} must be a string of unique characters.',
  },
  structure: {
    _: '{attribute} must have valid structure.',
  },
  terms: {
    _: '{attribute} must be accepted.',
  },
  unique: {
    _: 'Record with this {attribute} value already exists.',
  },
  url: {
    _: '{attribute} must be a valid URL.',
  },
};

export default attributes;
