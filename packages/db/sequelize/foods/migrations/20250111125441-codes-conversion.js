/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Attributes to tags
      await Promise.all([
        queryInterface.addColumn(
          'category_locals',
          'exclude_tags',
          {
            type: Sequelize.STRING(2048),
            allowNull: false,
            defaultValue: '[]',
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'food_locals',
          'exclude_tags',
          {
            type: Sequelize.STRING(2048),
            allowNull: false,
            defaultValue: '[]',
          },
          { transaction },
        ),
      ]);

      // Same as before
      await queryInterface.sequelize.query(
        `UPDATE category_locals SET tags = (tags::jsonb || '["same-as-before"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.same_as_before_option = true;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE category_locals SET exclude_tags = (exclude_tags::jsonb || '["same-as-before"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.same_as_before_option = false;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET tags = (tags::jsonb || '["same-as-before"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.same_as_before_option = true;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET exclude_tags = (exclude_tags::jsonb || '["same-as-before"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.same_as_before_option = false;`,
        { transaction },
      );

      // Ready meal
      await queryInterface.sequelize.query(
        `UPDATE category_locals SET tags = (tags::jsonb || '["ready-meal"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.ready_meal_option = true;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE category_locals SET exclude_tags = (exclude_tags::jsonb || '["ready-meal"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.ready_meal_option = false;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET tags = (tags::jsonb || '["ready-meal"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.ready_meal_option = true;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET exclude_tags = (exclude_tags::jsonb || '["ready-meal"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.ready_meal_option = false;`,
        { transaction },
      );

      // Use in recipes
      await queryInterface.sequelize.query(
        `UPDATE category_locals SET tags = (tags::jsonb || '["use-anywhere"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.use_in_recipes = 0;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE category_locals SET tags = (tags::jsonb || '["use-as-food"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.use_in_recipes = 1;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE category_locals SET tags = (tags::jsonb || '["use-as-ingredient"]'::jsonb)::text FROM category_attributes
          WHERE category_locals.category_code = category_attributes.category_code AND category_attributes.use_in_recipes = 2;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET tags = (tags::jsonb || '["use-anywhere"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.use_in_recipes = 0;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET tags = (tags::jsonb || '["use-as-food"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.use_in_recipes = 1;`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `UPDATE food_locals SET tags = (tags::jsonb || '["use-as-ingredient"]'::jsonb)::text FROM food_attributes
          WHERE food_locals.food_code = food_attributes.food_code AND food_attributes.use_in_recipes = 2;`,
        { transaction },
      );

      // categories
      await queryInterface.renameTable('categories', 'old_categories', { transaction });
      await queryInterface.sequelize.query(`ALTER INDEX categories_name_idx RENAME TO old_categories_name_idx;`, { transaction });

      // category_locals
      await queryInterface.renameTable('category_locals', 'categories', { transaction });

      await queryInterface.sequelize.query(`ALTER SEQUENCE category_locals_id_seq RENAME TO categories_id_seq;`, { transaction });

      await queryInterface.addColumn('categories', 'english_name', { allowNull: true, type: Sequelize.STRING(256) }, { transaction });
      await queryInterface.addColumn('categories', 'hidden', { allowNull: true, type: Sequelize.BOOLEAN }, { transaction });
      await queryInterface.renameColumn('categories', 'category_code', 'code', { transaction });

      await queryInterface.sequelize.query(
        `UPDATE categories SET english_name = old_categories.name, hidden = old_categories.is_hidden FROM old_categories WHERE categories.code = old_categories.code;`,
        { transaction },
      );

      await queryInterface.changeColumn('categories', 'code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction });
      await queryInterface.changeColumn('categories', 'english_name', { allowNull: false, type: Sequelize.STRING(256) }, { transaction });
      await queryInterface.changeColumn('categories', 'hidden', { allowNull: false, type: Sequelize.BOOLEAN }, { transaction });
      await queryInterface.removeConstraint('categories', 'category_locals_category_code_fk', { transaction });

      await Promise.all([
        queryInterface.sequelize.query(`ALTER TABLE categories RENAME CONSTRAINT category_locals_pkey TO categories_pkey;`, { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE categories RENAME CONSTRAINT category_locals_unique TO categories_unique;`, { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE categories RENAME CONSTRAINT category_locals_locale_id_fk TO categories_locale_id_fk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX category_locals_category_code_idx RENAME TO categories_code_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX category_locals_locale_id_idx RENAME TO categories_locale_id_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX category_locals_name_idx RENAME TO categories_name_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX category_locals_simple_name_idx RENAME TO categories_simple_name_idx;`, { transaction }),
      ]);

      // categories_categories
      await queryInterface.renameTable('categories_categories', 'old_categories_categories', { transaction });

      await queryInterface.sequelize.query(
        `ALTER TABLE old_categories_categories RENAME CONSTRAINT categories_categories_subcategory_code_category_code_pk TO old_categories_categories_subcategory_code_category_code_pk;`,
        { transaction },
      );

      await queryInterface.createTable(
        'categories_categories',
        {
          category_id: {
            allowNull: false,
            type: Sequelize.BIGINT,
          },
          sub_category_id: {
            allowNull: false,
            type: Sequelize.BIGINT,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint('categories_categories', {
        fields: ['category_id', 'sub_category_id'],
        type: 'primary key',
        transaction,
      });

      await queryInterface.addConstraint('categories_categories', {
        fields: ['category_id'],
        type: 'foreign key',
        references: {
          table: 'categories',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addConstraint('categories_categories', {
        fields: ['sub_category_id'],
        type: 'foreign key',
        references: {
          table: 'categories',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addIndex('categories_categories', ['category_id'], {
        name: 'categories_categories_category_id_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.addIndex('categories_categories', ['sub_category_id'], {
        name: 'categories_categories_sub_category_id_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.sequelize.query(
        `INSERT INTO categories_categories (category_id, sub_category_id) SELECT c1.id, c2.id FROM old_categories_categories old_cc
        JOIN categories c1 ON old_cc.category_code = c1.code
        JOIN categories c2 ON old_cc.subcategory_code = c2.code AND c1.locale_id = c2.locale_id;
          `,
        { transaction },
      );

      // category_portion_size_methods
      await queryInterface.renameColumn('category_portion_size_methods', 'category_local_id', 'category_id', { transaction });

      await Promise.all([
        queryInterface.sequelize.query(`ALTER TABLE category_portion_size_methods RENAME CONSTRAINT category_portion_size_methods_category_local_id_fk TO category_portion_size_methods_category_id_fk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX category_portion_size_methods_category_local_id_idx RENAME TO category_portion_size_methods_category_id_idx;`, { transaction }),
      ]);

      // foods
      await queryInterface.renameTable('foods', 'old_foods', { transaction });
      await queryInterface.sequelize.query(`ALTER INDEX foods_name_idx RENAME TO old_foods_name_idx;`, { transaction });

      // food_locals
      await queryInterface.renameTable('food_locals', 'foods', { transaction });

      await queryInterface.sequelize.query(`ALTER SEQUENCE food_locals_id_seq RENAME TO foods_id_seq;`, { transaction });

      await queryInterface.addColumn('foods', 'english_name', { allowNull: true, type: Sequelize.STRING(256) }, { transaction });
      await queryInterface.addColumn('foods', 'food_group_id', { allowNull: true, type: Sequelize.BIGINT }, { transaction });
      await queryInterface.renameColumn('foods', 'food_code', 'code', { transaction });

      await queryInterface.sequelize.query(
        `UPDATE foods SET english_name = old_foods.name, food_group_id = old_foods.food_group_id FROM old_foods WHERE foods.code = old_foods.code;`,
        { transaction },
      );

      await queryInterface.changeColumn('foods', 'code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction });
      await queryInterface.changeColumn('foods', 'english_name', { allowNull: false, type: Sequelize.STRING(256) }, { transaction });
      await queryInterface.changeColumn('foods', 'food_group_id', { allowNull: false, type: Sequelize.BIGINT }, { transaction });
      await queryInterface.removeConstraint('foods', 'food_locals_food_code_fk', { transaction });

      await Promise.all([
        queryInterface.sequelize.query(`ALTER TABLE foods RENAME CONSTRAINT food_locals_pkey TO foods_pkey;`, { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE foods RENAME CONSTRAINT food_locals_unique TO foods_unique;`, { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE foods RENAME CONSTRAINT food_locals_locale_id_fk TO foods_locale_id_fk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX food_locals_food_code_idx RENAME TO foods_code_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX food_locals_locale_id_idx RENAME TO foods_locale_id_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX food_locals_name_idx RENAME TO foods_name_idx;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX food_locals_simple_name_idx RENAME TO foods_simple_name_idx;`, { transaction }),
      ]);

      // foods_categories
      await queryInterface.renameTable('foods_categories', 'old_foods_categories', { transaction });

      await queryInterface.sequelize.query(
        `ALTER TABLE old_foods_categories RENAME CONSTRAINT foods_categories_food_code_category_code_pk TO old_foods_categories_food_code_category_code_pk;`,
        { transaction },
      );

      await queryInterface.createTable(
        'foods_categories',
        {
          food_id: {
            allowNull: false,
            type: Sequelize.BIGINT,
          },
          category_id: {
            allowNull: false,
            type: Sequelize.BIGINT,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint('foods_categories', {
        fields: ['food_id', 'category_id'],
        type: 'primary key',
        transaction,
      });

      await queryInterface.addConstraint('foods_categories', {
        fields: ['food_id'],
        type: 'foreign key',
        references: {
          table: 'foods',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addConstraint('foods_categories', {
        fields: ['category_id'],
        type: 'foreign key',
        references: {
          table: 'categories',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addIndex('foods_categories', ['food_id'], {
        name: 'foods_categories_food_id_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.addIndex('foods_categories', ['category_id'], {
        name: 'foods_categories_category_id_idx',
        indexType: 'btree',
        transaction,
      });

      await queryInterface.sequelize.query(
        `INSERT INTO foods_categories (food_id, category_id) SELECT foods.id, categories.id FROM old_foods_categories old_fc
        JOIN foods ON old_fc.food_code = foods.code
        JOIN categories ON old_fc.category_code = categories.code AND foods.locale_id = categories.locale_id;`,
        { transaction },
      );

      // foods_nutrients / food_portion_size_methods
      await Promise.all([
        queryInterface.renameColumn('food_portion_size_methods', 'food_local_id', 'food_id', { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE food_portion_size_methods RENAME CONSTRAINT food_portion_size_methods_food_local_id_fk TO food_portion_size_methods_food_id_fk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX food_portion_size_methods_food_local_id_idx RENAME TO food_portion_size_methods_food_id_idx;`, { transaction }),
        queryInterface.renameColumn('foods_nutrients', 'food_local_id', 'food_id', { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE foods_nutrients RENAME CONSTRAINT foods_nutrients_nutrient_table_record_id_food_local_id_pk TO foods_nutrients_nutrient_table_record_id_food_id_pk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER TABLE foods_nutrients RENAME CONSTRAINT foods_nutrients_food_local_id_food_locals_fk TO foods_nutrients_food_id_foods_fk;`, { transaction }),
        queryInterface.sequelize.query(`ALTER INDEX foods_nutrients_food_local_id_idx RENAME TO foods_nutrients_food_id_idx;`, { transaction }),
      ]);

      // associated_foods

      // Codes not globally unique anymore -> cannot be FK
      // TODO: do we keep associated_food_code/associated_category_code as CODEs or convert to IDs?
      await queryInterface.removeConstraint('associated_foods', 'associated_foods_associated_category_code_fk', { transaction });
      await queryInterface.removeConstraint('associated_foods', 'associated_foods_associated_food_code_fk', { transaction });

      await queryInterface.changeColumn('associated_foods', 'associated_food_code', { allowNull: true, type: Sequelize.STRING(36) }, { transaction });
      await queryInterface.changeColumn('associated_foods', 'associated_category_code', { allowNull: true, type: Sequelize.STRING(36) }, { transaction });

      await queryInterface.removeConstraint('associated_foods', 'associated_foods_food_code_fk', { transaction });
      await queryInterface.removeConstraint('associated_foods', 'associated_foods_locale_id_fk', { transaction });

      await queryInterface.addColumn('associated_foods', 'food_id', { allowNull: true, type: Sequelize.BIGINT }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE associated_foods SET food_id = foods.id FROM foods WHERE associated_foods.food_code = foods.code AND associated_foods.locale_id = foods.locale_id;`,
        { transaction },
      );

      await queryInterface.changeColumn('associated_foods', 'food_id', { allowNull: false, type: Sequelize.BIGINT }, { transaction });
      await queryInterface.removeColumn('associated_foods', 'food_code', { transaction });
      await queryInterface.removeColumn('associated_foods', 'locale_id', { transaction });

      await queryInterface.addConstraint('associated_foods', {
        fields: ['food_id'],
        type: 'foreign key',
        references: {
          table: 'foods',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addIndex('associated_foods', ['food_id'], {
        name: 'associated_foods_food_id_idx',
        indexType: 'btree',
        transaction,
      });

      // brands
      await queryInterface.removeConstraint('brands', 'brands_food_code_fk', { transaction });
      await queryInterface.removeConstraint('brands', 'brands_locale_id_fk', { transaction });

      await queryInterface.addColumn('brands', 'food_id', { allowNull: true, type: Sequelize.BIGINT }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE brands SET food_id = foods.id FROM foods WHERE brands.food_code = foods.code AND brands.locale_id = foods.locale_id;`,
        { transaction },
      );

      await queryInterface.changeColumn('brands', 'food_id', { allowNull: false, type: Sequelize.BIGINT }, { transaction });
      await queryInterface.removeColumn('brands', 'food_code', { transaction });
      await queryInterface.removeColumn('brands', 'locale_id', { transaction });

      await queryInterface.addConstraint('brands', {
        fields: ['food_id'],
        type: 'foreign key',
        references: {
          table: 'foods',
          field: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        transaction,
      });

      await queryInterface.addIndex('brands', ['food_id'], {
        name: 'brands_food_id_idx',
        indexType: 'btree',
        transaction,
      });

      // recipe_foods
      await queryInterface.changeColumn('recipe_foods', 'code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction });
      await queryInterface.removeConstraint('recipe_foods_steps', 'category_foods_code_fk', { transaction });
      await queryInterface.changeColumn('recipe_foods_steps', 'category_code', { allowNull: false, type: Sequelize.STRING(36) }, { transaction });

      // Resolve prototypes
      const { QueryTypes } = queryInterface.sequelize;

      // Resolve prototype associated foods
      const afpFoods = await queryInterface.sequelize.query(`
        SELECT l.id, l.prototype_locale_id, f1.id as food_id, afc1.c1, f2.id as p_food_id, afc2.c2
        FROM locales l
        JOIN foods f1 ON l.id = f1.locale_id
        LEFT JOIN foods f2 ON l.prototype_locale_id = f2.locale_id AND f1.code = f2.code
        LEFT JOIN (
          SELECT count(1) as c1, food_id FROM associated_foods af1 GROUP BY food_id
        ) afc1 ON afc1.food_id = f1.id
        LEFT JOIN (
          SELECT count(1) as c2, food_id FROM associated_foods af2 GROUP BY food_id
        ) afc2 ON afc2.food_id = f2.id
        WHERE l.prototype_locale_id IS NOT NULL AND afc1.c1 IS NULL AND afc2.c2 IS NOT NULL
        ORDER BY l.id, f1.code;`, {
        type: QueryTypes.SELECT,
        transaction,
      });

      for (const afpFood of afpFoods) {
        const { food_id, p_food_id } = afpFood;

        await queryInterface.sequelize.query(
          `INSERT INTO associated_foods (food_id, associated_food_code, associated_category_code, text, link_as_main, generic_name, order_by, multiple)
            SELECT :food_id, associated_food_code, associated_category_code, text, link_as_main, generic_name, order_by, multiple FROM associated_foods
            WHERE food_id = :p_food_id ORDER BY order_by;
          `,
          {
            replacements: { food_id, p_food_id },
            transaction,
          },
        );
      }

      // Resolve prototype portion size methods
      const psmFoods = await queryInterface.sequelize.query(`
        SELECT
          l.id as locale_id, l.prototype_locale_id, f1.id as food_id, f1.code, fpsm1.c1, f2.id as p_food_id, f2.code, fpsm2.c2, cpsm.c3
        FROM locales l
        JOIN foods f1 ON l.id = f1.locale_id
        LEFT JOIN foods f2 ON l.prototype_locale_id = f2.locale_id AND f1.code = f2.code
        LEFT JOIN (
          SELECT count(1) as c1, food_id FROM food_portion_size_methods fpsm GROUP BY food_id
        ) fpsm1 ON fpsm1.food_id = f1.id
        LEFT JOIN (
          SELECT count(1) as c2, food_id FROM food_portion_size_methods fpsm GROUP BY food_id
        ) fpsm2 ON fpsm2.food_id = f2.id
        LEFT JOIN (
          WITH RECURSIVE parents AS (
          SELECT fc.food_id, fc.category_id, 0 as depth FROM foods_categories as fc
          UNION
          SELECT p.food_id, ccs.category_id, p.depth + 1 FROM categories_categories as ccs
          INNER JOIN parents p ON p.category_id = ccs.sub_category_id
          )
          SELECT sum(ci.c3) as c3, parents.food_id FROM parents
          INNER JOIN categories ON parents.category_id = categories.id
          LEFT JOIN (
            select count(1) as c3, category_id from category_portion_size_methods ci GROUP BY category_id
          ) ci ON ci.category_id = parents.category_id
          GROUP BY parents.food_id
        ) cpsm ON cpsm.food_id = f1.id
        WHERE l.prototype_locale_id IS NOT NULL AND fpsm1.c1 IS NULL AND f2.id IS NOT NULL AND cpsm.c3 IS NULL
        ORDER BY l.id, f1.code`, {
        type: QueryTypes.SELECT,
        transaction,
      });

      // Track visited categories to avoid multiple insertions
      const catVisited = new Set();

      for (const psmFood of psmFoods) {
        const { locale_id, food_id, p_food_id, c2 } = psmFood;

        if (c2) {
          await queryInterface.sequelize.query(
            `INSERT INTO food_portion_size_methods (food_id, method, description, use_for_recipes, conversion_factor, order_by, parameters)
            SELECT :food_id, method, description, use_for_recipes, conversion_factor, order_by, parameters FROM food_portion_size_methods
            WHERE food_id = :p_food_id ORDER BY order_by;
          `,
            {
              replacements: { food_id, p_food_id },
              transaction,
            },
          );

          continue;
        }

        const cPsmFoods = await queryInterface.sequelize.query(`
          WITH RECURSIVE parents AS (
            SELECT fc.food_id, fc.category_id, 0 as depth FROM foods_categories as fc
            WHERE fc.food_id = :p_food_id
            UNION
            SELECT p.food_id, ccs.category_id, p.depth +1 FROM categories_categories as ccs
            INNER JOIN parents p ON p.category_id = ccs.sub_category_id
          )
          SELECT parents.food_id, parents.category_id, parents.depth, ci.count, cc.id as child_category_id FROM parents
          INNER JOIN categories cp ON parents.category_id = cp.id
          LEFT JOIN (
            select count(1) as count, category_id from category_portion_size_methods ci GROUP BY category_id
          ) ci ON ci.category_id = parents.category_id
          LEFT JOIN categories cc ON cc.code = cp.code and cc.locale_id = :locale_id
          ORDER BY parents.depth asc`, {
          type: QueryTypes.SELECT,
          replacements: { p_food_id, locale_id },
          transaction,
        });

        for (const cPsmFood of cPsmFoods) {
          const { category_id, count, child_category_id } = cPsmFood;

          if (count && child_category_id && !catVisited.has(child_category_id)) {
            await queryInterface.sequelize.query(
              `INSERT INTO category_portion_size_methods (category_id, method, description, use_for_recipes, conversion_factor, order_by, parameters)
              SELECT :child_category_id, method, description, use_for_recipes, conversion_factor, order_by, parameters FROM category_portion_size_methods
              WHERE category_id = :category_id ORDER BY order_by;
            `,
              {
                replacements: { category_id, child_category_id },
                transaction,
              },
            );

            catVisited.add(child_category_id);

            // TODO: breaking on first category that has some portion size methods, should we fill whole tree???
            break;
          }
        }
      }

      // Remove locale prototypes
      await queryInterface.removeColumn('locales', 'prototype_locale_id', { transaction });

      await Promise.all([
        queryInterface.dropTable('attribute_defaults', { transaction }),
        queryInterface.dropTable('category_attributes', { transaction }),
        queryInterface.dropTable('food_attributes', { transaction }),
        queryInterface.dropTable('foods_local_lists', { transaction }),
        queryInterface.dropTable('foods_restrictions', { transaction }),
        queryInterface.dropTable('old_categories_categories', { transaction }),
        queryInterface.dropTable('old_foods_categories', { transaction }),
        queryInterface.dropTable('old_categories', { transaction }),
        queryInterface.dropTable('old_foods', { transaction }),
      ]);
    });
  },

  async down() {
    throw new Error('This migration cannot be undone');
  },
};
