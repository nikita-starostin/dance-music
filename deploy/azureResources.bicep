@description('Name of the environment use as prefix for all resources and group name')
param environment string

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

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${environment}-application-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

var hostingPlanLocation = 'eastus'
resource demohosterHostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: '${environment}-demohoster2-hosting-plan'
  location: hostingPlanLocation
  sku: {
    name: 'Y1'
  }
  properties: {}
}

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
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
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

