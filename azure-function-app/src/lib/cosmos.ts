import {CosmosClient} from "@azure/cosmos";
import {Env} from "./env";
import {v4 as uuidv4} from 'uuid';

const cosmosClient = new CosmosClient(Env.CosmosConnectionString);
const database = cosmosClient.database(Env.CosmosDbName);
export const TracksContainer = database.container(Env.CosmosTracksContainerName);

export function getNewId(): string {
    return uuidv4();
}
