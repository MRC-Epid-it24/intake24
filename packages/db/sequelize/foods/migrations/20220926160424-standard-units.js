module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'standard_units',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(64),
          },
          estimate_in: {
            allowNull: false,
            type: Sequelize.TEXT({ length: 'long' }),
          },
          how_many: {
            allowNull: false,
            type: Sequelize.TEXT({ length: 'long' }),
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('standard_units', { transaction });
    }),
};
