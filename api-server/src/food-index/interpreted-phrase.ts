import {InterpretedWord} from "@/food-index/interpreted-word";

function countCombinations(words: Array<InterpretedWord>): number {
  let n = 1;

  for (let w of words) {
    n *= w.interpretations.length
  }

  return n;
}

function maxInterpretationsIndex(words: Array<InterpretedWord>): number {
  let max = 0;
  let maxIndex = -1;

  for (let i = 0; i < words.length; i++) {
    if (words[i].interpretations.length > max) {
      max = words[i].interpretations.length;
      maxIndex = i;
    }
  }

  return maxIndex;
}

function cutCombinations(words: Array<InterpretedWord>, maxCombinations: number): Array<InterpretedWord> {
  let combinations = countCombinations(words);
  let cutWords = new Array<InterpretedWord>(...words);

  if (maxCombinations < 1)
    maxCombinations = 1;

  while (combinations > maxCombinations) {
    let i = maxInterpretationsIndex(cutWords);
    cutWords[i].dropInterpretation();
    combinations = countCombinations(cutWords);
  }

  return cutWords;
}


/*
  Returns an array containing every valid index for the given array, e.g.:

  indices(['a','b','c']) = [0,1,2]
 */
function indices<T>(a: Array<T>): Array<number> {
  let result = new Array<number>();
  for (let i=0; i<a.length; i++)
    result.push(i);
  return result;
}

/*
  Returns a cartesian product of an array of tuples (encoded as arrays of values) and an array of
  values of type T by appending every single element from the right hand side array to every tuple
  on the left hand side, similar to an SQL cross join, e.g.:

  product ([[a,b], [c,d]], [e,f]) =
    [[a,b,e],
     [a,b,f],
     [c,d,e],
     [c,d,f]]
 */
function product<T>(tuples: Array<Array<T>>, values: Array<T>): Array<Array<T>> {
  let result = new Array<Array<T>>();

  for (let tuple of tuples) {
    for (let value of values) {
      let newTuple = new Array<T>();
      newTuple.push(...tuple);
      newTuple.push(value);
      result.push(newTuple);
    }
  }

  return result;
}

export class InterpretedPhrase {

  readonly asTyped: string;
  readonly words: Array<InterpretedWord>;

  constructor(asTyped: string, words: Array<InterpretedWord>) {
    this.asTyped = asTyped;
    this.words = words;
  }

  generateCombinations(maxCombinations: number): Array<Array<number>> {
    let workingSet = cutCombinations(this.words, maxCombinations);

    let combinations = new Array<Array<number>>();

    for (let i of indices(workingSet[0].interpretations)) {
      let a = new Array<number>();
      a.push(i);
      combinations.push(a);
    }

    for (let i = 1; i<workingSet.length; i++) {
      combinations = product(combinations, indices(workingSet[i].interpretations));
    }

    return combinations;
  }
}
