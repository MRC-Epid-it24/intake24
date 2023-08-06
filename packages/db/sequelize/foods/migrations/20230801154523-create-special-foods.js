module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // Create Special Foods Table and Special_Foods Steps Table and Special_Foods <-> Category <-> Foods Table)
      await queryInterface.createTable(
        'special_foods',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          code: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(16),
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING(128),
          },
          locale_id: {
            allowNull: false,
            type: Sequelize.STRING(16),
          },
          special_words: {
            allowNull: false,
            type: Sequelize.STRING(512),
          },
          synonyms: {
            allowNull: false,
            type: Sequelize.STRING(512),
          },
          created_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          owner_id: {
            allowNull: true,
            type: Sequelize.BIGINT,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'special_foods_steps',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          code: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(16),
          },
          special_foods_code: {
            allowNull: false,
            type: Sequelize.BIGINT,
          },
          name: {
            allowNull: false,
            type: Sequelize.TEXT({ length: 'long' }),
          },
          description: {
            allowNull: false,
            type: Sequelize.TEXT({ length: 'long' }),
          },
          order: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          created_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          owner_id: {
            allowNull: true,
            type: Sequelize.BIGINT,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'special_foods_category_foods',
        {
          special_foods_step_code: {
            allowNull: false,
            type: Sequelize.STRING(16),
          },
          category_code: {
            allowNull: true,
            type: Sequelize.STRING(16),
          },
          food_code: {
            allowNull: true,
            type: Sequelize.STRING(16),
          },
          created_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            defaultValue: Sequelize.NOW,
            type: Sequelize.DATE,
          },
          owner_id: {
            allowNull: true,
            type: Sequelize.BIGINT,
          },
        },
        { transaction }
      );

      // Add Defaults for timestamps
      await queryInterface.sequelize.query(
        `ALTER TABLE special_foods ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP(3), ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP(3);`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE special_foods_steps ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP(3), ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP(3);`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE special_foods_category_foods ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP(3), ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP(3);`,
        { transaction }
      );

      // Add Indexes and FKs
      await queryInterface.addConstraint('special_foods', {
        fields: ['locale_id'],
        name: 'special_foods_locale_id_fk',
        type: 'foreign key',
        references: {
          table: 'locales',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addConstraint('special_foods_steps', {
        fields: ['special_foods_code'],
        name: 'special_foods_code_fk',
        type: 'foreign key',
        references: {
          table: 'special_foods',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addConstraint('special_foods_category_foods', {
        fields: ['special_foods_step_code'],
        name: 'special_foods_step_code_fk',
        type: 'foreign key',
        references: {
          table: 'special_foods_steps',
          field: 'code',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addConstraint('special_foods_category_foods', {
        fields: ['category_code'],
        name: 'category_locale_code_fk',
        type: 'foreign key',
        references: {
          table: 'categories',
          field: 'code',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addIndex('special_foods', ['code'], {
        name: 'special_foods_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.addIndex('special_foods_steps', ['code'], {
        name: 'special_foods_steps_idx',
        fields: ['code', 'special_foods_code'],
        indexType: 'btree',
        transaction,
      });

      await queryInterface.addIndex('special_foods_category_foods', ['special_foods_step_code'], {
        name: 'special_foods_steps_category_foods_idx',
        indexType: 'btree',
        transaction,
      });
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('special_foods_category_foods', {
        transaction,
      });
      await queryInterface.dropTable('special_foods_steps', { transaction });
      await queryInterface.dropTable('special_foods', { transaction });
    }),
};
