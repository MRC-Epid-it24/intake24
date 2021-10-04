module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameTable('brands', 'v3_brands', {
        transaction,
      });

      await queryInterface.createTable(
        'brands',
        {
          id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true,
          },
          food_code: {
            type: Sequelize.STRING(8),
            allowNull: false,
          },
          locale_id: {
            type: Sequelize.STRING(16),
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(128),
            allowNull: false,
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint('brands', {
        fields: ['food_code'],
        type: 'foreign key',
        references: {
          table: 'foods',
          field: 'code',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        name: 'brands_food_code_fk',
        transaction,
      });

      await queryInterface.addIndex('brands', ['food_code'], {
        name: 'brands_food_code_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.addConstraint('brands', {
        fields: ['locale_id'],
        type: 'foreign key',
        references: {
          table: 'locales',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        name: 'brands_locale_id_fk',
        transaction,
      });

      await queryInterface.addIndex('brands', ['locale_id'], {
        name: 'brands_locale_id_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.sequelize.query(
        'INSERT INTO brands (id, food_code, locale_id, "name") SELECT id, food_code, locale_id, "name" FROM v3_brands',
        { transaction }
      );
    }),

  down: () => {
    throw new Error('This migration cannot be undone');
  },
};
