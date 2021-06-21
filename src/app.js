const { getDatabaseClient, getDbWaiter} = require('./helpers');
const parsers = require('./parsers');
const {AutonomousDatabase} = require("oci-database").models;

async function createAutonomousDatabase(action, settings){
  const dbClient = getDatabaseClient(settings);
  let result = await dbClient.createAutonomousDatabase({ createAutonomousDatabaseDetails: {
    compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId),
    cpuCoreCount: parsers.number(action.params.cpuCount),
    dbName: parsers.string(action.params.dbName),
    adminUsername: parsers.string(action.params.adminUsername),
    adminPassword: action.params.adminPassword,
    source: "NONE",
    isFreeTier: action.params.isFreeTier || false,
    dbVersion: parsers.autocomplete(action.params.version),
    displayName: parsers.string(action.params.name),
    isDataGuardEnabled: action.params.isDataGuardEnabled || false,
    isDedicated: action.params.isDedicated || false,
    isAutoScalingEnabled: action.params.isAutoScalingEnabled || false,
    licenseModel: action.params.licenseModel || "LICENSE_INCLUDED",
    dbWorkload: action.params.workload,
    autonomousContainerDatabaseId: parsers.autocomplete(action.params.dbContainerId),
    subnetId: parsers.autocomplete(action.params.subnetId),
    dataStorageSizeInTBs: parsers.number(action.params.storageSize)
  }});
  if (action.params.waitFor){
    const waiters = getDbWaiter(settings);
    result = await waiters.forAutonomousDatabase(
      { autonomousDatabaseId: result.autonomousDatabase.id }, // GetAutonomusDatabaseRequest
      AutonomousDatabase.LifecycleState.Available);
  }
  return result;
}
/* 
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
        adminPassword: action.params.adminPassword,
        adminUsername: parsers.string(action.params.adminUsername),
        compartmentId: parsers.autocomplete(action.params.compartment || settings.tenancyId),
        shapeName: parsers.autocomplete(action.params.shape),
        subnetId: parsers.autocomplete(action.params.subnet),
        availabilityDomain: parsers.autocomplete(action.params.availabilityDomain),
        displayName: parsers.string(action.params.name),
        description: parsers.string(action.params.description),
        mysqlVersion: parsers.autocomplete(action.params.mysqlVersion),
        isHighlyAvailable: action.params.isHighlyAvailable || false,
        port: parsers.number(action.params.port),
        dataStorageSizeInGBs: parsers.number(action.params.storageSize)
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
} */

module.exports = {
  ...require("./autocomplete"),
  createAutonomousDatabase
}

