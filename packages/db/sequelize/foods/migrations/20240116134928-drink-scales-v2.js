'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'drinkware_sets',
        'drink_scale_version',
        {
          type: Sequelize.SMALLINT,
          allowNull: false,
          defaultValue: 1,
        },
        { transaction }
      );

      await queryInterface.createTable(
        'drinkware_scales_v2',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          drinkware_set_id: {
            allowNull: false,
            unique: false,
            type: Sequelize.STRING(32),
            references: { model: 'drinkware_sets', key: 'id' },
          },
          choice_id: {
            allowNull: false,
            unique: false,
            type: Sequelize.BIGINT,
          },
          base_image_id: {
            allowNull: false,
            unique: false,
            type: Sequelize.BIGINT,
            references: { model: 'processed_images', key: 'id' },
          },
          label: {
            allowNull: true,
            unique: false,
            type: Sequelize.STRING(128),
          },
          outline_path: {
            allowNull: false,
            unique: false,
            type: Sequelize.TEXT,
          },
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('drinkware_sets_v2', { transaction });
      await queryInterface.removeColumn('drinkware_sets', 'drink_scale_version', { transaction });
    });
  },
};
