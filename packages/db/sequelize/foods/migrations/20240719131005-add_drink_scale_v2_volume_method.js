'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('drinkware_scales_v2', 'volume_method', {
      type: Sequelize.STRING(16),
      defaultValue: 'lookUpTable',
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('drinkware_scales_v2', 'volume_method');
  },
};
