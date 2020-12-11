module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable(
      'foods_portion_size_method_params',
      'food_portion_size_method_params'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable(
      'food_portion_size_method_params',
      'foods_portion_size_method_params'
    );
  },
};
