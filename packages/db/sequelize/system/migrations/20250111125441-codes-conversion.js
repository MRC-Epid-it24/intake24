/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.changeColumn('fixed_food_ranking', 'food_code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction }),
        queryInterface.changeColumn('popularity_counters', 'food_code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction }),
        queryInterface.changeColumn('survey_submission_foods', 'code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction }),
        queryInterface.removeColumn('locales', 'prototype_locale_id', { transaction }),
      ]);
    });
  },

  async down() {
    throw new Error('This migration cannot be undone');
  },
};
