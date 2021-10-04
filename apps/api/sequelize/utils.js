const updateSequence = async (table, column, { queryInterface, transaction }) => {
  const [[{ max }]] = await queryInterface.sequelize.query(`SELECT MAX(${column}) FROM ${table}`, {
    transaction,
  });

  if (!max) return;

  await queryInterface.sequelize.query(
    `SELECT setval(pg_get_serial_sequence('${table}', '${column}'), max(${column})) FROM ${table};`,
    { transaction }
  );
};

exports.updateSequence = updateSequence;
