'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
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
          outline_coordinates: {
            allowNull: false,
            unique: false,
            type: Sequelize.TEXT,
          },
          volume_samples: {
            allowNull: false,
            unique: false,
            type: Sequelize.TEXT,
          },
        },
        {
          transaction,
          uniqueKeys: {
            drinkware_set_choice_unique: { fields: ['drinkware_set_id', 'choice_id'] },
          },
        }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('drinkware_scales_v2', { transaction });
    });
  },
};
