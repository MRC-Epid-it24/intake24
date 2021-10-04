module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'tools_tasks',
        'message',
        {
          type: Sequelize.STRING(512),
          allowNull: true,
        },
        { transaction }
      );
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('tools_tasks', 'message', { transaction });
    }),
};
