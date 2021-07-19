module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('surveys', 'locale', 'locale_id', { transaction });
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('surveys', 'locale_id', 'locale', { transaction });
    }),
};
