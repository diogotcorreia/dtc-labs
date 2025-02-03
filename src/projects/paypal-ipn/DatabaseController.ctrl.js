import knex from 'knex';

class DatabaseController {
  constructor() {
    this.db = knex({
      client: 'pg',
      connection: process.env.TRITON_DB_URL || 'postgresql:///triton?host=/run/postgresql',
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
