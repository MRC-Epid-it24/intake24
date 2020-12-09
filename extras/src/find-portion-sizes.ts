import { config } from 'dotenv';

config();

import {FoodLocal } from '@api-server/db/models/foods';

import DB from '@api-server/db';

import databaseConfig from '@api-server/config/database'

import logger from '@api-server/services/logger'


async function main() {

    const db = new DB({databaseConfig: databaseConfig, logger: logger, environment: 'development'});

    await db.init();

    let test = await FoodLocal.findAll({where: {foodCode: 'BGMA'}});

    console.log(JSON.stringify(test));
}

main().catch(err => {
    throw err
});
