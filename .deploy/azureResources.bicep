﻿@description('Name of the environment use as prefix for all resources and group name')
param environment string

@description('hosting plan location, due to limitations of subscriptions it can be different')
param hostingPlanLocation string

@description('location for all resources')
param location string = resourceGroup().location

var demohosterSAName = '${environment}demohoster2sa'
resource demohosterSA 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: demohosterSAName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {
    supportsHttpsTrafficOnly: true
    defaultToOAuthAuthentication: true
  }
}

resource demohosterHostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: '${environment}-demohoster2-hosting-plan'
  location: hostingPlanLocation
  sku: {
    name: 'F1'
  }
  properties: {}
}

param baseTime string = utcNow('u')
var demohosterFAName = '${environment}-demohoster2-function-app'
resource demohosterFA 'Microsoft.Web/sites@2022-09-01' = {
  name: demohosterFAName
  location: hostingPlanLocation
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: demohosterHostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsFeatureFlags'
          value: 'EnableWorkerIndexing'
        }
        {
          name: 'AzureWebJobsSecretStorageType'
          value: 'files'
        }
        {
          name: 'AzureWebJobsStorage'
          value: demohosterSA.listKeys().keys[0].value
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'TracksContainerName'
          value: blobContainer.name
        }
        {
          name: 'TracksStorageAccountName'
          value: musicStorageAccount.name
        }
        {
          name: 'TracksStorageAccountKey'
          value: musicStorageAccount.listKeys().keys[0].value
        }
        {
          name: 'CosmosDbName'
          value: cosmosDb.name
        }
        {
          name: 'CosmosTracksContainerName'
          value: tracksContainer.name
        }
        {
          name: 'CosmosConnectionString'
          value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString
        }
        {
          name: 'TracksUploadSas'
          value: musicStorageAccount.listAccountSas(musicStorageAccount.apiVersion, {
            signedExpiry: dateTimeAdd(baseTime, 'P1Y')
            signedPermission: 'w'
            signedResourceTypes: 's'
            signedServices: 't'
          }).accountSasToken
        }
      ]
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
    }
    httpsOnly: true
  }
}

var uiClientSWAName =  '${environment}-static-web-app'
resource uiClientSWA 'Microsoft.Web/staticSites@2022-09-01' = {
  name: uiClientSWAName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    allowConfigFileUpdates: true
    provider: 'Custom'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

resource uiClientSWALinkedApi 'Microsoft.Web/staticSites/linkedBackends@2022-09-01' = {
  name: '${environment}-${uiClientSWAName}-${demohosterFAName}-linked'
  parent: uiClientSWA
  properties: {
    backendResourceId: demohosterFA.id
    region: hostingPlanLocation
  }
}

var musicsaName = '${environment}musicsa'
resource musicStorageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: musicsaName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    defaultToOAuthAuthentication: true
    allowBlobPublicAccess: true
    accessTier: 'Hot'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2022-09-01' = {
  name: 'default'
  parent: musicStorageAccount
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: 'tracks'
  parent: blobService
}

@description('Azure Cosmos DB account name, max length 44 characters')
param cosmosAccountName string = '${environment}-cosmosaccount'

@description('The primary region for the Azure Cosmos DB account.')
param primaryRegion string = 'eastus'

@description('The secondary region for the Azure Cosmos DB account.')
param secondaryRegion string = 'eastus2'

@description('The name for the database')
param cosmosDbName string = environment

@description('The name for the container')
param tracksContainerName string = '${environment}Tracks'

var locations = [
  {
    locationName: primaryRegion
    failoverPriority: 0
    isZoneRedundant: false
  }
  {
    locationName: secondaryRegion
    failoverPriority: 1
    isZoneRedundant: false
  }
]

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: toLower(cosmosAccountName)
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    enableFreeTier: true
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: locations
    databaseAccountOfferType: 'Standard'
  }
}

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  name: cosmosDbName
  parent: cosmosAccount
  properties: {
    resource: {
      id: cosmosDbName
    }
    options: {
      throughput: 1000
    }
  }
}

resource tracksContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  name: tracksContainerName
  parent: cosmosDb
  properties: {
    resource: {
      id: tracksContainerName
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/myPathToNotIndex/*'
          }
          {
            path: '/_etag/?'
          }
        ]
      }
      defaultTtl: -1
      uniqueKeyPolicy: {
        uniqueKeys: [
          {
            paths: [
              '/title'
            ]
          }
        ]
      }
    }
  }
}
