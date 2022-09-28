/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

const baseUrl =
  'https://raw.githubusercontent.com/MRC-Epid-it24/survey-frontend/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/survey/portionsize';
const filename = 'StandardUnits_en.properties';

const fetchStandardUnits = async () =>
  new Promise((resolve, reject) => {
    const url = `${baseUrl}/${filename}`;

    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);

      file
        .on('finish', () => {
          file.close();

          const fileMap = fs
            .readFileSync('StandardUnits_en.properties', 'utf-8')
            .split(/\r?\n/)
            .filter(Boolean)
            .reduce((acc, line) => {
              const [keyType, value] = line.split('=').map((s) => s.trim());

              const res = keyType.match(/^(?<key>.*?)_(?<type>estimate_in|how_many)$/);
              const { key, type } = res?.groups || {};

              if (!key || !type) {
                console.warn(`Invalid line: ${line}`);
                return acc;
              }

              if (!acc[key]) acc[key] = {};

              acc[key][type] = value;
              return acc;
            }, {});

          const records = Object.entries(fileMap).map(([id, { estimate_in, how_many }]) => ({
            id,
            estimate_in: JSON.stringify({ en: estimate_in }),
            how_many: JSON.stringify({ en: how_many }),
          }));

          fs.unlinkSync(path.resolve(filename));

          resolve(records);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  });

module.exports = {
  up: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      const standardUnits = await fetchStandardUnits();
      console.log(standardUnits);

      const created_at = new Date();
      const updated_at = created_at;
      const timestamps = { created_at, updated_at };

      await queryInterface.bulkInsert(
        'standard_units',
        standardUnits.map((standardUnit) => ({ ...standardUnit, ...timestamps })),
        { transaction }
      );
    }),

  down: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      const standardUnits = await fetchStandardUnits();
      const id = standardUnits.map(({ id }) => `'${id}'`).join(`,`);
      await queryInterface.sequelize.query(`DELETE FROM standard_units WHERE id IN (${id});`, {
        transaction,
      });
    }),
};
