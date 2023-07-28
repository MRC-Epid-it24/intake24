import type { LocaleMessageObject } from 'vue-i18n';

const feedback: LocaleMessageObject = {
  _: 'Maklum balas',
  info: 'Maklumat maklum balas',
  status: {
    available: 'Maklum balas anda telah tersedia',
    lowRecalls:
      'Maklum balas akan tersedia setelah anda menghantar sekurang-kurangnya {minRecalls} ingatan semula.',
    notAvailable: 'Maklum balas tidak tersedia untuk survei ini.',
  },
  title: 'Maklum balas daripada {name}  ingatan semula anda',
  missingFoods:
    'Sebarang makanan yang dilaporkan hilang tidak akan disertakan dalam maklum balas pemakanan anda',

  physicalData: {
    title: 'Tentang diri anda',
    subtitle: 'Kami hanya memerlukan sedikit butiran tentang diri anda',
    change: 'Tukar maklumat saya',
    recall: 'Rekod hari seterusnya',

    sexes: {
      _: 'Jantina',
      m: 'Lelaki',
      f: 'Perempuan',
    },
    sex: 'Jantina: {sex}',
    age: 'Umur: {age}',
    birthdate: 'Tahun kelahiran',
    height: 'Tinggi: {height} cm',
    heightCm: 'Tinggi dalam sentimeter (cm)',
    weight: 'Berat: {weight} kg',
    weightKg: 'Berat dalam kilogram (kg)',
    physicalActivityLevelId: 'Tahap aktiviti fizikal',
    weightTarget: 'Sasaran: {target}',
    weightTargets: {
      _: 'Sasaran berat berat badan',
      title: 'Sasaran berat badan',
      keep_weight: 'Kekalkan berat badan',
      lose_weight: 'Turunkan berat badan',
      gain_weight: 'Capai berat badan',
    },
  },

  outputs: {
    title: 'Output',
    download: {
      _: 'Muat turun',
      title: 'Muat turun sebagai fail PDF',
      subtitle:
        'Muat turun salinan maklum balas anda sebagai fail PDF. Proses ini akan mengambil masa beberapa saat, sila tunggu sebentar.',
      send: 'Hantar permohonan',
      sent: 'Maklum balas fail PDF telah disimpan.',
    },
    email: {
      _: 'Emel',
      title: 'Hantar ke emel',
      send: 'Hantar permohonan',
      sent: 'Kami telah menghantar maklum balas anda ke alamat emel yang telah diberikan.',
    },
    retry: 'Output maklum balas baru sahaja dipohon, cuba lagi dalam {secs}.',
    print: 'Cetak',
  },

  topFoods: {
    title: 'Makanan yang paling banyak menyumbang kepada pengambilan nutrien anda',
    chart: 'Paling tinggi {nutrient}',
  },

  meals: {
    title: 'Meals per-day breakdown',
    chart: '{nutrient}',
  },

  intake: {
    your: 'Pengambilan {nutrient} anda ialah {amount}',
    estimated: 'Anggaran pengambilan',
    recommended: 'Pengambilan yang disarankan',
    tellMeMore: 'Huraikan dengan lebih lanjut',
    gotIt: 'Saya faham!',
  },

  unitDescription: {
    percentage_of_energy:
      'Maklum balas adalah berdasarkan sumbangan nutrien ini kepada pengambilan tenaga anda dan perbandingannya dengan saranan pengambilan.',
    energy_divided_by_bmr:
      'Maklum balas adalah berdasarkan pengambilan tenaga anda dibahagikan dengan BMR dan perbandingannya dengan saranan pengambilan.',
    per_unit_of_weight:
      'Maklum balas adalah berdasarkan pengambilan nutrien ini untuk setiap kg berat badan anda dan perbandingannya dengan saranan pengambilan.',
    range:
      'Maklum balas adalah berdasarkan pengambilan nutrien ini dan perbandingannya dengan saranan pengambilan.',
  },
};

export default feedback;
