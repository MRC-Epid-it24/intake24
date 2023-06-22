module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all(
        ['drinkware_scales', 'guide_image_objects', 'image_map_objects'].map((table) =>
          queryInterface.addColumn(
            table,
            'label',
            { allowNull: true, type: Sequelize.TEXT({ length: 'long' }) },
            { transaction }
          )
        )
      );
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all(
        ['drinkware_scales', 'guide_image_objects', 'image_map_objects'].map((table) =>
          queryInterface.removeColumn(table, 'label', { transaction })
        )
      );
    }),
};
