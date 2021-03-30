import { Locale } from '@/db/models/foods';

export default async () => {
  await Locale.create({
    adminLanguageId: 'en',
    countryFlagCode: 'gb',
    englishName: 'United Kingdom',
    id: 'en_GB',
    localName: 'United Kingdom',
    prototypeLocaleId: undefined,
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });

  await Locale.create({
    adminLanguageId: 'en',
    countryFlagCode: 'au',
    englishName: 'Australia',
    id: 'en_AU',
    localName: 'Australia',
    prototypeLocaleId: 'en_GB',
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });
};
