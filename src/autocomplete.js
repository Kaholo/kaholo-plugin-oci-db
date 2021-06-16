const database = require("oci-database")
const identity = require("oci-identity");
const { getProvider, getDatabaseClient } = require('./helpers');
const parsers = require("./parsers")

// auto complete helper methods

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

function handleResult(result, query, key){
  let items = result.items;
  if (items.length === 0) throw result;
  items = items.map(item => ({
    id: key ? item[key] : item.id, 
    value:  key ? item[key] :
            item.displayName ? item.displayName :
            item.name ? item.name : 
            item.id
  }));

  if (!query) return items;
  return items.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
}
 
// main auto complete methods

async function listCompartments(query, pluginSettings) {
  const settings = mapAutoParams(pluginSettings);
  const compartmentId = settings.tenancyId;
  const provider = getProvider(settings);
  const identityClient = await new identity.IdentityClient({
    authenticationDetailsProvider: provider
  });
  const result = await identityClient.listCompartments({compartmentId});
  return handleResult(result, query);
}

async function listDbHomes(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available db homes
   * Must have compartmentId before
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const dbClient = getDatabaseClient(settings);
  
  const result = await dbClient.listDbHomes({
    compartmentId: params.compartment || settings.tenancyId,
    dbSystemId: params.dbSystem
  });
  return handleResult(result, query);
}

async function listDbSystems(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available db systems
   * Must have compartmentId before
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const compartmentId = params.compartment || settings.tenancyId;
  const dbClient = getDatabaseClient(settings);
  
  const result = await dbClient.listDbSystems({compartmentId});
  return handleResult(result, query);
}

async function listDbVersions(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available db versions
   * Must have compartmentId before
   */
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
  const dbClient = getDatabaseClient(settings);
  
  if (params.dbHome && !params.dbSystem){
    const dbHomeRes = await dbClient.getDbHome({dbHomeId: params.dbHome});
    params.dbSystem = dbHomeRes.dbHome.dbSystemId;
  }
  
  const result = await dbClient.listDbVersions({
    compartmentId: params.compartment || settings.tenancyId,
    dbSystemId: params.dbSystem
  });
  return handleResult(result, query, "version");
}
 

module.exports = {
  listCompartments,
  listDbHomes,
  listDbSystems,
  listDbVersions
}
