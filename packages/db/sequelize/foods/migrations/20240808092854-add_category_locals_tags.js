'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('category_locals', 'tags', {
      type: Sequelize.STRING(2048),
      allowNull: false,
      defaultValue: '[]',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('category_locals', 'tags');
  },
};
