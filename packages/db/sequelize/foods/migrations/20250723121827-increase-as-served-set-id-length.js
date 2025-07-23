'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('as_served_sets', 'id', {
      type: Sequelize.STRING(128),
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('as_served_sets', 'id', {
      type: Sequelize.STRING(32),
      allowNull: false,
      primaryKey: true,
    });
  },
};
