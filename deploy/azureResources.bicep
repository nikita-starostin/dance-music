@description('Name of the environment use as prefix for all resources and group name')
param environment string

@description('location for all resources')
param location string = resourceGroup().location

var demohosterSAName = '${environment}demohoster2storageaccount'
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

