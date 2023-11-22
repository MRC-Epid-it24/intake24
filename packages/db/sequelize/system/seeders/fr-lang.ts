module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `INSERT INTO food_index_language_backends (id, flag, description, created_at, updated_at)
       VALUES ('fr', 'fr', 'French', NOW(), NOW());`);

    await queryInterface.sequelize.query(
      `INSERT INTO languages (code, english_name, local_name, country_flag_code, text_direction,
                              owner_id, created_at, updated_at)
       VALUES ('fr', 'French', 'Français', 'fr', 'ltr', NULL, NOW(), NOW());`);

  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`DELETE
                                          FROM food_index_language_backends
                                          WHERE id = 'fr';`);
    await queryInterface.sequelize.query(`DELETE
                                          FROM languages
                                          WHERE code = 'fr';`);
  }
};
