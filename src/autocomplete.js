const identity = require("oci-identity");
const core = require("oci-core");
const mySql = require("oci-mysql");
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

async function listAvailabilityDomains(query, pluginSettings) {
  /**
   * This method will return all availability domains
   */
  const settings = mapAutoParams(pluginSettings);
  const provider = getProvider(settings);
  const identityClient = await new identity.IdentityClient({
     authenticationDetailsProvider: provider
  });

  const request = { compartmentId: settings.tenancyId };
  const result = await identityClient.listAvailabilityDomains(request);
  return handleResult(result, query);
}

async function listSubnets(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available subnets in the specified compartment
   * Must have compartmentId before
   */
   const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
   const provider = getProvider(settings);
   const networkClient = await new core.VirtualNetworkClient({
      authenticationDetailsProvider: provider
   });
   const result = await networkClient.listSubnets({
     compartmentId: params.compartment || settings.tenancyId
   });
   return handleResult(result, query);
}

async function listShapes(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available shapes for mysql db system
   * Must have compartmentId before
   */
   const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
   const provider = getProvider(settings);
   const aasClient = await new mySql.MysqlaasClient({
      authenticationDetailsProvider: provider
   });
   const result = await aasClient.listShapes({
     availabilityDomain: params.availabilityDomain,
     compartmentId: params.compartment || settings.tenancyId 
   });
   return handleResult(result, query);
}

async function listMysqlVersions(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available mysql versions
   * Must have compartmentId before
   */
   const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
   const provider = getProvider(settings);
   const aasClient = await new mySql.MysqlaasClient({
      authenticationDetailsProvider: provider
   });
   const result = await aasClient.listVersions({
     compartmentId: params.compartment || settings.tenancyId
   });
   return handleResult(result, query);
} 

module.exports = {
  listCompartments,
  listDbHomes,
  listDbSystems,
  listDbVersions,
  listAvailabilityDomains,
  listSubnets,
  listShapes,
  listMysqlVersions
}
