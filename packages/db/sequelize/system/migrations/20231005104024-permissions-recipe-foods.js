const { createPermissions } = require('../../utils.js');

const permissions = [{ name: 'locales|recipe-foods', display_name: 'Locale recipe foods' }];

module.exports = {
  up: async queryInterface =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await createPermissions(permissions, { queryInterface, transaction });
    }),

  down: async queryInterface =>
    queryInterface.sequelize.transaction(async (transaction) => {
      const names = permissions.map(({ name }) => `'${name}'`).join(`,`);
      await queryInterface.sequelize.query(`DELETE FROM permissions WHERE name IN (${names});`, {
        transaction,
      });
    }),
};
