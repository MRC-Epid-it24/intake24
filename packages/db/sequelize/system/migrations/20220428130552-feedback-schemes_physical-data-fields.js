module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'feedback_schemes',
        'physical_data_fields',
        { allowNull: true, type: Sequelize.TEXT() },
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE feedback_schemes SET physical_data_fields = :physicalDataFields;`,
        {
          type: queryInterface.sequelize.QueryTypes.UPDATE,
          replacements: {
            physicalDataFields: JSON.stringify([
              'sex',
              'weightKg',
              'heightCm',
              'physicalActivityLevelId',
              'birthdate',
              'weightTarget',
            ]),
          },
          transaction,
        }
      );
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('feedback_schemes', 'physical_data_fields', {
        transaction,
      });
    }),
};
