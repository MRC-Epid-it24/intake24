'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // Add a localeId colump to Special Foods Step Table
      await queryInterface.addColumn(
        'special_foods_steps',
        'locale_id',
        {
          allowNull: false,
          defaultValue: 'en_GB',
          type: Sequelize.STRING(16),
        },
        { transaction }
      );
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('special_foods_steps', 'locale_id', { transaction });
    }),
};
