/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pairwise_associations_occurrences', 'multiplier', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },
  async down (queryInterface) {
    await queryInterface.removeColumn('pairwise_associations_occurrences', 'multiplier');
  }
};
