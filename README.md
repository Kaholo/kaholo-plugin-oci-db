# kaholo-plugin-oci-db
Kaholo plugin for integration with Oracle Cloud Infrastracture(OCI) DB Services.

## Settings
1. Private Key (Vault) **Required** - Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
2. User ID (String) **Required** - The OCID of the user to authenticate with.
3. Tenancy ID (String) **Required** - Tenancy OCID. Can be found in user profile.
4. Fingerprint (Vault) **Required** -  Will be used to authenticate to the OCI API. Can be taken from Identity\Users\YOUR_USER\API keys.
5. Region (String) **Required** - Identifier of the region to create the requests in. 

## Method: Create Autonomous Database
Creates a new autonomous database. To read more on autonomous databases click [here](https://docs.oracle.com/en-us/iaas/Content/Database/Concepts/adboverview.htm).

### Parameters
1. Compartment (Autocomplete) **Optional** - The compartment to create the DB in.
2. Display name (String) **Optional** - The display name for the new DB.
3. DB name (String) **Required** - The name of the new DB. Can't use nothing but alphanumeric chars.
4. DB Workload Type (Options) **Required** - The type of worload the new db will handle. Possible Values are: 
* "AJD" - Autonomous JSON Database
* "APEX" - Oracle APEX Application Development
* "DW" - Autonomous Data Warehouse
* "OLTP" - Autonomous Transaction Processing
5. License Model (Options) **Optional** - Determines what to do about the DB license. Possible Values are LICENSE_INCLUDED/BRING_YOUR_OWN_LICENSE. Default value is LICENSE_INCLUDED.
6. Is Dedicated (Boolean) **Optional** - Determines if the infrastracture will be **Dedicated**  Exadata or Shared Exadata. Default is False.
7. Is Data Guard Enabled (Boolean) **Optional** - If true, enable Data Guard on the new DB. Default is False.
8. Autonomous DB Container (Autocomplete) **Required for Dedicated** - Only for Dedicated DBs. The DB Container to run the new DB on. 
9. Is Free Tier (Boolean) **Optional** - Should stay always in the free limits of the service. Default Value is False.
10. DB Version (AutoComplete) **Optional** - The version of the new autonomous db. If not specified OCI will chose version.
11. CPU Core Count (Integer) **Required** - the number of cpu cores to use with the db.
12. Storage Size In TBs (Integer) **Required** - The size of storage to allocate for the new DB.
13. Auto Scaling Enabled (Boolean) **Optional** - Whether to enable auto scaling of the db cores and storage size. Default value is false.
14. Admin Username (String) **Required** - The username for the admin user in the new DB.
15. Admin Password (Vault) **Required** - The password of the admin user in the new DB.
16. VCN (AutoComplete) **Optional** - If specified, filter subnets in the next argumant to only be from the specified VCN.
17. Subnet (AutoComplete) **Optional** - If specified, host the new db on the specified subnet.
18. Wait For Creation (Boolean) **Optional** - Whether should wait for the DB to finish creating before returning from this method. Default Value is False.

## Method: Create MySQL DB System
Creates a new MySQL DB System

### Parameters
1. Compartment (Autocomplete) **Required** - The compartment to create the DB System in.
2. Display Name (String) **Required** - The display name for the new DB System.
3. Availability Domain (Autocomplete) **Required** - The availability domain on which to deploy the Read/Write endpoint. This defines the preferred primary instance.
4. VCN (Autocomplete) **Required** - The VCN of the subnet to store the DB system in.
5. Subnet (Autocomplete) **Required** - The subnet to store the DB system in.
6. Admin Username (String) **Required** - The username for the admin user in the new DB system.
7. Admin Password (Vault) **Required** - The password of the admin user in the new DB system.
8. Shape (Autocomplete) **Required** - The compute shape of the new DB system.
9. MySQL Version (Autocomplete) **Required** - The version of MySQL to use.
10. Description (Text) **Optional** - Description of the DB system.
11. Is Highly Available (Boolean) **Optional** - Specifies if the DB System is highly available. Default value is false.
12. Port (Integer) **Optional** - The port for primary endpoint of the DB System to listen on.
12. Storage Size In GBs (Integer) **Required** - The size of storage to allocate for the new DB System.
18. Wait For Creation (Boolean) **Optional** - Whether should wait for the DB System to finish creating before returning from this method. Default Value is False.