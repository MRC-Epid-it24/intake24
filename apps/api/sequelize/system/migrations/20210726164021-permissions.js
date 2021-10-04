module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE permissions SET name = REPLACE(name, '-detail', '-read') WHERE name LIKE '%-detail';`,
        { transaction }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE permissions SET name = REPLACE(name, '-read', '-detail') WHERE name LIKE '%-read';`,
        { transaction }
      );
    });
  },
};
