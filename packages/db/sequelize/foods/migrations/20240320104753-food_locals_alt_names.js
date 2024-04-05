'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('food_locals', 'alt_names', {
      type: Sequelize.STRING(2048),
      allowNull: false,
      defaultValue: '{}',
      unique: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('food_locals', 'alt_names');
  },
};
