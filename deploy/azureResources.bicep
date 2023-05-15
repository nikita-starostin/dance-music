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

resource demohosterHostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: '${environment}-demohoster2-hosting-plan'
  location: location
  sku: {
    name: 'E64bds_v5',
    tier: 'Standard'
  }
  properties: {}
}
