module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const tableExist = await queryInterface.tableExists('schemes', { transaction });
      if (!tableExist) {
        console.log('Creating schemes table');
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
              type: Sequelize.STRING(128),
              unique: true,
            },
            type: {
              allowNull: false,
              type: Sequelize.STRING(64),
            },
            questions: {
              type: Sequelize.TEXT({ length: 'long' }),
            },
            meals: {
              type: Sequelize.TEXT({ length: 'long' }),
            },
            created_at: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            updated_at: {
              allowNull: false,
              type: Sequelize.DATE,
            },
          },
          { transaction }
        );
      } else {
        const tableDefinition = await queryInterface.describeTable('schemes', { transaction });
        console.log('Updating schemes table');
        if (!tableDefinition['created_at']) {
          console.log('Adding created_at column');
          await queryInterface.addColumn(
            'schemes',
            'created_at',
            {
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('now'),
            },
            { transaction }
          );
        }
        if (!tableDefinition['updated_at']) {
          console.log('Adding updated_at column');
          await queryInterface.addColumn(
            'schemes',
            'updated_at',
            {
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('now'),
            },
            { transaction }
          );
        }

        //FIXME: Hack to get around the fact that the default value for created_at and updated_at is not being set if the schemes table existed before this migration was run.
        console.log('Updating created_at column to CURRENT STAMP');
        await queryInterface.sequelize.query(`UPDATE schemes SET  created_at=CURRENT_TIMESTAMP`, {
          transaction,
        });

        console.log('Updating updated_at column to CURRENT STAMP');
        await queryInterface.sequelize.query(`UPDATE schemes SET  updated_at=CURRENT_TIMESTAMP`, {
          transaction,
        });

        console.log('Updating created_at column DEFAULT and NOT NULL');
        await queryInterface.changeColumn(
          'schemes',
          'created_at',
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          { transaction }
        );

        console.log('Updating updated_at column to DEFAULT and NOT NULL');
        await queryInterface.changeColumn(
          'schemes',
          'updated_at',
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          { transaction }
        );
      }

      const created_at = new Date();
      const updated_at = created_at;

      //FIXME: Hack to get around the existing bug with UPSERT in SEQUELIZE - https://github.com/sequelize/sequelize/issues/14832
      const existingDefault = await queryInterface.sequelize.query(
        `SELECT id FROM schemes WHERE id = 'default'`,
        {
          transaction,
        }
      );

      if (existingDefault[1].rowCount) {
        console.log('Updating default scheme');
        await queryInterface.bulkUpdate(
          'schemes',
          {
            name: 'Default',
            type: 'data-driven',
            questions: null,
            meals: null,
            created_at,
            updated_at,
          },
          {
            id: 'default',
          },
          { transaction }
        );
      } else {
        console.log('Creating default scheme');
        await queryInterface.bulkInsert(
          'schemes',
          [
            {
              id: 'default',
              name: 'Default',
              type: 'data-driven',
              questions: null,
              meals: null,
              created_at,
              updated_at,
            },
          ],
          { transaction }
        );
      }
      await queryInterface.sequelize.query(`UPDATE surveys SET scheme_id = 'default'`, {
        transaction,
      });

      await queryInterface
        .getForeignKeysForTables(['surveys'], { transaction })
        .then(async function (fks) {
          console.log(fks);
          if (fks.surveys.includes('surveys_scheme_id_schemes_fk')) {
            console.log(`Removing foreign keys`);
            return await queryInterface.removeConstraint(
              'surveys',
              'surveys_scheme_id_schemes_fk',
              {
                transaction,
              }
            );
          } else {
            console.log('No foreign keys to remove');
          }
        })
        .then(async function () {
          console.log('Adding foreign key to surveys');
          await queryInterface.addConstraint(
            'surveys',
            {
              fields: ['scheme_id'],
              name: 'surveys_scheme_id_schemes_fk',
              type: 'foreign key',
              references: {
                table: 'schemes',
                field: 'id',
              },
              onUpdate: 'cascade',
              onDelete: 'restrict',
              transaction,
            },
            { transaction }
          );
        });
    });
  },

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('surveys', 'surveys_scheme_id_schemes_fk', {
        transaction,
      });

      await queryInterface.dropTable('schemes', { transaction });
    }),
};
