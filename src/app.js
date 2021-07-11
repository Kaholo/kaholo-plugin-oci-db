const { getDatabaseClient, getDbWaiter, getMySqlSysClient} = require('./helpers');
const parsers = require('./parsers');

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
    result = await waiters.forAutonomousDatabase({ 
      autonomousDatabaseId: result.autonomousDatabase.id 
    }, "AVAILABLE");
  }
  return result;
}

async function createMySqlDatabaseSystem(action, settings) {
  const mySqlClient = getMySqlSysClient(settings);
  let result = await mySqlClient.createDbSystem({ createDbSystemDetails: {
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
  }});
  if (action.params.waitFor){
    const waiters = mySqlClient.createWaiters();
    result = await waiters.forDbSystem({
      dbSystemId: result.dbSystem.id
    }, "ACTIVE");
  }
  return result;
}

module.exports = {
  createAutonomousDatabase,
  createMySqlDatabaseSystem,
  ...require("./autocomplete")
}

