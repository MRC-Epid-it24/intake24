/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'food_builders',
        'variant',
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_builders SET variant = 'tonal' WHERE variant IS NULL;`,
        { transaction },
      );

      await queryInterface.changeColumn(
        'food_builders',
        'variant',
        {
          type: Sequelize.STRING(32),
          allowNull: false,
        },
        { transaction },
      );
    }),

  down: async queryInterface =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('food_builders', 'variant', { transaction });
    }),
};
