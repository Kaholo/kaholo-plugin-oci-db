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
  let items = result.items || result;
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

async function listAutoDbVersions(query, pluginSettings) {
  /**
   * This method returns all available db versions
   * Must have compartmentId before
   */
  const settings = mapAutoParams(pluginSettings);
  const dbClient = getDatabaseClient(settings);
  
  
  const result = await dbClient.listAutonomousDbVersions({
    compartmentId: params.compartment || settings.tenancyId,
  });
  return handleResult(result, query, "version");
}

async function listAutoDbContainer(query, pluginSettings) {
  /**
   * This method returns all available db versions
   * Must have compartmentId before
   */
  const settings = mapAutoParams(pluginSettings);
  const dbClient = getDatabaseClient(settings);
  
  
  const result = await dbClient.listAutonomousContainerDatabases({
    compartmentId: params.compartment || settings.tenancyId,
  });
  return handleResult(result, query);
}

async function listVCN(query, pluginSettings, pluginActionParams) {
  /**
   * This method returns all available subnets in the specified compartment
   * Must have compartmentId before
   */
   const settings = mapAutoParams(pluginSettings), params = mapAutoParams(pluginActionParams);
   const provider = getProvider(settings);
   const networkClient = await new core.VirtualNetworkClient({
      authenticationDetailsProvider: provider
   });
   const result = await networkClient.listVcns({
     compartmentId: params.compartment || settings.tenancyId
   });
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
     compartmentId: params.compartment || settings.tenancyId,
     vcnId: params.vcn
   });
   return handleResult(result, query);
}

module.exports = {
  listCompartments,
  listAutoDbVersions,
  listAutoDbContainer,
  listVCN,
  listSubnets,
}
