import {workerData} from "worker_threads";
import FoodLocalList from "@/db/models/foods/food-local-list";

import {Sequelize} from "sequelize-typescript";
import dbConfig from "@/config/database";
import foods from "@/db/models/foods";
import FoodLocal from "@/db/models/foods/food-local";
import {LevenshteinTransducer} from "@/food-index/levenshtein";
import {CaseInsensitiveString} from "@/food-index/strings";
import {RichDictionary} from "@/food-index/dictionary";
import {Metaphone3Encoder} from "@/food-index/metaphone-encoder";

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

    const dictionary = new Array<string>();

    console.log('Building dictionary');

    for (let f of foodLocal) {
      if (f.foodLocal) {
        dictionary.push(...f.foodLocal.localDescription.split(' '));
      }
    }

    console.log('Dictonary length: ' + dictionary.length);

    console.log('Building rich dictionary');

    const rd = new RichDictionary(dictionary.map(w => new CaseInsensitiveString(w)), new Metaphone3Encoder(), new Array<Set<CaseInsensitiveString>>(new Set<CaseInsensitiveString>([new CaseInsensitiveString('banana'), new CaseInsensitiveString('dog'), new CaseInsensitiveString('helicopter')])));

    console.log('Rich dictionary done!');

    console.log(JSON.stringify(rd.interpretWord('bAnaNa', 10, 'match-fewer')));
  }
);
