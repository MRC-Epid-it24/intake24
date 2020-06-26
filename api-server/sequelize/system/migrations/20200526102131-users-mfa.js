module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'users',
        'multi_factor_authentication',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { transaction }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'multi_factor_authentication', { transaction });
    });
  },
};
