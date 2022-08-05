export type PAOccurrenceAttributes = {
  localeId: string;
  foodCode: string;
  occurrences: number;
};

export type PACoOccurrenceAttributes = {
  localeId: string;
  antecedentFoodCode: string;
  consequentFoodCode: string;
  occurrences: number;
};

export type PAOccurrenceTransactionCountAttributes = {
  localeId: string;
  transactionsCount: number;
};
