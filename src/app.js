const { getDatabaseClient, getDbSystemClient } = require('./helpers');
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

async function createMySqlDatabaseSystem(action, settings) {
  const mySqlClient = getDbSystemClient(settings);
  const result = {
    createDbSystem: await mySqlClient.createDbSystem({
      createDbSystemDetails: {
        adminPassword: action.params.adminUsername,
        adminUsername: parsers.string(action.params.adminUsername),
        compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId),
        shapeName: parsers.autocomplete(action.params.shape),
        subnetId: parsers.autocomplete(action.params.subnet),
        availabilityDomain: parsers.autocomplete(action.params.availabilityDomain),
        displayName: parsers.string(action.params.name),
        description: parsers.string(action.params.description),
        mysqlVersion: parsers.autocomplete(action.params.mysqlVersion),
        isHighlyAvailable: action.params.isHighlyAvailable || false,
        port: parsers.number(action.params.port)
      }
    })
  };
  if (action.params.createDbHome){
    if (!action.params.version) throw "Must Specify DB Version for DB Home";
    action.params.dbSystem = result.createDbSystem.dbSystem.id;
    const shortId = action.params.dbSystem.substring(action.params.dbSystem.length - 4);
    action.params.name = `db_home_${shortId}`;
    result.createDbHome = await createDbHome(action, settings);
    if (action.params.createDatabase){
      action.params.dbHome = result.createDbHome.dbHome.id;
      action.params.name = `db_${shortId}`;
      result.createDatabase = await createDatabase(action, settings);
    }
  }
  else if (action.params.createDatabase) throw "Must Create Default DB Home for default database";
  return result;
}

module.exports = {
  ...require("./autocomplete"),
  createDatabase,
  createDbHome,
  createMySqlDatabaseSystem
}

