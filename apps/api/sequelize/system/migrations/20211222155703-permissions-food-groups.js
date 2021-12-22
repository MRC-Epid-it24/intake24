module.exports = {
  up: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      const created_at = new Date();
      const updated_at = created_at;

      const newPermissions = [
        { name: 'food-groups-browse', display_name: 'Browse food groups' },
        { name: 'food-groups-read', display_name: 'Read food groups' },
        { name: 'food-groups-create', display_name: 'Create food groups' },
        { name: 'food-groups-edit', display_name: 'Edit food groups' },
        { name: 'food-groups-delete', display_name: 'Delete food groups' },
      ].map((permission) => ({ ...permission, created_at, updated_at }));

      await queryInterface.bulkInsert('permissions', newPermissions, { transaction });

      const roles = await queryInterface.sequelize.query(
        `SELECT id, name FROM roles WHERE name = 'superuser';`,
        { transaction }
      );
      const permissions = await queryInterface.sequelize.query(
        `SELECT id, name FROM permissions WHERE name LIKE 'food-groups-%';`,
        { transaction }
      );

      const records = [];
      roles[0].forEach((role) => {
        permissions[0].reduce((acc, perm) => {
          acc.push({ permission_id: perm.id, role_id: role.id, created_at, updated_at });
          return acc;
        }, records);
      });

      // Length check is a workaround for https://github.com/sequelize/sequelize/issues/11071
      if (records.length > 0) {
        await queryInterface.bulkInsert('permission_role', records, { transaction });
      }
    }),

  down: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `DELETE FROM permissions WHERE name LIKE 'food-groups-%';`,
        { transaction }
      );
    }),
};
