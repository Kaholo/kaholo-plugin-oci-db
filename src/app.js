const { getDatabaseClient } = require('./helpers');
const parsers = require('./parsers');

async function createDatabase(action, settings) {
  const dbClient = getDatabaseClient(settings);
  return dbClient.createDatabase({
    compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId),
    createNewDatabaseDetails: {
      dbHomeId: parsers.autocomplete(action.params.dbHome),
      dbVersion: parsers.autocomplete(action.params.version)
    }
  });
}

async function createDbHome(action, settings) {
  const dbClient = getDatabaseClient(settings);
  return dbClient.createDbHome({
    compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId),
    createDbHomeWithDbSystemIdDetails: {
      displayName: parsers.string(action.params.name),
      dbSystemId: parsers.autocomplete(action.params.dbSystem),
      dbVersion: parsers.autocomplete(action.params.version)
    }
  });
}

module.exports = {
  ...require("./autocomplete"),
  createDatabase,
  createDbHome
}

