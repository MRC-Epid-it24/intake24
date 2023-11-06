module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'category_portion_size_method_params',
        'value',
        { type: Sequelize.STRING(1024), allowNull: false },
        { transaction }
      );

      await queryInterface.changeColumn(
        'food_portion_size_method_params',
        'value',
        { type: Sequelize.STRING(1024), allowNull: false },
        { transaction }
      );
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'category_portion_size_method_params',
        'value',
        { type: Sequelize.STRING(128), allowNull: false },
        { transaction }
      );

      await queryInterface.changeColumn(
        'food_portion_size_method_params',
        'value',
        { type: Sequelize.STRING(128), allowNull: false },
        { transaction }
      );
    }),
};
