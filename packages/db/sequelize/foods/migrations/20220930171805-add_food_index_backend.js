'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('locales', 'food_index_language_backend_id', {
      type: Sequelize.STRING(16),
      defaultValue: 'en',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('locales', 'food_index_language_backend_id');
  },
};
