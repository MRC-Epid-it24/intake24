/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pairwise_associations_occurrences', 'multiplier', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.sequelize.query(
      `UPDATE "pairwise_associations_occurrences" SET "multiplier" = 1 WHERE "food_code" NOT IN ('WMLK', '19CWMLK', 'KMLK', '19CKMLK', 'SMLK', '19CSMLK', 'CHED')`
    );

    await queryInterface.sequelize.query(
      `UPDATE "pairwise_associations_occurrences" SET "multiplier" = 100 WHERE "food_code" IN ('WMLK', '19CWMLK', 'KMLK', '19CKMLK', 'SMLK', '19CSMLK', 'CHED')`
    );
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('pairwise_associations_occurrences', 'multiplier');
  }
};
