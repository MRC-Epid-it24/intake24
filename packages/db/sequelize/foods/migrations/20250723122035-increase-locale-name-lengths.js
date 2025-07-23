'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Increase english_name and local_name columns from 64 to 128 characters
    await queryInterface.changeColumn('locales', 'english_name', {
      type: Sequelize.STRING(128),
      allowNull: false,
    });

    await queryInterface.changeColumn('locales', 'local_name', {
      type: Sequelize.STRING(128),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('locales', 'english_name', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });

    await queryInterface.changeColumn('locales', 'local_name', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });
  },
};
