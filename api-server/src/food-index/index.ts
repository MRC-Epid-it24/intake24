import {Worker} from 'worker_threads'
import databaseConfig from "@/config/database";
import appConfig from "@/config/app";

export default {

  async init() {
    new Worker('./dist/foodIndexBuilder.js', {workerData: {dbConnectionInfo: databaseConfig[appConfig.env].foods}});
  },

  async search(query: string): Promise<string> {
    return Promise.reject(new Error("Not implemented"));
  },
};
