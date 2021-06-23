const common = require("oci-common");
const database = require("oci-database");
const wr = require("oci-workrequests");

/***
 * @returns {common.SimpleAuthenticationDetailsProvider} OCI Auth Details Provider
 ***/
function getProvider(settings){
    return new common.SimpleAuthenticationDetailsProvider(
        settings.tenancyId,     settings.userId,
        settings.fingerprint,   settings.privateKey,
        null,                   settings.region
    );
}

/***
 * @returns {database.DatabaseClient} OCI Database Client
 ***/
function getDatabaseClient(settings){
    const provider = getProvider(settings);
    return new database.DatabaseClient({
      authenticationDetailsProvider: provider
    });
}

/***
 * @returns {database.DatabaseWaiter} OCI Database Client
 ***/
 function getDbWaiter(settings){
    const provider = getProvider(settings);
    const dbClient = getDatabaseClient(settings);
    const wrClient =  new wr.WorkRequestClient({
      authenticationDetailsProvider: provider
    });
    return dbClient.createWaiters(wrClient);
}
  
module.exports = {
    getProvider,
    getDatabaseClient,
    getDbWaiter
}