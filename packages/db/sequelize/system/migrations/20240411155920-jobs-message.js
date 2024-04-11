/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'jobs',
        'message',
        {
          type: Sequelize.TEXT({ length: 'long' }),
          allowNull: true,
        },
        { transaction },
      );
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'jobs',
        'message',
        {
          type: Sequelize.STRING(1024),
          allowNull: true,
        },
        { transaction },
      );
    }),
};
