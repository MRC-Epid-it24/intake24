import {workerData} from "worker_threads";
import FoodLocalList from "@/db/models/foods/food-local-list";
import {Sequelize} from "sequelize-typescript";
import foods from "@/db/models/foods";
import FoodLocal from "@/db/models/foods/food-local";
import {Metaphone3Encoder} from "@/food-index/metaphone-encoder";
import {PhraseIndex, PhraseWithKey} from "@/food-index/phrase-index";
import {EnglishWordOps} from "@/food-index/english-word-ops";

const db = new Sequelize({...workerData.dbConnectionInfo, models: Object.values(foods)});


FoodLocalList.findAll({
  where: {
    localeId: 'en_GB'
  },
  include: [{
    model: FoodLocal,
    where: {
      localeId: 'en_GB'
    }
  }]
}).then(foodLocal => {

    const foodDescriptions = new Array<PhraseWithKey<string>>();

    console.log('Building dictionary');

    for (let f of foodLocal) {
      if (f.foodLocal) {
        foodDescriptions.push({phrase: f.foodLocal.localDescription, key: f.foodCode});
      }
    }

    const phraseIndex = new PhraseIndex<string>(foodDescriptions, new Array<string>(), new Metaphone3Encoder(),  new EnglishWordOps(),
      new Array(new Set<string>(['banana', 'dog', 'helicopter'])));


    let test = phraseIndex.interpretPhrase('banana with helicopter meat sausage', 'match-fewer');

    console.log('Interpreted phrase: ' + JSON.stringify(test));

    console.log('Combinations: ' + JSON.stringify(test.generateCombinations(10)));

  }
);
