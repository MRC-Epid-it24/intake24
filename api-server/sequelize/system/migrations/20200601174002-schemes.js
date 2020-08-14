module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'schemes',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(64),
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true,
          },
          type: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          questions: {
            type: Sequelize.TEXT({ length: 'long' }),
          },
          meals: {
            type: Sequelize.TEXT({ length: 'long' }),
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint('surveys', ['scheme_id'], {
        name: 'surveys_scheme_id_schemes_fk',
        type: 'foreign key',
        references: {
          table: 'schemes',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
        transaction,
      });
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('surveys', 'surveys_scheme_id_schemes_fk', {
        transaction,
      });
      await queryInterface.dropTable('schemes', { transaction });
    }),
};
