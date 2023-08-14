/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const recipeFoods = [
  {
    recipe_food: { code: '$SND', name: 'Sandwich', recipe_word: 'sandwich' },
    recipe_food_steps: [
      {
        name: `"en": { "name": "Bread and Base", }`,
        description: `"en": { "description": "What bread did you have in your sandwich?", }`,
        order: 1,
        repetable: false,
        categoryCode: 'SW01',
      },
      {
        name: `"en": { "name": "Spread", }`,
        description: `"en": { "description": "What spread did you have in your sandwich?", }`,
        order: 2,
        repetable: false,
        categoryCode: 'SW02',
      },
      {
        name: `"en": { "name": "Meat, Fish or Other Protein Source", }`,
        description: `"en": { "description": "What meat, fish or other protein source did you have in your sandwich?", }`,
        order: 3,
        repetable: false,
        categoryCode: 'SW03',
      },
      {
        name: `"en": { "name": "Cheese", }`,
        description: `"en": { "description": "What cheese did you have in your sandwich?", }`,
        order: 4,
        repetable: false,
        categoryCode: 'SW04',
      },
      {
        name: `"en": { "name": "Extra Filling", }`,
        description: `"en": { "description": "What extra filling did you have in your sandwich?", }`,
        order: 5,
        repetable: true,
        categoryCode: 'SW05',
      },
      {
        name: `"en": { "name": "Sauce and Dressing", }`,
        description: `"en": { "description": "What sauce or dressing did you have in your sandwich?", }`,
        order: 6,
        repetable: true,
        categoryCode: 'SW06',
      },
    ],
  },
  {
    recipe_food: { code: '$SLD', name: 'Salad', recipe_word: 'salad' },
    recipe_food_steps: [
      {
        name: `"en": { "name": "Salad Ingridients", }`,
        description: `"en": { "description": "What ingridients did you have in your salad?", }`,
        order: 1,
        repetable: true,
        categoryCode: 'SLW1',
      },
      {
        name: `"en": { "name": "Salad Dressing", }`,
        description: `"en": { "description": "What dressing did you have in your salad?", }`,
        order: 2,
        repetable: true,
        categoryCode: 'SLW2',
      },
    ],
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      //Getting all available locales from the locales table in foods DB
      const locales = await queryInterface.sequelize.query(`SELECT id FROM locales;`, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let recipeFoodsEntries = [];

      for (const locale of locales) {
        //Get all the synonyms for this Recipe Food name and this locale from the Synonyms Set table in foods DB
        const synonyms = await queryInterface.sequelize.query(
          `SELECT id, locale_id, synonyms FROM synonym_sets WHERE locale_id = '${locale.id}';`,
          {
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          }
        );

        recipeFoods.map((recipeFood) => {
          const synonymsIndex = synonyms.findIndex((synonym) =>
            synonym.synonyms.split(/\s+/).includes(recipeFood.recipe_food.recipe_word.toLowerCase())
          );
          console.log(
            `Synonyms Index: ${synonymsIndex} for ${recipeFood.recipe_food.recipe_word} and locale: ${locale.id}`
          );
          return recipeFoodsEntries.push({
            ...recipeFood.recipe_food,
            locale_id: locale.id,
            synonyms_id: synonymsIndex !== -1 ? synonyms[synonymsIndex].id : null,
          });
        });
      }

      // Creating recipe foods
      await queryInterface.bulkInsert('recipe_foods', recipeFoodsEntries, {
        transaction,
      });
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      const code = recipeFoods.map((recipeFood) => recipeFood.recipe_food.code);
      await queryInterface.sequelize.query(`DELETE FROM recipe_foods WHERE code IN (:code);`, {
        type: queryInterface.sequelize.QueryTypes.DELETE,
        replacements: { code },
        transaction,
      });
    }),
};
