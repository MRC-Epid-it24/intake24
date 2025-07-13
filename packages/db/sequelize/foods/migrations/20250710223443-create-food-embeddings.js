'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create food_embeddings table
    await queryInterface.createTable('food_embeddings', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      food_code: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      locale_id: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      text_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      embedding: {
        type: Sequelize.TEXT, // Store as JSON text for now, can upgrade to vector later
        allowNull: false,
      },
      embedding_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: 'SHA256 hash of text_content for cache validation',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create category_embeddings table
    await queryInterface.createTable('category_embeddings', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      category_code: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      locale_id: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      text_content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      embedding: {
        type: Sequelize.TEXT, // Store as JSON text for now, can upgrade to vector later
        allowNull: false,
      },
      embedding_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: 'SHA256 hash of text_content for cache validation',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create indexes for performance
    await queryInterface.addIndex('food_embeddings', ['locale_id', 'food_code'], {
      name: 'food_embeddings_locale_code_idx',
      unique: true,
    });

    await queryInterface.addIndex('food_embeddings', ['embedding_hash'], {
      name: 'food_embeddings_hash_idx',
    });

    await queryInterface.addIndex('category_embeddings', ['locale_id', 'category_code'], {
      name: 'category_embeddings_locale_code_idx',
      unique: true,
    });

    await queryInterface.addIndex('category_embeddings', ['embedding_hash'], {
      name: 'category_embeddings_hash_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('food_embeddings', {
      fields: ['food_code'],
      type: 'foreign key',
      name: 'food_embeddings_food_code_fk',
      references: {
        table: 'foods',
        field: 'code',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('food_embeddings', {
      fields: ['locale_id'],
      type: 'foreign key',
      name: 'food_embeddings_locale_id_fk',
      references: {
        table: 'locales',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('category_embeddings', {
      fields: ['category_code'],
      type: 'foreign key',
      name: 'category_embeddings_category_code_fk',
      references: {
        table: 'categories',
        field: 'code',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('category_embeddings', {
      fields: ['locale_id'],
      type: 'foreign key',
      name: 'category_embeddings_locale_id_fk',
      references: {
        table: 'locales',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('category_embeddings');
    await queryInterface.dropTable('food_embeddings');
  },
};
