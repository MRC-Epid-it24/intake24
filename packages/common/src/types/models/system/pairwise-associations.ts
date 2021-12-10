export type PAOccurrenceAttributes = {
  locale: string;
  foodCode: string;
  occurrences: number;
};

export type PACoOccurrenceAttributes = {
  locale: string;
  antecedentFoodCode: string;
  consequentFoodCode: string;
  occurrences: number;
};

export type PAOccurrenceTransactionCountAttributes = {
  locale: string;
  transactionsCount: number;
};
