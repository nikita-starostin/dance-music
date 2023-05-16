import {CosmosClient} from "@azure/cosmos";
import {Env} from "./env";

const cosmosClient = new CosmosClient(Env.CosmosConnectionString);
const database = cosmosClient.database(Env.CosmosDbName);
export const TracksContainer = database.container(Env.CosmosTracksContainerName);
