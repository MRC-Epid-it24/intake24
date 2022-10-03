export const copyPairwiseAssociationsQueries = () => {
  const occurrences = `INSERT INTO pairwise_associations_occurrences (locale_id, food_code, occurrences) \
SELECT :targetLocaleCode, food_code, occurrences FROM pairwise_associations_occurrences WHERE locale_id = :sourceLocaleCode;`;

  const coOccurrences = `INSERT INTO pairwise_associations_co_occurrences (locale_id, antecedent_food_code, consequent_food_code, occurrences) \
SELECT :targetLocaleCode, antecedent_food_code, consequent_food_code, occurrences FROM pairwise_associations_co_occurrences WHERE locale_id = :sourceLocaleCode;`;

  const transactionsCount = `INSERT INTO pairwise_associations_transactions_count (locale_id, transactions_count) \
SELECT :targetLocaleCode, transactions_count FROM pairwise_associations_transactions_count WHERE locale_id = :sourceLocaleCode;`;

  return {
    occurrences,
    coOccurrences,
    transactionsCount,
  };
};
