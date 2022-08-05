export const copyPairwiseAssociationsQueries = () => {
  const occurrences = `INSERT INTO pairwise_associations_occurrences (locale_id, food_code, occurrences) \
SELECT :targetLocaleId, food_code, occurrences FROM pairwise_associations_occurrences WHERE locale_id = :sourceLocaleId;`;

  const coOccurrences = `INSERT INTO pairwise_associations_co_occurrences (locale_id, antecedent_food_code, consequent_food_code, occurrences) \
SELECT :targetLocaleId, antecedent_food_code, consequent_food_code, occurrences FROM pairwise_associations_co_occurrences WHERE locale_id = :sourceLocaleId;`;

  const transactionsCount = `INSERT INTO pairwise_associations_transactions_count (locale_id, transactions_count) \
SELECT :targetLocaleId, transactions_count FROM pairwise_associations_transactions_count WHERE locale_id = :sourceLocaleId;`;

  return {
    occurrences,
    coOccurrences,
    transactionsCount,
  };
};
