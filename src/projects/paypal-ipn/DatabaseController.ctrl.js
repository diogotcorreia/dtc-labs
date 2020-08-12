import knex from 'knex';

class DatabaseController {
  constructor() {
    this.db = knex({
      client: 'mysql',
      connection: {
        host: process.env.TRITON_DB_HOST || 'localhost',
        port: process.env.TRITON_DB_PORT || 3306,
        user: process.env.TRITON_DB_USERNAME || 'root',
        password: process.env.TRITON_DB_PASSWORD || '',
        database: process.env.TRITON_DB_NAME || 'triton',
      },
    });
  }

  addPurchaseToDatabase(marketplaceId, friendlyName, discordTag, date) {
    return this.db('triton_buyers').insert({
      marketplaceId,
      friendlyName,
      discordTag,
      date,
    });
  }
}

export default DatabaseController;
