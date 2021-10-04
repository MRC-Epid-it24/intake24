module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'schemes',
        'export',
        {
          allowNull: true,
          type: Sequelize.TEXT({ length: 'long' }),
        },
        { transaction }
      );
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('schemes', 'export', { transaction });
    }),
};
