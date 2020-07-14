import { MatchStrategy, PhoneticEncoder, RichDictionary } from '@/food-index/dictionary';
import InterpretedPhrase from '@/food-index/interpreted-phrase';

const MAX_WORDS_PER_PHRASE = 10;
const MAX_WORD_INTERPRETATIONS = 4;
const MAX_PHRASE_COMBINATIONS = 1000;
const MAX_MATCHES_FOR_MATCH_MORE = 3;
const MAX_PHRASE_MATCHES = 6;
const DISTANCE_COST = 1;
const ORDER_COST = 4;
const UNMATCHED_WORD_COST = 8;

export interface PhraseWithKey<K> {
  phrase: string;
  key: K;
}

export interface WordOps {
  stem(word: string): string;

  splitCompound(word: string): Array<string>;
}

export interface DictionaryPhrase {
  asTyped: string;
  words: Array<string>;
}

export class PhraseIndex<K> {
  readonly indexFilter: Array<string>;

  readonly wordOps: WordOps;

  readonly dictionary: RichDictionary;

  getWordList(phrase: string): Array<string> {
    let p = phrase.toLocaleLowerCase();

    for (const filterWord of this.indexFilter) {
      p = p.replace(filterWord, ' ');
    }

    return (
      p
        .split(/\s+/)
        .filter((s) => s.length > 1)
        // split compound words (e.g. for German and Nordic languages)
        .flatMap((s) => this.wordOps.splitCompound(s))
        .map((s) => this.wordOps.stem(s))
    );
  }

  interpretPhrase(phrase: string, strategy: MatchStrategy): InterpretedPhrase {
    const words = this.getWordList(phrase).slice(0, MAX_WORDS_PER_PHRASE);

    // FIXME: Not sure if unmatched words are being completely ignored?
    //        Check that the unmatched word penalty is correctly applied
    const interpretedWords = words
      .map((w) => this.dictionary.interpretWord(w, MAX_WORD_INTERPRETATIONS, strategy))
      .filter((w) => w.interpretations.length > 0);

    return new InterpretedPhrase(phrase, interpretedWords);
  }

  constructor(
    phrases: Array<PhraseWithKey<K>>,
    indexFilter: Array<string>,
    phoneticEncoder: PhoneticEncoder | undefined,
    wordOps: WordOps,
    synonymSets: Array<Set<string>>
  ) {
    this.indexFilter = indexFilter.map((s) => s.toLocaleLowerCase());
    this.wordOps = wordOps;

    const descriptions = phrases.map((p) => p.phrase);
    const keys = phrases.map((p) => p.key);

    const phraseList = new Array<DictionaryPhrase>();
    const dictionaryWords = new Set<string>();

    for (const desc of descriptions) {
      const words = this.getWordList(desc);
      phraseList.push({ asTyped: desc, words });
      for (const word of words) {
        dictionaryWords.add(word);
      }
    }

    this.dictionary = new RichDictionary(dictionaryWords, phoneticEncoder, synonymSets);
  }
}

/*
class PhraseIndex[T](phrases: Seq[(String, T), indexFilter: Seq[CaseInsensitiveString], nonIndexedWords: Seq[CaseInsensitiveString], val phoneticEncoder: Option[PhoneticEncoder], val stemmer: WordOps, synsets: Seq[Set[CaseInsensitiveString]]) {

  val (desc, values) = phrases.unzip

  val (phraseList, dictionaryWords) = desc.foldLeft((List[DictionaryPhrase](), Set[CaseInsensitiveString]())) {
  case ((phrases, dict), phrase) =>
    val words = mkWordList(phrase)
    (DictionaryPhrase(phrase, words) :: phrases, dict ++ words)
  }

  val dictionary = new RichDictionary(dictionaryWords ++ synsets.flatten, phoneticEncoder, synsets)

  val phraseIndex = phraseList.reverse.zipWithIndex.map(_.swap).toMap

  val valueIndex = values.zipWithIndex.map(_.swap).toMap

  val wordIndex = phraseIndex.foldLeft(Map[CaseInsensitiveString, List[(Int, Int)]]().withDefaultValue(List[(Int, Int)]())) {
  case (map, (id, DictionaryPhrase(_, words))) =>
    words.zipWithIndex.foldLeft(map) {
    case (map, (word, pos)) =>
      map + (word -> ((id, pos) :: map(word)))
    }
  }

  def orderViolations(order: List[Int]) =
    order.indices.map(i => {
      val (left, right) = order.splitAt(i)
      val ref = right.head
      left.count(_ > ref) + right.count(_ < ref)
    }).foldLeft(0)(_ + _)

  def distanceViolations(order: List[Int]) =
    order.zip(order.drop(1)).map(x => math.abs(x._1 - x._2) - 1).foldLeft(0)(_ + _)


  def matchQuality(order: List[Int], orderViolationCost: Int, distanceCost: Int) =
    orderViolations(order) * orderViolationCost + distanceViolations(order) * distanceCost


  def findMatches(phrase: InterpretedPhrase, maxMatches: Int, maxCombinations: Int) = {
    def matchCombination(combination: List[Int]) = {
    // need to avoid matching a single input word with many phrase words at once,
    // but still match the same word multiple times in correct sequence if it is
    // indeed seen several times in the input
    //
    // e.g. for dictionary phrase "a black dog and a black cat"
    // for input "black" we should only match "black" once
    // but for input "black black" we need to match both instances of "black"
    // and in the same order as they appear in the dictionary phrase

    val z = (List[WordMatch](), Set[(Int, Int)]())

    val wordMatches = {
      combination.zipWithIndex.foldLeft(z) {
  case ((wordMatches, usedMatches), (int_id, word_id)) => {
      val indexMatches = wordIndex(phrase.words(word_id).interpretations(int_id).image)

      // exclude words that have already been matched and take the first
      // (position-wise, from left to right) matching word
      val newMatches = indexMatches.filterNot(usedMatches.contains(_)).groupBy(_._1).mapValues(_.map(_._2).min)

      (wordMatches ++ newMatches.map { case (phrase_id, pos_id) => WordMatch(phrase_id, word_id, int_id, pos_id) }, usedMatches ++ newMatches)
    }
  }._1
}

  wordMatches.groupBy(_.phrase_id).toList.map {
  case (phrase_id, words) =>
      PhraseMatch(phrase_id, valueIndex(phrase_id), words.length,
        matchQuality(words.map(_.pos),
          DefaultPhraseIndexConstants.orderCost,
          DefaultPhraseIndexConstants.distanceCost) + (phraseIndex(phrase_id).words.length - words.length) * DefaultPhraseIndexConstants.unmatchedWordCost,
        words)
  }
}

  phrase.generateCombinations(maxCombinations).flatMap(matchCombination(_)) match {
  case Nil => Nil
  case phraseMatches => {
      val bestMatch = phraseMatches.maxBy(_.wordCount).wordCount
      phraseMatches.filter(_.wordCount == bestMatch)
      // exclude duplicates which could have appeared due to different
      // variants of spelling correction on the same word matching
      // different words in the same phrase
      // e.g. the word "cat" is not in the dictionary and is corrected
      // to "oat" and "eat"
      // then it will match the phrase "eat oats" twice
        .map(phr => (phr.index, phr)).toMap.toList.map(_._2)
        .sortBy(_.quality)
        .take(maxMatches)
    }
  }
}

  def interpretPhrase(phrase: String, strategy: MatchStrategy) =
    InterpretedPhrase(phrase, mkWordList(phrase).take(DefaultPhraseIndexConstants.maxWordsPerPhrase).map(dictionary.interpretWord(_, DefaultPhraseIndexConstants.maxWordInterpretations, strategy)).filterNot(_.interpretations.isEmpty))

  def lookup(phrase: String, maxResults: Int): Seq[(T, Int)] = {
    val stage1interpretation = interpretPhrase(phrase, MatchFewer)
    val stage1result = findMatches(stage1interpretation, maxResults, DefaultPhraseIndexConstants.maxPhraseCombinations).map(m => (m.value, m.quality))
    if (stage1result.size <= DefaultPhraseIndexConstants.maxMatchesForMatchMore) {
    if (stage1interpretation.words.exists(_.interpretations.exists { case AltSpelling(_, _) => true; case _ => false }))
    findMatches(interpretPhrase(phrase, MatchMore), maxResults, DefaultPhraseIndexConstants.maxPhraseCombinations).map(m => (m.value, m.quality))
  else stage1result
  }
else stage1result
}
}
*/
