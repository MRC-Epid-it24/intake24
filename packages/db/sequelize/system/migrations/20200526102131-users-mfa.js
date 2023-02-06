module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable('users').then((tableDefinition) => {
      if (!tableDefinition['multi_factor_authentication']) {
        return queryInterface.sequelize.transaction(async (transaction) => {
          await queryInterface.addColumn(
            'users',
            'multi_factor_authentication',
            {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            { transaction }
          );
        });
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'multi_factor_authentication', { transaction });
    });
  },
};
