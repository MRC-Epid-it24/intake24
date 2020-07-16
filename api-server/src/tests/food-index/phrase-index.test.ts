/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { PhraseIndex, PhraseWithKey } from '@/food-index/phrase-index';
import Metaphone3Encoder from '@/food-index/metaphone-encoder';
import EnglishWordOps from '@/food-index/english-word-ops';
import InterpretedPhrase, { cutCombinations } from '@/food-index/interpreted-phrase';
import { InterpretedWord } from '@/food-index/interpreted-word';

describe('Phrase index', function () {
  const phrases: Array<PhraseWithKey<string>> = [
    {
      phrase: 'banana with banana tea',
      key: 'P1',
    },
    {
      phrase: 'dog helicopter with coffee rice',
      key: 'P2',
    },
    {
      phrase: 'pizza and chips with strawberry jam and vodka',
      key: 'P3',
    },
  ];

  const indexFilter: Array<string> = ['with'];

  const synonyms: Array<Set<string>> = [];

  const index = new PhraseIndex(
    phrases,
    indexFilter,
    new Metaphone3Encoder(),
    new EnglishWordOps(),
    synonyms
  );

  describe('Interpretation combinations', () => {
    it('Empty interpretations list', () => {
      const t = new InterpretedPhrase('bleh', []);
      expect(t.generateCombinations(100)).to.be.empty;
    });

    it('Cut combinations', () => {
      const t = new InterpretedPhrase('bleh', [
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
      ]);

      const cut = cutCombinations(t.words, 1);

      expect(cut[2].interpretations.length).eq(1);
      expect(cut[2].interpretations[0].kind).eq('alt-spelling');
    });

    it('Generate combinations', () => {
      const t1 = new InterpretedPhrase('bleh', [
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
      ]);

      const t2 = new InterpretedPhrase('bleh', [
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
      ]);

      const t3 = new InterpretedPhrase('bleh', [
        new InterpretedWord('bleh', [{ dictionaryWord: 'bleh', kind: 'synonym' }]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
        new InterpretedWord('bleh', [
          {
            dictionaryWord: 'bleh',
            kind: 'synonym',
          },
          { dictionaryWord: 'bleh', kind: 'alt-spelling', method: 'phonetic' },
        ]),
      ]);

      expect(t1.generateCombinations(100)).deep.eq([
        [0, 0, 0],
        [0, 0, 1],
      ]);

      expect(t2.generateCombinations(100)).deep.eq([
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
      ]);

      expect(t2.generateCombinations(1)).deep.eq([[0, 0, 0]]);

      expect(t3.generateCombinations(2)).deep.eq([
        [0, 0, 0],
        [0, 0, 1],
      ]);
    });

    it('Match', () => {

      const t = index.interpretPhrase('banana with coffee', 'match-fewer');

      console.log(JSON.stringify(index.findMatches(t, 10, 100)));

    });
  });
});
